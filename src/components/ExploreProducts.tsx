import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";

const categories = [
  { name: "iPhone Cases", count: "120+ Products", image: magsafeClearImg, href: "/collections/iphone-cases", accent: "from-blue-500/20 to-transparent" },
  { name: "Samsung Cases", count: "45+ Products", image: siliconeBluImg, href: "/collections/samsung-cases", accent: "from-emerald-500/20 to-transparent" },
  { name: "MagSafe Cases", count: "80+ Products", image: leatherBrownImg, href: "/collections/magsafe-cases", accent: "from-amber-500/20 to-transparent" },
  { name: "Leather Cases", count: "35+ Products", image: magsafeBlackImg, href: "/collections/leather-cases", accent: "from-rose-500/20 to-transparent" },
];

const ExploreProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) setScrollProgress(el.scrollLeft / maxScroll);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <ScrollReveal className="flex items-end justify-between mb-5 lg:mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Browse by</p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Explore Products
          </h2>
        </div>
        <Link to="/collections/all" className="hidden sm:flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </ScrollReveal>

      {/* Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory lg:hidden -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            to={cat.href}
            className="group flex-none w-[38vw] sm:w-[32vw] snap-start"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-muted"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-background font-bold text-xs leading-tight">{cat.name}</h3>
                <p className="text-background/70 text-[10px] mt-0.5">{cat.count}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Scroll progress bar - mobile */}
      <div className="lg:hidden mx-auto mt-2 h-[3px] bg-border rounded-full max-w-[120px] overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-transform duration-100 ease-out origin-left"
          style={{ transform: `scaleX(${0.25 + scrollProgress * 0.75})` }}
        />
      </div>

      {/* Desktop: 4-column grid with modern cards */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            to={cat.href}
            className="group block relative rounded-2xl overflow-hidden aspect-[3/4] bg-muted"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-full h-full"
            >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-background font-bold text-base mb-1">{cat.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-background/70 text-xs">{cat.count}</p>
                <ArrowRight className="w-3.5 h-3.5 text-background/70 group-hover:translate-x-1 group-hover:text-background transition-all duration-300" />
              </div>
            </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
