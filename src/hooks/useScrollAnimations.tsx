import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ── Signature easing: expo-out — fast start, feather-soft landing ── */
const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Scroll reveal wrapper ──
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 1.5,
}, _forwardedRef) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directionMap = {
    up: { y: "2rem", x: 0 },
    down: { y: "-2rem", x: 0 },
    left: { y: 0, x: "-2rem" },
    right: { y: 0, x: "2rem" },
    none: { y: 0, x: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration, delay, ease: expoOut }}
    >
      {children}
    </motion.div>
  );
});
ScrollReveal.displayName = "ScrollReveal";

// ── Staggered children ──
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(({
  children,
  className = "",
  staggerDelay = 0.1,
}, _forwardedRef) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
});
StaggerContainer.displayName = "StaggerContainer";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(({ children, className = "" }, _forwardedRef) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: "2.5rem" },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.075, 0.82, 0.165, 1] },
      },
    }}
  >
    {children}
  </motion.div>
));
StaggerItem.displayName = "StaggerItem";

// ── Parallax media wrapper (vertical / horizontal / zoom) ──
export const ParallaxImage = ({
  src,
  alt,
  className = "",
  speed = 0.15,
  direction = "vertical",
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal" | "zoom";
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = 1 + speed;
  const translate = (speed * 100) / (1 + speed);

  const y = useTransform(scrollYProgress, [0, 1], [`${translate}%`, "0%"]);
  const x = useTransform(scrollYProgress, [0, 1], [`${translate}%`, "0%"]);
  const scaleVal = useTransform(scrollYProgress, [0, 1], [1, scale]);

  const style =
    direction === "horizontal" ? { x, scale } :
    direction === "zoom" ? { scale: scaleVal } :
    { y, scale };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover"
        style={style}
      />
    </div>
  );
};

// ── Counter animation ──
export const AnimatedCounter = ({
  value,
  className = "",
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const durationMs = duration * 1000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // expo-out easing
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
};

// ── Text reveal animation (word by word) ──
export const TextReveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.05,
            ease: expoOut,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// ── Scale on scroll ──
export const ScaleOnScroll = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
};

// ── Hook for scroll-based navbar with hysteresis ──
export const useScrollDirection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const buffer = 10;

  useEffect(() => {
    const threshold = 80;
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Hysteresis
      if (!scrolled && currentY > threshold + buffer) setScrolled(true);
      else if (scrolled && currentY < threshold - buffer) setScrolled(false);

      // Hide/show
      if (currentY > threshold + 100) {
        if (currentY > lastScrollY.current) setHidden(true);
        else if (currentY < lastScrollY.current) setHidden(false);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return { scrolled, hidden };
};
