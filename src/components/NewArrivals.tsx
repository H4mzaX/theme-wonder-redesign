import { useRef, useState, useEffect } from "react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { newArrivalProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = newArrivalProducts.length;
  const segments = Math.ceil(totalCards / 2);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        const progress = el.scrollLeft / maxScroll;
        setActiveIndex(Math.min(Math.round(progress * (segments - 1)), segments - 1));
      }
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [segments]);

  return (
    <section className="py-3 sm:py-4 lg:py-5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal className="mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground text-center">
            New Arrivals
          </h2>
        </ScrollReveal>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {newArrivalProducts.map((product) => (
            <div key={product.id} className="flex-none w-[calc(50vw-22px)] sm:w-[calc(50vw-28px)] md:w-[260px] lg:w-[280px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 mx-auto mt-3 sm:mt-4 max-w-[260px] sm:max-w-[320px] px-4">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              i <= activeIndex ? "bg-foreground" : "bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
