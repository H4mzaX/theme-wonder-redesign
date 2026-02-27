import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { z } from "zod";

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
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, color: string) => void;
  updateQuantity: (id: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "vcase-cart";
const RECENT_STORAGE_KEY = "vcase-recently-viewed";

function loadFromStorage<T>(key: string, fallback: T, schema: z.ZodType<T>): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return schema.parse(parsed);
  } catch {
    return fallback;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage<CartItem[]>(CART_STORAGE_KEY, [], z.array(CartItemSchema)));
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() => loadFromStorage<RecentlyViewedItem[]>(RECENT_STORAGE_KEY, [], z.array(RecentlyViewedItemSchema)));

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Persist recently viewed
  useEffect(() => {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
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
  };

  const removeFromCart = (id: string, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)));
  };

  const updateQuantity = (id: string, color: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id, color);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.color === color ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => setItems([]);

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

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, recentlyViewed, addRecentlyViewed }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
