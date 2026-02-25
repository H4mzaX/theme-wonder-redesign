import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
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
    <section ref={ref} className="py-6 lg:py-10 overflow-hidden">
      <ScrollReveal className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Featured In</h2>
      </ScrollReveal>
      <motion.div className="flex gap-4 w-max" style={{ x }}>
        {doubled.map((item, i) => (
          <a
            key={i}
            href="#"
            className="flex-none w-[320px] sm:w-[380px] border border-border rounded-xl p-5 hover:bg-muted transition-colors"
          >
            <span className="text-base font-bold block mb-2">{item.name}</span>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {item.quote}
            </p>
          </a>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedIn;
