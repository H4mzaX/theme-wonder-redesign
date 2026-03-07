import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from "framer-motion";
import { premiumEase, smoothSpring } from "@/lib/motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3-poster.jpg";

// Preload all hero images immediately so they're cached before render
const preloadImages = [hero1, hero2, hero3];
preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});

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
    title: "MAGSAFE\nTRANSPARENT",
    subtitle: "Crystal clarity meets magnetic precision.",
    cta: "SHOP NOW",
  },
  {
    image: hero2,
    badge: "Best Seller",
    title: "BOLD PRO\nCASE",
    subtitle: "Statement protection for the fearless.",
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
  const shouldReduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const progressAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startProgress = useCallback(() => {
    progressAnimationRef.current?.stop();
    progress.set(0);

    if (shouldReduceMotion) {
      progress.set(1);
      return;
    }

    progressAnimationRef.current = animate(progress, 1, {
      duration: AUTOPLAY_DURATION / 1000,
      ease: "linear",
    });
  }, [progress, shouldReduceMotion]);

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
      progressAnimationRef.current?.stop();
    };
  }, [current, next, startProgress]);

  const slide = slides[current];

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 lg:pt-2">
      <div className="max-w-[1400px] mx-auto lg:max-w-none">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-2xl">
          {/* Aspect ratio: portrait on mobile, 16:9 on desktop */}
          <div className="relative aspect-[3/4] sm:aspect-[16/9]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                className="absolute inset-0"
                custom={direction}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: premiumEase }}
              >
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="w-full h-full object-cover will-change-transform"
                  initial={{ scale: shouldReduceMotion ? 1 : 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 8, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent sm:bg-gradient-to-r sm:from-foreground/60 sm:via-foreground/20 sm:to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end sm:items-center px-5 sm:px-10 lg:px-16 pb-20 sm:pb-10 pointer-events-none z-10">
              <div className="pointer-events-auto w-full sm:max-w-xl">
                <AnimatePresence mode="wait">
                  <motion.div key={current}>
                    {slide.badge && (
                      <motion.span
                        className="inline-block bg-background text-foreground text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.16, ease: premiumEase }}
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
                        transition={{ duration: shouldReduceMotion ? 0 : 0.64, delay: shouldReduceMotion ? 0 : 0.2 + li * 0.1, ease: premiumEase }}
                      >
                        <span className="block text-3xl sm:text-5xl lg:text-7xl font-display font-bold text-background sm:text-foreground leading-[1.05] tracking-tight">
                          {line}
                        </span>
                      </motion.div>
                    ))}
                    <motion.p
                      className="text-background/80 sm:text-foreground/70 text-sm sm:text-lg mt-3 mb-4 sm:mt-4 sm:mb-6"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.52, duration: shouldReduceMotion ? 0 : 0.45, ease: premiumEase }}
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.a
                      href="#"
                      className="inline-block bg-background text-foreground sm:bg-foreground sm:text-background px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium tracking-wider rounded-full border border-background sm:border-foreground hover:bg-transparent hover:text-background sm:hover:text-foreground transition-colors duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.62, duration: shouldReduceMotion ? 0 : 0.45, ease: premiumEase }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {slide.cta}
                    </motion.a>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Dots + arrows — inside the rounded container */}
            <div className="absolute bottom-0 left-0 right-0 sm:left-auto sm:right-0 z-20 pb-4 sm:pb-6 px-5 sm:px-10 lg:px-16 flex items-center justify-start sm:justify-end gap-4">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === current ? 28 : 8 }}
                  >
                    <span className="absolute inset-0 bg-background/40 sm:bg-foreground/30 rounded-full" />
                    {i === current && (
                      <motion.span
                        className="absolute inset-0 bg-background sm:bg-foreground rounded-full origin-left"
                        style={{ scaleX: progress }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
                  whileTap={{ scale: 0.9 }}
                  transition={smoothSpring}
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
                <motion.button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
                  whileTap={{ scale: 0.9 }}
                  transition={smoothSpring}
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
