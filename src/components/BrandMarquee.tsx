import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const brands = ["SonicPulse", "Vibrance", "Resonance", "Aureal", "SoundSphere", "HarmonyTech", "AudioCore"];
const doubled = [...brands, ...brands, ...brands, ...brands];

const BrandMarquee = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={ref} className="py-12 overflow-hidden border-y border-border">
      <motion.div className="marquee-track" style={{ x }}>
        {doubled.map((brand, i) => (
          <span
            key={i}
            className="text-xl sm:text-2xl font-display text-muted-foreground/40 whitespace-nowrap px-10 sm:px-14 font-semibold tracking-wide"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default BrandMarquee;
