import { useState } from "react";
import { Star } from "lucide-react";
import featuredImg from "@/assets/featured-headphones.jpg";
import airbeatsImg from "@/assets/product-airbeats.jpg";
import zenithImg from "@/assets/product-zenith.jpg";
import rhythmiqImg from "@/assets/product-rhythmiq.jpg";
import soundrollImg from "@/assets/product-soundroll.jpg";

const categories = ["Headphones", "Earphones", "Speakers", "Accessories"];

const products = [
  { name: "Air Beats Gold Tone", price: "$499.00", vendor: "SonicPulse", rating: 5, image: featuredImg, tag: "New" },
  { name: "Air Beats", price: "$499.00", vendor: "SonicPulse", rating: 5, image: airbeatsImg },
  { name: "FlowHarmony", price: "$999.00", vendor: "SonicPulse", rating: 5, image: featuredImg },
  { name: "Zenith Pulse", price: "$400.00", vendor: "Vibrance", rating: 5, image: zenithImg },
  { name: "RhythmiQ", price: "$399.00", vendor: "SonicPulse", rating: 5, image: rhythmiqImg },
  { name: "Nature Tune", price: "$1,099.00", vendor: "SonicPulse", rating: 4.5, image: airbeatsImg },
  { name: "SoundRoll", price: "$199.00", vendor: "Vibrance", rating: 4.5, image: soundrollImg },
  { name: "Echo Elegance", price: "$799.00", vendor: "Resonance", rating: 5, image: zenithImg },
];

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="section-padding py-20 lg:py-28">
      <h2 className="text-3xl sm:text-4xl font-display text-center mb-2">
        Best<em className="italic">Sellers</em>
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mt-6 mb-12 flex-wrap">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveTab(i)}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              i === activeTab
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <a key={product.name} href="#" className="group block">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-card mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide">
                  {product.tag}
                </span>
              )}
              <button className="absolute bottom-3 right-3 bg-background text-foreground text-xs px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Add to cart
              </button>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-accent text-accent"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">{product.vendor}</p>
            <h3 className="text-sm font-medium mt-0.5">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{product.price}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
