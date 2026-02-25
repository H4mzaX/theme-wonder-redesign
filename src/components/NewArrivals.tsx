import { useRef, useState, useEffect } from "react";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { newArrivalProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const NewArrivals = () => {
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

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-8">
      <ScrollReveal className="mb-3 sm:mb-4 lg:mb-6">
        <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground">
          iPhone 17 Essentials
        </h2>
      </ScrollReveal>

      <div
        ref={scrollRef}
        className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {newArrivalProducts.map((product) => (
          <div key={product.id} className="flex-none w-[42vw] sm:w-[260px] lg:w-[280px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-2 h-[3px] bg-border rounded-full max-w-[200px] overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-transform duration-100 ease-out origin-left"
          style={{ transform: `scaleX(${0.2 + scrollProgress * 0.8})` }}
        />
      </div>
    </section>
  );
};

export default NewArrivals;
