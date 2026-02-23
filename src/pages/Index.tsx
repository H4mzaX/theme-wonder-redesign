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

const Index = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LoadingBar />
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <FloatingSidebar />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main>
        <HeroSlider />
        <ExploreProducts />
        <NewArrivals />
        <PromoBanner />
        <ExploreLineup />
        <WatchAndShop />
        <AboutRewardsCards />
        <FeaturedIn />
        <TrustBadges />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
