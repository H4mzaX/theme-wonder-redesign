import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { seriesData, type SeriesSlug } from "@/data/products";
import BrandName from "@/components/BrandName";

const seriesList: { slug: SeriesSlug; href: string }[] = [
  { slug: "clearmag", href: "/collections/clearmag" },
  { slug: "clearmag-edge", href: "/collections/clearmag-edge" },
  { slug: "softmag", href: "/collections/softmag" },
  { slug: "edgeguard", href: "/collections/edgeguard" },
  { slug: "lensguard", href: "/collections/lensguard" },
];

const ExploreProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < maxScroll - 10);
    if (maxScroll > 0) {
      const progress = el.scrollLeft / maxScroll;
      setActiveIndex(Math.min(Math.round(progress * (seriesList.length - 1)), seriesList.length - 1));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    return () => el.removeEventListener("scroll", updateScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="py-8 sm:py-10 lg:py-14">
      <div className="max-w-[1400px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-left mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-10"
        >
          Explore Collection
        </motion.h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-10 px-4 sm:px-6 lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {seriesList.map(({ slug, href }, i) => {
              const series = seriesData[slug];
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-none w-[65vw] sm:w-[44vw] md:w-[320px] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-12px)] snap-start"
                >
                  <Link to={href} className="group block relative rounded-2xl overflow-hidden bg-white">
                    {/* Product image on pure white */}
                    <div className="aspect-square p-6 sm:p-8 overflow-hidden">
                      <img
                        src={series.icon}
                        alt={series.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Bottom info */}
                    <div className="py-5 sm:py-6 px-4 text-center">
                      <BrandName
                        name={series.name}
                        as="p"
                        className="text-xl sm:text-2xl lg:text-[1.75rem] tracking-tight text-foreground"
                      />
                      <div className="flex items-center justify-center gap-1 mt-1.5 text-muted-foreground text-xs sm:text-sm">
                        <span className="group-hover:text-foreground transition-colors duration-300">Shop now</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Bottom border accent on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-2 lg:-left-2 top-[40%] -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border/60 shadow-lg hover:bg-background hover:scale-105 active:scale-95 transition-all z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-2 lg:right-4 top-[40%] -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border/60 shadow-lg hover:bg-background hover:scale-105 active:scale-95 transition-all z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mx-auto mt-5 sm:mt-6 max-w-[280px] sm:max-w-[320px] px-4">
          {seriesList.map((_, i) => (
            <motion.div
              key={i}
              className="h-[3px] flex-1 rounded-full bg-border"
              animate={{ backgroundColor: i <= activeIndex ? "hsl(var(--foreground))" : "hsl(var(--border))" }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;
