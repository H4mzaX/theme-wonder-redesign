import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";

import exploreIphoneImg from "@/assets/explore-iphone.jpg";
import exploreSamsungImg from "@/assets/explore-samsung.jpg";
import exploreMagsafeImg from "@/assets/explore-magsafe.jpg";
import exploreLeatherImg from "@/assets/explore-leather.jpg";
import exploreSiliconeImg from "@/assets/explore-silicone.jpg";

const categories = [
  { name: "iPhone", count: "120+", image: exploreIphoneImg, href: "/collections/iphone-cases" },
  { name: "Samsung", count: "45+", image: exploreSamsungImg, href: "/collections/samsung-cases" },
  { name: "MagSafe", count: "80+", image: exploreMagsafeImg, href: "/collections/magsafe-cases" },
  { name: "Leather", count: "35+", image: exploreLeatherImg, href: "/collections/leather-cases" },
  { name: "Silicone", count: "60+", image: exploreSiliconeImg, href: "/collections/silicone-cases" },
];

const ExploreProducts = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <ScrollReveal className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground uppercase">
          Shop by Category
        </h2>
        <Link
          to="/collections/all"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </ScrollReveal>

      {/* Horizontal scroll on all sizes, compact circular/rounded cards */}
      <div
        className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible lg:justify-between"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex-none lg:flex-1"
          >
            <Link
              to={cat.href}
              className="group flex flex-col items-center gap-2 w-[72px] sm:w-[80px] lg:w-auto"
            >
              <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] lg:w-20 lg:h-20 rounded-full overflow-hidden bg-muted border-2 border-border group-hover:border-foreground/30 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <p className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight">{cat.name}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">{cat.count}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
