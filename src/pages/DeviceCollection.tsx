import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Smartphone, ArrowRight, Shield, Camera } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { deviceSeries, seriesData, getDeviceProducts, type SeriesSlug } from "@/data/products";
import { premiumEase } from "@/lib/motion";
import { useSEO } from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import CollectionProductCard from "@/components/CollectionProductCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import AnimateElement, { StaggerGroup, StaggerChild } from "@/components/AnimateElement";
import BrandName from "@/components/BrandName";

import collectionHero from "@/assets/collection-hero-cases.jpg";
import { useRef } from "react";

const sectionConfig = [
  {
    title: "Cases",
    icon: Smartphone,
    seriesSlugs: ["clearmag", "clearmag-edge", "softmag"] as SeriesSlug[],
  },
  {
    title: "Screen Protection",
    icon: Shield,
    seriesSlugs: ["edgeguard"] as SeriesSlug[],
  },
  {
    title: "Camera Protection",
    icon: Camera,
    seriesSlugs: ["lensguard"] as SeriesSlug[],
  },
];

const DeviceCollection = () => {
  const { deviceSlug } = useParams<{ deviceSlug: string }>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const deviceGroup = deviceSeries.find((g) => g.slug === deviceSlug);

  useSEO({
    title: deviceGroup ? `${deviceGroup.name} Cases & Protection | VCASE` : "Device Collection | VCASE",
    description: deviceGroup ? `Shop premium cases, screen protectors & camera lens guards for ${deviceGroup.name}. MagSafe, silicone & clear cases with military-grade drop protection.` : "Browse VCASE device collections.",
    canonical: `https://vcase.in/devices/${deviceSlug}`,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [deviceSlug]);

  if (!deviceGroup) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Device Not Found</h1>
            <Link to="/" className="text-sm text-muted-foreground underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allDeviceProducts = getDeviceProducts(deviceSlug!);
  const pageTitle = `${deviceGroup.name} Cases & Protection | VCASE`;

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      <title>{pageTitle}</title>
      <meta name="description" content={`Browse all VCASE products for ${deviceGroup.name} — cases, screen protectors, and camera lens guards.`} />

      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} transparent />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ═══ Hero with parallax ═══ */}
      <motion.section
        ref={heroRef}
        className="relative -mt-[60px] h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="absolute inset-0" style={{ opacity: heroOpacity }}>
          <motion.img
            src={collectionHero}
            alt={deviceGroup.name}
            className="w-full h-full object-cover"
            style={{ scale: heroScale }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: premiumEase }}
            className="mb-4"
          >
            <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-background/80" strokeWidth={1.5} />
          </motion.div>
          <motion.p
            className="text-accent text-xs sm:text-sm tracking-[0.25em] font-medium mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            DEVICE COLLECTION
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-background leading-[1.1] tracking-tight"
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ delay: 0.35, duration: 0.7, ease: premiumEase }}
          >
            {deviceGroup.name}
          </motion.h1>
          <motion.p
            className="text-background/70 text-sm sm:text-base mt-4 max-w-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Browse all cases and protection for your {deviceGroup.name} device.
          </motion.p>
        </div>
      </motion.section>

      {/* ═══ Content — floating panel ═══ */}
      <motion.div
        className="relative -mt-8 bg-background rounded-t-[2.5rem] sm:rounded-t-[3rem] z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: premiumEase }}
      >
        {/* Breadcrumb */}
        <div className="section-padding pt-6 sm:pt-8 pb-2">
          <nav className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Devices</span>
            <span>/</span>
            <span className="text-foreground font-medium">{deviceGroup.name}</span>
          </nav>
        </div>

        {/* Product count */}
        <AnimateElement type="fade" delay={0.4} className="section-padding pb-4">
          <p className="text-sm text-muted-foreground">{allDeviceProducts.length} products</p>
        </AnimateElement>

        {/* Sections with staggered animations */}
        {sectionConfig.map((section, sectionIdx) => {
          const sectionProducts = allDeviceProducts.filter((p) =>
            section.seriesSlugs.includes(p.seriesSlug as SeriesSlug)
          );
          if (sectionProducts.length === 0) return null;

          return (
            <section key={section.title} className="section-padding py-6 sm:py-8">
              <AnimateElement type="fade-left" delay={0.1}>
                <div className="flex items-center gap-3 mb-6">
                  <section.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
              </AnimateElement>

              {section.seriesSlugs.map((slug) => {
                const seriesProducts = sectionProducts.filter((p) => p.seriesSlug === slug);
                if (seriesProducts.length === 0) return null;
                const info = seriesData[slug];

                return (
                  <div key={slug} className="mb-8">
                    <AnimateElement type="fade-up" delay={0.1}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={info.icon} alt={info.name} className="w-7 h-7 lg:w-9 lg:h-9 rounded-lg" />
                          <div>
                            <BrandName name={info.name} as="h3" className="text-base sm:text-lg text-foreground" />
                            <p className="text-xs text-muted-foreground">{info.tagline}</p>
                          </div>
                        </div>
                        <Link
                          to={`/${slug}/${deviceSlug}?model=${deviceGroup?.models[0]?.slug || ''}`}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-accent hover:underline"
                        >
                          View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </AnimateElement>
                    <StaggerGroup className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" staggerDelay={0.08}>
                      {seriesProducts.slice(0, 4).map((product) => (
                        <StaggerChild key={product.id}>
                          <CollectionProductCard product={product} />
                        </StaggerChild>
                      ))}
                    </StaggerGroup>
                  </div>
                );
              })}
            </section>
          );
        })}

        {/* Explore other devices */}
        <section className="section-padding py-8 sm:py-12 pb-20">
          <AnimateElement type="fade-up">
            <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-4">
              Explore Other Devices
            </h2>
          </AnimateElement>
          <StaggerGroup className="flex flex-wrap gap-3" staggerDelay={0.08}>
            {deviceSeries
              .filter((g) => g.slug !== deviceSlug)
              .map((group) => (
                <StaggerChild key={group.slug}>
                  <Link
                    to={`/devices/${group.slug}`}
                    className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    {group.name}
                  </Link>
                </StaggerChild>
              ))}
          </StaggerGroup>
        </section>
      </motion.div>

      {/* Footer */}
      <div className="bg-foreground relative -mt-8 pt-12 sm:pt-14">
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

export default DeviceCollection;
