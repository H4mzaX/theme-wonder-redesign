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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
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
