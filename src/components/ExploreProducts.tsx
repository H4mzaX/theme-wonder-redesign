import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";

import exploreIphoneImg from "@/assets/explore-iphone.jpg";
import exploreSamsungImg from "@/assets/explore-samsung.jpg";
import exploreMagsafeImg from "@/assets/explore-magsafe.jpg";
import exploreLeatherImg from "@/assets/explore-leather.jpg";
import exploreSiliconeImg from "@/assets/explore-silicone.jpg";
import exploreNewImg from "@/assets/explore-new.jpg";

const categories = [
  {
    name: "iPhone Cases",
    count: "120+",
    image: exploreIphoneImg,
    href: "/collections/iphone-cases",
    span: "col-span-2 row-span-2",
    mobileSpan: "col-span-2",
    aspect: "aspect-[4/5]",
  },
  {
    name: "Samsung Cases",
    count: "45+",
    image: exploreSamsungImg,
    href: "/collections/samsung-cases",
    span: "col-span-1 row-span-1",
    mobileSpan: "col-span-1",
    aspect: "aspect-square",
  },
  {
    name: "MagSafe",
    count: "80+",
    image: exploreMagsafeImg,
    href: "/collections/magsafe-cases",
    span: "col-span-1 row-span-1",
    mobileSpan: "col-span-1",
    aspect: "aspect-square",
  },
  {
    name: "Leather Cases",
    count: "35+",
    image: exploreLeatherImg,
    href: "/collections/leather-cases",
    span: "col-span-1 row-span-1",
    mobileSpan: "col-span-1",
    aspect: "aspect-square",
  },
  {
    name: "Silicone Cases",
    count: "60+",
    image: exploreSiliconeImg,
    href: "/collections/silicone-cases",
    span: "col-span-2 row-span-1",
    mobileSpan: "col-span-1",
    aspect: "aspect-[16/9]",
  },
  {
    name: "New Arrivals",
    count: "New",
    image: exploreNewImg,
    href: "/collections/new-arrivals",
    span: "col-span-1 row-span-1",
    mobileSpan: "col-span-2",
    aspect: "aspect-[16/9]",
  },
];

const BentoCard = ({ cat, index }: { cat: typeof categories[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
    className={`${cat.span} ${cat.mobileSpan}`}
  >
    <Link
      to={cat.href}
      className={`group relative block w-full ${cat.aspect} rounded-2xl overflow-hidden bg-muted`}
    >
      {/* Image */}
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-background/10 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-background/70 mb-1">
              {cat.count} Products
            </span>
            <h3 className="text-background font-bold text-sm sm:text-lg lg:text-xl leading-tight">
              {cat.name}
            </h3>
          </div>

          {/* Arrow button */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/20 backdrop-blur-sm border border-background/20 flex items-center justify-center group-hover:bg-background group-hover:border-background transition-all duration-500">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background group-hover:text-foreground transition-colors duration-500" />
          </div>
        </div>
      </div>

      {/* Top badge for New Arrivals */}
      {cat.count === "New" && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="px-2.5 py-1 bg-accent text-accent-foreground text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full">
            New
          </span>
        </div>
      )}
    </Link>
  </motion.div>
);

const ExploreProducts = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      <ScrollReveal className="flex items-end justify-between mb-5 lg:mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Browse by</p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Explore Products
          </h2>
        </div>
        <Link
          to="/collections/all"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors group"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </ScrollReveal>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
        {categories.map((cat, i) => (
          <BentoCard key={cat.name} cat={cat} index={i} />
        ))}
      </div>

      {/* Mobile View All */}
      <Link
        to="/collections/all"
        className="flex sm:hidden items-center justify-center gap-1.5 text-xs font-semibold text-foreground mt-4 py-2.5 border border-border rounded-full hover:bg-muted transition-colors"
      >
        View All Collections <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
};

export default ExploreProducts;
