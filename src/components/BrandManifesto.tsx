import { motion } from "framer-motion";
import { ScrollReveal } from "@/hooks/useScrollAnimations";

/**
 * Premium brand statement section - Apple/Aesop editorial style
 * Full-bleed dark background with bold typography
 */
const BrandManifesto = () => {
  return (
    <section className="relative bg-foreground py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-foreground opacity-60" />
      
      <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-background leading-[1.15] tracking-tight mb-6">
              Protection isn't just about defense.
              <br className="hidden sm:block" />
              It's about confidence.
            </h2>
            <p className="text-background/70 text-base sm:text-lg lg:text-xl max-w-[720px] mx-auto leading-relaxed">
              Every VCASE product is engineered to disappear into your life — 
              protecting what matters most while letting your device's beauty shine through.
            </p>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <motion.div 
            className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 text-background/50 text-xs sm:text-sm tracking-widest uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span>Premium Materials</span>
            <span className="opacity-30">·</span>
            <span>Precision Engineering</span>
            <span className="opacity-30">·</span>
            <span>Thoughtful Design</span>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BrandManifesto;
