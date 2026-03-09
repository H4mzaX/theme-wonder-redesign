import { motion } from "framer-motion";
import { Shield, Magnet, Fingerprint, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Military-Grade",
    desc: "16ft drop-tested protection",
  },
  {
    icon: Magnet,
    title: "MagSafe Built-in",
    desc: "N52 magnets, perfect alignment",
  },
  {
    icon: Fingerprint,
    title: "Anti-Yellow Tech",
    desc: "Crystal clarity that lasts",
  },
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Precision-crafted in India",
  },
];

const WhyVCASE = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-accent/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Premium grid layout - asymmetric on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ 
                delay: i * 0.1, 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="group relative bg-gradient-to-br from-background via-background to-muted/20 border border-border/40 rounded-3xl p-6 sm:p-7 lg:p-8 hover:border-border/60 hover:shadow-xl hover:shadow-foreground/[0.02] transition-all duration-500"
            >
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-foreground/[0.01] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon container with glassmorphic background */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <feat.icon className="relative w-6 h-6 sm:w-7 sm:h-7 text-foreground" strokeWidth={1.5} />
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-2 group-hover:text-foreground/90 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVCASE;
