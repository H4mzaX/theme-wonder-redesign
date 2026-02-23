import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
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
  const products = exploreLineupTabs[tabs[activeTab]];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-2 tracking-tight">
          Explore The Line-up
        </h2>
      </ScrollReveal>

      <div className="flex justify-center gap-1 mt-6 mb-10">
        <div className="inline-flex border border-foreground rounded-full overflow-hidden">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-sm font-medium px-5 py-2.5 transition-all duration-200 ${
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
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <a href="#" className="group block border border-border rounded-xl overflow-hidden bg-card">
                  <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide">
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
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default ExploreLineup;
