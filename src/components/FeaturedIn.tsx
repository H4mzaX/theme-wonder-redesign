import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";

const pressMentions = [
  { name: "TechCrunch", quote: "VCASE is redefining mobile protection with premium quality at accessible prices." },
  { name: "The Verge", quote: "7 Reasons smartphone users are switching to VCASE for their device protection." },
  { name: "Wired", quote: "Can a premium case really save your expensive phone? VCASE thinks so." },
  { name: "Forbes", quote: "From Protection to Inspiration — VCASE's new era of mobile accessories." },
  { name: "TechRadar", quote: "VCASE: The new favorite brand for iPhone and Samsung accessories." },
];

const doubled = [...pressMentions, ...pressMentions];

const FeaturedIn = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <section ref={ref} className="py-16 lg:py-20 overflow-hidden">
      <ScrollReveal className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-display font-semibold">Featured In</h2>
      </ScrollReveal>
      <motion.div className="flex gap-6 w-max" style={{ x }}>
        {doubled.map((item, i) => (
          <motion.a
            key={i}
            href="#"
            className="flex-none w-[350px] sm:w-[400px] bg-card rounded-2xl p-6 group hover:bg-card/80 transition-colors"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-display font-bold text-foreground/80 block mb-3">{item.name}</span>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {item.quote}
            </p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedIn;
