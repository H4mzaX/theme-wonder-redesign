import { useState } from "react";
import { Star } from "lucide-react";
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

  const displayImage = isHovered && product.hoverImage ? product.hoverImage : product.image;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border/40 shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area — fixed aspect ratio */}
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {(tag || product.discount) && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-foreground text-background text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide">
            {tag || product.discount}
          </span>
        )}
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain p-6 sm:p-8 transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info area */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{product.subtitle}</p>

        {/* Rating */}
        <div className="inline-flex items-center gap-1 border border-border rounded px-2 py-0.5">
          <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-muted-foreground text-[10px] sm:text-xs">| {product.reviews} Reviews</span>
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 pt-0.5">
            {product.colors.map((c) => (
              <span
                key={c}
                className="w-4 h-4 rounded-full border-2 border-border/60"
                style={{ backgroundColor: colorMap[c] || "#ccc" }}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-bold text-base sm:text-lg">{product.price}</span>
          <span className="text-xs text-muted-foreground">MRP <span className="line-through">{product.originalPrice}</span></span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-foreground text-background text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-lg tracking-wider hover:bg-foreground/90 transition-colors"
        >
          ADD TO CART
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
