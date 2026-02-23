import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { newArrivalProducts } from "@/data/products";
import { colorImages } from "@/data/products";

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

const NewArrivals = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight italic">
            iPhone 17 Essentials
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {newArrivalProducts.map((product, idx) => (
          <motion.a
            key={product.id}
            href="#"
            className="group flex-none w-[280px] sm:w-[320px] snap-start border border-border rounded-xl overflow-hidden bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
          >
            <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
              {product.discount && (
                <span className="absolute top-3 left-3 z-10 bg-foreground text-background text-[11px] px-3 py-1 rounded-full font-medium">
                  {product.discount}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-sm leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">{product.subtitle}</p>
              <div className="inline-flex items-center gap-1 border border-border rounded px-2 py-0.5">
                <span className="text-xs font-semibold">{product.rating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] text-muted-foreground">| {product.reviews} Reviews</span>
              </div>
              {product.colors.length > 1 && (
                <div className="flex gap-1.5 pt-0.5">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: colorMap[color] || "#ccc" }}
                      title={color}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">{product.price}</span>
                <span className="text-xs text-muted-foreground">MRP</span>
                <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
              </div>
              <button className="w-full bg-foreground text-background text-xs font-semibold py-3 rounded-lg tracking-wider hover:bg-foreground/90 transition-colors">
                ADD TO CART
              </button>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
