import { useState } from "react";
import { Star, Shield, Magnet, Zap, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
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
    { icon: Droplets, label: "Anti-Slip" },
  ],
  "Silicone Cases": [
    { icon: Shield, label: "Shock Proof" },
    { icon: Droplets, label: "Anti-Slip" },
    { icon: Zap, label: "Wireless" },
    { icon: Star, label: "Soft Touch" },
  ],
  "Leather Cases": [
    { icon: Star, label: "Genuine" },
    { icon: Shield, label: "6ft Drop" },
    { icon: Magnet, label: "MagSafe" },
    { icon: Zap, label: "Wireless" },
  ],
  "Clear Cases": [
    { icon: Shield, label: "Anti-Yellow" },
    { icon: Droplets, label: "Anti-Slip" },
    { icon: Zap, label: "Wireless" },
    { icon: Star, label: "Crystal" },
  ],
  "Black Cases": [
    { icon: Shield, label: "Shock Proof" },
    { icon: Star, label: "Matte" },
    { icon: Zap, label: "Wireless" },
    { icon: Droplets, label: "Anti-Slip" },
  ],
};

const defaultFeatures = [
  { icon: Shield, label: "Protected" },
  { icon: Zap, label: "Wireless" },
  { icon: Droplets, label: "Anti-Slip" },
  { icon: Star, label: "Premium" },
];

const ProductCard = ({ product, tag }: { product: Product; tag?: string }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      image: product.image,
      color: product.colors[0] || "Default",
    });
    toast({ title: "Added to cart", description: `${product.name} — ${product.subtitle}` });
  };

  const features = categoryFeatures[product.category] || defaultFeatures;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col h-full bg-background rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area with crossfade */}
      <div className="relative aspect-square bg-secondary/50 overflow-hidden">
        {(tag || product.discount) && (
          <span className="absolute top-3 left-3 z-10 bg-foreground text-background text-[11px] px-3 py-1 rounded-full font-medium">
            {tag || product.discount}
          </span>
        )}

        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6 sm:p-8 transition-opacity duration-500 ease-in-out"
          style={{ opacity: isHovered && product.hoverImage ? 0 : 1 }}
          loading="lazy"
        />

        {/* Hover image (crossfade) */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate`}
            className="absolute inset-0 w-full h-full object-contain p-6 sm:p-8 transition-all duration-500 ease-in-out"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
            loading="lazy"
          />
        )}

        {/* Feature icons overlay — slides up on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 px-2 pb-2 pt-6 bg-gradient-to-t from-background/90 via-background/50 to-transparent transition-all duration-400 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
          }}
        >
          {features.map((feat) => (
            <div
              key={feat.label}
              className="flex flex-col items-center gap-0.5 px-1.5 py-1"
            >
              <feat.icon className="w-3.5 h-3.5 text-foreground" strokeWidth={2} />
              <span className="text-[9px] sm:text-[10px] font-medium text-foreground leading-none whitespace-nowrap">
                {feat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-4 gap-1">
        <h3 className="font-semibold text-[14px] sm:text-[15px] leading-tight line-clamp-1 text-foreground">{product.name}</h3>
        <p className="text-[12px] sm:text-[13px] text-muted-foreground">{product.subtitle}</p>

        {/* Rating */}
        <div className="inline-flex items-center gap-1 border border-border rounded w-fit px-2 py-0.5 mt-2">
          <span className="text-[12px] font-bold text-foreground">{product.rating.toFixed(1)}</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-muted-foreground text-[11px]">| {product.reviews} Reviews</span>
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.map((c) => (
              <span
                key={c}
                className="w-[18px] h-[18px] rounded-full border border-border/80"
                style={{ backgroundColor: colorMap[c] || "#ccc" }}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-3">
          <span className="font-bold text-[16px] sm:text-[18px] leading-none text-foreground">{product.price}</span>
          <span className="text-[11px] sm:text-[12px] text-muted-foreground">MRP <span className="line-through">{product.originalPrice}</span></span>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-foreground text-background text-[12px] sm:text-[13px] font-semibold py-3 rounded-lg tracking-wider hover:opacity-90 transition-opacity mt-3"
        >
          ADD TO CART
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
