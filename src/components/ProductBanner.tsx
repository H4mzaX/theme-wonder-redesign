import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductBannerProps {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  layout?: "left" | "right" | "center";
  theme?: "light" | "dark";
}

const ProductBanner = ({
  image,
  title,
  subtitle,
  cta,
  href,
  layout = "left",
  theme = "dark",
}: ProductBannerProps) => {
  const isDark = theme === "dark";
  const isCenter = layout === "center";
  const isRight = layout === "right";

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
      <Link to={href} className="group block">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden ${isDark ? "bg-foreground" : "bg-muted"}`}
        >
          {/* Image */}
          <div
            className={`flex ${isCenter ? "flex-col items-center" : isRight ? "flex-row-reverse" : "flex-row"} min-h-[220px] sm:min-h-[360px] lg:min-h-[420px]`}
          >
            {/* Text content */}
            <div
              className={`relative z-10 flex flex-col justify-center p-6 sm:p-10 lg:p-14 ${
                isCenter ? "items-center text-center w-full absolute inset-0" : "w-full lg:w-[45%]"
              }`}
            >
              <p
                className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-2 sm:mb-3 ${
                  isDark ? "text-background/60" : "text-muted-foreground"
                }`}
              >
                {subtitle}
              </p>
              <h3
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4 sm:mb-6 ${
                  isDark ? "text-background" : "text-foreground"
                }`}
              >
                {title}
              </h3>
              <div>
                <span
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider ${
                    isDark ? "text-background" : "text-foreground"
                  } border-b ${isDark ? "border-background/40" : "border-foreground/40"} pb-1 group-hover:gap-3 transition-all duration-300`}
                >
                  {cta} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
            </div>

            {/* Image */}
            <div
              className={`${
                isCenter ? "w-full h-full absolute inset-0" : "w-full lg:w-[55%]"
              } overflow-hidden`}
            >
              <img
                src={image}
                alt={title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                  isCenter ? "opacity-40" : ""
                }`}
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
};

export default ProductBanner;
