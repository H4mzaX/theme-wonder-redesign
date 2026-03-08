import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const messages = [
  "COD AVAILABLE ✅",
  "GET EXTRA DISCOUNT ON PREPAID ORDERS!",
  "FREE SHIPPING ON ORDERS ABOVE ₹499 🚚",
  "NEW ARRIVALS — SHOP THE LATEST CASES 🆕",
];

const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(Math.random() > 0.5 ? 1 : -1);
    setCurrent((prev) => (prev + 1) % messages.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(Math.random() > 0.5 ? 1 : -1);
    setCurrent((prev) => (prev - 1 + messages.length) % messages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="bg-announcement text-announcement-foreground">
      {/* Desktop: social icons left, message center, language right */}
      <div className="hidden lg:flex items-center justify-between px-8 xl:px-10 py-3">
        {/* Social icons */}
        <div className="flex items-center gap-3.5">
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Youtube className="w-4 h-4" />
          </a>
        </div>

        {/* Center message with arrows */}
        <div className="flex items-center gap-5">
          <button onClick={prev} className="hover:opacity-70 transition-opacity" aria-label="Previous announcement">
            <ChevronLeft className="w-4 h-4" />
          </button>
        <div className="relative h-6 flex items-center justify-center overflow-hidden min-w-[440px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={current}
                custom={direction}
                initial={{ opacity: 0, y: direction * 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[13px] font-medium tracking-wide whitespace-nowrap absolute"
              >
                {messages[current]}
              </motion.span>
            </AnimatePresence>
          </div>
          <button onClick={next} className="hover:opacity-70 transition-opacity" aria-label="Next announcement">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right side: language / currency */}
        <div className="flex items-center gap-5 text-[13px] font-medium">
          <span className="opacity-70">English</span>
          <span className="opacity-70">India (INR ₹)</span>
        </div>
      </div>

      {/* Mobile: compact with arrows and message */}
      <div className="lg:hidden flex items-center justify-center px-10 py-3.5 relative">
        <button
          onClick={prev}
          className="absolute left-3 hover:opacity-70 transition-opacity"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="relative h-5 flex items-center justify-center overflow-hidden w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={current}
              custom={direction}
              initial={{ opacity: 0, y: direction * 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-[11px] sm:text-[12px] font-medium tracking-wide whitespace-nowrap absolute"
            >
              {messages[current]}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          className="absolute right-3 hover:opacity-70 transition-opacity"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
