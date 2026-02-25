import { useState, useRef, useCallback } from "react";
import { Star, Shield, Magnet, Zap, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";

// Clean, flat badge styles — Amazon/Flipkart inspired
const badgeStyles: Record<string, string> = {
  "New":          "bg-emerald-600 text-white",
  "Bestseller":   "bg-foreground text-background",
  "Hot":          "bg-rose-600 text-white",
  "Sale":         "bg-amber-500 text-foreground",
};

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

type SlideDir = "left" | "right" | "top" | "bottom";

function getDirection(el: HTMLElement, e: React.MouseEvent): SlideDir {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  // Determine direction based on angle
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle >= -45 && angle < 45) return "right";
  if (angle >= 45 && angle < 135) return "bottom";
  if (angle >= -135 && angle < -45) return "top";
  return "left";
}

const slideTransforms: Record<SlideDir, string> = {
  left: "translateX(-100%)",
  right: "translateX(100%)",
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
};

const ProductCard = ({ product, tag }: { product: Product; tag?: string }) => {
  const { addToCart } = useCart();
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [enterDir, setEnterDir] = useState<SlideDir>("left");
  const [exitDir, setExitDir] = useState<SlideDir>("left");
  const [isExiting, setIsExiting] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const dir = getDirection(imageRef.current, e);
    setEnterDir(dir);
    setIsExiting(false);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const dir = getDirection(imageRef.current, e);
    setExitDir(dir);
    setIsExiting(true);
    setIsHovered(false);
  }, []);

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

  const features = categoryFeatures[product.category] || defaultFeatures;

  // Hover image transform
  const hoverTransform = isHovered
    ? "translate(0, 0)"
    : isExiting
      ? slideTransforms[exitDir]
      : slideTransforms[enterDir];

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col h-full bg-background rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
    >
      {/* Image area with directional slide */}
      <div
        ref={imageRef}
        className="relative aspect-[3/4] bg-secondary/50 overflow-hidden rounded-xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badge */}
        {(() => {
          const badgeTag = tag || product.tag;
          const style = badgeTag ? badgeStyles[badgeTag] : null;
          if (!style) return null;
          return (
            <span className={`absolute top-2.5 left-2.5 z-10 ${style} text-[10px] sm:text-[11px] px-2.5 py-[3px] rounded font-semibold tracking-wide`}>
              {badgeTag}
            </span>
          );
        })()}

        {/* Primary image — bigger, less padding */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-700 ease-out"
          style={{ transform: isHovered && !product.hoverImage ? "scale(1.08)" : "scale(1)" }}
          loading="lazy"
        />

        {/* Hover image — directional slide */}
        {product.hoverImage && (
          <div
            className="absolute inset-0 bg-secondary/50"
            style={{
              transform: hoverTransform,
              transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <img
              src={product.hoverImage}
              alt={`${product.name} alternate`}
              className="w-full h-full object-contain p-2 sm:p-4"
              loading="lazy"
            />
          </div>
        )}

        {/* Feature icons — 2 on mobile, 3 on desktop, both on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 pb-2.5 sm:pb-3 pt-8 bg-gradient-to-t from-background/95 via-background/40 to-transparent"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.35s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: isHovered ? "0.15s" : "0s",
          }}
        >
          {features.slice(0, isMobile ? 2 : 3).map((feat, i) => (
            <div
              key={feat.label}
              className="flex items-center gap-1 sm:gap-1 bg-foreground/90 text-background rounded-full px-2.5 sm:px-2 py-1.5 sm:py-1 backdrop-blur-sm"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
                transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: isHovered ? `${0.18 + i * 0.05}s` : "0s",
              }}
            >
              <feat.icon className="w-3.5 sm:w-3 h-3.5 sm:h-3" strokeWidth={2.5} />
              <span className="text-[9px] font-semibold leading-none whitespace-nowrap">
                {feat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop — all 3, slide up on hover */}
        <div
          className="hidden sm:flex absolute bottom-0 left-0 right-0 justify-center gap-2 px-3 pb-3 pt-8 bg-gradient-to-t from-background/95 via-background/40 to-transparent"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.35s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: isHovered ? "0.15s" : "0s",
          }}
        >
          {features.map((feat, i) => (
            <div
              key={feat.label}
              className="flex items-center gap-1 bg-foreground/90 text-background rounded-full px-2 py-1 backdrop-blur-sm"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
                transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                transitionDelay: isHovered ? `${0.18 + i * 0.05}s` : "0s",
              }}
            >
              <feat.icon className="w-3 h-3" strokeWidth={2.5} />
              <span className="text-[9px] font-semibold leading-none whitespace-nowrap">
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

        {/* Color swatches — always show at least one */}
        <div className="flex gap-1.5 mt-2">
          {(product.colors.length > 1 ? product.colors : ["White"]).map((c) => (
            <span
              key={c}
              className="w-[18px] h-[18px] rounded-full border border-border/80"
              style={{ backgroundColor: colorMap[c] || "#ffffff" }}
              title={c}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-3">
          <span className="font-bold text-[16px] sm:text-[18px] leading-none text-foreground">{product.price}</span>
          <span className="text-[11px] sm:text-[12px] text-muted-foreground">MRP <span className="line-through">{product.originalPrice}</span></span>
        </div>

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
