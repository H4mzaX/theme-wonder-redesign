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
  badge?: string;
  title: string;
  subtitle: string;
  cta: string;
}

const slides: Slide[] = [
  {
    image: hero1,
    badge: "New Arrival",
    title: "SNAP CLEAR.\nSNAP SECURE.",
    subtitle: "MagSafe Transparent Protection Case",
    cta: "SHOP NOW",
  },
  {
    image: hero2,
    badge: "4 Colors",
    title: "PICK YOUR\nEDGE.",
    subtitle: "Sand Beige · Matte Black · Slate Blue · Burnt Orange",
    cta: "Shop Colors",
  },
  {
    image: hero3,
    badge: "Armor Edge",
    title: "ENGINEERED\nFOR IMPACT.",
    subtitle: "Precision-crafted magnetic stand protection built for performance.",
    cta: "Shop Now",
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
    // Don't advance if clicking on interactive elements
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
            {/* Fixed images - no animation, instant swap */}
            <img
              src={slide.image}
              alt={slide.title}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent sm:bg-gradient-to-r sm:from-foreground/60 sm:via-foreground/20 sm:to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-end sm:items-center px-5 sm:px-10 lg:px-16 pb-20 sm:pb-10 pointer-events-none z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  className="pointer-events-auto w-full sm:max-w-xl"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
                    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                  }}
                >
                  {slide.badge && (
                    <motion.span
                      className="inline-block bg-background text-foreground text-[10px] sm:text-xs font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-4"
                      variants={{
                        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                      }}
                    >
                      {slide.badge}
                    </motion.span>
                  )}
                  {slide.title.split("\n").map((line, li) => (
                    <motion.div
                      key={li}
                      className="overflow-hidden"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                        exit: { opacity: 0 },
                      }}
                    >
                      <motion.span
                        className="block text-3xl sm:text-5xl lg:text-7xl font-display font-bold text-background sm:text-foreground leading-[1.05] tracking-tight"
                        variants={{
                          hidden: { y: "100%", opacity: 0 },
                          visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                          exit: { y: "-50%", opacity: 0, transition: { duration: 0.25 } },
                        }}
                      >
                        {line}
                      </motion.span>
                    </motion.div>
                  ))}
                  <motion.p
                    className="text-background/80 sm:text-foreground/70 text-sm sm:text-lg mt-3 mb-4 sm:mt-4 sm:mb-6"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                      exit: { opacity: 0, transition: { duration: 0.2 } },
                    }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.a
                    href="#"
                    className="inline-block bg-background text-foreground sm:bg-foreground sm:text-background px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-medium tracking-wider rounded-full border border-background sm:border-foreground hover:bg-transparent hover:text-background sm:hover:text-foreground transition-colors duration-300"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                      exit: { opacity: 0, transition: { duration: 0.2 } },
                    }}
                  >
                    {slide.cta}
                  </motion.a>
                </motion.div>
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
