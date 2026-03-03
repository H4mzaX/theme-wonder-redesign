import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: expoOut } },
  },
  "fade-up": {
    hidden: { opacity: 0, y: "2rem" },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: expoOut } },
  },
  "reveal-up": {
    hidden: { opacity: 0, y: "90%" },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: expoOut } },
  },
  "zoom-out": {
    hidden: { scale: 1.3, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1.3, ease: expoOut } },
  },
};

type AnimationType = keyof typeof variants;

interface AnimateElementProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span";
}

const AnimateElement = ({
  children,
  type = "fade-up",
  delay = 0,
  className = "",
  as = "div",
}: AnimateElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

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

export default AnimateElement;
