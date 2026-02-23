import { useRef } from "react";
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

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-14">
      <ScrollReveal className="text-center mb-6 lg:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight">Explore Products</h2>
      </ScrollReveal>

      {/* Mobile: horizontal scroll carousel like casegear */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory lg:hidden -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group flex-none w-[65vw] sm:w-[45vw] snap-start relative rounded-xl overflow-hidden aspect-[3/4]"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
            </div>
          </a>
        ))}
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group block relative rounded-xl overflow-hidden aspect-[3/4]"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
