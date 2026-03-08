import { useState, useEffect, useCallback, useRef } from "react";
import { motion, animate, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3-poster.jpg";

const preloadImages = [hero1, hero2, hero3];
preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});

interface Slide {
  image: string;
  cta: string;
  href: string;
}

const slides: Slide[] = [
  {
    image: hero1,
    cta: "SHOP NOW",
    href: "/clearmag",
  },
  {
    image: hero2,
    cta: "Shop Colors",
    href: "/armor-edge",
  },
  {
    image: hero3,
    cta: "Shop Now",
    href: "/armor-edge",
  },
];

const AUTOPLAY_DURATION = 5000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const progress = useMotionValue(0);
  const progressAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
  }, []);

  const startProgress = useCallback(() => {
    progressAnimationRef.current?.stop();
    progress.set(0);
    progressAnimationRef.current = animate(progress, 1, {
      duration: AUTOPLAY_DURATION / 1000,
      ease: "linear",
    });
  }, [progress]);

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

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;
    next();
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 lg:pt-2">
      <div className="max-w-[1400px] mx-auto lg:max-w-none">
        <div
          className="relative overflow-hidden rounded-[1rem] sm:rounded-[1.1rem] lg:rounded-[1.25rem] cursor-pointer"
          onClick={handleClick}
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
            {/* Crossfade images */}
            <AnimatePresence initial={false}>
              <motion.img
                key={current}
                src={slide.image}
                alt="VCASE premium phone case"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover object-center"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 5, ease: [0.16, 1, 0.3, 1] },
                }}
              />
            </AnimatePresence>

            {/* Subtle bottom gradient for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent pointer-events-none" />

            {/* Shop CTA — bottom right */}
            <div className="absolute inset-0 flex items-end justify-center sm:justify-end px-5 sm:px-10 lg:px-16 pb-20 sm:pb-12 z-10 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.a
                  key={current}
                  href={slide.href}
                  className="pointer-events-auto inline-block bg-background text-foreground px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-[15px] font-medium tracking-wide rounded-full hover:bg-foreground hover:text-background transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  {slide.cta}
                </motion.a>
              </AnimatePresence>
            </div>

            {/* Left / Right arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); goTo((current - 1 + slides.length) % slides.length); }}
              className="absolute left-4 sm:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-background/80 hover:text-background transition-colors"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-background/80 hover:text-background transition-colors"
              aria-label="Next slide"
            >
              <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
            </button>

            {/* Dots — centered */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 sm:pb-6 flex items-center justify-center gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: i === current ? 28 : 8 }}
                >
                  <span className="absolute inset-0 bg-background/40 rounded-full" />
                  {i === current && (
                    <motion.span
                      className="absolute inset-0 bg-background rounded-full origin-left"
                      style={{ scaleX: progress }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
