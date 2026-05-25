// ─────────────────────────────────────────────────────────────
//  src/context/CartContext.tsx
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
import { resolveShopifyVariantId } from "@/lib/shopifyVariantResolver";
import { seriesSearchTermFor } from "@/lib/shopifyProductMap";

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
  variantId: z.string().max(200).optional(),
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

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string, color: string) => void;
  updateQuantity: (id: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  checkoutUrl: string | null;
  cartLoading: boolean;
  cartInitializing: boolean;
  // Returns the latest checkoutUrl synchronously from shopifyCart ref
  getLatestCheckoutUrl: () => string | null;
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() =>
    loadFromStorage(CART_STORAGE_KEY, [], z.array(CartItemSchema))
  );
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() =>
    loadFromStorage(RECENT_STORAGE_KEY, [], z.array(RecentlyViewedItemSchema))
  );
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  // True while the initial cart bootstrap/fetch is in-flight
  const [cartInitializing, setCartInitializing] = useState(true);

  // Ref so async callbacks always see latest cart + items
  const itemsRef = useRef(items);
  const shopifyCartRef = useRef(shopifyCart);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { shopifyCartRef.current = shopifyCart; }, [shopifyCart]);

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
          if (cart) {
            setShopifyCart(cart);
            // Bug 4 fix: re-sync local items to Shopify if cart has no lines
            if (cart.lines.length === 0) {
              const localItems = loadFromStorage(CART_STORAGE_KEY, [], z.array(CartItemSchema));
              if (localItems.length > 0) {
                resyncItemsToCart(cart.id, localItems);
              }
            }
          } else {
            bootstrapNewCart();
          }
        })
        .catch(bootstrapNewCart)
        .finally(() => setCartInitializing(false));
    } else {
      bootstrapNewCart().finally(() => setCartInitializing(false));
    }
  }, []);

  async function resyncItemsToCart(cartId: string, localItems: CartItem[]) {
    try {
      let cart: ShopifyCart | null = null;
      for (const item of localItems) {
        if (!item.variantId) continue;
        cart = await addToShopifyCart(cartId, item.variantId, item.quantity);
      }
      if (cart) {
        setShopifyCart(cart);
        setItems((prev) =>
          prev.map((item) => {
            const line = cart!.lines.find((l) => l.merchandise.id === item.variantId);
            return line ? { ...item, shopifyLineId: line.id } : item;
          })
        );
      }
    } catch (e) {
      console.warn("resyncItemsToCart failed", e);
    }
  }

  async function bootstrapNewCart() {
    try {
      const cart = await createCart();
      localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id);
      setShopifyCart(cart);
    } catch (e) {
      console.warn("Shopify cart creation failed — running in local-only mode", e);
    }
  }

  async function ensureCart(): Promise<ShopifyCart> {
    if (shopifyCartRef.current) return shopifyCartRef.current;
    const cart = await createCart();
    localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id);
    setShopifyCart(cart);
    return cart;
  }

  // ── addToCart ──────────────────────────────────────────────
  const addToCart = useCallback(async (item: Omit<CartItem, "quantity">) => {
    // 1. Optimistic local update
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

    // 2. Resolve a Shopify variantId if one wasn't supplied (mock products).
    let variantId = item.variantId;
    if (!variantId) {
      // Mock product ids look like "iphone-17-pro-clearmag"; the suffix is the series slug.
      const seriesSlug = item.id.split("-").slice(-1)[0] && item.id.includes("-")
        ? item.id.split("-").slice(-2).join("-") // try last 2 segments first (e.g. clearmag-edge, armor-edge)
        : undefined;
      const seriesTerm =
        (seriesSlug && seriesSearchTermFor(seriesSlug)) ||
        seriesSearchTermFor(item.id.split("-").pop() || "");
      variantId = (await resolveShopifyVariantId({
        device: item.device,
        seriesTerm,
        name: item.name,
        color: item.color !== "Default" ? item.color : undefined,
      })) || undefined;

      if (variantId) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && i.color === item.color ? { ...i, variantId } : i
          )
        );
      }
    }

    if (!variantId) return;

    // 3. Sync to Shopify
    try {
      setCartLoading(true);
      const cart = await ensureCart();
      const updatedCart = await addToShopifyCart(cart.id, variantId, 1);
      setShopifyCart(updatedCart);

      // Back-fill shopifyLineId
      const newLine = updatedCart.lines.find(
        (l) => l.merchandise.id === variantId
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
  }, []);

  const removeFromCart = useCallback(async (id: string, color: string) => {
    const item = itemsRef.current.find((i) => i.id === id && i.color === color);
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));
    if (item?.shopifyLineId && shopifyCartRef.current) {
      try {
        const updatedCart = await removeCartLine(shopifyCartRef.current.id, [item.shopifyLineId]);
        setShopifyCart(updatedCart);
      } catch (e) {
        console.warn("Shopify removeCartLine failed", e);
      }
    }
  }, []);

  const updateQuantity = useCallback(async (id: string, color: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id, color);
    const item = itemsRef.current.find((i) => i.id === id && i.color === color);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.color === color ? { ...i, quantity: qty } : i
      )
    );
    if (item?.shopifyLineId && shopifyCartRef.current) {
      try {
        const updatedCart = await updateCartLine(shopifyCartRef.current.id, item.shopifyLineId, qty);
        setShopifyCart(updatedCart);
      } catch (e) {
        console.warn("Shopify updateCartLine failed", e);
      }
    }
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    setItems([]);
    try {
      const cart = await createCart();
      localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id);
      setShopifyCart(cart);
    } catch (e) {
      console.warn("Shopify clearCart failed", e);
    }
  }, []);

  const addRecentlyViewed = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 10);
    });
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = parseInt(i.price.replace(/[₹,]/g, "")) || 0;
    return sum + price * i.quantity;
  }, 0);

  const checkoutUrl = shopifyCart?.checkoutUrl || null;

  // Always read from ref so callers get the latest URL even inside stale closures
  const getLatestCheckoutUrl = useCallback(() => {
    return shopifyCartRef.current?.checkoutUrl || null;
  }, []);

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
        cartInitializing,
        getLatestCheckoutUrl,
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
