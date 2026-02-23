import featuredImg from "@/assets/featured-headphones.jpg";
import { Star } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { motion } from "framer-motion";

const specs = [
  { label: "Driver size", value: "40mm" },
  { label: "Product weight", value: "323 g" },
  { label: "Battery life", value: "38h" },
  { label: "Bluetooth®", value: "v5.1" },
  { label: "Noise cancellation", value: "Adaptive" },
  { label: "Connector", value: "USB-C" },
];

const FeaturedProduct = () => {
  return (
    <section className="bg-section-alt">
      <div className="section-padding py-20 lg:py-28">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-3">Featured · Product</p>
          <h2 className="text-3xl sm:text-4xl font-display">
            Sound.<em className="italic">Sculpted.</em>
          </h2>
          <p className="text-muted-foreground mt-3">A speaker that excites the eye and ear from every angle.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Product Image */}
          <ScrollReveal direction="left" duration={0.8}>
            <motion.div
              className="relative aspect-square rounded-lg overflow-hidden bg-card cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img src={featuredImg} alt="FlowHarmony Headphones" className="w-full h-full object-cover" />
            </motion.div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal direction="right" delay={0.15} duration={0.8}>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">SonicPulse</p>
                <h3 className="text-3xl font-display font-semibold">FlowHarmony</h3>
                <p className="text-2xl font-display mt-2">$999.00</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">2 reviews</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Experience a harmonious blend of premium sound quality and ergonomic design that allows for all-day comfortable listening.
              </p>

              {/* Specs */}
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

              {/* Color Options */}
              <div>
                <p className="text-sm mb-2">Color: <span className="font-medium">Gold Tone</span></p>
                <div className="flex gap-2">
                  {[
                    { color: "bg-amber-600", active: true },
                    { color: "bg-foreground", active: false },
                    { color: "bg-amber-800", active: false },
                    { color: "bg-blue-900", active: false },
                    { color: "bg-red-900", active: false },
                  ].map((c, i) => (
                    <motion.button
                      key={i}
                      className={`w-8 h-8 rounded-full ${c.color} ${c.active ? "ring-2 ring-foreground ring-offset-2 ring-offset-section-alt" : ""}`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                className="w-full bg-foreground text-background py-4 rounded-lg font-medium text-sm tracking-wide"
                whileHover={{ scale: 1.01, opacity: 0.9 }}
                whileTap={{ scale: 0.99 }}
              >
                Add to cart — $999.00
              </motion.button>

              <div className="flex gap-6 text-xs text-muted-foreground">
                <span>✓ Ships within 1-2 days</span>
                <span>✓ 90-day trial</span>
                <span>✓ 2-Year Warranty</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
