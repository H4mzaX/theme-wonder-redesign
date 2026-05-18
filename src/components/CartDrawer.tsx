import { X, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight, ChevronDown, FileText, Package, Tag, Shield, Camera, Smartphone, Zap, Clock, Users, Flame, Timer, Sparkles, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { drawerSpring } from "@/lib/motion";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { bestSellerTabs, newArrivalProducts } from "@/data/products";
import collectionCases from "@/assets/collection-headphones.jpg";
import collectionProtectors from "@/assets/collection-earphones.jpg";
import collectionRugged from "@/assets/collection-speakers.jpg";
import collectionAccessories from "@/assets/collection-accessories.jpg";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1000;

const parsePriceValue = (value?: string) => parseInt((value || "").replace(/[₹,]/g, ""), 10) || 0;

// Top picks for empty cart — real products with working links
const topPicks = [
  ...Object.values(bestSellerTabs).flat().slice(0, 3).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    href: `/product/${p.id}`,
  })),
  ...newArrivalProducts.slice(0, 3).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    href: `/product/${p.id}`,
  })),
].slice(0, 6);

const collectionLinks = [
  { name: "iPhone Cases", image: collectionCases, href: "/collections/iphone-cases" },
  { name: "Samsung Cases", image: collectionProtectors, href: "/collections/samsung-cases" },
  { name: "OnePlus Cases", image: collectionRugged, href: "/collections/oneplus-cases" },
  { name: "All Accessories", image: collectionAccessories, href: "/collections/magsafe-cases" },
];

interface BundleItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  numericPrice: number;
  originalPrice: string;
  icon: typeof Shield;
  image: string;
}

const getBundleAccessories = (device: string): BundleItem[] => [
  {
    id: `${device.replace(/\s+/g, "-").toLowerCase()}-screen-guard`,
    name: "Tempered Glass Screen Guard",
    subtitle: `For ${device}`,
    price: "₹349",
    numericPrice: 349,
    originalPrice: "₹799",
    icon: Shield,
    image: collectionProtectors,
  },
  {
    id: `${device.replace(/\s+/g, "-").toLowerCase()}-camera-lens`,
    name: "Camera Lens Protector",
    subtitle: `For ${device}`,
    price: "₹249",
    numericPrice: 249,
    originalPrice: "₹599",
    icon: Camera,
    image: collectionAccessories,
  },
  {
    id: `${device.replace(/\s+/g, "-").toLowerCase()}-charging-cable`,
    name: "Fast Charging Cable",
    subtitle: "Type-C · 1.5m",
    price: "₹399",
    numericPrice: 399,
    originalPrice: "₹999",
    icon: Smartphone,
    image: collectionRugged,
  },
];

// 24hr deal items
const flashDealItems: BundleItem[] = [
  {
    id: "flash-deal-wireless-charger",
    name: "15W MagSafe Wireless Charger",
    subtitle: "Fast charge · LED indicator",
    price: "₹699",
    numericPrice: 699,
    originalPrice: "₹1,999",
    icon: Zap,
    image: collectionRugged,
  },
  {
    id: "flash-deal-car-mount",
    name: "Magnetic Car Mount",
    subtitle: "360° rotation · Air vent",
    price: "₹499",
    numericPrice: 499,
    originalPrice: "₹1,499",
    icon: Smartphone,
    image: collectionAccessories,
  },
];

