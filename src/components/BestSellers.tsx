import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { bestSellerTabs } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categories = Object.keys(bestSellerTabs);

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const products = bestSellerTabs[categories[activeTab]];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
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
                <ProductCard product={product} tag={product.tag} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default BestSellers;
