import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import FeaturedProduct from "@/components/FeaturedProduct";
import MarqueeSection from "@/components/MarqueeSection";
import CountdownSection from "@/components/CountdownSection";
import LookbookSection from "@/components/LookbookSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BestSellers from "@/components/BestSellers";
import BrandMarquee from "@/components/BrandMarquee";
import BlogSection from "@/components/BlogSection";
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
        <AboutSection />
        <CollectionsGrid />
        <FeaturedProduct />
        <MarqueeSection />
        <CountdownSection />
        <LookbookSection />
        <TestimonialsSection />
        <BestSellers />
        <BrandMarquee />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
