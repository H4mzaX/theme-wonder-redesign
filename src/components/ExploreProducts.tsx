import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { seriesData, type SeriesSlug } from "@/data/products";
import BrandName from "@/components/BrandName";

const seriesList: { slug: SeriesSlug; href: string }[] = [
  { slug: "clearmag", href: "/clearmag" },
  { slug: "clearmag-edge", href: "/clearmag-edge" },
  { slug: "softmag", href: "/softmag" },
  { slug: "edgeguard", href: "/edgeguard" },
  { slug: "lensguard", href: "/lensguard" },
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
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-left mb-4 sm:mb-5 lg:mb-7 px-4 sm:px-6 lg:px-10">
          Explore Collection
        </h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-10 px-4 sm:px-6 lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {seriesList.map(({ slug, href }, i) => {
              const series = seriesData[slug];
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: "2rem" }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-none w-[calc(50vw-22px)] sm:w-[44vw] md:w-[280px] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-12px)] snap-start"
                >
                  <Link
                    to={href}
                    className="group block rounded-xl sm:rounded-2xl overflow-hidden bg-muted/40 border border-border/50 hover:border-border transition-all duration-300"
                  >
                    {/* Product image on light background */}
                    <div className="aspect-[3/4] flex items-center justify-center p-6 sm:p-8">
                      <img
                        src={series.icon}
                        alt={series.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Series name with BrandName typography */}
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-center">
                      <BrandName
                        name={series.name}
                        as="p"
                        className="text-lg sm:text-xl lg:text-2xl tracking-tight text-foreground"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-2 lg:-left-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-background border border-border shadow-md hover:bg-muted transition-colors z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mx-auto mt-3 sm:mt-4 max-w-[280px] sm:max-w-[320px] px-4">
          {seriesList.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                i <= activeIndex ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;
