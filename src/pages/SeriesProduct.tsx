import { useState, useRef, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  Shield, Magnet, Zap, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
  Minus, Plus, Package, Truck, Percent, Smartphone, Waves, ShieldCheck, BadgeCheck, Star, Heart, Share2
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { seriesData, deviceSeries, getSeriesProducts, softmagColors, allProducts, type SeriesSlug, iphone17ProGalleryImages, iphone17GalleryImages, iphone16MagsafeGalleryImages, siliconeGalleryImages } from "@/data/products";
import softmagHero from "@/assets/softmag-hero.webp";
import softmagFloating from "@/assets/softmag-floating.webp";
import softmagCamera from "@/assets/softmag-camera.webp";
import softmagCloseup from "@/assets/softmag-closeup.webp";
import softmagLifestyle from "@/assets/softmag-lifestyle.webp";
import armoredgeHeroImg from "@/assets/armoredge-hero.webp";
import armoredgeCloseupImg from "@/assets/armoredge-closeup.webp";
import armoredgeRing from "@/assets/armoredge-ring.webp";
import armoredgeLifestyle from "@/assets/armoredge-lifestyle.webp";
import edgeguardImg from "@/assets/edgeguard-screen-protector.jpg";
import edgeguardHoverImg from "@/assets/edgeguard-screen-protector-hover.jpg";
import lensguardImg from "@/assets/lensguard-camera-protector.jpg";
import lensguardHoverImg from "@/assets/lensguard-camera-protector-hover.jpg";
import { useSEO } from "@/hooks/useSEO";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import VideoTextOverlay from "@/components/VideoTextOverlay";
import BrandName from "@/components/BrandName";
import AnimateElement, { StaggerGroup, StaggerChild, ScaleReveal } from "@/components/AnimateElement";
import ProductContentSections from "@/components/ProductContentSections";
import FloatingNavPill from "@/components/FloatingNavPill";
import { premiumEase } from "@/lib/motion";

import heroVideo from "@/assets/hero-video.mp4";

const featureIcons = [Waves, ShieldCheck, Magnet, BadgeCheck];

const faqItems = [
  { q: "Will this case make my phone bulky?", a: "No! Our cases are designed with a slim profile that adds minimal bulk while providing maximum protection." },
  { q: "Is it compatible with wireless charging?", a: "Yes, all our cases are fully compatible with Qi and Qi2 wireless charging. MagSafe cases have built-in magnets for perfect alignment." },
  { q: "What if my case turns yellow?", a: "We offer a free replacement guarantee if your clear case turns yellow within the warranty period." },
  { q: "How do I clean it?", a: "Wipe with a damp cloth and mild soap. For silicone surfaces, the material is washable. Avoid harsh chemicals." },
];

const SeriesProduct = () => {
  const { seriesSlug, deviceSlug } = useParams<{ seriesSlug: string; deviceSlug: string }>();
  const [searchParams] = useSearchParams();
  const modelParam = searchParams.get("model");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState(0);
  const { addToCart } = useCart();
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const series = seriesData[seriesSlug as SeriesSlug];
  const deviceGroup = deviceSeries.find((g) => g.slug === deviceSlug);

  // Resolve selected model from URL query param
  const resolveModelIndex = () => {
    if (!deviceGroup || !seriesSlug) return 0;
    const products = getSeriesProducts(seriesSlug, deviceSlug!);
    if (modelParam) {
      const model = deviceGroup.models.find((m) => m.slug === modelParam);
      if (model) {
        const idx = products.findIndex((p) => p.device === model.name);
        if (idx >= 0) return idx;
      }
    }
    return 0;
  };
  const [selectedModel, setSelectedModel] = useState(resolveModelIndex);

  // Update selected model when URL changes
  useEffect(() => {
    setSelectedModel(resolveModelIndex());
    setActiveGalleryImg(0);
  }, [modelParam, seriesSlug, deviceSlug]);

  const seriesName = series?.name || seriesSlug || "";

  // Derive device name from model param or first model
  const resolvedModelName = modelParam && deviceGroup
    ? deviceGroup.models.find((m) => m.slug === modelParam)?.name
    : undefined;
  const currentDeviceName = resolvedModelName || deviceGroup?.models[0]?.name || deviceSlug || "";

  useSEO({
    title: series && deviceGroup ? `${seriesName} for ${currentDeviceName} | VCASE` : "Product | VCASE",
    description: series ? `Buy ${seriesName} ${series.type === "case" ? "case" : "protector"} for ${currentDeviceName}. ${series.description} Free shipping on prepaid orders.` : "Premium phone protection by VCASE.",
    canonical: `https://vcase.in/${seriesSlug}/${deviceSlug}`,
    type: "product",
    jsonLd: series && deviceGroup ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${seriesName} for ${currentDeviceName}`,
      description: series.description,
      brand: { "@type": "Brand", name: "VCASE" },
      offers: { "@type": "Offer", priceCurrency: "INR", availability: "https://schema.org/InStock" },
    } : undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [seriesSlug, deviceSlug]);

  // Intersection observer for gallery scroll tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    imageRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveGalleryImg(i); },
        { threshold: 0.6 }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [seriesSlug, deviceSlug, selectedModel, selectedColor]);

  if (!series || !deviceGroup) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <Link to="/" className="text-sm text-muted-foreground underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const products = getSeriesProducts(seriesSlug!, deviceSlug!);
  const currentProduct = products[selectedModel] || products[0];
  const isSoftmag = seriesSlug === "softmag";

  // Build gallery images array — use device/series-specific galleries
  const getGalleryImages = (): string[] => {
    if (!currentProduct) return [];
    const device = currentProduct.device;
    const slug = currentProduct.seriesSlug;

    // Device-specific ClearMag galleries
    if (slug === "clearmag" || slug === "clearmag-edge") {
      if (device === "iPhone 17 Pro" || device === "iPhone 17 Pro Max") return iphone17ProGalleryImages;
      if (device === "iPhone 17" || device === "iPhone 17 Air") return iphone17GalleryImages;
      if (device.includes("iPhone 16")) return iphone16MagsafeGalleryImages;
    }
    // SoftMag galleries
    if (slug === "softmag") {
      return [softmagHero, softmagFloating, softmagCamera, softmagCloseup, softmagLifestyle];
    }
    // Armor Edge galleries
    if (slug === "armor-edge") {
      return [armoredgeHeroImg, armoredgeCloseupImg, armoredgeRing, armoredgeLifestyle];
    }
    // EdgeGuard
    if (slug === "edgeguard") {
      return [edgeguardImg, edgeguardHoverImg, edgeguardImg, edgeguardHoverImg];
    }
    // LensGuard
    if (slug === "lensguard") {
      return [lensguardImg, lensguardHoverImg, lensguardImg, lensguardHoverImg];
    }
    // Fallback
    return [
      currentProduct.image,
      ...(currentProduct.hoverImage ? [currentProduct.hoverImage] : []),
      currentProduct.image,
      ...(currentProduct.hoverImage ? [currentProduct.hoverImage] : []),
    ];
  };
  const galleryImages = getGalleryImages();

  const handleAddToCart = () => {
    if (!currentProduct) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: currentProduct.id,
        name: currentProduct.name,
        subtitle: currentProduct.subtitle,
        price: currentProduct.price,
        originalPrice: currentProduct.originalPrice,
        image: currentProduct.image,
        color: isSoftmag ? softmagColors[selectedColor]?.name || "Default" : "Default",
        device: currentProduct.device,
      });
    }
    toast({ title: "Added to cart!", description: `${series.name} × ${quantity}` });
    setCartOpen(true);
  };

  const relatedProducts = allProducts
    .filter((p) => p.device === currentProduct?.device && p.seriesSlug !== seriesSlug)
    .slice(0, 4);

  const otherDeviceGroups = deviceSeries.filter((g) => g.slug !== deviceSlug);
  const pageTitle = `${series.name} for ${currentDeviceName} | VCASE`;
  const metaDescription = series.description;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />

      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ BREADCRUMB ═══ */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <motion.nav
          className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="capitalize">{series.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{series.name} — {currentDeviceName}</span>
        </motion.nav>
      </div>

      {/* ═══ MAIN PRODUCT SECTION — Concept theme layout ═══ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">

          {/* ── LEFT: Vertically stacked scroll gallery (Concept style) ── */}
          <div ref={galleryRef} className="lg:col-span-7">
            {/* Mobile: horizontal swipe gallery */}
            <div className="lg:hidden">
              <div className="relative aspect-[4/5] bg-secondary/20 rounded-2xl overflow-hidden mb-3">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeGalleryImg}
                    src={galleryImages[activeGalleryImg] || currentProduct?.image}
                    alt={`${series.name} for ${currentProduct?.device}`}
                    className="w-full h-full object-contain p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    draggable={false}
                  />
                </AnimatePresence>

                {/* Series icon */}
                <motion.div
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
                >
                  <img src={series.icon} alt={series.name} className="w-9 h-9 rounded-lg bg-background/80 p-1.5" />
                </motion.div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {galleryImages.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGalleryImg(i)}
                    className={`flex-none w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeGalleryImg ? "border-foreground" : "border-border/40"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: Concept-style two-column stacked gallery */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={i}
                  ref={(el) => { imageRefs.current[i] = el; }}
                  className={`relative bg-secondary/20 rounded-2xl overflow-hidden ${
                    i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: premiumEase }}
                >
                  <img
                    src={img}
                    alt={`${series.name} view ${i + 1}`}
                    className="w-full h-full object-contain p-6 lg:p-10"
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding={i < 2 ? "sync" : "async"}
                  />

                  {/* Series badge on first image */}
                  {i === 0 && (
                    <motion.div
                      className="absolute top-5 left-5"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <img src={series.icon} alt={series.name} className="w-11 h-11 rounded-xl bg-background/80 p-1.5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Sticky product info (Concept style) ── */}
          <div className="lg:col-span-5 py-4 lg:py-0">
            <div className="lg:sticky lg:top-[80px] lg:pb-10">
              {/* Brand label */}
              <motion.p
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                VCASE
              </motion.p>

              {/* Product title */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: premiumEase }}
              >
                <BrandName
                  name={series.name}
                  as="h1"
                  className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display text-foreground tracking-tight leading-[1.1]"
                />
              </motion.div>

              {/* Price + Rating row */}
              {currentProduct && (
                <motion.div
                  className="flex items-center justify-between mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-foreground">{currentProduct.price}</span>
                    <span className="text-base text-muted-foreground line-through">{currentProduct.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{currentProduct.reviews} reviews</span>
                  </div>
                </motion.div>
              )}

              {/* Discount badge */}
              {currentProduct && (
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <span className="inline-block text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                    {currentProduct.discount}
                  </span>
                </motion.div>
              )}

              {/* Description */}
              <motion.p
                className="text-sm text-muted-foreground leading-relaxed mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.3 }}
              >
                {series.description}
              </motion.p>

              {/* Divider */}
              <div className="h-px bg-border/60 my-6" />

              {/* ── Model Selector ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                  Model: <span className="text-foreground">{currentProduct?.device}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {deviceGroup.models.map((model, i) => {
                    const prodIdx = products.findIndex((p) => p.device === model.name);
                    const hasProduct = prodIdx >= 0;
                    const isSelected = selectedModel === prodIdx;
                    return (
                      <motion.button
                        key={model.slug}
                        onClick={() => hasProduct && setSelectedModel(prodIdx)}
                        disabled={!hasProduct}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : hasProduct
                            ? "border-border hover:border-foreground/50"
                            : "border-border/30 text-muted-foreground/40 cursor-not-allowed"
                        }`}
                        whileTap={hasProduct ? { scale: 0.95 } : undefined}
                      >
                        {model.name}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Color Selector (SoftMag only) ── */}
              {isSoftmag && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                    Color: <span className="text-foreground">{softmagColors[selectedColor]?.name}</span>
                  </p>
                  <div className="flex gap-3">
                    {softmagColors.map((color, i) => (
                      <motion.button
                        key={color.name}
                        onClick={() => setSelectedColor(i)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          i === selectedColor ? "border-foreground scale-110 ring-2 ring-foreground/20 ring-offset-2 ring-offset-background" : "border-border hover:border-foreground/50"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <div className="h-px bg-border/60 my-6" />

              {/* ── Quantity + Add to Cart ── */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-muted transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-muted transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 bg-foreground text-background py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-foreground/90 transition-colors"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                >
                  Add to Cart — {currentProduct?.price}
                </motion.button>
              </motion.div>

              {/* Wishlist + Share */}
              <motion.div
                className="flex gap-3 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.3 }}
              >
                <button className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  <Heart className="w-4 h-4" /> Wishlist
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </motion.div>

              {/* ── Offers strip ── */}
              <motion.div
                className="mt-6 space-y-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                {[
                  { icon: Percent, text: "Flat 5% off on single product" },
                  { icon: Percent, text: "Flat 10% off on 2+ products" },
                  { icon: Truck, text: "Free shipping on all prepaid orders" },
                  { icon: Package, text: "Easy 7-day return policy" },
                ].map((offer, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <offer.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{offer.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* ── Product Highlights (Concept style) ── */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.3 }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">
                  Product Highlights
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {series.features.map((feature, i) => {
                    const Icon = featureIcons[i % featureIcons.length];
                    return (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/20">
                        <Icon className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs text-foreground leading-snug">{feature}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FLOATING NAV PILL ═══ */}
      <FloatingNavPill
        sections={[
          { id: "pdp-highlights", label: "Highlights" },
          { id: "pdp-features", label: "Features" },
          { id: "pdp-faqs", label: "FAQs" },
        ]}
      />

      {/* ═══ RICH PRODUCT CONTENT — ScrollVideo, Gallery, Editorial, Stats ═══ */}
      {currentProduct && <ProductContentSections product={currentProduct} />}

      {/* ═══ VIDEO TEXT OVERLAY SECTION ═══ */}
      <div className="mt-12 sm:mt-20">
        <VideoTextOverlay
          videoSrc={heroVideo}
          title={`Experience\n${series.name}`}
          subtitle="WATCH THE FILM"
          description={`Discover the craftsmanship behind ${series.name} — engineered for protection, designed for elegance.`}
        />
      </div>

      {/* ═══ COMPATIBILITY ═══ */}
      <section className="section-padding py-12 sm:py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto text-center">
          <AnimateElement type="fade-up">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-8 tracking-tight">
              Compatible Models
            </h2>
          </AnimateElement>
          <StaggerGroup className="flex flex-wrap justify-center gap-3" staggerDelay={0.06}>
            {deviceGroup.models.map((model) => (
              <StaggerChild key={model.slug}>
                <div className="flex items-center gap-2 bg-muted/50 border border-border/30 rounded-xl px-4 py-2.5">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{model.name}</span>
                </div>
              </StaggerChild>
            ))}
          </StaggerGroup>

          {otherDeviceGroups.length > 0 && (
            <AnimateElement type="fade" delay={0.3}>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">Also available for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {otherDeviceGroups.map((group) => (
                      <Link
                        key={group.slug}
                        to={`/${seriesSlug}/${group.slug}?model=${group.models[0]?.slug}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        {group.name}
                    </Link>
                  ))}
                </div>
              </div>
            </AnimateElement>
          )}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-padding py-12 sm:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-[700px] mx-auto">
          <AnimateElement type="fade-up">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground text-center mb-10 tracking-tight">
              Frequently Asked Questions
            </h2>
          </AnimateElement>
          <div className="space-y-0">
            {faqItems.map((faq, i) => (
              <AnimateElement key={i} type="fade-up" delay={i * 0.06}>
                <div className="border-b border-border/40">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex items-center justify-between w-full py-5 text-left"
                  >
                    <span className="text-sm sm:text-base font-medium text-foreground pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: premiumEase }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: premiumEase }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimateElement>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Related Products ═══ */}
      {relatedProducts.length > 0 && (
        <section className="section-padding py-12 sm:py-20 lg:py-24">
          <AnimateElement type="fade-up">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-8 tracking-tight">
              You May Also Like
            </h2>
          </AnimateElement>
          <StaggerGroup className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.1}>
            {relatedProducts.map((product) => (
              <StaggerChild key={product.id}>
                <ProductCard product={product} />
              </StaggerChild>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* Footer */}
      <div className="bg-foreground relative pt-12 sm:pt-14">
        <div className="absolute top-0 left-0 right-0 h-10 bg-background rounded-b-[2.5rem] sm:rounded-b-[3rem] z-10" />
        <Footer />
      </div>

      {/* ── Mobile sticky Add to Cart ── */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background border-t border-border/40 px-4 py-3 safe-area-inset-bottom"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground line-clamp-1">{series.name} — {currentProduct?.device}</p>
            <p className="text-base font-bold text-foreground">{currentProduct?.price}</p>
          </div>
          <motion.button
            onClick={handleAddToCart}
            className="bg-foreground text-background px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider"
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </motion.div>

      <MobileBottomNav
        onMenuOpen={() => {}}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />
    </div>
  );
};

export default SeriesProduct;
