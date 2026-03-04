import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyVideo from "@/components/LazyVideo";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import watchMagsafe from "@/assets/watch-shop-magsafe.mp4";
import watchLeather from "@/assets/watch-shop-leather.mp4";
import watchSilicone from "@/assets/watch-shop-silicone.mp4";
import watchRugged from "@/assets/watch-shop-rugged.mp4";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";
import siliconePinkImg from "@/assets/case-silicone-pink.jpg";

const videoProducts = [
  {
    video: watchMagsafe,
    productName: "MagSafe Clear Case",
    productImage: magsafeClearImg,
    tagline: "Snap-on Perfection",
    href: "/collections/magsafe-cases",
  },
  {
    video: watchLeather,
    productName: "Leather Case",
    productImage: leatherBrownImg,
    tagline: "Handcrafted Luxury",
    href: "/collections/leather-cases",
  },
  {
    video: watchSilicone,
    productName: "Silicone Case",
    productImage: siliconePinkImg,
    tagline: "Express Your Color",
    href: "/collections/iphone-cases",
  },
  {
    video: watchRugged,
    productName: "Rugged Armor Case",
    productImage: magsafeBlackImg,
    tagline: "Built to Survive",
    href: "/collections/iphone-cases",
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
      <ScrollReveal>
        <div className="flex flex-col items-center mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-foreground text-center">
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
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videoProducts.map((item, idx) => (
          <div key={idx} className="flex-none w-[44vw] sm:w-[260px] lg:w-[280px] snap-start">
            <a href={item.href} className="group block">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[9/16] mb-2">
                <LazyVideo
                  src={item.video}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />

                {/* Product thumbnail overlay */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-background shadow-lg">
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
