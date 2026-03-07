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
    setDirection(1);
    setCurrent((prev) => (prev + 1) % messages.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
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
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
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
      <div className="lg:hidden flex items-center justify-center px-12 py-3.5 relative">
        <button
          onClick={prev}
          className="absolute left-4 hover:opacity-70 transition-opacity"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="relative h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-[13px] font-medium tracking-wide whitespace-nowrap"
            >
              {messages[current]}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          className="absolute right-4 hover:opacity-70 transition-opacity"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
