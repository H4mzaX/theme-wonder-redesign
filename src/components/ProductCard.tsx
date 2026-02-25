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
      className="group flex flex-col h-full bg-background rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_12px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area — light gray bg like CaseGear */}
      <div className="relative aspect-square bg-secondary/50 overflow-hidden">
        {(tag || product.discount) && (
          <span className="absolute top-3 left-3 z-10 bg-foreground text-background text-[11px] px-3 py-1 rounded-full font-medium">
            {tag || product.discount}
          </span>
        )}
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain p-6 sm:p-8 transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info area — white bg, structured spacing */}
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

        {/* Price — pushed to bottom */}
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
