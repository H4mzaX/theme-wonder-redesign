import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { exploreLineupTabs } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const tabs = Object.keys(exploreLineupTabs);

const ExploreLineup = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const products = exploreLineupTabs[tabs[activeTab]];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) setScrollProgress(el.scrollLeft / maxScroll);
      else setScrollProgress(0);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  return (
    <section className="py-5 sm:py-6 lg:py-8">
      <ScrollReveal className="px-4 sm:px-6 lg:px-10">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground mb-4 lg:mb-6">
          Explore The Line-up
        </h2>
      </ScrollReveal>

      <div className="flex mb-5 sm:mb-8 px-4 sm:px-6 lg:px-10">
        <div className="inline-flex border border-foreground rounded-full overflow-hidden overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-[11px] sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 whitespace-nowrap transition-all duration-200 ${
                i === activeTab ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory px-4 sm:px-6 lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[260px] lg:w-[280px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Segmented progress bar */}
          <div className="flex gap-1 mx-auto mt-3 sm:mt-4 max-w-[280px] sm:max-w-[320px] px-4">
            {Array.from({ length: Math.ceil(products.length / 2) }).map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                  i <= Math.round(scrollProgress * (Math.ceil(products.length / 2) - 1)) ? "bg-foreground" : "bg-border"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default ExploreLineup;
