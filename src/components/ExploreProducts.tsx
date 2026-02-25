import { useRef, useState, useEffect } from "react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";

const categories = [
  { name: "Cases & Protectors", image: magsafeClearImg, href: "#" },
  { name: "Charging Solutions", image: siliconeBluImg, href: "#" },
  { name: "Silicone Cases", image: leatherBrownImg, href: "#" },
  { name: "Leather Cases", image: magsafeBlackImg, href: "#" },
];

const ExploreProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(el.scrollLeft / maxScroll);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <ScrollReveal className="text-center mb-3 lg:mb-5">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground">
          Explore Products
        </h2>
      </ScrollReveal>

      {/* Mobile: horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-3 snap-x snap-mandatory lg:hidden -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group flex-none w-[42vw] sm:w-[35vw] snap-start relative rounded-xl overflow-hidden aspect-square"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <h3 className="text-background font-semibold text-xs">{cat.name}</h3>
            </div>
          </a>
        ))}
      </div>

      {/* Scroll progress bar - mobile only */}
      <div className="lg:hidden mx-auto mt-1 h-[3px] bg-border rounded-full max-w-[160px] overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-transform duration-100 ease-out origin-left"
          style={{ transform: `scaleX(${0.25 + scrollProgress * 0.75})` }}
        />
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden lg:grid grid-cols-4 gap-3">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group block relative rounded-xl overflow-hidden aspect-square"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent transition-opacity duration-300 group-hover:from-foreground/70" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-background font-semibold text-sm">{cat.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
