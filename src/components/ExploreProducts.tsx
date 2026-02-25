import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, Smartphone, Shield, Layers, Watch } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import siliconeBlackImg from "@/assets/case-silicone-black.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import leatherBlackImg from "@/assets/case-leather-black.jpg";
import siliconePinkImg from "@/assets/case-silicone-pink.jpg";
import siliconeGreenImg from "@/assets/case-silicone-green.jpg";
import bundlePromoImg from "@/assets/bundle-promo.jpg";

const colorMap: Record<string, string> = {
  Clear: "#e5e5e5",
  "Jet Black": "#1a1a1a",
  Black: "#1a1a1a",
  Blue: "#2563eb",
  Pink: "#ec4899",
  Green: "#16a34a",
  "Saddle Brown": "#92400e",
  "Matte Black": "#333333",
};

interface CategoryProduct {
  id: string;
  brand: string;
  name: string;
  price: string;
  rating: number;
  image: string;
  colors: { name: string; hex: string }[];
}

const categories = [
  {
    name: "iPhone Cases",
    icon: Smartphone,
    count: 24,
    products: [
      { id: "iphone-magsafe-clear", brand: "VCASE", name: "MagSafe Clear", price: "₹1,499", rating: 5.0, image: magsafeClearImg, colors: [{ name: "Clear", hex: "#e5e5e5" }, { name: "Black", hex: "#1a1a1a" }, { name: "Blue", hex: "#2563eb" }] },
      { id: "iphone-silicone-blue", brand: "VCASE", name: "Silicone Snap", price: "₹1,299", rating: 5.0, image: siliconeBluImg, colors: [{ name: "Blue", hex: "#2563eb" }, { name: "Pink", hex: "#ec4899" }, { name: "Green", hex: "#16a34a" }, { name: "Black", hex: "#1a1a1a" }] },
      { id: "iphone-leather-brown", brand: "VCASE", name: "Premium Leather", price: "₹1,999", rating: 5.0, image: leatherBrownImg, colors: [{ name: "Brown", hex: "#92400e" }, { name: "Black", hex: "#1a1a1a" }] },
    ] as CategoryProduct[],
  },
  {
    name: "Samsung Cases",
    icon: Shield,
    count: 20,
    products: [
      { id: "samsung-silicone-black", brand: "VCASE", name: "Silicone Snap", price: "₹1,299", rating: 5.0, image: siliconeBlackImg, colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Blue", hex: "#2563eb" }, { name: "Pink", hex: "#ec4899" }] },
      { id: "samsung-clear-armor", brand: "VCASE", name: "Clear Armor", price: "₹1,199", rating: 5.0, image: magsafeClearImg, colors: [{ name: "Clear", hex: "#e5e5e5" }] },
      { id: "samsung-matte-black", brand: "VCASE", name: "Matte Black", price: "₹1,399", rating: 5.0, image: magsafeBlackImg, colors: [{ name: "Black", hex: "#1a1a1a" }] },
    ] as CategoryProduct[],
  },
  {
    name: "OnePlus Cases",
    icon: Layers,
    count: 10,
    products: [
      { id: "oneplus-leather", brand: "VCASE", name: "Premium Leather", price: "₹1,999", rating: 5.0, image: leatherBrownImg, colors: [{ name: "Brown", hex: "#92400e" }, { name: "Black", hex: "#1a1a1a" }] },
      { id: "oneplus-silicone-green", brand: "VCASE", name: "Silicone Snap", price: "₹1,299", rating: 5.0, image: siliconeGreenImg, colors: [{ name: "Green", hex: "#16a34a" }, { name: "Blue", hex: "#2563eb" }, { name: "Pink", hex: "#ec4899" }] },
      { id: "oneplus-clear", brand: "VCASE", name: "Clear Armor", price: "₹1,199", rating: 5.0, image: magsafeClearImg, colors: [{ name: "Clear", hex: "#e5e5e5" }] },
    ] as CategoryProduct[],
  },
  {
    name: "Accessories",
    icon: Watch,
    count: 30,
    products: [
      { id: "acc-leather-black", brand: "VCASE", name: "Leather Sleeve", price: "₹2,499", rating: 5.0, image: leatherBlackImg, colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Brown", hex: "#92400e" }] },
      { id: "acc-silicone-pink", brand: "VCASE", name: "Silicone Grip", price: "₹999", rating: 5.0, image: siliconePinkImg, colors: [{ name: "Pink", hex: "#ec4899" }, { name: "Blue", hex: "#2563eb" }, { name: "Green", hex: "#16a34a" }] },
      { id: "acc-magsafe-black", brand: "VCASE", name: "MagSafe Mount", price: "₹1,699", rating: 5.0, image: magsafeBlackImg, colors: [{ name: "Black", hex: "#1a1a1a" }] },
    ] as CategoryProduct[],
  },
];

const ExploreProducts = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const { addToCart } = useCart();
  const current = categories[activeCategory];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left sidebar */}
        <div className="lg:w-[180px] flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Collections</h2>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left whitespace-nowrap transition-all duration-200 ${
                    i === activeCategory
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={i === activeCategory ? 2.5 : 1.5} />
                  <span className={`text-sm lg:text-base ${i === activeCategory ? "font-bold" : "font-medium"}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="hidden lg:block mt-6 pt-6 border-t border-border">
            <Link
              to="/collections"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Center products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">Most Popular</p>
            <Link
              to="/collections"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
            >
              All {current.name} ({current.count}) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {current.products.map((product) => (
                <div key={product.id} className="flex-none w-[58vw] sm:w-[220px] lg:w-[calc(33.333%-11px)] snap-start">
                  <Link to={`/product/${product.id}`} className="group block">
                    {/* Image container */}
                    <div className="relative aspect-square bg-muted/40 rounded-xl overflow-hidden mb-3">
                      {/* Rating badge */}
                      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>
                    {/* Info */}
                    <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-0.5">
                      {product.brand}
                    </p>
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">{product.name}</h3>
                      <span className="text-sm sm:text-base font-semibold text-foreground flex-shrink-0">{product.price}</span>
                    </div>
                    {/* Color swatches */}
                    <div className="flex items-center gap-1.5">
                      {product.colors.slice(0, 3).map((c) => (
                        <span
                          key={c.name}
                          className="w-6 h-6 rounded-full border-2 border-border/60"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-muted-foreground font-medium ml-0.5">
                          +{product.colors.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Mobile view all link */}
          <div className="flex lg:hidden mt-4">
            <Link
              to="/collections"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right promo card */}
        <div className="hidden lg:block w-[240px] flex-shrink-0">
          <Link to="/collections" className="group block relative rounded-xl overflow-hidden h-full min-h-[380px]">
            <img
              src={bundlePromoImg}
              alt="Build your bundle"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-white text-lg font-bold leading-tight mb-1">
                    Build your<br />bundle
                  </h3>
                  <p className="text-white/80 text-xs">Buy 3 and save 30%</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;
