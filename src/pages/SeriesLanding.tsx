import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { seriesData, deviceSeries, type SeriesSlug } from "@/data/products";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import BrandName from "@/components/BrandName";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const SeriesLanding = () => {
  const { seriesSlug } = useParams<{ seriesSlug: string }>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const series = seriesSlug ? seriesData[seriesSlug as SeriesSlug] : null;
  if (!series) return <Navigate to="/404" replace />;

  return (
    <div className="min-h-screen bg-announcement">
      <AnnouncementBar />
      <div className="bg-background rounded-t-[1.5rem] sm:rounded-t-[2rem] lg:rounded-t-[2.25rem] overflow-hidden">
        <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
        <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 sm:mb-16"
          >
            <img
              src={series.icon}
              alt={series.name}
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto mb-6"
            />
            <BrandName
              name={series.name}
              as="h1"
              className="text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground mb-3"
            />
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              {series.tagline}
            </p>
          </motion.div>

          {/* Choose your model */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-8"
          >
            Choose Your Model
          </motion.h2>

          <div className="space-y-10">
            {deviceSeries.map((deviceGroup, gi) => (
              <motion.div
                key={deviceGroup.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + gi * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">
                  {deviceGroup.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {deviceGroup.models.map((model) => (
                    <Link
                      key={model.slug}
                      to={`/${seriesSlug}/${model.slug}`}
                      className="group relative bg-white rounded-2xl p-5 sm:p-6 text-center border border-border/40 hover:border-foreground/20 hover:shadow-lg transition-all duration-300"
                    >
                      <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                        {model.name}
                      </p>
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto mt-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <div className="bg-foreground relative pt-12 sm:pt-14">
          <div className="absolute top-0 left-0 right-0 h-10 bg-background rounded-b-[2.5rem] sm:rounded-b-[3rem] z-10" />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SeriesLanding;
