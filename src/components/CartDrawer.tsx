import { X, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight, FileText, Package, Tag, Shield, Camera, Smartphone, Zap, Clock, Users, Flame, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import collectionCases from "@/assets/collection-headphones.jpg";
import collectionProtectors from "@/assets/collection-earphones.jpg";
import collectionRugged from "@/assets/collection-speakers.jpg";
import collectionAccessories from "@/assets/collection-accessories.jpg";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1000;

const emptySuggestions = [
  { name: "iPhone Cases", image: collectionCases, href: "#" },
  { name: "Screen Protectors", image: collectionProtectors, href: "#" },
  { name: "Rugged Cases", image: collectionRugged, href: "#" },
  { name: "Accessories", image: collectionAccessories, href: "#" },
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
  const { items, totalItems, subtotal, updateQuantity, removeFromCart, addToCart } = useCart();
  const isMobile = useIsMobile();
  const countdown = useCountdown();

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  const discount = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - discount;

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

  const bundleSavings = bundleItems.reduce((sum, b) => {
    const orig = parseInt(b.originalPrice.replace(/[₹,]/g, "")) || 0;
    return sum + (orig - b.numericPrice);
  }, 0);

  const cartContent = (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 py-5 border-b border-border">
        <button onClick={() => setActiveTab("cart")} className={`text-2xl font-display font-bold relative ${activeTab === "cart" ? "text-foreground" : "text-muted-foreground/40"}`}>
          Cart
          {totalItems > 0 && <sup className="text-xs font-body ml-0.5">{totalItems}</sup>}
        </button>
        <button onClick={() => setActiveTab("recent")} className={`text-2xl font-display font-bold italic ${activeTab === "recent" ? "text-foreground" : "text-muted-foreground/40"}`}>
          Recently viewed
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "cart" ? (
          items.length === 0 ? (
            <div className="text-center max-w-sm mx-auto mt-12 px-6">
              <h3 className="text-2xl font-display font-semibold mb-3">Your cart is currently empty.</h3>
              <p className="text-sm text-muted-foreground mb-8">Not sure where to start?<br />Try these collections:</p>
              <ul className="space-y-3 text-left">
                {emptySuggestions.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-card transition-colors group">
                      <div className="flex items-center gap-3">
                        <img src={s.image} alt={s.name} className="w-9 h-9 rounded-md object-cover" />
                        <span className="font-medium text-sm">{s.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-6">
              {/* Free shipping progress */}
              <div className="py-4">
                <p className="text-sm mb-2">
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
              </div>

              {/* Cart items with MRP display */}
              <div className="space-y-4 py-2">
                {items.map((item) => {
                  const numericPrice = parseInt(item.price.replace(/[₹,]/g, "")) || 0;
                  const numericOriginal = item.originalPrice ? parseInt(item.originalPrice.replace(/[₹,]/g, "")) || 0 : 0;
                  const discountPct = numericOriginal > 0 ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100) : 0;

                  return (
                    <div key={`${item.id}-${item.color}`} className="flex gap-4">
                      <Link to={`/product/${item.id}`} onClick={onClose} className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-bold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.color}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-base font-bold">{item.price}</span>
                              {numericOriginal > numericPrice && (
                                <>
                                  <span className="text-xs text-muted-foreground line-through">MRP ₹{numericOriginal.toLocaleString("en-IN")}</span>
                                  <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
                                    {discountPct}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w-12 h-10 border border-border rounded-lg flex items-center justify-center text-sm font-semibold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.color)} className="text-sm font-medium underline underline-offset-2 text-foreground hover:text-accent transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bundle Deal — Flash Section */}
              {bundleItems.length > 0 && (
                <div className="py-5 border-t border-border mt-4">
                  {/* Flash header with animated shimmer */}
                  <div className="relative bg-foreground text-background rounded-xl p-4 mb-4 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                        <div>
                          <h4 className="text-base font-display font-bold">Bundle Deal</h4>
                          <p className="text-[11px] text-background/60">Only with your case purchase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-display font-bold text-yellow-400">
                          Save ₹{bundleSavings.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    {/* Social proof + urgency */}
                    <div className="relative flex items-center gap-4 mt-3 pt-3 border-t border-background/10">
                      <div className="flex items-center gap-1.5 text-[11px] text-background/70">
                        <Users className="w-3 h-3" />
                        <span><strong className="text-background">23 people</strong> added this today</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-background/70">
                        <Clock className="w-3 h-3" />
                        <span>Limited time</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation dots */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setBundleIndex(Math.max(0, bundleIndex - 1))}
                      className={`w-7 h-7 rounded-full border border-border flex items-center justify-center transition-colors ${bundleIndex === 0 ? "text-muted-foreground/30" : "hover:bg-muted"}`}
                      disabled={bundleIndex === 0}
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <div className="flex-1 flex gap-1 justify-center">
                      {bundleItems.map((_, idx) => (
                        <button key={idx} onClick={() => setBundleIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === bundleIndex ? "bg-foreground w-4" : "bg-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <button
                      onClick={() => setBundleIndex(Math.min(bundleItems.length - 1, bundleIndex + 1))}
                      className={`w-7 h-7 rounded-full border border-border flex items-center justify-center transition-colors ${bundleIndex >= bundleItems.length - 1 ? "text-muted-foreground/30" : "hover:bg-muted"}`}
                      disabled={bundleIndex >= bundleItems.length - 1}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bundle card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={bundleIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="relative rounded-xl border border-border overflow-hidden"
                    >
                      <div className="flex gap-3 items-center p-3">
                        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                          {(() => {
                            const Icon = bundleItems[bundleIndex].icon;
                            return <Icon className="w-8 h-8 text-muted-foreground" />;
                          })()}
                          {(() => {
                            const orig = parseInt(bundleItems[bundleIndex].originalPrice.replace(/[₹,]/g, "")) || 0;
                            const curr = bundleItems[bundleIndex].numericPrice;
                            const pct = Math.round(((orig - curr) / orig) * 100);
                            return (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-0.5 left-0.5 text-[9px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded"
                              >
                                -{pct}%
                              </motion.span>
                            );
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold leading-tight">{bundleItems[bundleIndex].name}</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">{bundleItems[bundleIndex].subtitle}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-base font-bold">{bundleItems[bundleIndex].price}</span>
                            <span className="text-xs text-muted-foreground line-through">{bundleItems[bundleIndex].originalPrice}</span>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddBundle(bundleItems[bundleIndex])}
                          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors flex-shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <div className="bg-accent/10 px-3 py-1.5 flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wide">Bundle exclusive — not sold separately at this price</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Add all CTA */}
                  {bundleItems.length > 1 && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => bundleItems.forEach((b) => handleAddBundle(b))}
                      className="relative w-full mt-3 py-3 bg-foreground text-background rounded-xl text-sm font-bold overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        Add all {bundleItems.length} for ₹{bundleItems.reduce((s, b) => s + b.numericPrice, 0).toLocaleString("en-IN")}
                        <span className="text-xs font-normal opacity-70 ml-1 line-through">
                          ₹{bundleItems.reduce((s, b) => s + (parseInt(b.originalPrice.replace(/[₹,]/g, "")) || 0), 0).toLocaleString("en-IN")}
                        </span>
                      </span>
                    </motion.button>
                  )}
                </div>
              )}

              {/* 24hr Flash Deal with Countdown Timer */}
              {countdown.isActive && availableFlashDeals.length > 0 && items.length > 0 && (
                <div className="py-5 border-t border-border">
                  {/* Timer header */}
                  <div className="relative rounded-xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, hsl(0 72% 50%), hsl(25 95% 53%))" }}>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Timer className="w-5 h-5 text-white" />
                          </motion.div>
                          <div>
                            <h4 className="text-base font-display font-bold text-white">Flash Sale</h4>
                            <p className="text-[11px] text-white/70">Ends soon — don't miss out!</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[
                            { val: String(countdown.hours).padStart(2, "0"), label: "HRS" },
                            { val: String(countdown.minutes).padStart(2, "0"), label: "MIN" },
                            { val: String(countdown.seconds).padStart(2, "0"), label: "SEC" },
                          ].map((t, i) => (
                            <div key={t.label} className="flex items-center gap-1">
                              <div className="bg-black/30 backdrop-blur-sm rounded-md px-2 py-1 text-center min-w-[36px]">
                                <motion.span
                                  key={t.val}
                                  initial={{ y: -8, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  className="text-sm font-mono font-bold text-white block"
                                >
                                  {t.val}
                                </motion.span>
                                <span className="text-[7px] text-white/60 font-semibold">{t.label}</span>
                              </div>
                              {i < 2 && <span className="text-white/50 font-bold text-xs">:</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/15">
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-green-400"
                        />
                        <span className="text-[11px] text-white/80"><strong className="text-white">47 people</strong> viewing this deal</span>
                      </div>
                    </div>
                  </div>

                  {/* Flash deal items */}
                  <div className="space-y-3">
                    {availableFlashDeals.map((deal) => {
                      const orig = parseInt(deal.originalPrice.replace(/[₹,]/g, "")) || 0;
                      const pct = Math.round(((orig - deal.numericPrice) / orig) * 100);
                      return (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative rounded-xl border border-destructive/30 overflow-hidden bg-destructive/5"
                        >
                          <div className="flex gap-3 items-center p-3">
                            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center relative">
                              {(() => { const Icon = deal.icon; return <Icon className="w-7 h-7 text-muted-foreground" />; })()}
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -left-1 text-[9px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded"
                              >
                                -{pct}%
                              </motion.span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-bold leading-tight">{deal.name}</h5>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{deal.subtitle}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-base font-bold">{deal.price}</span>
                                <span className="text-xs text-muted-foreground line-through">{deal.originalPrice}</span>
                                <span className="text-[9px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
                                  SAVE ₹{(orig - deal.numericPrice).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddBundle(deal)}
                              className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors flex-shrink-0"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center mt-12 px-6">
            <p className="text-muted-foreground">No recently viewed items</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border">
        {/* Action tabs */}
        <div className="flex items-center justify-around py-3 border-b border-border">
          <button className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="w-4 h-4" />
            Order note
          </button>
          <div className="w-px h-5 bg-border" />
          <button className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package className="w-4 h-4" />
            Shipping
          </button>
          <div className="w-px h-5 bg-border" />
          <button className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Tag className="w-4 h-4" />
            Discount
          </button>
        </div>

        {/* Discount row */}
        {discount > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">Order discount</span>
            </div>
            <span className="text-sm font-bold text-destructive bg-destructive/10 px-3 py-1 rounded-full">-₹{discount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Subtotal & checkout */}
        <div className="px-6 py-4">
          <div className="flex items-end justify-between mb-3">
            <p className="text-xs text-muted-foreground max-w-[55%]">Taxes included and shipping calculated at checkout.</p>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-xl font-display font-bold">₹{finalTotal.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <button disabled={items.length === 0} className="w-full bg-foreground text-background py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Check out
          </button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 bg-foreground/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.div
              className="fixed inset-x-0 bottom-0 bg-background z-50 rounded-t-2xl max-h-[92vh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              {cartContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-foreground/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background z-50 flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            {cartContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
