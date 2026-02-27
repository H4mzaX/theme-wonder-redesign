import { useRef, useEffect } from "react";
import { Shield, Sparkles, Zap, Gem, Star, Diamond } from "lucide-react";

const items = [
  { text: "DROP-PROOF DESIGN", icon: Shield },
  { text: "CRYSTAL CLEAR", icon: Sparkles },
  { text: "MAGSAFE READY", icon: Zap },
  { text: "PREMIUM LEATHER", icon: Gem },
  { text: "6FT DROP TESTED", icon: Shield },
  { text: "WIRELESS CHARGING", icon: Zap },
  { text: "SLIM FIT", icon: Star },
  { text: "ECO FRIENDLY", icon: Diamond },
];

const MarqueeSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const speed = 0.5; // px per frame

    const step = () => {
      pos += speed;
      // Reset when first set scrolls out
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="py-3.5 sm:py-4 overflow-hidden bg-foreground select-none">
      <div className="relative">
        <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform">
          {/* Render twice for seamless loop */}
          {[0, 1].map((set) =>
            items.map((item, i) => (
              <span
                key={`${set}-${i}`}
                className="flex items-center gap-2.5 px-6 sm:px-8 whitespace-nowrap text-[11px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase text-background/85"
              >
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background/45 flex-shrink-0" strokeWidth={1.5} />
                {item.text}
                <span className="text-background/20 ml-4 sm:ml-6 text-[8px]">✦</span>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
