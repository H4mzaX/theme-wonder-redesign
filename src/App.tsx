import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";


import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import ShopifyProductDetail from "./pages/ShopifyProductDetail";
import Collection from "./pages/Collection";
import SeriesProduct from "./pages/SeriesProduct";
import DeviceCollection from "./pages/DeviceCollection";
import SeriesLanding from "./pages/SeriesLanding";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";
import { useCartSync } from "@/hooks/useCartSync";

const queryClient = new QueryClient();

const conceptEase: [number, number, number, number] = [0.25, 1, 0.5, 1];

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: conceptEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: conceptEase },
  },
};

const AnimatedRoutes = () => {
  useCartSync();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "clip-path, opacity" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop/:handle" element={<ShopifyProductDetail />} />
          <Route path="/collections/:slug" element={<Collection />} />
          
          {/* Series landing & product pages */}
          <Route path="/:seriesSlug" element={<SeriesLanding />} />
          <Route path="/:seriesSlug/:deviceSlug" element={<SeriesProduct />} />
          
          {/* Device collection pages */}
          <Route path="/devices/:deviceSlug" element={<DeviceCollection />} />
          
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
