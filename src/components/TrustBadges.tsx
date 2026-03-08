import { useRef, useEffect, useState, useCallback } from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, title: "Free Shipping", desc: "On all prepaid orders" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% safe checkout" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated assistance" },
];

const AUTO_ROTATE_MS = 3000;

const TrustBadges = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
    }
  }, []);

  // Auto-rotate on mobile
  useEffect(() => {
    const start = () => {
      timerRef.current = setInterval(() => {
        setActive((prev) => {
          const next = (prev + 1) % badges.length;
          scrollTo(next);
          return next;
        });
      }, AUTO_ROTATE_MS);
    };
    start();
    return () => clearInterval(timerRef.current);
  }, [scrollTo]);

  // Sync active dot on manual scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handle = () => {
      const cardW = el.scrollWidth / badges.length;
      const idx = Math.round(el.scrollLeft / cardW);
      setActive(Math.min(idx, badges.length - 1));
    };
    el.addEventListener("scroll", handle, { passive: true });
    return () => el.removeEventListener("scroll", handle);
  }, []);

  // Pause auto-rotate on touch
  const pauseAuto = () => clearInterval(timerRef.current);
  const resumeAuto = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % badges.length;
        scrollTo(next);
        return next;
      });
    }, AUTO_ROTATE_MS);
  };

  return (
    <section className="border-y border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-8">
        {/* Desktop: grid */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-5 h-5 text-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet: scrollable carousel */}
        <div className="lg:hidden">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory overflow-x-auto gap-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onTouchStart={pauseAuto}
            onTouchEnd={resumeAuto}
          >
            {badges.map((badge) => (
              <div
                key={badge.title}
                className="flex-none w-full snap-center flex flex-col items-center text-center gap-2 py-1"
              >
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-foreground" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {badges.map((_, i) => (
              <button
                key={i}
                onClick={() => { scrollTo(i); setActive(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "bg-foreground w-4" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
