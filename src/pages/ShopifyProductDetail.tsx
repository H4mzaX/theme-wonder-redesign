import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Loader2, Minus, Plus, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { useShopifyCartStore } from "@/stores/cartStore";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        edges { node { url altText } }
      }
      variants(first: 30) {
        edges {
          node {
            id title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

const ShopifyProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = useShopifyCartStore((s) => s.addItem);
  const isCartLoading = useShopifyCartStore((s) => s.isLoading);
  const getCheckoutUrl = useShopifyCartStore((s) => s.getCheckoutUrl);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => {
        const p = data?.data?.product;
        if (p) {
          setProduct({ node: p });
        } else {
          setProduct(null);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [handle]);

  const p = product?.node;
  const images = p?.images.edges || [];
  const variants = p?.variants.edges || [];
  const selectedVariant = variants[selectedVariantIdx]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const compareAtPrice = (selectedVariant as any)?.compareAtPrice
    ? parseFloat((selectedVariant as any).compareAtPrice.amount)
    : 0;
  const currency = selectedVariant?.price.currencyCode || "INR";
  const currencySymbol = currency === "INR" ? "₹" : currency + " ";

  useSEO({
    title: p ? `${p.title} — Buy Online | VCASE India` : "Product | VCASE India",
    description: p?.description?.slice(0, 160) || "Shop premium phone accessories at VCASE India.",
    canonical: `https://vcase.in/shop/${handle}`,
    type: "product",
    jsonLd: p && selectedVariant ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      description: p.description,
      image: images[0]?.node.url,
      brand: { "@type": "Brand", name: "VCASE" },
      offers: {
        "@type": "Offer",
        priceCurrency: currency,
        price,
        availability: selectedVariant.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    } : undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      compareAtPrice: (selectedVariant as any).compareAtPrice || null,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: p!.title, position: "top-center" });
    setCartOpen(true);
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      compareAtPrice: (selectedVariant as any).compareAtPrice || null,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <Link to="/" className="text-sm text-muted-foreground underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-16">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div>
            {/* Main image */}
            <motion.div
              className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3"
              key={activeImg}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {images[activeImg] && (
                <img
                  src={images[activeImg].node.url}
                  alt={images[activeImg].node.altText || p.title}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImg ? "border-foreground" : "border-border/40"
                    }`}
                  >
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              {p.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">
                {currencySymbol}{price.toLocaleString("en-IN")}
              </span>
              {compareAtPrice > price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {currencySymbol}{compareAtPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded">
                    {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Options / Variants */}
            {p.options && p.options.length > 0 && p.options[0].name !== "Title" && (
              <div className="mt-6 space-y-4">
                {p.options.map((option) => (
                  <div key={option.name}>
                    <p className="text-sm font-medium text-foreground mb-2">{option.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const variantIdx = variants.findIndex((v) =>
                          v.node.selectedOptions.some((o) => o.name === option.name && o.value === value)
                        );
                        const isSelected = selectedVariant?.selectedOptions.some(
                          (o) => o.name === option.name && o.value === value
                        );
                        return (
                          <button
                            key={value}
                            onClick={() => variantIdx >= 0 && setSelectedVariantIdx(variantIdx)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              isSelected
                                ? "border-foreground bg-foreground text-background"
                                : "border-border hover:border-foreground/40"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
              <div className="inline-flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
                className="w-full py-4 rounded-full bg-foreground text-background font-medium text-base flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isCartLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
                className="w-full py-4 rounded-full border-2 border-foreground text-foreground font-medium text-base flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <ExternalLink className="w-5 h-5" />
                Buy Now
              </button>
            </div>

            {/* Description */}
            {p.description && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopifyProductDetail;
