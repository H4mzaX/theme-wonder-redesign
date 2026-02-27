import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrivals from "@/components/NewArrivals";
import PromoBanner from "@/components/PromoBanner";
import ExploreLineup from "@/components/ExploreLineup";
import WatchAndShop from "@/components/WatchAndShop";
import AboutRewardsCards from "@/components/AboutRewardsCards";
import FeaturedIn from "@/components/FeaturedIn";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import FloatingSidebar from "@/components/FloatingSidebar";
import LoadingBar from "@/components/LoadingBar";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import MarqueeSection from "@/components/MarqueeSection";
import ProductBanner from "@/components/ProductBanner";

import bannerProduct1 from "@/assets/banner-magsafe-orange-1.png";
import bannerProduct2 from "@/assets/banner-product-2.jpg";
import bannerWide1 from "@/assets/banner-wide-1.jpg";
import bannerWide2 from "@/assets/banner-wide-2.jpg";

const Index = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <LoadingBar />
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <FloatingSidebar />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="space-y-0 sm:space-y-2">
        <HeroSlider />
        <MarqueeSection />
        <ExploreProducts />

        {/* Banner: MagSafe Collection */}
        <ProductBanner
          image={bannerProduct1}
          title="MagSafe Ready. Always."
          subtitle="New Collection"
          cta="Shop MagSafe"
          href="/collections/magsafe-cases"
          layout="right"
          theme="light"
        />

        <NewArrivals />

        {/* Banner: Black Edition */}
        <ProductBanner
          image={bannerWide1}
          title="The Black Edition"
          subtitle="Limited Drop"
          cta="Shop Now"
          href="/collections/black-cases"
          layout="center"
          theme="dark"
        />

        <PromoBanner />
        <ExploreLineup />

        {/* Banner: Clear Case */}
        <ProductBanner
          image={bannerProduct2}
          title="Crystal Clear Protection"
          subtitle="Bestseller"
          cta="Explore Clear Cases"
          href="/collections/clear-cases"
          layout="left"
          theme="light"
        />

        <WatchAndShop />

        {/* Banner: Color Collection */}
        <ProductBanner
          image={bannerWide2}
          title="Express Your Color"
          subtitle="Silicone Collection"
          cta="Shop Colors"
          href="/collections/silicone-cases"
          layout="center"
          theme="light"
        />

        <AboutRewardsCards />
        <FeaturedIn />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
