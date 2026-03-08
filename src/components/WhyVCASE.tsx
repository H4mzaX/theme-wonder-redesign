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
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-muted/50 border border-border/60 rounded-2xl p-5 sm:p-6 text-center hover:bg-muted transition-colors duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-foreground/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-foreground/10 transition-colors">
                <feat.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-foreground" strokeWidth={1.6} />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold text-foreground tracking-tight">{feat.title}</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVCASE;
