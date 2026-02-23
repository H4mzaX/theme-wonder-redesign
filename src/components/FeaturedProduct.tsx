import featuredImg from "@/assets/featured-headphones.jpg";
import { Star } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";

const specs = [
  { label: "Material", value: "Leather" },
  { label: "Weight", value: "42g" },
  { label: "Drop Protection", value: "6ft" },
  { label: "MagSafe", value: "Yes" },
  { label: "Wireless Charging", value: "Compatible" },
  { label: "Compatibility", value: "iPhone 16 Pro" },
];

const FeaturedProduct = () => {
  return (
    <section className="bg-section-alt">
      <div className="section-padding py-20 lg:py-28">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-3">Featured · Product</p>
          <h2 className="text-3xl sm:text-4xl font-display">
            Style.<em className="italic">Protected.</em>
          </h2>
          <p className="text-muted-foreground mt-3">A case that elevates your phone's look while keeping it safe.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          <ScrollReveal direction="left" duration={0.8}>
            <motion.div className="relative aspect-square rounded-lg overflow-hidden bg-card cursor-pointer" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
              <img src={featuredImg} alt="Premium Leather Case" className="w-full h-full object-cover" />
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15} duration={0.8}>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">CaseVault</p>
                <h3 className="text-3xl font-display font-semibold">Premium Leather Case</h3>
                <p className="text-2xl font-display mt-2">$59.00</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">48 reviews</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Crafted from genuine Italian leather, this case develops a beautiful patina over time. MagSafe compatible with precise cutouts and 6ft drop protection.
              </p>

              <StaggerContainer className="grid grid-cols-3 gap-4" staggerDelay={0.06}>
                {specs.map((spec) => (
                  <StaggerItem key={spec.label}>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="font-semibold text-sm">{spec.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{spec.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div>
                <p className="text-sm mb-2">Color: <span className="font-medium">Saddle Brown</span></p>
                <div className="flex gap-2">
                  {[
                    { color: "bg-amber-700", active: true },
                    { color: "bg-foreground", active: false },
                    { color: "bg-red-900", active: false },
                    { color: "bg-blue-900", active: false },
                    { color: "bg-green-900", active: false },
                  ].map((c, i) => (
                    <motion.button key={i} className={`w-8 h-8 rounded-full ${c.color} ${c.active ? "ring-2 ring-foreground ring-offset-2 ring-offset-section-alt" : ""}`} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
                  ))}
                </div>
              </div>

              <motion.button className="w-full bg-foreground text-background py-4 rounded-lg font-medium text-sm tracking-wide" whileHover={{ scale: 1.01, opacity: 0.9 }} whileTap={{ scale: 0.99 }}>
                Add to cart — $59.00
              </motion.button>

              <div className="flex gap-6 text-xs text-muted-foreground">
                <span>✓ Ships within 1-2 days</span>
                <span>✓ 30-day returns</span>
                <span>✓ Lifetime warranty</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
