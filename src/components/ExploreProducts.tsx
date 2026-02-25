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
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight italic text-foreground text-center mb-5 lg:mb-8">
        Explore Products
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
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
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Category name */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="text-sm sm:text-base font-semibold text-white">
                  {cat.name}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
