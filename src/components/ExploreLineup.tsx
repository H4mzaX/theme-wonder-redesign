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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-8">
      <ScrollReveal>
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground mb-4 lg:mb-6">
          Explore The Line-up
        </h2>
      </ScrollReveal>

      <div className="flex mb-5 sm:mb-8">
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
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[44vw] sm:w-[260px] lg:w-[280px] snap-start">
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
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default ExploreLineup;
