import { Star, ShoppingBag } from "lucide-react";
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

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square bg-muted/50 overflow-hidden">
        {(tag || product.discount) && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-foreground text-background text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide">
            {tag || product.discount}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Quick add overlay */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 sm:p-4 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-0.5 flex-shrink-0 bg-muted px-1.5 py-0.5 rounded">
            <span className="text-[11px] font-bold">{product.rating.toFixed(1)}</span>
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground">{product.subtitle}</p>
        {product.colors.length > 1 && (
          <div className="flex gap-1 pt-0.5">
            {product.colors.map((c) => (
              <span
                key={c}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-border/80"
                style={{ backgroundColor: colorMap[c] || "#ccc" }}
                title={c}
              />
            ))}
          </div>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-sm sm:text-base">{product.price}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground line-through">{product.originalPrice}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-foreground text-background text-[11px] sm:text-xs font-semibold py-2.5 rounded-lg tracking-wider hover:bg-foreground/90 transition-colors mt-1"
        >
          ADD TO CART
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
