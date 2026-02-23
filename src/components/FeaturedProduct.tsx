import featuredImg from "@/assets/featured-headphones.jpg";
import { Star } from "lucide-react";

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
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-3">Featured · Product</p>
          <h2 className="text-3xl sm:text-4xl font-display">
            Sound.<em className="italic">Sculpted.</em>
          </h2>
          <p className="text-muted-foreground mt-3">A speaker that excites the eye and ear from every angle.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-card">
            <img src={featuredImg} alt="FlowHarmony Headphones" className="w-full h-full object-cover" />
          </div>

          {/* Product Info */}
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
            <div className="grid grid-cols-3 gap-4">
              {specs.map((spec) => (
                <div key={spec.label} className="text-center p-3 bg-background rounded-lg">
                  <p className="font-semibold text-sm">{spec.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* Color Options */}
            <div>
              <p className="text-sm mb-2">Color: <span className="font-medium">Gold Tone</span></p>
              <div className="flex gap-2">
                {["bg-amber-600", "bg-foreground", "bg-amber-800", "bg-blue-900", "bg-red-900"].map((color, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} ${i === 0 ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                  />
                ))}
              </div>
            </div>

            <button className="w-full bg-foreground text-background py-4 rounded-lg font-medium text-sm tracking-wide hover:opacity-90 transition-opacity">
              Add to cart — $999.00
            </button>

            <div className="flex gap-6 text-xs text-muted-foreground">
              <span>✓ Ships within 1-2 days</span>
              <span>✓ 90-day trial</span>
              <span>✓ 2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
