import { ScrollReveal } from "@/hooks/useScrollAnimations";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";

const categories = [
  { name: "Cases & Protectors", image: magsafeClearImg, href: "#" },
  { name: "Charging Solutions", image: siliconeBluImg, href: "#" },
  { name: "Silicone Cases", image: leatherBrownImg, href: "#" },
  { name: "Leather Cases", image: magsafeBlackImg, href: "#" },
];

const ExploreProducts = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-12">
      <ScrollReveal className="text-center mb-5 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-foreground">
          Explore Products
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group block relative rounded-lg overflow-hidden aspect-[3/4]"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent transition-opacity duration-300 group-hover:from-foreground/70" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
              <h3 className="text-background font-semibold text-xs sm:text-sm lg:text-base leading-tight">
                {cat.name}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ExploreProducts;
