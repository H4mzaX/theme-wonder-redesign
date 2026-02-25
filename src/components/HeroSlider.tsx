import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3-poster.jpg";

interface Slide {
  image: string;
  badge?: string;
  title: string;
  subtitle: string;
  cta: string;
}

const slides: Slide[] = [
  {
    image: hero1,
    badge: "New Arrival",
    title: "BOLD PRO CASE",
    subtitle: "Meet the New Standard of Protection.",
    cta: "SHOP NOW",
  },
  {
    image: hero2,
    badge: "Best Seller",
    title: "CRYSTAL CLEAR\nPROTECTION",
    subtitle: "MagSafe-ready cases that feel invisible.",
    cta: "Shop All",
  },
  {
    image: hero3,
    badge: "Premium",
    title: "LEATHER\nEDITION",
    subtitle: "Luxury craftsmanship for your device.",
    cta: "Shop Now",
  },
];

const AUTOPLAY_DURATION = 7000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / AUTOPLAY_DURATION, 1);
      setProgress(pct);
      if (pct >= 1 && progressRef.current) clearInterval(progressRef.current);
    }, 30);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  useEffect(() => {
    startProgress();
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    autoplayRef.current = setTimeout(next, AUTOPLAY_DURATION);
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, next, startProgress]);

  const slide = slides[current];

  return (
    <section className="relative">
      <div className="relative h-[75vh] min-h-[480px] max-h-[600px] sm:h-[500px] sm:max-h-none lg:h-[750px]">
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
            <motion.img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent sm:bg-gradient-to-r sm:from-foreground/60 sm:via-foreground/20 sm:to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end sm:items-center px-4 sm:px-12 lg:px-20 pb-20 sm:pb-12 pointer-events-none z-10">
          <div className="pointer-events-auto w-full sm:max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div key={current}>
                {slide.badge && (
                  <motion.span
                    className="inline-block bg-background text-foreground text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-sm mb-3 sm:mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {slide.badge}
                  </motion.span>
                )}
                {slide.title.split("\n").map((line, li) => (
                  <motion.div
                    key={li}
                    initial={{ opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.7, delay: 0.3 + li * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <span className="block text-2xl sm:text-5xl lg:text-7xl font-display font-bold text-background sm:text-foreground leading-[1.1] tracking-tight">
                      {line}
                    </span>
                  </motion.div>
                ))}
                <motion.p
                  className="text-background/80 sm:text-foreground/70 text-sm sm:text-lg mt-3 mb-4 sm:mt-4 sm:mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.a
                  href="#"
                  className="inline-block bg-background text-foreground sm:bg-foreground sm:text-background px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-medium tracking-wider border border-background sm:border-foreground hover:bg-transparent hover:text-background sm:hover:text-foreground transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {slide.cta}
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 sm:left-auto sm:right-0 z-20 pb-4 sm:pb-6 px-4 sm:px-12 lg:px-20 flex items-center justify-center sm:justify-end gap-4">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300" style={{ width: i === current ? 28 : 8 }}>
              <span className="absolute inset-0 bg-background/40 sm:bg-foreground/30 rounded-full" />
              {i === current && <motion.span className="absolute inset-0 bg-background sm:bg-foreground rounded-full origin-left" style={{ scaleX: progress }} />}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <motion.button onClick={prev} className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors" whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
          <motion.button onClick={next} className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors" whileTap={{ scale: 0.9 }}>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
