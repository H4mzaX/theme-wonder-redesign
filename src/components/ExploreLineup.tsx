import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { exploreLineupTabs } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const tabs = Object.keys(exploreLineupTabs);

const ExploreLineup = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const products = exploreLineupTabs[tabs[activeTab]];
  const segments = Math.ceil(products.length / 2);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(0);
    el.scrollLeft = 0;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        const progress = el.scrollLeft / maxScroll;
        setActiveIndex(Math.min(Math.round(progress * (segments - 1)), segments - 1));
      }
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeTab, segments]);

  return (
    <section className="py-5 sm:py-6 lg:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground mb-4 lg:mb-6 text-center">
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
              className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((product) => (
                <div key={product.id} className="flex-none w-[calc(50vw-22px)] sm:w-[calc(50vw-28px)] md:w-[260px] lg:w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExploreLineup;
