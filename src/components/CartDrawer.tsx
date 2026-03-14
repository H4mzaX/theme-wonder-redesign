import { X, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight, FileText, Package, Tag, Shield, Camera, Smartphone, Zap, Clock, Users, Flame, Timer, Sparkles, Eye, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { drawerSpring } from "@/lib/motion";
import { useShopifyCartStore, type ShopifyCartItem } from "@/stores/cartStore";
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

const collectionLinks = [
  { name: "iPhone Cases", image: collectionCases, href: "/collections/iphone-cases" },
  { name: "Samsung Cases", image: collectionProtectors, href: "/collections/samsung-cases" },
  { name: "OnePlus Cases", image: collectionRugged, href: "/collections/oneplus-cases" },
  { name: "All Accessories", image: collectionAccessories, href: "/collections/magsafe-cases" },
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
  const [expandedAction, setExpandedAction] = useState<"note" | "shipping" | "coupon" | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [shippingNote, setShippingNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const items = useShopifyCartStore((s) => s.items);
  const isLoading = useShopifyCartStore((s) => s.isLoading);
  const isSyncing = useShopifyCartStore((s) => s.isSyncing);
  const updateQuantity = useShopifyCartStore((s) => s.updateQuantity);
  const removeItem = useShopifyCartStore((s) => s.removeItem);
  const getCheckoutUrl = useShopifyCartStore((s) => s.getCheckoutUrl);
  const syncCart = useShopifyCartStore((s) => s.syncCart);

  const isMobile = useIsMobile();
  const countdown = useCountdown();

  // Sync Shopify cart when drawer opens
  useEffect(() => { if (open) syncCart(); }, [open, syncCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  // Calculate savings from compareAtPrice
  const totalSavings = useMemo(() => {
    return items.reduce((sum, item) => {
      const compareAt = (item as any).compareAtPrice;
      if (compareAt) {
        const orig = parseFloat(compareAt.amount);
        const curr = parseFloat(item.price.amount);
        if (orig > curr) return sum + (orig - curr) * item.quantity;
      }
      return sum;
    }, 0);
  }, [items]);

  const currencySymbol = items[0]?.price.currencyCode === "INR" ? "₹" : (items[0]?.price.currencyCode || "₹") + " ";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      onClose();
    }
  };

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
            <div className="px-6 mt-6">
              <h3 className="text-xl font-display font-semibold mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-5">Explore our collections to get started</p>

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
            <div className="px-6">
              {/* Free shipping progress */}
              <div className="py-4">
                <p className="text-sm mb-2">
                  {remaining > 0 ? (
                    <>Spend <span className="font-bold">{currencySymbol}{remaining.toLocaleString("en-IN")}</span> more to reach free shipping!</>
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

              {/* Cart items */}
              <div className="space-y-4 py-2">
                {items.map((item) => {
                  const price = parseFloat(item.price.amount);
                  const compareAt = (item as any).compareAtPrice;
                  const originalPrice = compareAt ? parseFloat(compareAt.amount) : 0;
                  const discountPct = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                  const image = item.product.node.images?.edges?.[0]?.node;

                  return (
                    <div key={item.variantId} className="flex gap-4">
                      <Link to={`/shop/${item.product.node.handle}`} onClick={onClose} className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {image && (
                          <img src={image.url} alt={item.product.node.title} className="w-full h-full object-contain p-2" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-bold">{item.product.node.title}</h4>
                            {item.variantTitle && item.variantTitle !== "Default Title" && (
                              <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-base font-bold">{currencySymbol}{price.toLocaleString("en-IN")}</span>
                              {originalPrice > price && (
                                <>
                                  <span className="text-xs text-muted-foreground line-through">MRP {currencySymbol}{originalPrice.toLocaleString("en-IN")}</span>
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
                            <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.variantId)} className="text-sm font-medium underline underline-offset-2 text-foreground hover:text-accent transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="px-6 mt-4">
            <div className="text-center mt-8">
              <Eye className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recently viewed items yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Products you view will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border">
        {/* Action tabs */}
        <div className="flex items-center justify-around py-3 border-b border-border">
          <button
            onClick={() => setExpandedAction(expandedAction === "note" ? null : "note")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${expandedAction === "note" ? "text-accent" : "text-foreground"}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Note
          </button>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => setExpandedAction(expandedAction === "shipping" ? null : "shipping")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${expandedAction === "shipping" ? "text-accent" : "text-foreground"}`}
          >
            <Package className="w-3.5 h-3.5" />
            Shipping
          </button>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={() => setExpandedAction(expandedAction === "coupon" ? null : "coupon")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${appliedCoupon ? "text-green-600" : expandedAction === "coupon" ? "text-accent" : "text-foreground"}`}
          >
            <Tag className="w-3.5 h-3.5" />
            {appliedCoupon ? `"${appliedCoupon}"` : "Apply Coupon"}
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
              <div className="px-6 py-3">
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
                      placeholder="Shipping instructions (e.g. leave at door)..."
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
                      placeholder="Enter coupon code"
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
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applied coupon badge */}
        {appliedCoupon && expandedAction !== "coupon" && (
          <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-green-500/5">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-600">Coupon "{appliedCoupon}" applied</span>
            </div>
            <button
              onClick={() => setAppliedCoupon("")}
              className="text-[10px] font-medium text-destructive underline underline-offset-2"
            >
              Remove
            </button>
          </div>
        )}

        {/* Total Savings */}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              <span className="text-sm font-medium">Total Savings</span>
            </div>
            <span className="text-sm font-bold text-green-600">-{currencySymbol}{totalSavings.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Subtotal & checkout */}
        <div className="px-6 py-4">
          <div className="flex items-end justify-between mb-3">
            <p className="text-xs text-muted-foreground max-w-[55%]">Taxes included and shipping calculated at checkout.</p>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-xl font-display font-bold">
                {currencySymbol}{subtotal.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || isLoading || isSyncing}
            className="w-full bg-foreground text-background py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSyncing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Check out"
            )}
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
              className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl h-[min(85dvh,720px)] flex flex-col will-change-transform"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={drawerSpring}
            >
              {/* Drag handle + close */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex justify-center py-2">
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
