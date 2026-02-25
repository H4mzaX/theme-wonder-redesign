import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import watchShop1 from "@/assets/watch-shop-1.mp4";
import watchShop2 from "@/assets/watch-shop-2.mp4";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";
import siliconePinkImg from "@/assets/case-silicone-pink.jpg";

const videoProducts = [
  {
    video: watchShop1,
    productName: "Clear Pro Lens",
    productImage: magsafeClearImg,
    tagline: "Unmatched Clarity",
    href: "#",
  },
  {
    video: watchShop2,
    productName: "Modern Leatherite Case",
    productImage: leatherBrownImg,
    tagline: "Premium Texture",
    href: "#",
  },
  {
    video: watchShop1,
    productName: "Snap Fit Case",
    productImage: magsafeBlackImg,
    tagline: "Smooth Microfiber Inside",
    href: "#",
  },
  {
    video: watchShop2,
    productName: "Grip Armour Case",
    productImage: siliconePinkImg,
    tagline: "12 Feet Protection",
    href: "#",
  },
];

const WatchAndShop = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) setScrollProgress(el.scrollLeft / maxScroll);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
            Watch and Shop
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videoProducts.map((item, idx) => (
          <div key={idx} className="flex-none w-[44vw] sm:w-[260px] lg:w-[280px] snap-start">
            <a href={item.href} className="group block">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[9/16] mb-2">
                <video
                  src={item.video}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  onTouchStart={(e) => e.currentTarget.play()}
                />
                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />

                {/* Product thumbnail overlay */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-background shadow-lg">
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-center px-1">
                <p className="font-semibold text-xs sm:text-sm truncate text-foreground">{item.productName}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{item.tagline}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-2 h-[3px] bg-border rounded-full max-w-[200px] overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-transform duration-100 ease-out origin-left"
          style={{ transform: `scaleX(${0.2 + scrollProgress * 0.8})` }}
        />
      </div>
    </section>
  );
};

export default WatchAndShop;
