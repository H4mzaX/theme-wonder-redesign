import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ShoppingCart,
  Loader2,
  Shield,
  Magnet,
  Sparkles,
  Fingerprint,
  Lock,
  Package,
  Truck,
  Percent,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { useShopifyCartStore } from "@/stores/cartStore";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchDrawer from "@/components/SearchDrawer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingNavPill from "@/components/FloatingNavPill";
import BrandName from "@/components/BrandName";
import AnimateElement from "@/components/AnimateElement";
import { premiumEase } from "@/lib/motion";

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

const highlightCards = [
  { label: "MagSafe", Icon: Magnet },
  { label: "Anti-Yellow", Icon: Sparkles },
  { label: "Drop Rated", Icon: Shield },
  { label: "Anti-Smudges", Icon: Fingerprint },
];

const offers = [
  { icon: Package, label: "Free Shipping", desc: "On prepaid orders" },
  { icon: Truck, label: "Fast Delivery", desc: "1-3 business days" },
  { icon: Percent, label: "10% Off", desc: "Use code SAVE10" },
];

const ShopifyProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeGalleryImg, setActiveGalleryImg] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const productInfoRef = useRef<HTMLDivElement>(null);
  const addItem = useShopifyCartStore((s) => s.addItem);
  const isCartLoading = useShopifyCartStore((s) => s.isLoading);
  const getCheckoutUrl = useShopifyCartStore((s) => s.getCheckoutUrl);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((data) => {
        const p = data?.data?.product;
        if (p) setProduct({ node: p });
        else setProduct(null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [handle]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  // Sticky cart bar observer
  useEffect(() => {
    const el = productInfoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCart(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

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
  const discountPct =
    compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  useSEO({
    title: p ? `${p.title} — Buy Online | VCASE India` : "Product | VCASE India",
    description:
      p?.description?.slice(0, 160) ||
      "Shop premium phone accessories at VCASE India.",
    canonical: `https://vcase.in/shop/${handle}`,
    type: "product",
    jsonLd:
      p && selectedVariant
        ? {
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
          }
        : undefined,
  });

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice || null,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", {
      description: p!.title,
      position: "top-center",
    });
    setCartOpen(true);
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice || null,
      quantity: 1,
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
        <Navbar
          onSearchOpen={() => setSearchOpen(true)}
          onCartOpen={() => setCartOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Product Not Found
            </h1>
            <Link
              to="/"
              className="text-sm text-muted-foreground underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-announcement overflow-x-clip">
      <AnnouncementBar />
      <div className="bg-background rounded-t-[1.25rem] sm:rounded-t-[1rem] lg:rounded-t-[0.625rem] overflow-x-clip">
        <Navbar
          onSearchOpen={() => setSearchOpen(true)}
          onCartOpen={() => setCartOpen(true)}
        />
        <SearchDrawer
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Breadcrumb — desktop */}
        <div className="hidden lg:block max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
          <motion.nav
            className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{p.title}</span>
          </motion.nav>
        </div>

        {/* Main product section — editorial layout matching SeriesProduct */}
        <section className="max-w-[1400px] mx-auto w-full px-0 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
            {/* LEFT: Gallery */}
            <div className="lg:col-span-7">
              {/* Mobile: swipeable gallery */}
              <div className="lg:hidden">
                <div
                  className="relative overflow-hidden rounded-lg sm:rounded-xl mx-0 bg-secondary/20"
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const el = e.currentTarget as any;
                    el._startX = touch.clientX;
                    el._startY = touch.clientY;
                    el._startTime = Date.now();
                  }}
                  onTouchEnd={(e) => {
                    const el = e.currentTarget as any;
                    const startX = el._startX;
                    const endX = e.changedTouches[0].clientX;
                    const diffX = startX - endX;
                    const diffY =
                      el._startY - e.changedTouches[0].clientY;
                    const elapsed = Date.now() - (el._startTime || 0);
                    const velocity =
                      Math.abs(diffX) / Math.max(elapsed, 1);
                    const threshold = velocity > 0.5 ? 20 : 40;
                    if (
                      Math.abs(diffX) > Math.abs(diffY) &&
                      Math.abs(diffX) > threshold
                    ) {
                      if (
                        diffX > 0 &&
                        activeGalleryImg < images.length - 1
                      )
                        setActiveGalleryImg(activeGalleryImg + 1);
                      else if (diffX < 0 && activeGalleryImg > 0)
                        setActiveGalleryImg(activeGalleryImg - 1);
                    }
                  }}
                >
                  <div className="aspect-[4/5] relative">
                    <div
                      className="flex h-full will-change-transform"
                      style={{
                        transform: `translateX(-${activeGalleryImg * 100}%)`,
                        transition:
                          "transform 180ms cubic-bezier(0.25, 1, 0.5, 1)",
                      }}
                    >
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="w-full h-full flex-shrink-0"
                        >
                          <img
                            src={img.node.url}
                            alt={img.node.altText || `${p.title} view ${i + 1}`}
                            className="w-full h-full object-contain p-4"
                            loading={i < 2 ? "eager" : "lazy"}
                            decoding={i < 2 ? "sync" : "async"}
                            draggable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pagination dots */}
                <div className="flex items-center justify-center gap-1.5 py-3">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveGalleryImg(i)}
                      className={`rounded-full transition-all duration-150 ${
                        i === activeGalleryImg
                          ? "w-6 h-1.5 bg-foreground"
                          : "w-1.5 h-1.5 bg-foreground/20"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop: two-column stacked gallery */}
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    className={`relative bg-secondary/20 rounded-2xl overflow-hidden ${
                      i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: premiumEase,
                    }}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${p.title} view ${i + 1}`}
                      className="w-full h-full object-contain p-6 lg:p-10"
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding={i < 2 ? "sync" : "async"}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT: Sticky product info */}
            <div
              ref={productInfoRef}
              className="lg:col-span-5 py-2 lg:py-0 px-4 sm:px-0"
            >
              <div className="lg:sticky lg:top-[80px] lg:pb-10">
                {/* Brand */}
                <motion.p
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  VCASE
                </motion.p>

                {/* Title */}
                <motion.h1
                  className="text-[1.6rem] sm:text-3xl lg:text-[2.2rem] font-bold tracking-tight text-foreground leading-[1.15]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <BrandName name={p.title} />
                </motion.h1>

                {/* Price */}
                <motion.div
                  className="flex items-baseline gap-3 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    {currencySymbol}
                    {price.toLocaleString("en-IN")}
                  </span>
                  {compareAtPrice > price && (
                    <>
                      <span className="text-base text-muted-foreground line-through">
                        MRP {currencySymbol}
                        {compareAtPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded">
                        {discountPct}% OFF
                      </span>
                    </>
                  )}
                </motion.div>

                <p className="text-xs text-muted-foreground mt-1">
                  Inclusive of all taxes
                </p>

                {/* Variant Selector — as model list */}
                {p.options &&
                  p.options.length > 0 &&
                  p.options[0].name !== "Title" && (
                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {p.options.map((option) => (
                        <div key={option.name} className="mb-4">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                            Select {option.name}
                          </p>
                          <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                            {option.values.map((value) => {
                              const variantIdx = variants.findIndex(
                                (v) =>
                                  v.node.selectedOptions.some(
                                    (o) =>
                                      o.name === option.name &&
                                      o.value === value
                                  )
                              );
                              const isSelected =
                                selectedVariant?.selectedOptions.some(
                                  (o) =>
                                    o.name === option.name &&
                                    o.value === value
                                );
                              return (
                                <button
                                  key={value}
                                  onClick={() =>
                                    variantIdx >= 0 &&
                                    setSelectedVariantIdx(variantIdx)
                                  }
                                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                                    isSelected
                                      ? "bg-foreground text-background"
                                      : "hover:bg-muted"
                                  }`}
                                >
                                  <span>{value}</span>
                                  {isSelected && (
                                    <span className="text-xs opacity-70">
                                      Selected
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                {/* Highlight cards — 2x2 grid */}
                <motion.div
                  className="grid grid-cols-4 gap-2 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {highlightCards.map((card) => (
                    <div
                      key={card.label}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-muted/50 border border-border/40"
                    >
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                        <card.Icon className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="text-[10px] font-semibold text-foreground leading-none text-center">
                        {card.label}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Voucher-style offers */}
                <motion.div
                  className="flex gap-2 mt-5 overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {offers.map((offer) => (
                    <div
                      key={offer.label}
                      className="flex items-center gap-2.5 flex-none px-3.5 py-2.5 rounded-xl border border-dashed border-border bg-muted/30"
                    >
                      <div className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                        <offer.icon className="w-3.5 h-3.5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-foreground leading-none">
                          {offer.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                          {offer.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons — full-width pill-shaped */}
                <motion.div
                  className="flex flex-col gap-3 mt-7"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      isCartLoading || !selectedVariant?.availableForSale
                    }
                    className="w-full py-4 rounded-full bg-foreground text-background font-medium text-base flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {isCartLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={
                      isCartLoading || !selectedVariant?.availableForSale
                    }
                    className="w-full py-4 rounded-full border-2 border-foreground text-foreground font-medium text-base flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </motion.div>

                {/* Secure checkout */}
                <motion.div
                  className="flex items-center justify-center gap-4 mt-4 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">
                    Secure Checkout
                  </span>
                  <div className="flex gap-1.5">
                    {["Visa", "MC", "UPI", "GPay"].map((m) => (
                      <span
                        key={m}
                        className="text-[9px] font-semibold bg-muted px-1.5 py-0.5 rounded"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Description */}
                {p.description && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile sticky CTA bar */}
        <AnimatePresence>
          {showStickyCart && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-background border-t border-border px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {p.title}
                </p>
                <p className="text-base font-bold text-foreground">
                  {currencySymbol}
                  {price.toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isCartLoading}
                className="flex-none bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium disabled:opacity-50"
              >
                {isCartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add to Cart"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
      <MobileBottomNav />
      <FloatingNavPill />
    </div>
  );
};

export default ShopifyProductDetail;
