import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import heroPoster from "@/assets/hero-3-poster.jpg";

type SlideType = "image" | "video";

interface Slide {
  type: SlideType;
  image?: string;
  video?: string;
  poster?: string;
  title: string;
  cta: string;
}

const slides: Slide[] = [
  {
    type: "image",
    image: hero1,
    title: "PREMIUM\nPROTECTION\nFOR YOUR DEVICE",
    cta: "Shop Cases",
  },
  {
    type: "image",
    image: hero2,
    title: "CASES &\nSCREEN GUARDS\nFOR EVERY PHONE",
    cta: "Shop All",
  },
  {
    type: "video",
    video: heroVideo,
    poster: heroPoster,
    title: "STYLE MEETS\nDURABILITY\nIN EVERY CASE",
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
    <section className="relative mx-4 sm:mx-8 lg:mx-12 xl:mx-16 rounded-lg overflow-hidden">
      <div className="relative h-[500px] sm:h-[600px] lg:h-[750px]">
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
            {slide.type === "image" ? (
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "linear" }}
              />
            ) : (
              <video
                src={slide.video}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-foreground/20" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-end p-8 sm:p-12 lg:p-16 pb-24 pointer-events-none z-10">
          <div className="flex items-end justify-between w-full pointer-events-auto">
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={current}>
                  {slides[current].title.split("\n").map((line, li) => (
                    <motion.div
                      key={li}
                      initial={{ opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" }}
                      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.7, delay: 0.3 + li * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <span className="block text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-background leading-tight tracking-tight">
                        {line}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.a
                key={current}
                href="#"
                className="hidden sm:inline-flex self-end bg-background text-foreground px-8 py-3.5 rounded-full font-medium text-sm hover:bg-background/90 transition-colors tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {slides[current].cta}
              </motion.a>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-20 pb-6 px-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <motion.button onClick={prev} className="hidden md:flex items-center justify-center text-background hover:opacity-70 transition-opacity" whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="w-7 h-7" strokeWidth={1.5} />
          </motion.button>
          <div className="flex items-center gap-2.5 mx-auto md:mx-0">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative h-2 rounded-full overflow-hidden transition-all duration-300" style={{ width: i === current ? 32 : 10 }}>
                <span className="absolute inset-0 bg-background/40 rounded-full" />
                {i === current && <motion.span className="absolute inset-0 bg-background rounded-full origin-left" style={{ scaleX: progress }} />}
              </button>
            ))}
          </div>
          <motion.button onClick={next} className="hidden md:flex items-center justify-center text-background hover:opacity-70 transition-opacity" whileHover={{ x: 3 }} whileTap={{ scale: 0.9 }}>
            <ArrowRight className="w-7 h-7" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
