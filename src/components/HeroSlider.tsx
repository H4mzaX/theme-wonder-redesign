import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [
  {
    image: hero1,
    title: "EXPERIENCE\nUNPARALLELED\nAUDIO ELEGANCE",
    cta: "Shop Headphones",
  },
  {
    image: hero2,
    title: "DISCOVER\nTHE SOUND\nOF TOMORROW",
    cta: "Shop Speakers",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative mx-4 sm:mx-8 lg:mx-12 xl:mx-16 rounded-lg overflow-hidden">
      <div className="relative h-[500px] sm:h-[600px] lg:h-[700px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            className="absolute inset-0"
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Ken Burns zoom effect */}
            <motion.img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-foreground/20" />
            <div className="absolute inset-0 flex items-end justify-between p-8 sm:p-12 lg:p-16 pb-16">
              {/* Staggered title words */}
              <div>
                {slides[current].title.split("\n").map((line, li) => (
                  <motion.div
                    key={li}
                    initial={{ opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + li * 0.15,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <span className="block text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-background leading-tight tracking-tight">
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.a
                href="#"
                className="hidden sm:inline-flex self-end bg-background text-foreground px-8 py-3.5 rounded-full font-medium text-sm hover:bg-background/90 transition-colors tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {slides[current].cta}
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-background hover:opacity-70 transition-opacity"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-8 h-8" />
      </motion.button>
      <motion.button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-background hover:opacity-70 transition-opacity"
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-8 h-8" />
      </motion.button>

      {/* Dots with progress bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="relative h-2.5 rounded-full overflow-hidden transition-all"
            style={{ width: i === current ? 24 : 10 }}
          >
            <span className="absolute inset-0 bg-background/40 rounded-full" />
            {i === current && (
              <motion.span
                className="absolute inset-0 bg-background rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
