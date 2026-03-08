import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: expoOut } },
  },
  "fade-up": {
    hidden: { opacity: 0, y: "2.5rem" },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: expoOut } },
  },
  "fade-down": {
    hidden: { opacity: 0, y: "-2rem" },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: expoOut } },
  },
  "fade-left": {
    hidden: { opacity: 0, x: "-3rem" },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: expoOut } },
  },
  "fade-right": {
    hidden: { opacity: 0, x: "3rem" },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: expoOut } },
  },
  "reveal-up": {
    hidden: { opacity: 0, y: "90%" },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: expoOut } },
  },
  "zoom-out": {
    hidden: { scale: 1.3, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1.3, ease: expoOut } },
  },
  "zoom-in": {
    hidden: { scale: 0.85, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: expoOut } },
  },
  "clip-up": {
    hidden: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
    visible: { opacity: 1, clipPath: "inset(0% 0 0 0)", transition: { duration: 0.8, ease: expoOut } },
  },
  "clip-left": {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8, ease: expoOut } },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: "blur(12px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: expoOut } },
  },
};

type AnimationType = keyof typeof variants;

interface AnimateElementProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "h1" | "h2" | "h3" | "p";
  stagger?: number;
  viewport?: string;
}

const AnimateElement = ({
  children,
  type = "fade-up",
  delay = 0,
  className = "",
  as = "div",
  viewport = "-60px",
}: AnimateElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: viewport as any });

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      variants={variants[type]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
};

/* ── Stagger Container — children animate in sequence ── */
export const StaggerGroup = ({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerChild = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: "2rem" },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: expoOut },
      },
    }}
  >
    {children}
  </motion.div>
);

/* ── Parallax wrapper — content shifts on scroll ── */
export const ParallaxSection = ({
  children,
  className = "",
  speed = 0.1,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}px`, `${-speed * 100}px`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

/* ── Scale-on-scroll — grows slightly as you scroll past ── */
export const ScaleReveal = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
};

export default AnimateElement;
