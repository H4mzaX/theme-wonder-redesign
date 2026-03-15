import { useState, useEffect } from "react";
import { Star, ShoppingCart, Shield, Zap, Droplets, Magnet, Ruler, Gauge, Weight, Layers, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { toast } from "sonner";
import { type Product, getProductUrl } from "@/data/products";
import { useShopifyCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import BrandName from "@/components/BrandName";

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

const ProductCard = ({ product }: { product: Product; tag?: string }) => {
  const specs = categorySpecs[product.category] || defaultSpecs;
  const hasAlt = !!(product.hoverImage && product.hoverImage !== product.image);
  const images = hasAlt ? [product.image, product.hoverImage!] : [product.image];
  const [activeImg, setActiveImg] = useState(0);

  const addItem = useShopifyCartStore((s) => s.addItem);
  const isCartLoading = useShopifyCartStore((s) => s.isLoading);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);

  // Search for matching Shopify product
  useEffect(() => {
    const query = `${product.name} ${product.device}`;
    storefrontApiRequest(`
      query SearchProducts($query: String!) {
        products(first: 1, query: $query) {
          edges { node { id title handle description
            variants(first: 5) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
            images(first: 2) { edges { node { url altText } } }
            priceRange { minVariantPrice { amount currencyCode } }
            options { name values }
          } }
        }
      }
    `, { query })
      .then((data) => {
        const edges = data?.data?.products?.edges || [];
        if (edges.length > 0) setShopifyProduct(edges[0]);
      })
      .catch(() => {});
  }, [product.name, product.device]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (shopifyProduct) {
      const variant = shopifyProduct.node.variants.edges[0]?.node;
      if (!variant) return;
      await addItem({
        product: shopifyProduct,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      toast.success("Added to cart", { description: `${product.name} — ${product.subtitle}`, position: "top-center" });
    } else {
      toast.error("Product not available yet");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasAlt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setActiveImg(x > rect.width / 2 ? 1 : 0);
  };

  return (
    <Link
      to={getProductUrl(product)}
      className="group flex flex-col bg-background rounded-xl overflow-hidden border border-border/60 h-full"
    >
      {/* Image area with hover zones */}
      <div
        className="relative aspect-square overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveImg(0)}
      >
        {/* Rating pill */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold leading-none text-foreground">{product.rating.toFixed(1)}</span>
        </div>

        {/* Images stacked — crossfade */}
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 ? product.name : `${product.name} - alt`}
            className={`absolute inset-0 w-full h-full object-cover will-change-[opacity] ${
              i === activeImg ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: 'opacity 180ms cubic-bezier(0.25, 1, 0.5, 1)' }}
            loading="lazy"
            decoding="async"
          />
        ))}

        {/* Hover zone indicator — desktop only */}
        {hasAlt && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 hidden sm:flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === activeImg ? "bg-foreground w-4" : "bg-foreground/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile swappable dots */}
        {hasAlt && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex sm:hidden gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImg(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeImg ? "bg-foreground w-5" : "bg-foreground/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Cart button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isCartLoading}
          className="absolute bottom-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm text-foreground flex items-center justify-center shadow-md border border-border/40 disabled:opacity-50"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {isCartLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" strokeWidth={2} />
          )}
        </motion.button>
      </div>

      {/* Info area */}
      <div className="flex flex-col px-3 pt-2.5 pb-1 gap-0.5">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {product.device}
        </span>
        <BrandName name={product.name} as="h3" className="text-[13px] sm:text-[15px] leading-tight line-clamp-1 text-foreground" />
        <span className="font-semibold text-[13px] sm:text-[15px] leading-none text-foreground mt-0.5">
          {product.price}
        </span>
      </div>

      {/* Spec row */}
      <div
        className="flex gap-0 mt-auto mx-2.5 mb-2.5 overflow-x-auto border border-border/30 rounded-lg scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex flex-col items-center justify-center py-2 px-2.5 flex-1 min-w-[72px] ${i !== 0 ? "border-l border-border/30" : ""}`}
          >
            <spec.icon className="w-3.5 h-3.5 text-muted-foreground/50 mb-0.5" strokeWidth={1.5} />
            <span className="text-[11px] sm:text-[12px] font-bold text-foreground leading-none">{spec.value}</span>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5 whitespace-nowrap">{spec.label}</span>
          </div>
        ))}
      </div>
    </Link>
  );
};

export default ProductCard;