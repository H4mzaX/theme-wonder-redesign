import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import exploreCasesImg from "@/assets/explore-cases.jpg";
import exploreChargingImg from "@/assets/explore-charging.jpg";
import exploreAirpodsImg from "@/assets/explore-airpods.jpg";
import exploreWatchImg from "@/assets/explore-watch.jpg";

const categories = [
  { name: "Cases & Protectors", image: exploreCasesImg, href: "/collections/iphone-cases" },
  { name: "Charging Solutions", image: exploreChargingImg, href: "/collections/magsafe-cases" },
  { name: "AirPods Cases", image: exploreAirpodsImg, href: "/collections/leather-cases" },
  { name: "Watch Accessories", image: exploreWatchImg, href: "/collections/samsung-cases" },
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight italic text-foreground text-center mb-4 lg:mb-6">
        Explore Products
      </h2>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex-none w-[60vw] sm:w-[240px] lg:w-[calc(25%-12px)] snap-start"
          >
            <Link
              to={cat.href}
              className="group block relative rounded-xl overflow-hidden aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="text-sm sm:text-base font-semibold text-white">
                  {cat.name}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Scroll progress bar */}
      <div className="mx-auto mt-2 h-[3px] bg-border rounded-full max-w-[200px] overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-transform duration-100 ease-out origin-left"
          style={{ transform: `scaleX(${0.2 + scrollProgress * 0.8})` }}
        />
      </div>
    </section>
  );
};

export default ExploreProducts;
