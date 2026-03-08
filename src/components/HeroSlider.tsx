import { useState, useEffect, useCallback, useRef } from "react";
import { motion, animate, useMotionValue, AnimatePresence } from "framer-motion";
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
    <section className="px-3 sm:px-5 lg:px-6 pt-2 sm:pt-3 lg:pt-2">
      <div className="max-w-[1400px] mx-auto lg:max-w-none">
        <div
          className="relative overflow-hidden rounded-[0.85rem] sm:rounded-[1rem] lg:rounded-[1.15rem] cursor-pointer"
          onClick={handleClick}
        >
          <div className="relative aspect-[5/8] sm:aspect-[21/9]">
            {/* Crossfade images */}
            <AnimatePresence initial={false}>
              <motion.img
                key={current}
                src={slide.image}
                alt="VCASE premium phone case"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 5, ease: [0.16, 1, 0.3, 1] },
                }}
              />
            </AnimatePresence>

            {/* Subtle bottom gradient for button visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent sm:from-foreground/15 pointer-events-none" />

            {/* Shop Now CTA */}
            <div className="absolute inset-0 flex items-end justify-start px-5 sm:px-10 lg:px-16 pb-14 sm:pb-10 z-10 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.a
                  key={current}
                  href={slide.href}
                  className="pointer-events-auto inline-block bg-background text-foreground sm:bg-foreground sm:text-background px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium tracking-wider rounded-full border border-background sm:border-foreground hover:bg-transparent hover:text-background sm:hover:text-foreground transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                >
                  {slide.cta}
                </motion.a>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="absolute bottom-0 left-0 right-0 sm:left-auto sm:right-0 z-20 pb-4 sm:pb-6 px-5 sm:px-10 lg:px-16 flex items-center justify-start sm:justify-end gap-4">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
