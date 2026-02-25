import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Home, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts, type Product } from "@/data/products";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import collectionHero from "@/assets/collection-hero-cases.jpg";

// Collection definitions
const collectionDefs: Record<string, {
  title: string;
  description: string;
  heroImage: string;
  filter: (p: Product) => boolean;
  subcategories: { name: string; filter: (p: Product) => boolean }[];
}> = {
  "iphone-cases": {
    title: "iPhone Cases",
    description: "Premium protection for every iPhone",
    heroImage: collectionHero,
    filter: (p) => p.device.includes("iPhone"),
    subcategories: [
      { name: "All iPhone Cases", filter: () => true },
      { name: "MagSafe", filter: (p) => p.category === "MagSafe Cases" },
      { name: "Silicone", filter: (p) => p.category === "Silicone Cases" },
      { name: "Leather", filter: (p) => p.category === "Leather Cases" },
    ],
  },
  "samsung-cases": {
    title: "Samsung Cases",
    description: "Galaxy-grade protection for Samsung devices",
    heroImage: collectionHero,
    filter: (p) => p.device.includes("Samsung"),
    subcategories: [
      { name: "All Samsung Cases", filter: () => true },
      { name: "Silicone", filter: (p) => p.category === "Silicone Cases" },
      { name: "Leather", filter: (p) => p.category === "Leather Cases" },
      { name: "Clear Cases", filter: (p) => p.category === "Clear Cases" },
    ],
  },
  "oneplus-cases": {
    title: "OnePlus Cases",
    description: "Never settle on protection",
    heroImage: collectionHero,
    filter: (p) => p.device.includes("OnePlus"),
    subcategories: [
      { name: "All OnePlus Cases", filter: () => true },
      { name: "Silicone", filter: (p) => p.category === "Silicone Cases" },
      { name: "Leather", filter: (p) => p.category === "Leather Cases" },
    ],
  },
  "magsafe-cases": {
    title: "MagSafe Cases",
    description: "Snap-on perfection with MagSafe technology",
    heroImage: collectionHero,
    filter: (p) => p.category === "MagSafe Cases",
    subcategories: [
      { name: "All MagSafe", filter: () => true },
      { name: "Clear", filter: (p) => p.name.includes("Clear") },
      { name: "Black", filter: (p) => p.name.includes("Black") },
    ],
  },
  "leather-cases": {
    title: "Leather Cases",
    description: "Handcrafted premium leather protection",
    heroImage: collectionHero,
    filter: (p) => p.category === "Leather Cases",
    subcategories: [
      { name: "All Leather", filter: () => true },
      { name: "iPhone", filter: (p) => p.device.includes("iPhone") },
      { name: "Samsung", filter: (p) => p.device.includes("Samsung") },
    ],
  },
  "all": {
    title: "All Products",
    description: "Browse our complete collection",
    heroImage: collectionHero,
    filter: () => true,
    subcategories: [
      { name: "All Products", filter: () => true },
      { name: "iPhone", filter: (p) => p.device.includes("iPhone") },
      { name: "Samsung", filter: (p) => p.device.includes("Samsung") },
      { name: "OnePlus", filter: (p) => p.device.includes("OnePlus") },
    ],
  },
};

type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSubcat, setActiveSubcat] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);

  const collection = collectionDefs[slug || "all"] || collectionDefs["all"];

  const products = useMemo(() => {
    let filtered = allProducts.filter(collection.filter);
    const subFilter = collection.subcategories[activeSubcat]?.filter;
    if (subFilter) filtered = filtered.filter(subFilter);

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => parseInt(a.price.replace(/[₹,]/g, "")) - parseInt(b.price.replace(/[₹,]/g, "")));
      case "price-high":
        return [...filtered].sort((a, b) => parseInt(b.price.replace(/[₹,]/g, "")) - parseInt(a.price.replace(/[₹,]/g, "")));
      case "rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [collection, activeSubcat, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Banner */}
      <motion.section
        className="relative h-[280px] sm:h-[360px] lg:h-[440px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={collection.heroImage}
          alt={collection.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10" />
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-8 sm:pb-10 lg:pb-14">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-background/70 text-xs sm:text-sm mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Link to="/" className="hover:text-background transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span>/</span>
            <span>Collections</span>
            <span>/</span>
            <span className="text-background font-medium">{collection.title}</span>
          </motion.nav>
          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-background tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {collection.title}
          </motion.h1>
        </div>
      </motion.section>

      {/* Filter Bar */}
      <motion.section
        className="sticky top-[60px] z-40 bg-background border-b border-border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="section-padding py-3 sm:py-4 flex items-center gap-4 sm:gap-6">
          {/* Show filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition-colors flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{showFilters ? "Hide" : "Show"} filters</span>
          </button>

          {/* Category tabs - scrollable */}
          <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex items-center gap-1 sm:gap-2">
              {collection.subcategories.map((sub, i) => {
                const count = allProducts.filter(collection.filter).filter(sub.filter).length;
                return (
                  <button
                    key={sub.name}
                    onClick={() => setActiveSubcat(i)}
                    className={`relative whitespace-nowrap text-sm sm:text-base font-medium px-1 py-1 transition-colors ${
                      i === activeSubcat
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sub.name}
                    <sup className="text-[10px] ml-0.5 text-muted-foreground">{count}</sup>
                    {i === activeSubcat && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                        layoutId="collectionTab"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setSortDropdown(!sortDropdown)}
              className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <span className="hidden sm:inline">{sortOptions.find((s) => s.value === sortBy)?.label}</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortDropdown && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-muted font-semibold text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Filter sidebar + Product grid */}
      <section className="section-padding py-6 sm:py-8 lg:py-10">
        <div className="flex gap-6 lg:gap-8">
          {/* Filter sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                className="fixed inset-y-0 left-0 w-80 bg-background z-50 p-6 overflow-y-auto shadow-2xl lg:static lg:shadow-none lg:w-60 lg:flex-shrink-0 lg:border-r lg:border-border lg:pr-6"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="text-lg font-display font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Device</h4>
                    <div className="space-y-2">
                      {["iPhone 17", "iPhone 16", "iPhone 15", "Samsung S26", "Samsung S25", "OnePlus 15"].map((device) => (
                        <label key={device} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{device}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Price Range</h4>
                    <div className="space-y-2">
                      {["Under ₹1,000", "₹1,000 - ₹1,500", "₹1,500 - ₹2,000", "Above ₹2,000"].map((range) => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "Black", hex: "#1a1a1a" },
                        { name: "Blue", hex: "#2563eb" },
                        { name: "Pink", hex: "#ec4899" },
                        { name: "Green", hex: "#16a34a" },
                        { name: "Brown", hex: "#92400e" },
                        { name: "Clear", hex: "#e5e5e5" },
                      ].map((color) => (
                        <button
                          key={color.name}
                          className="w-7 h-7 rounded-full border-2 border-border hover:border-foreground transition-colors"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Overlay for mobile filter */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="fixed inset-0 bg-foreground/40 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
              />
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No products found in this collection.</p>
                <Link to="/collections/all" className="text-sm text-foreground underline mt-2 inline-block">
                  Browse all products
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collection;
