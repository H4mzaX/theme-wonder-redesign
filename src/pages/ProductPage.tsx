import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, ChevronDown, Package, Truck, Percent, Smartphone, Waves, ShieldCheck, Magnet, BadgeCheck, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { seriesData, deviceSeries, allProducts, type Product, type SeriesSlug, colorImages } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import BrandName from "@/components/BrandName";
import AnimateElement, { StaggerGroup, StaggerChild, ScaleReveal } from "@/components/AnimateElement";
import { premiumEase } from "@/lib/motion";

const featureIcons = [Waves, ShieldCheck, Magnet, BadgeCheck];

const faqItems = [
  { q: "Will this case make my phone bulky?", a: "No! Our cases are designed with a slim profile that adds minimal bulk while providing maximum protection." },
  { q: "Is it compatible with wireless charging?", a: "Yes, all our cases are fully compatible with Qi and Qi2 wireless charging. MagSafe cases have built-in magnets for perfect alignment." },
  { q: "What if my case turns yellow?", a: "We offer a free replacement guarantee if your clear case turns yellow within the warranty period." },
  { q: "How do I clean it?", a: "Wipe with a damp cloth and mild soap. For silicone surfaces, the material is washable. Avoid harsh chemicals." },
];

const ProductPage = () => {
  const { seriesSlug, deviceSlug, modelSlug } = useParams<{ seriesSlug: string; deviceSlug: string; modelSlug: string }>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const { addToCart } = useCart();

  const series = seriesData[seriesSlug as SeriesSlug];
  const deviceGroup = deviceSeries.find((g) => g.slug === deviceSlug);
  const model = deviceGroup?.models.find((m) => m.slug === modelSlug);

  const product = allProducts.find(
    (p) => p.seriesSlug === seriesSlug && p.device === model?.name
  );

  useSEO({
    title: product && series ? `${series.name} for ${product.device} | VCASE` : "Product | VCASE",
    description: series ? `Shop ${series.name} for ${product?.device || "your device"}. ${series.description}` : "Premium phone protection by VCASE.",
    canonical: `https://vcase.in/${seriesSlug}/${deviceSlug}/${modelSlug}`,
    type: "product",
    jsonLd: product ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${series?.name} for ${product.device}`,
      description: series?.description,
      brand: { "@type": "Brand", name: "VCASE" },
      offers: {
        "@type": "Offer",
        price: product.price.replace("₹", "").replace(",", ""),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    } : undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedColor(0);
  }, [seriesSlug, deviceSlug, modelSlug]);

  if (!series || !deviceGroup || !model || !product) {
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

  const galleryImages = [product.image, ...(product.hoverImage && product.hoverImage !== product.image ? [product.hoverImage] : [])];

  // Other models in this series for the same device group
  const siblingProducts = allProducts.filter(
    (p) => p.seriesSlug === seriesSlug && deviceGroup.models.some((m) => m.name === p.device) && p.id !== product.id
  );

  // Related products from different series
  const relatedProducts = allProducts
    .filter((p) => p.device === product.device && p.seriesSlug !== seriesSlug)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: product.colors[selectedColor] || "Default",
      device: product.device,
    });
    toast({ title: "Added to cart", description: `${product.name} — ${product.subtitle}` });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ BREADCRUMB ═══ */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6">
        <motion.nav
          className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/${seriesSlug}`} className="hover:text-foreground transition-colors">{series.name}</Link>
          <span>/</span>
          <Link to={`/${seriesSlug}/${deviceSlug}`} className="hover:text-foreground transition-colors">{deviceGroup.name}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.device}</span>
        </motion.nav>
      </div>

      {/* ═══ MAIN PRODUCT SECTION ═══ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted/20"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: premiumEase }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={galleryImages[selectedImage]}
                  alt={`${product.name} for ${product.device}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 mt-4">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? "border-foreground" : "border-border/40 hover:border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5">
            <motion.div
              className="lg:sticky lg:top-24 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: premiumEase }}
            >
              {/* Tag */}
              {product.tag && (
                <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold bg-accent/10 text-accent px-3 py-1 rounded-full">
                  {product.tag}
                </span>
              )}

              {/* Title */}
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
                  {product.device}
                </p>
                <BrandName
                  name={series.name}
                  as="h1"
                  className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight leading-[1.1]"
                />
                <p className="text-muted-foreground text-sm mt-1">{series.tagline}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">{product.price}</span>
                <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {product.discount}
                </span>
              </div>

              {/* Colors */}
              {product.colors.length > 1 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Color: <span className="text-muted-foreground font-normal">{product.colors[selectedColor]}</span>
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color, i) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(i)}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                          i === selectedColor ? "border-foreground scale-110" : "border-border/40 hover:border-border"
                        }`}
                        style={{ backgroundColor: colorImages[color] ? undefined : "#888" }}
                      >
                        {colorImages[color] ? (
                          <img src={colorImages[color]} alt={color} className="w-full h-full rounded-full object-cover" />
                        ) : null}
                        {i === selectedColor && (
                          <Check className="w-4 h-4 text-foreground absolute" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Model selector — other models in same group */}
              {siblingProducts.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Also available for</p>
                  <div className="flex flex-wrap gap-2">
                    {siblingProducts.map((sp) => {
                      const spModel = deviceGroup.models.find((m) => m.name === sp.device);
                      return (
                        <Link
                          key={sp.id}
                          to={`/${seriesSlug}/${deviceSlug}/${spModel?.slug}`}
                          className="text-xs font-medium border border-border/50 hover:border-foreground rounded-full px-3 py-1.5 transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {sp.device}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-2 bg-muted/30 rounded-xl p-4">
                {series.features.map((feature, i) => {
                  const Icon = featureIcons[i % featureIcons.length];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  );
                })}
              </div>

              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold text-sm uppercase tracking-wider py-4 rounded-full hover:bg-foreground/90 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart — {product.price}
              </motion.button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: "Free Shipping" },
                  { icon: Package, text: "7-Day Returns" },
                  { icon: Percent, text: "10% off on 2+" },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5 py-2.5">
                    <badge.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground leading-tight">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MATERIAL ═══ */}
      <ScaleReveal>
        <section className="section-padding py-12 sm:py-20 bg-muted/30">
          <div className="max-w-[800px] mx-auto text-center">
            <AnimateElement type="fade-up">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground mb-4 tracking-tight">
                Built to Last
              </h2>
            </AnimateElement>
            <AnimateElement type="fade-up" delay={0.1}>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">{series.description}</p>
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

      {/* ═══ FAQ ═══ */}
      <section className="section-padding py-12 sm:py-20">
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
        <section className="section-padding py-12 sm:py-20 bg-muted/30">
          <AnimateElement type="fade-up">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-8 tracking-tight">
              You May Also Like
            </h2>
          </AnimateElement>
          <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.1}>
            {relatedProducts.map((rp) => (
              <StaggerChild key={rp.id}>
                <ProductCard product={rp} />
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

      {/* Sticky bottom bar — mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/30 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <BrandName name={series.name} className="text-sm font-semibold text-foreground" />
          <p className="text-xs text-muted-foreground">{product.device}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground">{product.price}</span>
          <motion.button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-foreground text-background font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-full"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
