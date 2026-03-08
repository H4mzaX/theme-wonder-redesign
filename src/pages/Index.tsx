import { useState, lazy, Suspense } from "react";
import { useSEO } from "@/hooks/useSEO";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ExploreProducts from "@/components/ExploreProducts";
import LoadingBar from "@/components/LoadingBar";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import MarqueeSection from "@/components/MarqueeSection";
import FloatingSidebar from "@/components/FloatingSidebar";

// Lazy-load below-fold sections for faster initial paint
const NewArrivals = lazy(() => import("@/components/NewArrivals"));
const ProductBanner = lazy(() => import("@/components/ProductBanner"));
const PromoBanner = lazy(() => import("@/components/PromoBanner"));
const ExploreLineup = lazy(() => import("@/components/ExploreLineup"));
const WatchAndShop = lazy(() => import("@/components/WatchAndShop"));
const AboutRewardsCards = lazy(() => import("@/components/AboutRewardsCards"));
const FeaturedIn = lazy(() => import("@/components/FeaturedIn"));
const TrustBadges = lazy(() => import("@/components/TrustBadges"));
const Footer = lazy(() => import("@/components/Footer"));

import bannerProduct1 from "@/assets/banner-magsafe-orange-1.png";
import bannerProduct2 from "@/assets/banner-product-2.jpg";
import bannerWide1 from "@/assets/banner-wide-1.jpg";
import bannerWide2 from "@/assets/banner-silicone-fan.jpg";

const LazySection = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-[200px]" />}>
    {children}
  </Suspense>
);

const Index = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useSEO({
    title: "VCASE — Premium Phone Cases & Protection for iPhone",
    description: "Shop premium MagSafe, silicone & clear cases for iPhone 16 & 17. Military-grade drop protection, screen guards & camera lens protectors. Free shipping on prepaid orders.",
    canonical: "https://vcase.in/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "VCASE",
      url: "https://vcase.in",
      logo: "https://vcase.in/favicon.png",
      contactPoint: { "@type": "ContactPoint", email: "veecartretail@gmail.com", contactType: "customer service" },
    },
  });

  return (
    <div className="min-h-screen bg-announcement overflow-x-clip">
      <LoadingBar />
      <AnnouncementBar />
      <div className="bg-background rounded-t-[1.5rem] sm:rounded-t-[2rem] lg:rounded-t-[2.25rem] overflow-hidden">
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <FloatingSidebar />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="space-y-0">
        <HeroSlider />
        <MarqueeSection />
        <ExploreProducts />

        <LazySection>
          <ProductBanner
            image={bannerProduct1}
            title="MagSafe Ready. Always."
            subtitle="New Collection"
            cta="Shop MagSafe"
            href="/collections/magsafe-cases"
            layout="right"
            theme="light"
          />
        </LazySection>

        <LazySection><NewArrivals /></LazySection>

        <LazySection>
          <ProductBanner
            image={bannerWide1}
            title="The Black Edition"
            subtitle="Limited Drop"
            cta="Shop Now"
            href="/collections/black-cases"
            layout="center"
            theme="dark"
          />
        </LazySection>

        <LazySection><PromoBanner /></LazySection>
        <LazySection><ExploreLineup /></LazySection>

        <LazySection>
          <ProductBanner
            image={bannerProduct2}
            title="Crystal Clear Protection"
            subtitle="Bestseller"
            cta="Explore Clear Cases"
            href="/collections/clear-cases"
            layout="left"
            theme="light"
          />
        </LazySection>

        <LazySection><WatchAndShop /></LazySection>

        <LazySection>
          <ProductBanner
            image={bannerWide2}
            title="Express Your Color"
            subtitle="Silicone Collection"
            cta="Shop Colors"
            href="/collections/silicone-cases"
            layout="center"
            theme="light"
          />
        </LazySection>

        <LazySection><AboutRewardsCards /></LazySection>
        <LazySection><FeaturedIn /></LazySection>
        <LazySection><TrustBadges /></LazySection>
      </main>
      {/* Footer with floating rounded overlap */}
      <div className="bg-foreground relative pt-12 sm:pt-14">
        <div className="absolute top-0 left-0 right-0 h-10 bg-background rounded-b-[2.5rem] sm:rounded-b-[3rem] z-10" />
        <LazySection><Footer /></LazySection>
      </div>
      </div>
    </div>
  );
};

export default Index;