// Countdown hook
function useCountdown() {
  const getTarget = () => {
    const stored = localStorage.getItem("flash-deal-end");
    if (stored) {
      const end = parseInt(stored);
      if (end > Date.now()) return end;
    }
    const end = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("flash-deal-end", String(end));
    return end;
  };

  const [endTime] = useState(getTarget);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, endTime - Date.now());
      setTimeLeft(left);
      if (left <= 0) {
        localStorage.removeItem("flash-deal-end");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return { hours, minutes, seconds, isActive: timeLeft > 0 };
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"cart" | "recent">("cart");
  const [bundleIndex, setBundleIndex] = useState(0);
  const [expandedAction, setExpandedAction] = useState<"note" | "shipping" | "coupon" | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [shippingNote, setShippingNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [bundleExpanded, setBundleExpanded] = useState(true);
  const [flashExpanded, setFlashExpanded] = useState(true);
  const { items, totalItems, subtotal, updateQuantity, removeFromCart, addToCart, recentlyViewed, checkoutUrl, cartLoading } = useCart();
  const isMobile = useIsMobile();
  const countdown = useCountdown();
  const bundleSectionRef = useRef<HTMLDivElement | null>(null);
  const flashSectionRef = useRef<HTMLDivElement | null>(null);

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const productSavings = useMemo(
    () => items.reduce((sum, item) => {
      const numericPrice = parsePriceValue(item.price);
      const numericOriginal = item.originalPrice ? parsePriceValue(item.originalPrice) : numericPrice;
      return sum + Math.max(numericOriginal - numericPrice, 0) * item.quantity;
    }, 0),
    [items],
  );
  const finalTotal = subtotal;
  const compareAtTotal = subtotal + productSavings;

  // Smart bundle: detect device from cart items and suggest matching accessories
  // Filter by both ID and name to catch items added from different sources
  const bundleItems = useMemo(() => {
    const devices = items
      .map((item) => item.device || item.subtitle?.replace("For ", ""))
      .filter(Boolean);
    const uniqueDevice = devices[0];
    if (!uniqueDevice) return [];
    const accessories = getBundleAccessories(uniqueDevice);
    const cartIds = new Set(items.map((i) => i.id));
    const cartNames = new Set(items.map((i) => i.name.toLowerCase()));
    return accessories.filter((a) => !cartIds.has(a.id) && !cartNames.has(a.name.toLowerCase()));
  }, [items]);

  // Flash deal items also filtered
  const availableFlashDeals = useMemo(() => {
    const cartIds = new Set(items.map((i) => i.id));
    const cartNames = new Set(items.map((i) => i.name.toLowerCase()));
    return flashDealItems.filter((a) => !cartIds.has(a.id) && !cartNames.has(a.name.toLowerCase()));
  }, [items]);
  const hasBundleOffer = bundleItems.length > 0;
  const hasFlashOffer = countdown.isActive && availableFlashDeals.length > 0 && items.length > 0;

  // Reset bundleIndex when items change
  useEffect(() => {
    if (bundleIndex >= bundleItems.length) setBundleIndex(Math.max(0, bundleItems.length - 1));
  }, [bundleItems.length, bundleIndex]);

  const handleAddBundle = (bundle: BundleItem) => {
    addToCart({
      id: bundle.id,
      name: bundle.name,
      subtitle: bundle.subtitle,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
      image: bundle.image,
      color: "Default",
    });
  };

  const revealOfferSection = (section: "bundle" | "flash") => {
    if (section === "bundle") {
      setBundleExpanded(true);
      requestAnimationFrame(() => bundleSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }

    setFlashExpanded(true);
    requestAnimationFrame(() => flashSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const bundleSavings = bundleItems.reduce((sum, b) => {
    const orig = parseInt(b.originalPrice.replace(/[₹,]/g, "")) || 0;
    return sum + (orig - b.numericPrice);
  }, 0);

  const cartContent = (
    <>
      {/* Tabs */}
      <div className={`sticky top-0 z-10 flex items-center border-b border-border bg-background ${isMobile ? "gap-4 px-4 py-4" : "gap-6 px-6 py-5"}`}>
        <button onClick={() => setActiveTab("cart")} className={`relative font-display font-bold ${isMobile ? "text-xl" : "text-2xl"} ${activeTab === "cart" ? "text-foreground" : "text-muted-foreground/40"}`}>
          Cart
          {totalItems > 0 && <sup className="text-xs font-body ml-0.5">{totalItems}</sup>}
        </button>
        <button onClick={() => setActiveTab("recent")} className={`font-display font-bold italic ${isMobile ? "text-xl" : "text-2xl"} ${activeTab === "recent" ? "text-foreground" : "text-muted-foreground/40"}`}>
          Recently viewed
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-2">
        {activeTab === "cart" ? (
          items.length === 0 ? (
            <div className="px-6 mt-6">
              <h3 className="text-xl font-display font-semibold mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-5">Explore our top picks to get started</p>
              
              {/* Top product picks */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {topPicks.map((p) => {
                  const numPrice = parseInt(p.price.replace(/[₹,]/g, "")) || 0;
                  const numOrig = parseInt(p.originalPrice.replace(/[₹,]/g, "")) || 0;
                  const pct = numOrig > 0 ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;
                  return (
                    <Link key={p.id} to={p.href} onClick={onClose} className="group rounded-xl border border-border overflow-hidden hover:border-foreground/20 transition-colors">
                      <div className="relative aspect-square bg-muted">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-3" />
                        {pct > 0 && (
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">
                            -{pct}%
                          </span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold leading-tight truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.subtitle}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold">{p.price}</span>
                          {numOrig > numPrice && <span className="text-[10px] text-muted-foreground line-through">{p.originalPrice}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Collection quick links */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Browse Collections</p>
              <div className="space-y-2">
                {collectionLinks.map((c) => (
                  <Link key={c.name} to={c.href} onClick={onClose} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted transition-colors group">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-8 h-8 rounded-md object-cover" />
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className={isMobile ? "px-4" : "px-6"}>
              {/* Free shipping progress */}
              <div className={isMobile ? "py-3" : "py-4"}>
                <p className={`${isMobile ? "text-[13px]" : "text-sm"} mb-2`}>
                  {remaining > 0 ? (
                    <>Spend <span className="font-bold">₹{remaining.toLocaleString("en-IN")}</span> more to reach free shipping!</>
                  ) : (
                    <span className="font-bold text-accent">🎉 You've unlocked free shipping!</span>
                  )}
                </p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                {(hasBundleOffer || hasFlashOffer) && (
                  <div className="flex gap-2 overflow-x-auto pt-3">
                    {hasBundleOffer && (
                      <button
                        onClick={() => revealOfferSection("bundle")}
                        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/80"
                      >
                        <Zap className="h-3.5 w-3.5 text-accent" />
                        Bundle deals · Save ₹{bundleSavings.toLocaleString("en-IN")}
                      </button>
                    )}
                    {hasFlashOffer && (
                      <button
                        onClick={() => revealOfferSection("flash")}
                        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/80"
                      >
                        <Timer className="h-3.5 w-3.5 text-destructive" />
                        Flash offer · {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Cart items with MRP display */}
              <div className={`py-2 ${isMobile ? "space-y-3.5" : "space-y-4"}`}>
                {items.map((item) => {
                  const numericPrice = parsePriceValue(item.price);
                  const numericOriginal = item.originalPrice ? parsePriceValue(item.originalPrice) : 0;
                  const discountPct = numericOriginal > 0 ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100) : 0;

                  return (
                    <div key={`${item.id}-${item.color}`} className={`flex ${isMobile ? "gap-3" : "gap-4"}`}>
                      <Link to={`/product/${item.id}`} onClick={onClose} className={`${isMobile ? "w-20 h-20" : "w-24 h-24"} rounded-lg bg-muted flex-shrink-0 overflow-hidden`}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 pr-3">
                            <h4 className={`${isMobile ? "text-[15px]" : "text-base"} font-bold leading-tight`}>{item.name}</h4>
                            <p className={`${isMobile ? "text-[13px]" : "text-sm"} text-muted-foreground`}>{item.color}</p>
                            <div className={`mt-1 flex flex-wrap items-center ${isMobile ? "gap-1.5" : "gap-2"}`}>
                              <span className={`${isMobile ? "text-[15px]" : "text-base"} font-bold`}>{item.price}</span>
                              {numericOriginal > numericPrice && (
                                <>
                                  <span className={`${isMobile ? "text-[11px]" : "text-xs"} text-muted-foreground line-through`}>MRP {item.originalPrice}</span>
                                  <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
                                    {discountPct}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className={`${isMobile ? "h-10 w-11 text-[15px]" : "h-10 w-12 text-sm"} border border-border rounded-lg flex items-center justify-center font-semibold`}>
                            {item.quantity}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)} className={`${isMobile ? "h-8 w-8" : "h-7 w-7"} rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors`}>
                              <Minus className="w-3 h-3" />
                            </button>
                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)} className={`${isMobile ? "h-8 w-8" : "h-7 w-7"} rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors`}>
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.color)} className={`${isMobile ? "text-[13px]" : "text-sm"} font-medium underline underline-offset-2 text-foreground hover:text-accent transition-colors`}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bundle Deal */}
              {hasBundleOffer && (
                <div ref={bundleSectionRef} className="mt-3 border-t border-border py-4">
                  <button
                    onClick={() => setBundleExpanded((prev) => !prev)}
                    className="w-full rounded-2xl bg-foreground px-3.5 py-3 text-left text-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background/10">
                        <Zap className="h-4 w-4 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-display font-bold">Bundle Deal</h4>
                            <p className="text-[11px] text-background/70">Add matching accessories with your case</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-display font-bold text-accent">Save ₹{bundleSavings.toLocaleString("en-IN")}</p>
                            <p className="text-[10px] text-background/60">{bundleItems.length} offer{bundleItems.length > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-background/70">
                          <span className="inline-flex items-center gap-1.5"><Users className="w-3 h-3" /><strong className="text-background">23 people</strong> added today</span>
                          <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" />Limited time</span>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${bundleExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {bundleExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3">
                          {bundleItems.length > 1 && (
                            <div className="mb-3 flex items-center gap-2">
                              <button
                                onClick={() => setBundleIndex(Math.max(0, bundleIndex - 1))}
                                className={`h-7 w-7 rounded-full border border-border flex items-center justify-center transition-colors ${bundleIndex === 0 ? "text-muted-foreground/30" : "hover:bg-muted"}`}
                                disabled={bundleIndex === 0}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                              <div className="flex flex-1 justify-center gap-1">
                                {bundleItems.map((_, idx) => (
                                  <button key={idx} onClick={() => setBundleIndex(idx)} className={`h-2 w-2 rounded-full transition-all ${idx === bundleIndex ? "bg-foreground w-4" : "bg-muted-foreground/30"}`} />
                                ))}
                              </div>
                              <button
                                onClick={() => setBundleIndex(Math.min(bundleItems.length - 1, bundleIndex + 1))}
                                className={`h-7 w-7 rounded-full border border-border flex items-center justify-center transition-colors ${bundleIndex >= bundleItems.length - 1 ? "text-muted-foreground/30" : "hover:bg-muted"}`}
                                disabled={bundleIndex >= bundleItems.length - 1}
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={bundleIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden rounded-xl border border-border"
                            >
                              <div className="flex items-center gap-3 p-3">
                                <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                  {(() => {
                                    const Icon = bundleItems[bundleIndex].icon;
                                    return <Icon className="w-7 h-7 text-muted-foreground" />;
                                  })()}
                                  {(() => {
                                    const orig = parsePriceValue(bundleItems[bundleIndex].originalPrice);
                                    const curr = bundleItems[bundleIndex].numericPrice;
                                    const pct = Math.round(((orig - curr) / orig) * 100);
                                    return (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute left-1 top-1 rounded bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground"
                                      >
                                        -{pct}%
                                      </motion.span>
                                    );
                                  })()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-sm font-bold leading-tight">{bundleItems[bundleIndex].name}</h5>
                                  <p className="mt-0.5 text-[11px] text-muted-foreground">{bundleItems[bundleIndex].subtitle}</p>
                                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <span className="text-base font-bold">{bundleItems[bundleIndex].price}</span>
                                    <span className="text-xs text-muted-foreground line-through">{bundleItems[bundleIndex].originalPrice}</span>
                                  </div>
                                </div>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleAddBundle(bundleItems[bundleIndex])}
                                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>
                              <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5">
                                <Flame className="w-3 h-3 text-accent" />
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">Bundle exclusive — not sold separately at this price</span>
                              </div>
                            </motion.div>
                          </AnimatePresence>

                          {bundleItems.length > 1 && (
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => bundleItems.forEach((b) => handleAddBundle(b))}
                              className="relative mt-3 w-full overflow-hidden rounded-xl bg-foreground py-3 text-sm font-bold text-background"
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent"
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              />
                              <span className="relative flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" />
                                Add all {bundleItems.length} for ₹{bundleItems.reduce((sum, item) => sum + item.numericPrice, 0).toLocaleString("en-IN")}
                                <span className="ml-1 text-xs font-normal opacity-70 line-through">
                                  ₹{bundleItems.reduce((sum, item) => sum + parsePriceValue(item.originalPrice), 0).toLocaleString("en-IN")}
                                </span>
                              </span>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 24hr Flash Deal with Countdown Timer */}
              {hasFlashOffer && (
                <div ref={flashSectionRef} className="border-t border-border py-4">
                  <button
                    onClick={() => setFlashExpanded((prev) => !prev)}
                    className="w-full rounded-2xl border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                        <Timer className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-display font-bold">Flash Sale</h4>
                            <p className="text-[11px] text-muted-foreground">Live accessory offers ending soon</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-display font-bold">{String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:{String(countdown.seconds).padStart(2, "0")}</p>
                            <p className="text-[10px] text-muted-foreground">{availableFlashDeals.length} deal{availableFlashDeals.length > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /><strong className="text-foreground">47 people</strong> viewing now</span>
                          <span className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" />Ends today</span>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${flashExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {flashExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2.5 pt-3">
                          {availableFlashDeals.map((deal) => {
                            const orig = parsePriceValue(deal.originalPrice);
                            const pct = Math.round(((orig - deal.numericPrice) / orig) * 100);

                            return (
                              <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5"
                              >
                                <div className="flex items-center gap-3 p-3">
                                  <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                    {(() => {
                                      const Icon = deal.icon;
                                      return <Icon className="w-7 h-7 text-muted-foreground" />;
                                    })()}
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute left-1 top-1 rounded bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground"
                                    >
                                      -{pct}%
                                    </motion.span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-sm font-bold leading-tight">{deal.name}</h5>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{deal.subtitle}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                      <span className="text-base font-bold">{deal.price}</span>
                                      <span className="text-xs text-muted-foreground line-through">{deal.originalPrice}</span>
                                      <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[9px] font-bold text-success">
                                        SAVE ₹{(orig - deal.numericPrice).toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  </div>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAddBundle(deal)}
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/90"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="px-6 mt-4">
            {recentlyViewed.length === 0 ? (
              <div className="text-center mt-8">
                <Eye className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No recently viewed items yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Products you view will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentlyViewed.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={onClose}
                    className="flex gap-3 items-center p-2 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
        <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        {/* Action tabs */}
          <div className={`grid grid-cols-3 border-b border-border ${isMobile ? "gap-1.5 px-3 py-2" : "gap-2 px-4 py-2"}`}>
          <button
            onClick={() => setExpandedAction(expandedAction === "note" ? null : "note")}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-medium transition-colors ${isMobile ? "text-[11px]" : "text-xs"} ${expandedAction === "note" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Note
          </button>
          <button
            onClick={() => setExpandedAction(expandedAction === "shipping" ? null : "shipping")}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-medium transition-colors ${isMobile ? "text-[11px]" : "text-xs"} ${expandedAction === "shipping" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"}`}
          >
            <Package className="w-3.5 h-3.5" />
            Shipping
          </button>
          <button
            onClick={() => setExpandedAction(expandedAction === "coupon" ? null : "coupon")}
              className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-medium transition-colors ${isMobile ? "text-[11px]" : "text-xs"} ${appliedCoupon ? "bg-accent/10 text-accent" : expandedAction === "coupon" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"}`}
          >
            <Tag className="w-3.5 h-3.5" />
              <span className="truncate">{appliedCoupon ? "Saved" : "Coupon"}</span>
          </button>
        </div>

        {/* Expandable action area */}
        <AnimatePresence>
          {expandedAction && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border"
            >
              <div className={isMobile ? "px-3 py-2.5" : "px-4 py-2.5"}>
                {expandedAction === "note" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Add a note to your order..."
                      className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none placeholder:text-muted-foreground border border-border focus:border-foreground transition-colors"
                    />
                    <button
                      onClick={() => setExpandedAction(null)}
                      className="text-xs font-semibold bg-foreground text-background px-3 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                )}
                {expandedAction === "shipping" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shippingNote}
                      onChange={(e) => setShippingNote(e.target.value)}
                      placeholder="Shipping instructions..."
                      className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none placeholder:text-muted-foreground border border-border focus:border-foreground transition-colors"
                    />
                    <button
                      onClick={() => setExpandedAction(null)}
                      className="text-xs font-semibold bg-foreground text-background px-3 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                )}
                {expandedAction === "coupon" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code for checkout"
                      className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none placeholder:text-muted-foreground border border-border focus:border-foreground transition-colors font-mono tracking-wider uppercase"
                    />
                    <button
                      onClick={() => {
                        if (couponCode.trim()) {
                          setAppliedCoupon(couponCode.trim());
                          setCouponCode("");
                          setExpandedAction(null);
                        }
                      }}
                      disabled={!couponCode.trim()}
                      className="text-xs font-semibold bg-foreground text-background px-3 py-2 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-40"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applied coupon badge */}
        {appliedCoupon && expandedAction !== "coupon" && (
          <div className="flex items-center justify-between border-b border-border bg-accent/5 px-4 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <Tag className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
              <span className="text-xs font-semibold text-accent truncate">Coupon "{appliedCoupon}" saved for checkout</span>
            </div>
            <button
              onClick={() => setAppliedCoupon("")}
              className="text-[10px] font-medium text-destructive underline underline-offset-2 flex-shrink-0"
            >
              Remove
            </button>
          </div>
        )}

        {/* Total Savings */}
        {productSavings > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-success" />
              <span className="text-sm font-medium">Product Savings</span>
            </div>
            <span className="text-sm font-bold text-success">-₹{productSavings.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Subtotal & checkout */}
        <div className={isMobile ? "px-3 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+0.9rem)]" : "px-4 pt-3 pb-4"}>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div className="min-w-0 max-w-[58%]">
              <p className="text-[11px] leading-snug text-muted-foreground">Taxes included. Shipping and coupons are finalized on Shopify checkout.</p>
              {appliedCoupon && (
                <p className="mt-1 text-[11px] leading-snug text-accent">Coupon "{appliedCoupon}" will be verified at checkout.</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="text-lg font-display font-bold">₹{finalTotal.toLocaleString("en-IN")}</p>
              {productSavings > 0 && (
                <p className="text-[11px] text-muted-foreground line-through">MRP ₹{compareAtTotal.toLocaleString("en-IN")}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (items.length === 0 || cartLoading) return;
              if (!checkoutUrl) return;
              window.open(checkoutUrl, "_blank", "noopener,noreferrer");
              onClose();
            }}
            disabled={items.length === 0 || cartLoading || !checkoutUrl}
            className={`flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-[15px] font-medium text-background transition-colors hover:bg-foreground/90 ${items.length === 0 || !checkoutUrl ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {cartLoading ? "Syncing…" : "Check out"}
          </button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div key="cart-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]">
            <motion.div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
            <motion.div
              className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl h-[min(92dvh,760px)] flex flex-col will-change-transform"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={drawerSpring}
            >
              {/* Drag handle + close */}
              <div className="flex justify-center pt-2.5 pb-0.5">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex justify-center py-1.5">
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {cartContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="cart-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
          <motion.div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background flex flex-col will-change-transform" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={drawerSpring}>
            {cartContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
