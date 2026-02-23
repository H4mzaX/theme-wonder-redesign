import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { bestSellerTabs } from "@/data/products";

const categories = Object.keys(bestSellerTabs);

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const products = bestSellerTabs[categories[activeTab]];

  return (
    <section className="section-padding py-20 lg:py-28">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-display text-center mb-2">
          Best<em className="italic">Sellers</em>
        </h2>
      </ScrollReveal>

      <div className="flex justify-center gap-6 mt-6 mb-12 flex-wrap">
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
        <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }}>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <a href="#" className="group block">
                  <motion.div className="relative aspect-square rounded-lg overflow-hidden bg-card mb-3" whileHover="hovered">
                    <motion.img src={product.image} alt={product.name} className="w-full h-full object-cover" variants={{ hovered: { scale: 1.08 } }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide">{product.tag}</span>
                    )}
                    <motion.button className="absolute bottom-3 left-3 right-3 bg-background text-foreground text-xs py-2.5 rounded-full font-medium text-center" variants={{ hovered: { opacity: 1, y: 0 } }} initial={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} whileTap={{ scale: 0.97 }}>
                      Add to cart
                    </motion.button>
                  </motion.div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">{product.brand}</p>
                  <h3 className="text-sm font-medium mt-0.5 group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-display font-bold text-sm">{product.price}</span>
                    <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default BestSellers;
