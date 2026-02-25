import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const messages = [
  "BUY ON EMI 🔥 | COD AVAILABLE ✅",
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
    <div className="bg-announcement text-announcement-foreground py-2.5 relative">
      <div className="flex items-center justify-center px-12">
        <button
          onClick={prev}
          className="absolute left-4 sm:left-6 hover:opacity-70 transition-opacity"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="relative h-5 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.span
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap"
            >
              {messages[current]}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          className="absolute right-4 sm:right-6 hover:opacity-70 transition-opacity"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
