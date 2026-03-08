import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Shield, Magnet, Zap, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
  Minus, Plus, Package, Truck, Percent, Smartphone, Waves, ShieldCheck, BadgeCheck, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { premiumEase } from "@/lib/motion";

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

  const series = seriesData[seriesSlug as SeriesSlug];
  const deviceGroup = deviceSeries.find((g) => g.slug === deviceSlug);

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

  // Related products from other series for same device
  const relatedProducts = allProducts
    .filter((p) => p.device === currentProduct?.device && p.seriesSlug !== seriesSlug)
    .slice(0, 4);

  // Other device groups for same series
  const otherDeviceGroups = deviceSeries.filter((g) => g.slug !== deviceSlug);

  const pageTitle = `${series.name} Case for ${deviceGroup.name} | VCASE`;
  const metaDescription = series.description;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      {/* SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />

      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ MAIN PRODUCT SECTION ═══ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm py-4">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="capitalize">{series.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{series.name} — {deviceGroup.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-12 pt-2 sm:pt-4 lg:pt-6">
          {/* ── LEFT: Gallery ── */}
          <div className="lg:sticky lg:top-[80px] lg:self-start">
            <div className="relative aspect-[4/5] lg:aspect-square bg-secondary/30 rounded-2xl overflow-hidden"
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
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
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
              <div className="absolute top-4 left-4">
                <img src={series.icon} alt={series.name} className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-background/80 p-1.5" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="py-4 lg:py-0">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: premiumEase }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
                {series.category === "cases" ? "Cases" : "Protection"}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
                {series.name}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">{series.tagline}</p>
            </motion.div>

            {/* Price */}
            {currentProduct && (
              <motion.div
                className="flex items-baseline gap-3 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-2xl font-bold text-foreground">{currentProduct.price}</span>
                <span className="text-base text-muted-foreground line-through">{currentProduct.originalPrice}</span>
                <span className="text-sm font-semibold text-green-600">{currentProduct.discount}</span>
              </motion.div>
            )}

            {/* Rating */}
            {currentProduct && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({currentProduct.reviews} reviews)</span>
              </div>
            )}

            {/* ── Model Selector ── */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                Select Model
              </p>
              <div className="flex flex-wrap gap-2">
                {deviceGroup.models.map((model, i) => {
                  const hasProduct = products.some((p) => p.device === model.name);
                  return (
                    <button
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
                    >
                      {model.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Color Selector (SoftMag only) ── */}
            {isSoftmag && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                  Color — {softmagColors[selectedColor]?.name}
                </p>
                <div className="flex gap-3">
                  {softmagColors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        i === selectedColor ? "border-foreground scale-110" : "border-border hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Quantity + Add to Cart ── */}
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
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-foreground text-background py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-foreground/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            {/* Offers */}
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
          </div>
        </div>
      </section>

      {/* ═══ FEATURE HIGHLIGHTS ═══ */}
      <section className="section-padding py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground text-center mb-8">
          Why {series.name}?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[1200px] mx-auto">
          {series.features.map((feature, i) => {
            const Icon = featureIcons[i % featureIcons.length];
            return (
              <motion.div
                key={i}
                className="text-center p-5 sm:p-6 rounded-2xl bg-muted/50 border border-border/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-foreground" strokeWidth={1.5} />
                <p className="text-sm font-medium text-foreground whitespace-pre-line">{feature}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══ MATERIAL SECTION ═══ */}
      <section className="section-padding py-10 sm:py-14 bg-muted/30">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-4">
            Built to Last
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
            {series.description}
          </p>
          <div className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-5 py-2.5">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{series.material}</span>
          </div>
        </div>
      </section>

      {/* ═══ COMPATIBILITY ═══ */}
      <section className="section-padding py-10 sm:py-14">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-6">
            Compatible Models
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {deviceGroup.models.map((model) => (
              <div
                key={model.slug}
                className="flex items-center gap-2 bg-muted/50 border border-border/30 rounded-xl px-4 py-2.5"
              >
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{model.name}</span>
              </div>
            ))}
          </div>

          {/* Other device groups */}
          {otherDeviceGroups.length > 0 && (
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
          )}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-padding py-10 sm:py-14 bg-muted/30">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-0">
            {faqItems.map((faq, i) => (
              <div key={i} className="border-b border-border/40">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Related Products ═══ */}
      {relatedProducts.length > 0 && (
        <section className="section-padding py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
