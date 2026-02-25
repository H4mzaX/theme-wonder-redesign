import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { exploreLineupTabs } from "@/data/products";

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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <ScrollReveal>
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight italic text-foreground mb-4 lg:mb-6">
          Explore The Line-up
        </h2>
      </ScrollReveal>

      {/* Tabs */}
      <div className="flex mb-5 sm:mb-8">
        <div className="inline-flex border border-foreground rounded-full overflow-hidden overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-[11px] sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 whitespace-nowrap transition-all duration-200 ${
                i === activeTab
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Horizontal scroll carousel */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[44vw] sm:w-[280px] lg:w-[300px] snap-start">
                <Link to={`/product/${product.id}`} className="group block border border-border rounded-xl overflow-hidden bg-card">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-full font-medium">
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
                    <h3 className="font-semibold text-xs sm:text-sm leading-tight truncate">{product.name}</h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">{product.subtitle}</p>
                    <div className="inline-flex items-center gap-1 border border-border rounded px-1.5 sm:px-2 py-0.5">
                      <span className="text-[11px] sm:text-xs font-semibold">{product.rating.toFixed(1)}</span>
                      <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">| {product.reviews} Rev...</span>
                    </div>
                    {product.colors.length > 1 && (
                      <div className="flex gap-1 sm:gap-1.5 pt-0.5">
                        {product.colors.map((c) => (
                          <span
                            key={c}
                            className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full border border-border"
                            style={{ backgroundColor: colorMap[c] || "#ccc" }}
                            title={c}
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
              </div>
            ))}
          </div>

          {/* Progress bar */}
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
