import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Home, SlidersHorizontal, ChevronDown, X, ArrowRight, Headphones, Smartphone, Shield, Cable } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { allProducts, type Product } from "@/data/products";
import { premiumEase } from "@/lib/motion";
import { useSEO } from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import CollectionProductCard from "@/components/CollectionProductCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import TextBehindImageSection from "@/components/TextBehindImageSection";

// Per-collection hero images
import collectionHero from "@/assets/collection-hero-cases.jpg";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import samsungSiliconeBlueImg from "@/assets/samsung-silicone-blue.jpg";
import oneplusMatteBlackImg from "@/assets/oneplus-matte-black.jpg";
import accessoriesImg from "@/assets/collection-accessories.jpg";
import earImg from "@/assets/collection-earphones.jpg";

const collectionIcons: Record<string, React.ElementType> = {
  "iphone-cases": Smartphone,
  "samsung-cases": Smartphone,
  "oneplus-cases": Smartphone,
  "magsafe-cases": Shield,
  "leather-cases": Shield,
  all: Smartphone,
};

// Collection definitions
const collectionDefs: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  ctaLabel: string;
  filter: (p: Product) => boolean;
  subcategories: { name: string; filter: (p: Product) => boolean }[];
  midBanner?: { icon: React.ElementType; label: string; title: string; desc: string; cta: string; image: string };
}> = {
  "iphone-cases": {
    title: "Premium iPhone\nProtection",
    subtitle: "IPHONE CASES",
    description: "Engineered for every drop. Our iPhone cases blend military-grade protection with sleek aesthetics.",
    heroImage: collectionHero,
    ctaLabel: "View All Cases",
    filter: (p) => p.device.includes("iPhone"),
    subcategories: [
      { name: "All iPhone", filter: () => true },
      { name: "ClearMag", filter: (p) => p.seriesSlug === "clearmag" },
      { name: "ClearMag Edge", filter: (p) => p.seriesSlug === "clearmag-edge" },
      { name: "SoftMag", filter: (p) => p.seriesSlug === "softmag" },
    ],
    midBanner: {
      icon: Cable,
      label: "Protection",
      title: "Screen &\nCamera",
      desc: "Complete protection with EdgeGuard and LensGuard.",
      cta: "View Protection",
      image: accessoriesImg,
    },
  },
  cases: {
    title: "All Cases",
    subtitle: "CASES",
    description: "Browse our complete case collection — ClearMag, ClearMag Edge, and SoftMag.",
    heroImage: magsafeClearImg,
    ctaLabel: "View All Cases",
    filter: (p) => p.category === "Cases",
    subcategories: [
      { name: "All Cases", filter: () => true },
      { name: "ClearMag", filter: (p) => p.seriesSlug === "clearmag" },
      { name: "ClearMag Edge", filter: (p) => p.seriesSlug === "clearmag-edge" },
      { name: "SoftMag", filter: (p) => p.seriesSlug === "softmag" },
    ],
  },
  protection: {
    title: "Screen & Camera\nProtection",
    subtitle: "PROTECTION",
    description: "Edge-to-edge screen protectors and precision camera lens guards.",
    heroImage: leatherBrownImg,
    ctaLabel: "View Protection",
    filter: (p) => p.category === "Screen Protection" || p.category === "Camera Protection",
    subcategories: [
      { name: "All Protection", filter: () => true },
      { name: "EdgeGuard", filter: (p) => p.seriesSlug === "edgeguard" },
      { name: "LensGuard", filter: (p) => p.seriesSlug === "lensguard" },
    ],
  },
  all: {
    title: "All Products",
    subtitle: "COLLECTION",
    description: "Browse our complete collection of premium phone cases and protection.",
    heroImage: collectionHero,
    ctaLabel: "Browse All",
    filter: () => true,
    subcategories: [
      { name: "All Products", filter: () => true },
      { name: "Cases", filter: (p) => p.category === "Cases" },
      { name: "Screen", filter: (p) => p.category === "Screen Protection" },
      { name: "Camera", filter: (p) => p.category === "Camera Protection" },
    ],
    midBanner: {
      icon: Cable,
      label: "Protection",
      title: "Full\nProtection",
      desc: "Cases, screen protectors & camera guards for your devices.",
      cta: "View All",
      image: accessoriesImg,
    },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubcat, setActiveSubcat] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const collection = collectionDefs[slug || "all"] || collectionDefs["all"];
  const CollectionIcon = collectionIcons[slug || "all"] || Smartphone;

  useSEO({
    title: `${collection.title.replace("\n", " ")} | VCASE`,
    description: collection.description,
    canonical: `https://vcase.in/collections/${slug || "all"}`,
  });

  useEffect(() => {
    setActiveSubcat(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

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

  // Split products for mid-banner insertion
  const firstHalf = products.slice(0, 4);
  const secondHalf = products.slice(4);

  return (
    <motion.div
      key={slug}
      className="min-h-screen bg-background overflow-x-clip"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} transparent />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ Hero — Full bleed dark with parallax ═══ */}
      <motion.section
        ref={heroRef}
        className="relative -mt-[60px] h-[520px] sm:h-[560px] lg:h-[640px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="absolute inset-0" style={{ opacity: heroOpacity }}>
          <motion.img
            src={collection.heroImage}
            alt={collection.title}
            className="w-full h-full object-cover"
            style={{ scale: heroScale }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />

        {/* Hero content — bottom-left aligned */}
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-20 sm:pb-24 lg:pb-28">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: premiumEase }}
            className="mb-4"
          >
            <CollectionIcon className="w-8 h-8 sm:w-10 sm:h-10 text-background/80" strokeWidth={1.5} />
          </motion.div>

          {/* Subtitle label */}
          <motion.p
            className="text-accent text-xs sm:text-sm tracking-[0.25em] font-medium mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: premiumEase }}
          >
            {collection.subtitle}
          </motion.p>

          {/* Title — multiline */}
          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-background leading-[1.1] tracking-tight whitespace-pre-line"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: premiumEase }}
          >
            {collection.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-background/70 text-sm sm:text-base mt-4 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: premiumEase }}
          >
            {collection.description}
          </motion.p>

          {/* CTA pill button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease: premiumEase }}
            className="mt-6"
          >
            <button className="inline-flex items-center gap-3 border border-background/40 text-background rounded-full px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-medium hover:bg-background hover:text-foreground transition-all duration-300">
              {collection.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ White content panel — floating above hero with rounded top ═══ */}
      <motion.div
        className="relative -mt-10 bg-background rounded-t-[2.5rem] sm:rounded-t-[3rem] z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-b-[2.5rem] sm:rounded-b-[3rem]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: premiumEase }}
      >
        {/* Breadcrumb */}
        <div className="section-padding pt-6 sm:pt-8 pb-2">
          <nav className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span>/</span>
            <Link to="/collections/all" className="hover:text-foreground transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{collection.title.split("\n")[0]}</span>
          </nav>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm border-b border-border/40">
          <div className="section-padding py-3 sm:py-4 flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium hover:bg-muted transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{showFilters ? "Hide" : "Show"} filters</span>
            </button>

            <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="flex items-center gap-0">
                {collection.subcategories.map((sub, i) => {
                  const count = allProducts.filter(collection.filter).filter(sub.filter).length;
                  return (
                    <div key={sub.name} className="flex items-center">
                      {i > 0 && <span className="text-muted-foreground/40 mx-2 sm:mx-3 text-sm select-none">/</span>}
                      <button
                        onClick={() => setActiveSubcat(i)}
                        className={`relative whitespace-nowrap text-sm sm:text-base font-medium py-1 transition-colors ${
                          i === activeSubcat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
                    </div>
                  );
                })}
              </div>
            </div>

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
        </div>

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
                    <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Device</h4>
                      <div className="space-y-2">
                        {(() => {
                          const collectionProducts = allProducts.filter(collection.filter);
                          const devices = [...new Set(collectionProducts.map(p => p.device))].sort();
                          return devices.map((device) => (
                            <label key={device} className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" className="rounded border-border" />
                              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{device}</span>
                            </label>
                          ));
                        })()}
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

            {/* Product Grid with mid-banner */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>

              {/* First batch of products */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {firstHalf.map((product) => (
                  <div key={product.id}>
                    <CollectionProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* ═══ Mid-page banner ═══ */}
              {collection.midBanner && (
                <div
                  className="relative my-6 sm:my-10 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/7]"
                >
                  <img
                    src={collection.midBanner.image}
                    alt={collection.midBanner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <collection.midBanner.icon className="w-8 h-8 text-background/80 mb-3" strokeWidth={1.5} />
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-background whitespace-pre-line leading-tight">
                      {collection.midBanner.title}
                    </h2>
                    <p className="text-background/70 text-sm sm:text-base mt-3 max-w-md">
                      {collection.midBanner.desc}
                    </p>
                    <button className="mt-6 inline-flex items-center gap-3 border border-background/50 text-background rounded-full px-6 py-3 text-sm font-medium hover:bg-background hover:text-foreground transition-all duration-300">
                      {collection.midBanner.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Second batch of products */}
              {secondHalf.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {secondHalf.map((product) => (
                    <div key={product.id}>
                      <CollectionProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}

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

        {/* ═══ Text-behind-image parallax section ═══ */}
        <TextBehindImageSection />

        {/* ═══ You May Also Like — horizontal scroll carousel ═══ */}
        <section className="section-padding py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-5 sm:mb-7">
            You May Also Like
          </h2>
          <div
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {allProducts
              .filter((p) => !products.find((pp) => pp.id === p.id))
              .slice(0, 8)
              .map((product) => (
                <div key={product.id} className="flex-none w-[55vw] sm:w-[280px] lg:w-[320px] snap-start">
                  <CollectionProductCard product={product} large />
                </div>
              ))}
          </div>
        </section>

        {/* ═══ Recently Viewed — horizontal scroll carousel ═══ */}
        <section className="section-padding py-8 sm:py-12 pb-28 sm:pb-20">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-5 sm:mb-7">
            Recently Viewed
          </h2>
          <div
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {products.slice(0, 8).map((product) => (
              <div key={`rv-${product.id}`} className="flex-none w-[55vw] sm:w-[280px] lg:w-[320px] snap-start">
                <CollectionProductCard product={product} large />
              </div>
            ))}
          </div>
        </section>

        {/* Floating Filter & Sort button — mobile */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 sm:hidden">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2.5 bg-foreground text-background rounded-full px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-sm font-semibold"
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 25 }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter and sort
          </motion.button>
        </div>
      </motion.div>

      {/* ═══ Footer — dark bg visible behind rounded white panel ═══ */}
      <div className="bg-foreground relative -mt-8 pt-12 sm:pt-14">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onMenuOpen={() => setMobileMenuOpen(!mobileMenuOpen)}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />
    </motion.div>
  );
};

export default Collection;
