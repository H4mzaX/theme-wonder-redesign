import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { newArrivalProducts } from "@/data/products";

const NewArrivals = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="section-padding py-16 lg:py-20">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-semibold">
            iPhone 17 Essentials
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <motion.button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </ScrollReveal>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {newArrivalProducts.map((product, idx) => (
          <motion.a
            key={product.id}
            href="#"
            className="group flex-none w-[280px] sm:w-[300px] snap-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-card mb-4 aspect-square">
              {product.discount && (
                <span className="absolute top-3 left-3 z-10 bg-foreground text-background text-[11px] px-3 py-1 rounded-full font-medium">
                  {product.discount}
                </span>
              )}
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <motion.button
                className="absolute bottom-3 left-3 right-3 bg-foreground text-background text-sm py-3 rounded-full font-medium text-center"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
              >
                ADD TO CART
              </motion.button>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-semibold group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">{product.subtitle}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < product.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{product.reviews} reviews</span>
              </div>
              {product.colors.length > 1 && (
                <div className="flex gap-1.5 pt-1">
                  {product.colors.map((color) => (
                    <span key={color} className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                      {color}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="font-display font-bold text-base">{product.price}</span>
                <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
