import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/hooks/useScrollAnimations";
import { featuredProduct } from "@/data/products";
import { useShopifyCartStore } from "@/stores/cartStore";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

const SEARCH_QUERY = `
  query SearchProducts($query: String!) {
    products(first: 1, query: $query) {
      edges { node { id title handle
        variants(first: 5) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
        images(first: 2) { edges { node { url altText } } }
        priceRange { minVariantPrice { amount currencyCode } }
        options { name values }
      } }
    }
  }
`;

const FeaturedProduct = () => {
  const addItem = useShopifyCartStore((s) => s.addItem);
  const isCartLoading = useShopifyCartStore((s) => s.isLoading);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);

  useEffect(() => {
    storefrontApiRequest(SEARCH_QUERY, { query: "iPhone 17 Pro Clear MagSafe Case" })
      .then((data) => {
        const edges = data?.data?.products?.edges || [];
        if (edges.length > 0) setShopifyProduct(edges[0]);
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = async () => {
    if (!shopifyProduct) {
      toast.error("Product not available yet");
      return;
    }
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
    toast.success("Added to cart", { description: "ClearMag — iPhone 17 Pro", position: "top-center" });
  };

  const displayPrice = shopifyProduct
    ? `₹${parseFloat(shopifyProduct.node.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}`
    : featuredProduct.price;

  return (
    <section className="bg-muted">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
        <ScrollReveal className="text-center mb-10">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-2">Featured Product</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Style. Protected.
          </h2>
          <p className="text-muted-foreground mt-2">A case that elevates your phone's look while keeping it safe.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          <ScrollReveal direction="left" duration={0.8}>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={featuredProduct.image} alt={featuredProduct.name} className="w-full h-full object-cover" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.15} duration={0.8}>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">VCASE</p>
                <h3 className="text-2xl font-bold">{featuredProduct.name}</h3>
                <p className="text-xs text-muted-foreground">{featuredProduct.subtitle}</p>
                <p className="text-2xl font-bold mt-2">{displayPrice}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">{featuredProduct.reviews} reviews</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm">
                Crafted from genuine Italian leather, this case develops a beautiful patina over time. MagSafe compatible with precise cutouts and 6ft drop protection.
              </p>

              <StaggerContainer className="grid grid-cols-3 gap-3" staggerDelay={0.06}>
                {featuredProduct.specs.map((spec) => (
                  <StaggerItem key={spec.label}>
                    <div className="text-center p-3 bg-background rounded-lg border border-border">
                      <p className="font-semibold text-sm">{spec.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{spec.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div>
                <p className="text-sm mb-2">Color: <span className="font-medium">{featuredProduct.colors[0].name}</span></p>
                <div className="flex gap-2">
                  {featuredProduct.colors.map((c, i) => (
                    <button key={i} className={`w-8 h-8 rounded-full ${c.class} ${c.active ? "ring-2 ring-foreground ring-offset-2" : "border border-border"}`} />
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isCartLoading}
                className="w-full bg-foreground text-background py-3.5 rounded-lg font-medium text-sm tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Add to cart — ${displayPrice}`
                )}
              </button>

              <div className="flex gap-6 text-xs text-muted-foreground">
                <span>✓ Ships within 1-2 days</span>
                <span>✓ 30-day returns</span>
                <span>✓ Lifetime warranty</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;