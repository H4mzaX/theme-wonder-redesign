import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import featuredImg from "@/assets/featured-headphones.jpg";
import airbeatsImg from "@/assets/product-airbeats.jpg";
import zenithImg from "@/assets/product-zenith.jpg";
import rhythmiqImg from "@/assets/product-rhythmiq.jpg";
import soundrollImg from "@/assets/product-soundroll.jpg";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";

const categories = ["Headphones", "Earphones", "Speakers", "Accessories"];

const allProducts: Record<string, Array<{ name: string; price: string; vendor: string; rating: number; image: string; tag?: string }>> = {
  Headphones: [
    { name: "Air Beats Gold Tone", price: "$499.00", vendor: "SonicPulse", rating: 5, image: featuredImg, tag: "New" },
    { name: "Air Beats", price: "$499.00", vendor: "SonicPulse", rating: 5, image: airbeatsImg },
    { name: "FlowHarmony", price: "$999.00", vendor: "SonicPulse", rating: 5, image: featuredImg },
    { name: "Zenith Pulse", price: "$400.00", vendor: "Vibrance", rating: 5, image: zenithImg },
  ],
  Earphones: [
    { name: "RhythmiQ", price: "$399.00", vendor: "SonicPulse", rating: 5, image: rhythmiqImg },
    { name: "Pulse Dot", price: "$299.00", vendor: "SoundSphere", rating: 4.5, image: zenithImg },
    { name: "Echo Buds Pro", price: "$249.00", vendor: "Resonance", rating: 5, image: rhythmiqImg },
    { name: "Air Pods Elite", price: "$349.00", vendor: "Vibrance", rating: 4.5, image: zenithImg },
  ],
  Speakers: [
    { name: "SoundRoll", price: "$199.00", vendor: "Vibrance", rating: 4.5, image: soundrollImg },
    { name: "Echo Elegance", price: "$799.00", vendor: "Resonance", rating: 5, image: soundrollImg },
    { name: "Nature Tune", price: "$1,099.00", vendor: "SonicPulse", rating: 4.5, image: soundrollImg },
    { name: "Bass Wave", price: "$4,750.00", vendor: "Aureal", rating: 5, image: soundrollImg },
  ],
  Accessories: [
    { name: "3.5mm Audio Cable", price: "$35.00", vendor: "Resonance", rating: 4.5, image: airbeatsImg },
    { name: "Ear Cushions", price: "$199.00", vendor: "SonicPulse", rating: 5, image: featuredImg },
    { name: "Steel Case", price: "$80.00", vendor: "SonicPulse", rating: 5, image: zenithImg },
    { name: "Headphone Stand", price: "$49.00", vendor: "Vibrance", rating: 5, image: rhythmiqImg },
  ],
};

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const products = allProducts[categories[activeTab]];

  return (
    <section className="section-padding py-20 lg:py-28">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-display text-center mb-2">
          Best<em className="italic">Sellers</em>
        </h2>
      </ScrollReveal>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mt-6 mb-12 flex-wrap">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveTab(i)}
            className={`text-sm font-medium pb-1 relative transition-colors ${
              i === activeTab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
            {i === activeTab && (
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground"
                layoutId="bestSellerTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <a href="#" className="group block">
                  <motion.div
                    className="relative aspect-square rounded-lg overflow-hidden bg-card mb-3"
                    whileHover="hovered"
                  >
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      variants={{
                        hovered: { scale: 1.08 },
                      }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide">
                        {product.tag}
                      </span>
                    )}
                    <motion.button
                      className="absolute bottom-3 left-3 right-3 bg-background text-foreground text-xs py-2.5 rounded-full font-medium text-center"
                      variants={{
                        hovered: { opacity: 1, y: 0 },
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Add to cart
                    </motion.button>
                  </motion.div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">{product.vendor}</p>
                  <h3 className="text-sm font-medium mt-0.5 group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{product.price}</p>
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
