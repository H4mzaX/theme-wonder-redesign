import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import leatherImg from "@/assets/case-leather-brown.jpg";

const TextBehindImageSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Large scrolling text — behind the image */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: textY }}
      >
        <h2 className="text-[18vw] sm:text-[14vw] lg:text-[12vw] font-display font-black text-foreground/[0.04] leading-none whitespace-nowrap tracking-tighter">
          PREMIUM
        </h2>
      </motion.div>

      {/* Second line offset */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none mt-[10vw] sm:mt-[8vw]"
        style={{ y: textY }}
      >
        <h2 className="text-[18vw] sm:text-[14vw] lg:text-[12vw] font-display font-black text-foreground/[0.04] leading-none whitespace-nowrap tracking-tighter">
          LEATHER
        </h2>
      </motion.div>

      {/* Centered product image — in front of text */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <motion.div
          className="w-[260px] sm:w-[320px] lg:w-[380px] aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          style={{ y: imageY, scale: imageScale }}
        >
          <img
            src={leatherImg}
            alt="Premium leather case"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Caption below */}
        <motion.div
          className="mt-8 sm:mt-10 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2">
            Crafted with care
          </p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground leading-tight">
            Handcrafted Premium Leather
          </h3>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Each case develops a unique patina over time, making it truly yours.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TextBehindImageSection;
