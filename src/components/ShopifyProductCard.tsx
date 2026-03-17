import { ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type ShopifyProduct } from "@/lib/shopify";
import { useShopifyCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface Props {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: Props) => {
  const addItem = useShopifyCartStore((s) => s.addItem);
  const isLoading = useShopifyCartStore((s) => s.isLoading);
  const p = product.node;
  const image = p.images.edges[0]?.node;
  const hoverImage = p.images.edges[1]?.node;
  const variant = p.variants.edges[0]?.node;
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  const currency = p.priceRange.minVariantPrice.currencyCode;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      compareAtPrice: (variant as any).compareAtPrice || null,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: p.title, position: "top-center" });
  };

  return (
    <Link
      to={`/shop/${p.handle}`}
      className="group flex flex-col bg-background rounded-xl overflow-hidden border border-border/60 h-full"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image && (
          <img
            src={image.url}
            alt={image.altText || p.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hoverImage ? "group-hover:opacity-0" : ""}`}
            loading="lazy"
            decoding="async"
          />
        )}
        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={hoverImage.altText || `${p.title} - alt`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Cart button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isLoading || !variant?.availableForSale}
          className="absolute bottom-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm text-foreground flex items-center justify-center shadow-md border border-border/40 disabled:opacity-50"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" strokeWidth={2} />
          )}
        </motion.button>

        {!variant?.availableForSale && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-muted-foreground/80 text-background text-[10px] font-bold px-2 py-0.5 rounded">
            Sold Out
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col px-3 pt-2.5 pb-3 gap-0.5 flex-1">
        <h3 className="text-[13px] sm:text-[15px] font-semibold leading-tight line-clamp-2 text-foreground">
          {p.title}
        </h3>
        {variant && variant.title !== "Default Title" && (
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            {variant.title}
          </span>
        )}
        <span className="font-semibold text-[13px] sm:text-[15px] leading-none text-foreground mt-1">
          {currency === "INR" ? "₹" : currency + " "}{price.toLocaleString("en-IN")}
        </span>
      </div>
    </Link>
  );
};

export default ShopifyProductCard;
