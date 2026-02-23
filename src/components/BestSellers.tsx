import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { bestSellerTabs } from "@/data/products";

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

const categories = Object.keys(bestSellerTabs);

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const products = bestSellerTabs[categories[activeTab]];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-2 tracking-tight">
          Best Sellers
        </h2>
      </ScrollReveal>

      <div className="flex justify-center gap-6 mt-6 mb-10 flex-wrap">
        {categories.map((cat, i) => (
          <button key={cat} onClick={() => setActiveTab(i)} className={`text-sm font-medium pb-1 relative transition-colors ${i === activeTab ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {cat}
            {i === activeTab && (
              <motion.span className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground" layoutId="bestSellerTab" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <Link to={`/product/${product.id}`} className="group block border border-border rounded-xl overflow-hidden bg-card">
                  <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide">{product.tag}</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.subtitle}</p>
                    <div className="inline-flex items-center gap-1 border border-border rounded px-2 py-0.5">
                      <span className="text-xs font-semibold">{product.rating.toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] text-muted-foreground">| {product.reviews} Reviews</span>
                    </div>
                    {product.colors.length > 1 && (
                      <div className="flex gap-1.5 pt-0.5">
                        {product.colors.map((c) => (
                          <span
                            key={c}
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: colorMap[c] || "#ccc" }}
                            title={c}
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
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default BestSellers;
