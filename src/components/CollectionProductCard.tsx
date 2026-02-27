import { Star, ShoppingCart, Shield, Zap, Droplets, Magnet } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";

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
      className="group flex flex-col bg-background rounded-2xl overflow-hidden"
    >
      {/* Image area */}
      <div className={`relative bg-secondary/30 rounded-2xl overflow-hidden ${large ? "aspect-[3/4]" : "aspect-square"}`}>
        {/* Discount badge — top left */}
        {product.discount && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded">
            {product.discount}
          </span>
        )}

        {/* Rating badge — top right */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-foreground text-background rounded-full px-2 py-0.5 shadow-md">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold leading-none">{product.rating.toFixed(1)}</span>
        </div>

        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 ${large ? "p-4" : "p-3"}`}
          loading="lazy"
        />

        {/* Cart button — bottom right */}
        <motion.button
          onClick={handleAddToCart}
          className="absolute bottom-2.5 right-2.5 z-10 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ShoppingCart className="w-4 h-4" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Horizontally scrollable feature icons */}
      <div
        className="flex gap-2 mt-2.5 overflow-x-auto pb-1 px-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {features.map((feat) => (
          <div
            key={feat.label}
            className="flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 flex-shrink-0"
          >
            <feat.icon className="w-3 h-3 text-muted-foreground" strokeWidth={2.5} />
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground whitespace-nowrap">
              {feat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Info area */}
      <div className="flex flex-col px-0.5 pt-2 pb-2 gap-0.5">
        {/* Brand */}
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {product.brand}
        </span>

        {/* Product name */}
        <h3 className={`font-semibold leading-tight line-clamp-1 text-foreground ${large ? "text-[14px] sm:text-[16px]" : "text-[12px] sm:text-[14px]"}`}>
          {product.name}
        </h3>

        {/* Subtitle / device */}
        <p className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-1">
          {product.subtitle}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`font-bold leading-none text-foreground ${large ? "text-[16px] sm:text-[18px]" : "text-[14px] sm:text-[16px]"}`}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-[11px] text-muted-foreground line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Color swatches */}
        <div className="flex gap-1.5 mt-1.5">
          {(product.colors.length > 1 ? product.colors : ["White"]).slice(0, 4).map((c) => (
            <span
              key={c}
              className={`rounded-full border border-border/80 ${large ? "w-5 h-5" : "w-4 h-4"}`}
              style={{ backgroundColor: colorMap[c] || "#ffffff" }}
              title={c}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default CollectionProductCard;
