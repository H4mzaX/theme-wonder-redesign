import { motion } from "framer-motion";
import { Diamond, Sparkles, Shield, Zap, Gem, Star } from "lucide-react";

const items = [
  { text: "DROP-PROOF DESIGN", icon: Shield },
  { text: "CRYSTAL CLEAR", icon: Sparkles },
  { text: "MAGSAFE READY", icon: Zap },
  { text: "PREMIUM LEATHER", icon: Gem },
  { text: "6FT DROP TESTED", icon: Shield },
  { text: "WIRELESS CHARGING", icon: Zap },
  { text: "SLIM FIT", icon: Star },
  { text: "ECO FRIENDLY", icon: Diamond },
];

const doubled = [...items, ...items, ...items];

const MarqueeSection = () => {
  return (
    <section className="py-3 sm:py-4 overflow-hidden bg-foreground">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 whitespace-nowrap text-[11px] sm:text-sm font-semibold tracking-[0.2em] text-background/90"
          >
            <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background/50 flex-shrink-0" strokeWidth={1.5} />
            {item.text}
            <span className="text-background/25 ml-3 sm:ml-5">•</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default MarqueeSection;
