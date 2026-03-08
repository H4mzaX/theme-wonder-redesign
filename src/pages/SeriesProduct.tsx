import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Shield, Magnet, Zap, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
  Minus, Plus, Package, Truck, Percent, Smartphone, Waves, ShieldCheck, BadgeCheck, Star
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { seriesData, deviceSeries, getSeriesProducts, softmagColors, allProducts, type SeriesSlug } from "@/data/products";
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
import AnimateElement, { StaggerGroup, StaggerChild, ScaleReveal } from "@/components/AnimateElement";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const { addToCart } = useCart();
  const galleryRef = useRef<HTMLDivElement>(null);

  const series = seriesData[seriesSlug as SeriesSlug];
  const deviceGroup = deviceSeries.find((g) => g.slug === deviceSlug);

  // Parallax for gallery
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const galleryY = useTransform(galleryProgress, [0, 1], ["20px", "-20px"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [seriesSlug, deviceSlug]);

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

  const galleryImages = currentProduct
    ? [currentProduct.image, ...(currentProduct.hoverImage ? [currentProduct.hoverImage] : [])]
    : [];

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
  const pageTitle = `${series.name} Case for ${deviceGroup.name} | VCASE`;
  const metaDescription = series.description;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />

      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ MAIN PRODUCT SECTION ═══ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <AnimateElement type="fade" delay={0.1}>
          <nav className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm py-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="capitalize">{series.category}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{series.name} — {deviceGroup.name}</span>
          </nav>
        </AnimateElement>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-12 pt-2 sm:pt-4 lg:pt-6">
          {/* ── LEFT: Gallery with parallax ── */}
          <div ref={galleryRef} className="lg:sticky lg:top-[80px] lg:self-start">
            <AnimateElement type="zoom-in" delay={0.15}>
              <motion.div
                className="relative aspect-[4/5] lg:aspect-square bg-secondary/30 rounded-2xl overflow-hidden"
                style={{ y: galleryY }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  (e.currentTarget as any)._swipeStartX = touch.clientX;
                }}
                onTouchEnd={(e) => {
                  const startX = (e.currentTarget as any)._swipeStartX;
                  if (startX == null) return;
                  const dx = e.changedTouches[0].clientX - startX;
                  if (Math.abs(dx) > 40) {
                    if (dx < 0) setCurrentImg((p) => (p + 1) % galleryImages.length);
                    else setCurrentImg((p) => (p - 1 + galleryImages.length) % galleryImages.length);
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImg}
                    src={galleryImages[currentImg] || currentProduct?.image}
                    alt={`${series.name} for ${currentProduct?.device}`}
                    className="w-full h-full object-contain p-4 sm:p-6 lg:p-8"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: premiumEase }}
                    draggable={false}
                  />
                </AnimatePresence>

                {/* Dots */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-foreground w-5" : "bg-foreground/30"}`}
                      />
                    ))}
                  </div>
                )}

                {/* Series icon badge */}
                <motion.div
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 20 }}
                >
                  <img src={series.icon} alt={series.name} className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-background/80 p-1.5" />
                </motion.div>
              </motion.div>
            </AnimateElement>
          </div>

          {/* ── RIGHT: Product Info with staggered reveals ── */}
          <div className="py-4 lg:py-0">
            {/* Title */}
            <AnimateElement type="clip-up" delay={0.2}>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
                {series.category === "cases" ? "Cases" : "Protection"}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
                {series.name}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">{series.tagline}</p>
            </AnimateElement>

            {/* Price */}
            {currentProduct && (
              <AnimateElement type="fade-up" delay={0.3}>
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-2xl font-bold text-foreground">{currentProduct.price}</span>
                  <span className="text-base text-muted-foreground line-through">{currentProduct.originalPrice}</span>
                  <span className="text-sm font-semibold text-green-600">{currentProduct.discount}</span>
                </div>
              </AnimateElement>
            )}

            {/* Rating */}
            {currentProduct && (
              <AnimateElement type="fade-up" delay={0.35}>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({currentProduct.reviews} reviews)</span>
                </div>
              </AnimateElement>
            )}

            {/* ── Model Selector ── */}
            <AnimateElement type="fade-up" delay={0.4}>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                  Select Model
                </p>
                <div className="flex flex-wrap gap-2">
                  {deviceGroup.models.map((model, i) => {
                    const hasProduct = products.some((p) => p.device === model.name);
                    return (
                      <motion.button
                        key={model.slug}
                        onClick={() => hasProduct && setSelectedModel(products.findIndex((p) => p.device === model.name))}
                        disabled={!hasProduct}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          selectedModel === products.findIndex((p) => p.device === model.name)
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
              </div>
            </AnimateElement>

            {/* ── Color Selector (SoftMag only) ── */}
            {isSoftmag && (
              <AnimateElement type="fade-up" delay={0.45}>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                    Color — {softmagColors[selectedColor]?.name}
                  </p>
                  <div className="flex gap-3">
                    {softmagColors.map((color, i) => (
                      <motion.button
                        key={color.name}
                        onClick={() => setSelectedColor(i)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          i === selectedColor ? "border-foreground scale-110" : "border-border hover:border-foreground/50"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              </AnimateElement>
            )}

            {/* ── Quantity + Add to Cart ── */}
            <AnimateElement type="fade-up" delay={0.5}>
              <div className="mt-6 flex items-center gap-4">
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
                  Add to Cart
                </motion.button>
              </div>
            </AnimateElement>

            {/* Offers */}
            <AnimateElement type="fade-up" delay={0.55}>
              <div className="mt-6 space-y-2">
                {[
                  { icon: Percent, text: "Flat 5% off on single product" },
                  { icon: Percent, text: "Flat 10% off on 2+ products" },
                  { icon: Truck, text: "Free shipping on all prepaid orders" },
                ].map((offer, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <offer.icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{offer.text}</span>
                  </div>
                ))}
              </div>
            </AnimateElement>
          </div>
        </div>
      </section>

      {/* ═══ VIDEO TEXT OVERLAY SECTION ═══ */}
      <div className="mt-10 sm:mt-16">
        <VideoTextOverlay
          videoSrc={heroVideo}
          title={`Experience\n${series.name}`}
          subtitle="WATCH THE FILM"
          description={`Discover the craftsmanship behind ${series.name} — engineered for protection, designed for elegance.`}
        />
      </div>

      {/* ═══ FEATURE HIGHLIGHTS ═══ */}
      <section className="section-padding py-10 sm:py-16 lg:py-20">
        <AnimateElement type="clip-up">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground text-center mb-10 sm:mb-14 tracking-tight">
            Why {series.name}?
          </h2>
        </AnimateElement>
        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1200px] mx-auto" staggerDelay={0.12}>
          {series.features.map((feature, i) => {
            const Icon = featureIcons[i % featureIcons.length];
            return (
              <StaggerChild key={i}>
                <motion.div
                  className="text-center p-5 sm:p-7 rounded-2xl bg-muted/50 border border-border/30"
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-foreground" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground whitespace-pre-line">{feature}</p>
                </motion.div>
              </StaggerChild>
            );
          })}
        </StaggerGroup>
      </section>

      {/* ═══ MATERIAL SECTION ═══ */}
      <ScaleReveal>
        <section className="section-padding py-10 sm:py-16 lg:py-20 bg-muted/30">
          <div className="max-w-[800px] mx-auto text-center">
            <AnimateElement type="fade-up">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-4 tracking-tight">
                Built to Last
              </h2>
            </AnimateElement>
            <AnimateElement type="fade-up" delay={0.1}>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                {series.description}
              </p>
            </AnimateElement>
            <AnimateElement type="zoom-in" delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-5 py-2.5">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{series.material}</span>
              </div>
            </AnimateElement>
          </div>
        </section>
      </ScaleReveal>

      {/* ═══ COMPATIBILITY ═══ */}
      <section className="section-padding py-10 sm:py-16 lg:py-20">
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
                      to={`/${seriesSlug}/${group.slug}`}
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
      <section className="section-padding py-10 sm:py-16 lg:py-20 bg-muted/30">
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
                    className="flex items-center justify-between w-full py-4 text-left"
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
                        <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.a}</p>
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
        <section className="section-padding py-10 sm:py-16 lg:py-20">
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

      <MobileBottomNav
        onMenuOpen={() => {}}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />
    </div>
  );
};

export default SeriesProduct;
