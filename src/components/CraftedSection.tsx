import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import armorImg from "@/assets/armoredge-hero.webp";
import clearImg from "@/assets/iphone17-magsafe-clear.jpg";

const CraftedSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} className="py-6 sm:py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1 — Armor Edge */}
          <Link to="/armor-edge/iphone-17?model=iphone-17-pro" className="group block">
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-foreground h-[340px] sm:h-[420px] lg:h-[480px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div className="absolute inset-0" style={{ y: y1 }}>
                <img
                  src={armorImg}
                  alt="Armor Edge premium rugged case"
                  className="w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-background/50 mb-1.5">Built to Survive</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-background tracking-tight leading-tight mb-3">
                  Armor Edge
                </h3>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-background/80 uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Card 2 — ClearMag */}
          <Link to="/clearmag/iphone-17?model=iphone-17-pro" className="group block">
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-muted h-[340px] sm:h-[420px] lg:h-[480px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div className="absolute inset-0" style={{ y: y2 }}>
                <img
                  src={clearImg}
                  alt="ClearMag crystal clear MagSafe case"
                  className="w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Crystal Clarity</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight mb-3">
                  ClearMag
                </h3>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground/70 uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CraftedSection;
