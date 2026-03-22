// ─────────────────────────────────────────────────────────────
//  src/context/CartContext.tsx  (UPDATED — Shopify-synced)
//
//  ✅ Keeps the EXACT same interface as before:
//     addToCart, removeFromCart, updateQuantity, clearCart,
//     totalItems, subtotal, items, recentlyViewed
//
//  ✅ All existing components (CartDrawer, ProductPages etc.)
//     work with ZERO changes
//
//  NEW: Every mutation is mirrored to Shopify Cart API so
//       clicking "Check out" goes to real Shopify checkout
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { z } from "zod";
import {
  createCart,
  addToShopifyCart,
  updateCartLine,
  removeCartLine,
  fetchCart,
  type ShopifyCart,
} from "@/lib/shopify";

// ── Zod schemas (unchanged) ───────────────────────────────────
const CartItemSchema = z.object({
  id: z.string().max(200),
  name: z.string().max(500),
  subtitle: z.string().max(500),
  price: z.string().max(50),
  originalPrice: z.string().max(50).optional(),
  image: z.string().max(1000),
  color: z.string().max(100),
  quantity: z.number().int().min(1).max(999),
  device: z.string().max(200).optional(),
  // NEW: store variant ID for Shopify sync
  variantId: z.string().max(200).optional(),
  // NEW: store Shopify cart line ID for updates/removes
  shopifyLineId: z.string().max(200).optional(),
});

const RecentlyViewedItemSchema = z.object({
  id: z.string().max(200),
  name: z.string().max(500),
  subtitle: z.string().max(500),
  price: z.string().max(50),
  originalPrice: z.string().max(50).optional(),
  image: z.string().max(1000),
  viewedAt: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type RecentlyViewedItem = z.infer<typeof RecentlyViewedItemSchema>;

// ── Context interface (unchanged + checkoutUrl) ───────────────
interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, color: string) => void;
  updateQuantity: (id: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  // NEW — used by checkout button
  checkoutUrl: string | null;
  cartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY   = "vcase-cart";
const RECENT_STORAGE_KEY = "vcase-recently-viewed";
const SHOPIFY_CART_ID_KEY = "vcase-shopify-cart-id";

function loadFromStorage<T>(key: string, fallback: T, schema: z.ZodType<T>): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return schema.parse(JSON.parse(stored));
  } catch {
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────
//  CartProvider
// ─────────────────────────────────────────────────────────────
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() =>
    loadFromStorage(CART_STORAGE_KEY, [], z.array(CartItemSchema))
  );
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() =>
    loadFromStorage(RECENT_STORAGE_KEY, [], z.array(RecentlyViewedItemSchema))
  );
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  // Ref so async callbacks always see latest items
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // ── Persist local cart ──────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // ── Bootstrap Shopify cart on mount ───────────────────────
  useEffect(() => {
    const savedCartId = localStorage.getItem(SHOPIFY_CART_ID_KEY);
    if (savedCartId) {
      fetchCart(savedCartId)
        .then((cart) => {
          if (cart) setShopifyCart(cart);
          else bootstrapNewCart();
        })
        .catch(bootstrapNewCart);
    } else {
      bootstrapNewCart();
    }
  }, []);

  async function bootstrapNewCart() {
    try {
      const cart = await createCart();
      localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id);
      setShopifyCart(cart);
    } catch (e) {
      console.warn("Shopify cart creation failed — running in local-only mode", e);
    }
  }

  // ── Get or create Shopify cart ─────────────────────────────
  async function ensureCart(): Promise<ShopifyCart> {
    if (shopifyCart) return shopifyCart;
    const cart = await createCart();
    localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id);
    setShopifyCart(cart);
    return cart;
  }

  // ── addToCart ──────────────────────────────────────────────
  const addToCart = useCallback(async (item: Omit<CartItem, "quantity">) => {
    // 1. Optimistic local update (instant UI feedback)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.color === item.color);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // 2. Sync to Shopify (if we have a variantId)
    if (!item.variantId) return;
    try {
      setCartLoading(true);
      const cart = await ensureCart();
      const updatedCart = await addToShopifyCart(cart.id, item.variantId, 1);
      setShopifyCart(updatedCart);

      // Back-fill shopifyLineId onto the local item
      const newLine = updatedCart.lines.find(
        (l) => l.merchandise.id === item.variantId
      );
      if (newLine) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && i.color === item.color
              ? { ...i, shopifyLineId: newLine.id }
              : i
          )
        );
      }
    } catch (e) {
      console.warn("Shopify addToCart failed — item still in local cart", e);
    } finally {
      setCartLoading(false);
    }
  }, [shopifyCart]);

  // ── removeFromCart ─────────────────────────────────────────
  const removeFromCart = useCallback(async (id: string, color: string) => {
    const item = itemsRef.current.find((i) => i.id === id && i.color === color);

    // 1. Local remove
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));

    // 2. Shopify remove
    if (item?.shopifyLineId && shopifyCart) {
      try {
        const updatedCart = await removeCartLine(shopifyCart.id, [item.shopifyLineId]);
        setShopifyCart(updatedCart);
      } catch (e) {
        console.warn("Shopify removeCartLine failed", e);
      }
    }
  }, [shopifyCart]);

  // ── updateQuantity ─────────────────────────────────────────
  const updateQuantity = useCallback(async (id: string, color: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id, color);

    const item = itemsRef.current.find((i) => i.id === id && i.color === color);

    // 1. Local update
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.color === color ? { ...i, quantity: qty } : i
      )
    );

    // 2. Shopify update
    if (item?.shopifyLineId && shopifyCart) {
      try {
        const updatedCart = await updateCartLine(shopifyCart.id, item.shopifyLineId, qty);
        setShopifyCart(updatedCart);
      } catch (e) {
        console.warn("Shopify updateCartLine failed", e);
      }
    }
  }, [shopifyCart, removeFromCart]);

  // ── clearCart ──────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    setItems([]);
    // Create a fresh Shopify cart
    try {
      const cart = await createCart();
      localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id);
      setShopifyCart(cart);
    } catch (e) {
      console.warn("Shopify clearCart failed", e);
    }
  }, []);

  // ── recentlyViewed ─────────────────────────────────────────
  const addRecentlyViewed = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 10);
    });
  }, []);

  // ── Derived values ─────────────────────────────────────────
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = parseInt(i.price.replace(/[₹,]/g, "")) || 0;
    return sum + price * i.quantity;
  }, 0);

  const checkoutUrl = shopifyCart?.checkoutUrl || null;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        recentlyViewed,
        addRecentlyViewed,
        checkoutUrl,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
