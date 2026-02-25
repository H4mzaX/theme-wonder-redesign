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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        const progress = el.scrollLeft / maxScroll;
        const index = Math.round(progress * (categories.length - 1));
        setActiveIndex(Math.min(index, categories.length - 1));
      }
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight italic text-foreground text-center mb-4 sm:mb-5 lg:mb-7 px-4">
        Explore Products
      </h2>

      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-3 sm:px-6 lg:px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex-none w-[46vw] sm:w-[44vw] md:w-[240px] lg:w-[calc(25%-12px)] snap-start"
          >
            <Link
              to={cat.href}
              className="group block relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
                <p className="text-[13px] sm:text-base lg:text-lg font-semibold text-white leading-tight">
                  {cat.name}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Segmented progress bar - CaseGear style */}
      <div className="flex gap-1 mx-auto mt-3 sm:mt-4 max-w-[280px] sm:max-w-[320px] px-4">
        {categories.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              i <= activeIndex ? "bg-foreground" : "bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
