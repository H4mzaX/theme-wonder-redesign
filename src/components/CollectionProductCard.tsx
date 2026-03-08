import { Star, ShoppingCart, Shield, Zap, Droplets, Magnet, Ruler, Gauge, Weight, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import BrandName from "@/components/BrandName";

/* Spec badges per category — horizontal row at bottom of card */
const categorySpecs: Record<string, { icon: React.ElementType; label: string; value: string }[]> = {
  Cases: [
    { icon: Gauge, label: "MagSafe", value: "38T" },
    { icon: Ruler, label: "Thickness", value: "1.2mm" },
    { icon: Weight, label: "Weight", value: "32g" },
  ],
  "Screen Protection": [
    { icon: Shield, label: "Hardness", value: "9H" },
    { icon: Layers, label: "Coating", value: "Oleophobic" },
    { icon: Ruler, label: "Thickness", value: "0.33mm" },
  ],
  "Camera Protection": [
    { icon: Shield, label: "Hardness", value: "9H" },
    { icon: Layers, label: "Profile", value: "0.3mm" },
    { icon: Ruler, label: "Fit", value: "Precision" },
  ],
};

const defaultSpecs = [
  { icon: Layers, label: "Material", value: "TPU" },
  { icon: Ruler, label: "Thickness", value: "1.3mm" },
  { icon: Weight, label: "Weight", value: "30g" },
];

const colorMap: Record<string, string> = {
  Clear: "#e5e5e5",
  "Jet Black": "#1a1a1a",
  Black: "#1a1a1a",
  Blue: "#2563eb",
  Pink: "#ec4899",
  Green: "#16a34a",
  "Saddle Brown": "#92400e",
  "Matte Black": "#333333",
};

const categoryFeatures: Record<string, { icon: React.ElementType; label: string }[]> = {
  "MagSafe Cases": [
    { icon: Magnet, label: "MagSafe" },
    { icon: Shield, label: "6ft Drop" },
    { icon: Zap, label: "Wireless" },
  ],
  "Silicone Cases": [
    { icon: Shield, label: "Shock Proof" },
    { icon: Zap, label: "Wireless" },
    { icon: Droplets, label: "Anti-Slip" },
  ],
  "Leather Cases": [
    { icon: Star, label: "Genuine" },
    { icon: Shield, label: "6ft Drop" },
    { icon: Magnet, label: "MagSafe" },
  ],
  "Clear Cases": [
    { icon: Shield, label: "Anti-Yellow" },
    { icon: Zap, label: "Wireless" },
    { icon: Droplets, label: "Anti-Slip" },
  ],
  "Black Cases": [
    { icon: Shield, label: "Shock Proof" },
    { icon: Zap, label: "Wireless" },
    { icon: Star, label: "Matte" },
  ],
};

const defaultFeatures = [
  { icon: Shield, label: "Protected" },
  { icon: Zap, label: "Wireless" },
  { icon: Droplets, label: "Anti-Slip" },
];

interface CollectionProductCardProps {
  product: Product;
  large?: boolean;
}

const CollectionProductCard = ({ product, large = false }: CollectionProductCardProps) => {
  const { addToCart } = useCart();
  const features = categoryFeatures[product.category] || defaultFeatures;
  const specs = categorySpecs[product.category] || defaultSpecs;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: product.colors[0] || "Default",
      device: product.device,
    });
    toast({ title: "Added to cart", description: `${product.name} — ${product.subtitle}` });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-background rounded-xl overflow-hidden border border-border/60 [perspective:1000px]"
    >
      {/* Flip container */}
      <div className={`relative overflow-hidden [transform-style:preserve-3d] ${large ? "aspect-[3/4]" : "aspect-square"}`}>
        {/* Rating pill — top right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold leading-none text-foreground">{product.rating.toFixed(1)}</span>
        </div>

        {/* Front face */}
        <div className="absolute inset-0 [backface-visibility:hidden] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:rotateY(180deg)]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Back face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:rotateY(0deg)]">
          <img
            src={product.hoverImage || product.image}
            alt={`${product.name} - alternate view`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Cart button — bottom right */}
        <motion.button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm text-foreground flex items-center justify-center shadow-md border border-border/40"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ShoppingCart className="w-4 h-4" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Info area */}
      <div className="flex flex-col px-3 pt-3 pb-1 gap-0.5">
        {/* Device model */}
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {product.device}
        </span>

        {/* Product name */}
        <BrandName name={product.name} as="h3" className={`leading-tight line-clamp-1 text-foreground ${large ? "text-[16px] sm:text-[18px]" : "text-[14px] sm:text-[16px]"}`} />

        {/* Price */}
        <span className={`font-semibold leading-none text-foreground mt-1 ${large ? "text-[16px] sm:text-[18px]" : "text-[14px] sm:text-[16px]"}`}>
          {product.price}
        </span>
      </div>

      {/* Spec badges row — icon stacked above value & label */}
      <div
        className="flex gap-0 mt-2 mx-3 mb-3 overflow-x-auto border border-border/30 rounded-lg scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex flex-col items-center justify-center py-2.5 px-3 flex-1 min-w-[80px] ${i !== 0 ? "border-l border-border/30" : ""}`}
          >
            <spec.icon className="w-4 h-4 text-muted-foreground/50 mb-1" strokeWidth={1.5} />
            <span className="text-[12px] sm:text-[13px] font-bold text-foreground leading-none">{spec.value}</span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">{spec.label}</span>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default CollectionProductCard;
