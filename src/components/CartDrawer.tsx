import { X, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight, FileText, Package, Tag, Shield, Camera, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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
    price: "₹399",
    numericPrice: 399,
    originalPrice: "₹799",
    icon: Shield,
    image: collectionProtectors,
  },
  {
    id: `${device.replace(/\s+/g, "-").toLowerCase()}-camera-lens`,
    name: "Camera Lens Protector",
    subtitle: `For ${device}`,
    price: "₹299",
    numericPrice: 299,
    originalPrice: "₹599",
    icon: Camera,
    image: collectionAccessories,
  },
  {
    id: `${device.replace(/\s+/g, "-").toLowerCase()}-charging-cable`,
    name: "Fast Charging Cable",
    subtitle: "Type-C · 1.5m",
    price: "₹499",
    numericPrice: 499,
    originalPrice: "₹999",
    icon: Smartphone,
    image: collectionRugged,
  },
];

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"cart" | "recent">("cart");
  const [bundleIndex, setBundleIndex] = useState(0);
  const { items, totalItems, subtotal, updateQuantity, removeFromCart, addToCart } = useCart();
  const isMobile = useIsMobile();

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  const discount = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - discount;

  // Smart bundle: detect device from cart items and suggest matching accessories
  const bundleItems = useMemo(() => {
    const devices = items
      .map((item) => item.device || item.subtitle?.replace("For ", ""))
      .filter(Boolean);
    const uniqueDevice = devices[0];
    if (!uniqueDevice) return [];
    const accessories = getBundleAccessories(uniqueDevice);
    // Filter out items already in cart
    const cartIds = new Set(items.map((i) => i.id));
    return accessories.filter((a) => !cartIds.has(a.id));
  }, [items]);

  const handleAddBundle = (bundle: BundleItem) => {
    addToCart({
      id: bundle.id,
      name: bundle.name,
      subtitle: bundle.subtitle,
      price: bundle.price,
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

              {/* Cart items */}
              <div className="space-y-4 py-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex gap-4">
                    <Link to={`/product/${item.id}`} onClick={onClose} className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.color}</p>
                          <p className="text-base font-bold mt-1">{item.price}</p>
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
                ))}
              </div>

              {/* Bundle & Save */}
              {bundleItems.length > 0 && (
                <div className="py-6 border-t border-border mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-lg font-display font-bold">Bundle & Save</h4>
                    {bundleSavings > 0 && (
                      <span className="text-xs font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                        Save ₹{bundleSavings.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Complete your protection — accessories matched to your device</p>

                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setBundleIndex(Math.max(0, bundleIndex - 1))}
                      className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-colors ${bundleIndex === 0 ? "text-muted-foreground/30" : "hover:bg-muted"}`}
                      disabled={bundleIndex === 0}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1 flex gap-1 justify-center">
                      {bundleItems.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === bundleIndex ? "bg-foreground" : "bg-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <button
                      onClick={() => setBundleIndex(Math.min(bundleItems.length - 1, bundleIndex + 1))}
                      className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-colors ${bundleIndex >= bundleItems.length - 1 ? "text-muted-foreground/30" : "hover:bg-muted"}`}
                      disabled={bundleIndex >= bundleItems.length - 1}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={bundleIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 items-center bg-card rounded-xl p-3"
                    >
                      <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {(() => {
                          const Icon = bundleItems[bundleIndex].icon;
                          return <Icon className="w-8 h-8 text-muted-foreground" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold leading-tight">{bundleItems[bundleIndex].name}</h5>
                        <p className="text-xs text-muted-foreground mt-0.5">{bundleItems[bundleIndex].subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold">{bundleItems[bundleIndex].price}</span>
                          <span className="text-xs text-muted-foreground line-through">{bundleItems[bundleIndex].originalPrice}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddBundle(bundleItems[bundleIndex])}
                        className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors flex-shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </AnimatePresence>

                  {bundleItems.length > 1 && (
                    <button
                      onClick={() => bundleItems.forEach((b) => handleAddBundle(b))}
                      className="w-full mt-3 py-2.5 border-2 border-dashed border-border rounded-xl text-sm font-semibold hover:bg-card transition-colors"
                    >
                      Add all {bundleItems.length} accessories — Save ₹{bundleSavings.toLocaleString("en-IN")}
                    </button>
                  )}
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
