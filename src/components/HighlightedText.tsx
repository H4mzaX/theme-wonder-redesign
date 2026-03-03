import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

type HighlightStyle = "scribble-circle" | "underline" | "full_text" | "marker";

interface HighlightedTextProps {
  children: ReactNode;
  style?: HighlightStyle;
  color?: string;
  className?: string;
}

const HighlightedText = ({
  children,
  style = "scribble-circle",
  color = "hsl(var(--accent))",
  className = "",
}: HighlightedTextProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <em ref={ref} className={`not-italic relative inline-block ${className}`}>
      {children}
      {style === "scribble-circle" && (
        <motion.svg
          className="absolute pointer-events-none"
          style={{ top: "-20%", left: "-5%", width: "110%", height: "140%", zIndex: -1 }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <motion.ellipse
            cx="50" cy="50" rx="47" ry="42"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
          />
        </motion.svg>
      )}
      {style === "underline" && (
        <motion.svg
          className="absolute bottom-[-3px] left-0 w-full"
          style={{ height: "6px" }}
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 3 Q25 1 50 3 Q75 5 100 3"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.svg>
      )}
      {style === "full_text" && (
        <motion.span
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: color, originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
        />
      )}
      {style === "marker" && (
        <motion.span
          className="absolute -z-10"
          style={{
            inset: "-2px -4px",
            backgroundColor: color,
            originX: 0,
            rotate: "2deg",
            opacity: 0.3,
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
        />
      )}
    </em>
  );
};

export default HighlightedText;
