import { motion } from "framer-motion";

const MarqueeSection = () => {
  const items = [
    "DROP-PROOF DESIGN",
    "CRYSTAL CLEAR",
    "MAGSAFE READY",
    "PREMIUM LEATHER",
    "6FT DROP TESTED",
    "WIRELESS CHARGING",
    "SLIM FIT",
    "ECO FRIENDLY",
  ];
  const doubled = [...items, ...items, ...items];

  return (
    <section className="py-3 sm:py-4 overflow-hidden bg-muted/50 border-y border-border">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs sm:text-sm font-semibold tracking-widest whitespace-nowrap px-4 sm:px-6 text-foreground/60 flex items-center gap-4 sm:gap-6">
            {item} <span className="text-foreground/20">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default MarqueeSection;
