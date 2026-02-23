import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import featuredImg from "@/assets/featured-headphones.jpg";
import airbeatsImg from "@/assets/product-airbeats.jpg";
import zenithImg from "@/assets/product-zenith.jpg";
import rhythmiqImg from "@/assets/product-rhythmiq.jpg";
import soundrollImg from "@/assets/product-soundroll.jpg";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";

const tabs = ["Phone Cases", "Screen Protectors", "Charging Essentials"];

const allProducts: Record<string, Array<{
  name: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
}>> = {
  "Phone Cases": [
    { name: "Modern Leatherite Case", subtitle: "For iPhone 16 Pro Max", price: "₹1,699", originalPrice: "₹1,999", discount: "Save 15%", rating: 5, reviews: 126, image: featuredImg, colors: ["Windsor Tan", "Raven Black"] },
    { name: "Super Crystal Case Cover", subtitle: "For iPhone 16", price: "₹1,499", originalPrice: "₹2,999", discount: "Save 50%", rating: 5, reviews: 578, image: airbeatsImg, colors: ["Clear"] },
    { name: "Silicone Snap Fit Case", subtitle: "For iPhone 16 Pro Max", price: "₹1,299", originalPrice: "₹1,999", discount: "Save 35%", rating: 5, reviews: 320, image: rhythmiqImg, colors: ["Black", "Blue", "Grey"] },
    { name: "Grip Armour Case Cover", subtitle: "For iPhone 16", price: "₹1,199", originalPrice: "₹1,999", discount: "Save 40%", rating: 5, reviews: 196, image: soundrollImg, colors: ["Black"] },
  ],
  "Screen Protectors": [
    { name: "Impact Pro Screen Protector", subtitle: "For iPhone 16", price: "₹899", originalPrice: "₹1,499", discount: "On sale", rating: 5, reviews: 166, image: zenithImg, colors: ["Clear"] },
    { name: "Impact Pro (Privacy)", subtitle: "For iPhone 16", price: "₹999", originalPrice: "₹1,499", discount: "On sale", rating: 4, reviews: 48, image: zenithImg, colors: ["Privacy"] },
    { name: "5D Ultra Impact Protector", subtitle: "For iPhone 16 Pro Max", price: "₹1,099", originalPrice: "₹1,999", discount: "Save 45%", rating: 5, reviews: 80, image: zenithImg, colors: ["Clear"] },
    { name: "Matte Anti-Glare Guard", subtitle: "For iPhone 16 Pro", price: "₹999", originalPrice: "₹1,499", discount: "Save 33%", rating: 5, reviews: 95, image: zenithImg, colors: ["Matte"] },
  ],
  "Charging Essentials": [
    { name: "CORD 60W Type C Cable", subtitle: "For Fast Charging", price: "₹699", originalPrice: "₹1,499", discount: "Save 53%", rating: 5, reviews: 3, image: airbeatsImg, colors: ["Black"] },
    { name: "RAPID PRO 20W PD Charger", subtitle: "For Fast Charging", price: "₹699", originalPrice: "₹1,499", discount: "Save 53%", rating: 5, reviews: 13, image: soundrollImg, colors: ["White"] },
    { name: "MagSafe Wireless Charger", subtitle: "15W Fast Charging", price: "₹1,299", originalPrice: "₹1,999", discount: "Save 35%", rating: 5, reviews: 42, image: rhythmiqImg, colors: ["Black", "White"] },
    { name: "Car Mount Charger", subtitle: "Auto-Grip MagSafe", price: "₹1,499", originalPrice: "₹2,499", discount: "Save 40%", rating: 5, reviews: 28, image: featuredImg, colors: ["Black"] },
  ],
};

const ExploreLineup = () => {
  const [activeTab, setActiveTab] = useState(0);
  const products = allProducts[tabs[activeTab]];

  return (
    <section className="section-padding py-16 lg:py-20">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl font-display font-semibold text-center mb-2">
          Explore The Line-up
        </h2>
      </ScrollReveal>

      <div className="flex justify-center gap-2 sm:gap-3 mt-6 mb-10 flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 ${
              i === activeTab
                ? "bg-foreground text-background"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <a href="#" className="group block">
                  <motion.div className="relative rounded-2xl overflow-hidden bg-card mb-3 aspect-square" whileHover="hovered">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      variants={{ hovered: { scale: 1.08 } }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide">
                        {product.discount}
                      </span>
                    )}
                    <motion.button
                      className="absolute bottom-3 left-3 right-3 bg-foreground text-background text-xs py-2.5 rounded-full font-medium text-center"
                      variants={{ hovered: { opacity: 1, y: 0 } }}
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      ADD TO CART
                    </motion.button>
                  </motion.div>
                  <h3 className="font-display text-sm font-semibold group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.subtitle}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < product.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">{product.reviews} reviews</span>
                  </div>
                  {product.colors.length > 1 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {product.colors.map((c) => (
                        <span key={c} className="text-[10px] text-muted-foreground">{c}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
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

export default ExploreLineup;
