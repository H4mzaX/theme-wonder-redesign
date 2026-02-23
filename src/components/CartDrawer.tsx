import { X, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-foreground/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header with tabs */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`text-2xl font-display font-semibold relative ${
                    activeTab === "cart" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Cart
                  <span className="absolute -top-1 -right-4 text-xs font-body font-medium">0</span>
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`text-2xl font-display font-semibold ${
                    activeTab === "recent" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Recently viewed
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6">
              {activeTab === "cart" ? (
                <div className="text-center max-w-sm">
                  <h3 className="text-2xl font-display font-semibold mb-3">
                    Your cart is currently empty.
                  </h3>
                  <p className="text-sm text-muted-foreground mb-8">
                    Not sure where to start?<br />Try these collections:
                  </p>
                  <ul className="space-y-3 text-left">
                    {emptySuggestions.map((s) => (
                      <li key={s.name}>
                        <a
                          href={s.href}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-card transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={s.image}
                              alt={s.name}
                              className="w-9 h-9 rounded-md object-cover"
                            />
                            <span className="font-medium text-sm">{s.name}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground">No recently viewed items</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-display font-bold">$0.00 USD</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Taxes included and shipping calculated at checkout.
              </p>
              <button className="w-full bg-foreground text-background py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors">
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
