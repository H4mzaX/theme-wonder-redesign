import { X, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import collectionCases from "@/assets/collection-headphones.jpg";
import collectionProtectors from "@/assets/collection-earphones.jpg";
import collectionRugged from "@/assets/collection-speakers.jpg";
import collectionAccessories from "@/assets/collection-accessories.jpg";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const emptySuggestions = [
  { name: "iPhone Cases", image: collectionCases, href: "#" },
  { name: "Screen Protectors", image: collectionProtectors, href: "#" },
  { name: "Rugged Cases", image: collectionRugged, href: "#" },
  { name: "Accessories", image: collectionAccessories, href: "#" },
];

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const [activeTab, setActiveTab] = useState<"cart" | "recent">("cart");
  const { items, totalItems, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-foreground/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background z-50 flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex gap-8">
                <button onClick={() => setActiveTab("cart")} className={`text-2xl font-display font-semibold relative ${activeTab === "cart" ? "text-foreground" : "text-muted-foreground"}`}>
                  Cart
                  {totalItems > 0 && <span className="absolute -top-1 -right-5 text-xs font-body font-bold bg-accent text-accent-foreground w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>}
                </button>
                <button onClick={() => setActiveTab("recent")} className={`text-2xl font-display font-semibold ${activeTab === "recent" ? "text-foreground" : "text-muted-foreground"}`}>
                  Recently viewed
                </button>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "cart" ? (
                items.length === 0 ? (
                  <div className="text-center max-w-sm mx-auto mt-12">
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
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.color}`} className="flex gap-4 border border-border rounded-xl p-3">
                        <Link to={`/product/${item.id}`} onClick={onClose} className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                          <p className="text-[11px] text-muted-foreground">{item.subtitle} · {item.color}</p>
                          <p className="text-sm font-bold mt-1">{item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                              <Plus className="w-3 h-3" />
                            </button>
                            <button onClick={() => removeFromCart(item.id, item.color)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center mt-12">
                  <p className="text-muted-foreground">No recently viewed items</p>
                </div>
              )}
            </div>
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-display font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Taxes included and shipping calculated at checkout.</p>
              <button disabled={items.length === 0} className="w-full bg-foreground text-background py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Check out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
