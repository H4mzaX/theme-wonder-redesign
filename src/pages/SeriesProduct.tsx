import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Package, Truck, Percent, Smartphone, Waves, ShieldCheck, Magnet, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { seriesData, deviceSeries, getSeriesProducts, allProducts, type Product, type SeriesSlug } from "@/data/products";
import { useSEO } from "@/hooks/useSEO";
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const series = seriesData[seriesSlug as SeriesSlug];
  const deviceGroup = deviceSeries.find((g) => g.slug === deviceSlug);

  const seriesName = series?.name || seriesSlug || "";

  useSEO({
    title: series && deviceGroup ? `${seriesName} for ${deviceGroup.name} | VCASE` : "Collection | VCASE",
    description: series
      ? `Shop ${seriesName} ${series.type === "case" ? "cases" : "protectors"} for ${deviceGroup?.name}. ${series.description}`
      : "Premium phone protection by VCASE.",
    canonical: `https://vcase.in/${seriesSlug}/${deviceSlug}`,
    type: "product",
    jsonLd: series && deviceGroup ? {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${seriesName} for ${deviceGroup.name}`,
      description: series.description,
      brand: { "@type": "Brand", name: "VCASE" },
    } : undefined,
  });

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
            <h1 className="text-2xl font-bold text-foreground mb-2">Collection Not Found</h1>
            <Link to="/" className="text-sm text-muted-foreground underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const products = getSeriesProducts(seriesSlug!, deviceSlug!);
  const otherDeviceGroups = deviceSeries.filter((g) => g.slug !== deviceSlug);

  // Related products from different series for same devices
  const relatedProducts = allProducts
    .filter((p) => deviceGroup.models.some((m) => m.name === p.device) && p.seriesSlug !== seriesSlug)
    .reduce((acc, p) => {
      if (!acc.find((a) => a.seriesSlug === p.seriesSlug)) acc.push(p);
      return acc;
    }, [] as Product[])
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <title>{`${series.name} for ${deviceGroup.name} | VCASE`}</title>
      <meta name="description" content={series.description} />

      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ HERO HEADER ═══ */}
      <section className="relative bg-muted/30 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/${seriesSlug}`} className="hover:text-foreground transition-colors capitalize">{series.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{deviceGroup.name}</span>
          </motion.nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <motion.img
              src={series.icon}
              alt={series.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
            />
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: premiumEase }}
              >
                <BrandName
                  name={series.name}
                  as="h1"
                  className="text-3xl sm:text-4xl lg:text-5xl font-display text-foreground tracking-tight leading-[1.1]"
                />
                <p className="text-lg sm:text-xl text-muted-foreground mt-1">
                  for {deviceGroup.name}
                </p>
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {series.description}
              </motion.p>
            </div>
          </div>

          {/* Features pills */}
          <motion.div
            className="flex flex-wrap gap-2 mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            {series.features.map((feature, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <div key={i} className="flex items-center gap-1.5 bg-background border border-border/40 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{feature}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRODUCT GRID — All models ═══ */}
      <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
        <AnimateElement type="fade-up">
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground tracking-tight">
              Choose Your Model
            </h2>
            <span className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>
        </AnimateElement>

        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6" staggerDelay={0.08}>
          {products.map((product) => (
            <StaggerChild key={product.id}>
              <ProductCard product={product} />
            </StaggerChild>
          ))}
        </StaggerGroup>
      </section>

      {/* ═══ ALSO AVAILABLE FOR ═══ */}
      {otherDeviceGroups.length > 0 && (
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-10 sm:pb-14">
          <AnimateElement type="fade-up">
            <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4 tracking-tight">
              {series.name} for Other Devices
            </h2>
          </AnimateElement>
          <div className="flex flex-wrap gap-3">
            {otherDeviceGroups.map((group) => (
              <Link
                key={group.slug}
                to={`/${seriesSlug}/${group.slug}`}
                className="flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border/30 hover:border-border rounded-xl px-5 py-3 transition-all"
              >
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{group.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ OFFERS STRIP ═══ */}
      <ScaleReveal>
        <section className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Percent, text: "Flat 5% off on single product", bg: "bg-green-50" },
              { icon: Percent, text: "Flat 10% off on 2+ products", bg: "bg-green-50" },
              { icon: Truck, text: "Free shipping on prepaid orders", bg: "bg-blue-50" },
              { icon: Package, text: "Easy 7-day return policy", bg: "bg-amber-50" },
            ].map((offer, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-muted/30 border border-border/20"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <div className={`w-10 h-10 rounded-xl ${offer.bg} flex items-center justify-center`}>
                  <offer.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground leading-snug">{offer.text}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </ScaleReveal>

      {/* ═══ VIDEO TEXT OVERLAY SECTION ═══ */}
      <div className="mt-4 sm:mt-8">
        <VideoTextOverlay
          videoSrc={heroVideo}
          title={`Experience\n${series.name}`}
          subtitle="WATCH THE FILM"
          description={`Discover the craftsmanship behind ${series.name} — engineered for protection, designed for elegance.`}
        />
      </div>

      {/* ═══ MATERIAL SECTION ═══ */}
      <ScaleReveal>
        <section className="section-padding py-12 sm:py-20 lg:py-24 bg-muted/30">
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

      {/* ═══ FAQ ═══ */}
      <section className="section-padding py-12 sm:py-20 lg:py-24">
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
        <section className="section-padding py-12 sm:py-20 lg:py-24 bg-muted/30">
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
