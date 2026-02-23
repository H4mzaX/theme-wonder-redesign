import { ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";
import magsafeClearImg from "@/assets/case-magsafe-clear.jpg";
import siliconeBluImg from "@/assets/case-silicone-blue.jpg";
import leatherBrownImg from "@/assets/case-leather-brown.jpg";
import magsafeBlackImg from "@/assets/case-magsafe-black.jpg";

const categories = [
  { name: "MagSafe Cases", image: magsafeClearImg, href: "#" },
  { name: "Silicone Cases", image: siliconeBluImg, href: "#" },
  { name: "Leather Cases", image: leatherBrownImg, href: "#" },
  { name: "All Cases", image: magsafeBlackImg, href: "#" },
];

const ExploreProducts = () => {
  return (
    <section className="section-padding py-16 lg:py-20">
      <ScrollReveal className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-display font-semibold">Explore Products</h2>
      </ScrollReveal>
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
        {categories.map((cat) => (
          <StaggerItem key={cat.name}>
            <a href={cat.href} className="group block relative rounded-2xl overflow-hidden aspect-[3/4]">
              <motion.img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between">
                <h3 className="text-background font-display text-lg sm:text-xl font-semibold">{cat.name}</h3>
                <motion.div
                  className="w-9 h-9 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
                >
                  <ArrowRight className="w-4 h-4 text-background" />
                </motion.div>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default ExploreProducts;
