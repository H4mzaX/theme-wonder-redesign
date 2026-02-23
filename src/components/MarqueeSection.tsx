import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MarqueeSection = () => {
  const items = ["Play anything", "Day-long comfort", "Play anything", "Day-long comfort"];
  const doubled = [...items, ...items, ...items, ...items];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={ref} className="py-10 overflow-hidden border-y border-border">
      <motion.div className="marquee-track" style={{ x }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-lg sm:text-xl font-display italic font-semibold whitespace-nowrap px-8 text-foreground/80"
          >
            {item} <span className="text-accent mx-4">•</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default MarqueeSection;
