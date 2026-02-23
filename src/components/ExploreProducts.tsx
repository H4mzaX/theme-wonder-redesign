import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
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
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      <ScrollReveal className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Explore Products</h2>
      </ScrollReveal>
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" staggerDelay={0.08}>
        {categories.map((cat) => (
          <StaggerItem key={cat.name}>
            <a href={cat.href} className="group block relative rounded-xl overflow-hidden aspect-[3/4]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">{cat.name}</h3>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default ExploreProducts;
