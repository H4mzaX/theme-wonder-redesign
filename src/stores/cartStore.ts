// ─────────────────────────────────────────────────────────────
//  src/stores/cartStore.ts
//  Compatibility bridge — useShopifyCartStore wraps useCart()
//  so all components using either interface share one cart
// ─────────────────────────────────────────────────────────────

import { useCart } from "@/context/CartContext";

interface ShopifyCartStoreState {
  items: any[];
  isLoading: boolean;
  addItem: (item: {
    product: any;
    variantId: string;
    variantTitle: string;
    price: { amount: string; currencyCode: string };
    compareAtPrice?: { amount: string; currencyCode: string } | null;
    quantity: number;
    selectedOptions: Array<{ name: string; value: string }>;
  }) => Promise<void>;
  getCheckoutUrl: () => string | null;
}

/**
 * Bridge hook — lets components written for Zustand-style selectors
 * read/write the same CartContext used by CartDrawer.
 *
 * Usage:  const addItem = useShopifyCartStore(s => s.addItem);
 */
export function useShopifyCartStore<T>(selector: (state: ShopifyCartStoreState) => T): T {
  const cart = useCart();

  const state: ShopifyCartStoreState = {
    items: cart.items,
    isLoading: cart.cartLoading,

    addItem: async (item) => {
      const price = item.price?.amount ? `₹${Math.round(parseFloat(item.price.amount)).toLocaleString("en-IN")}` : "₹0";
      const origPrice = item.compareAtPrice?.amount
        ? `₹${Math.round(parseFloat(item.compareAtPrice.amount)).toLocaleString("en-IN")}`
        : price;

      const productNode = item.product?.node || item.product;
      const name = productNode?.title || "Product";
      const image = productNode?.images?.edges?.[0]?.node?.url || productNode?.featuredImage?.url || "";
      const handle = productNode?.handle || item.variantId;
      const color = item.selectedOptions?.find((o) => o.name.toLowerCase() === "color")?.value || "Default";

      cart.addToCart({
        id: handle,
        name,
        subtitle: item.variantTitle || "",
        price,
        originalPrice: origPrice,
        image,
        color,
        variantId: item.variantId,
      });
    },

    getCheckoutUrl: () => cart.checkoutUrl,
  };

  return selector(state);
}
