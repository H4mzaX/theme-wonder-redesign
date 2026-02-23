import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { newArrivalProducts } from "@/data/products";

const colorMap: Record<string, string> = {
  "Clear": "#e5e5e5",
  "Jet Black": "#1a1a1a",
  "Black": "#1a1a1a",
  "Blue": "#2563eb",
  "Pink": "#ec4899",
  "Green": "#16a34a",
  "Saddle Brown": "#92400e",
  "Matte Black": "#333333",
};

const ProductCard = ({ product }: { product: typeof newArrivalProducts[0] }) => (
  <Link to={`/product/${product.id}`} className="group block border border-border rounded-xl overflow-hidden bg-card">
    <div className="relative aspect-square bg-muted overflow-hidden">
      {product.discount && (
        <span className="absolute top-2 left-2 z-10 bg-foreground text-background text-[10px] sm:text-[11px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
          {product.discount}
        </span>
      )}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
      <h3 className="font-semibold text-xs sm:text-sm leading-tight truncate">
        {product.name}
      </h3>
      <p className="text-[11px] sm:text-xs text-muted-foreground">{product.subtitle}</p>
      <div className="inline-flex items-center gap-1 border border-border rounded px-1.5 sm:px-2 py-0.5">
        <span className="text-[11px] sm:text-xs font-semibold">{product.rating.toFixed(1)}</span>
        <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-400 text-amber-400" />
        <span className="text-[9px] sm:text-[10px] text-muted-foreground">| {product.reviews} Rev...</span>
      </div>
      {product.colors.length > 1 && (
        <div className="flex gap-1 sm:gap-1.5 pt-0.5">
          {product.colors.map((color) => (
            <span
              key={color}
              className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full border border-border"
              style={{ backgroundColor: colorMap[color] || "#ccc" }}
              title={color}
            />
          ))}
        </div>
      )}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="font-bold text-sm sm:text-base">{product.price}</span>
        <span className="text-[10px] sm:text-xs text-muted-foreground">MRP</span>
        <span className="text-[10px] sm:text-xs text-muted-foreground line-through">{product.originalPrice}</span>
      </div>
      <button className="w-full bg-foreground text-background text-[11px] sm:text-xs font-semibold py-2.5 sm:py-3 rounded-lg tracking-wider hover:bg-foreground/90 transition-colors">
        ADD TO CART
      </button>
    </div>
  </Link>
);

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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-12">
      <ScrollReveal className="mb-4 lg:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground">
          iPhone 17 Essentials
        </h2>
      </ScrollReveal>

      {/* Horizontal scroll carousel for all sizes */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {newArrivalProducts.map((product) => (
          <div key={product.id} className="flex-none w-[44vw] sm:w-[280px] lg:w-[300px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Scroll progress bar */}
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
