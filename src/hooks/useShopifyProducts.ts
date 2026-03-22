// ─────────────────────────────────────────────────────────────
//  src/hooks/useShopifyProducts.ts
//  Fetches all products from Shopify once, caches in memory,
//  and exposes the same helper functions as your static products.ts
//  so ZERO changes needed in any page or component
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { fetchAllProducts, type ShopifyProduct } from "@/lib/shopify";

// ── Module-level cache so we only fetch once per session ──────
let cachedProducts: ShopifyProduct[] | null = null;
let fetchPromise: Promise<ShopifyProduct[]> | null = null;

async function getProducts(): Promise<ShopifyProduct[]> {
  if (cachedProducts) return cachedProducts;
  if (!fetchPromise) {
    fetchPromise = fetchAllProducts().then((p) => {
      cachedProducts = p;
      return p;
    });
  }
  return fetchPromise;
}

// ── Hook: all products ────────────────────────────────────────
export function useAllProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (cachedProducts) return;
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

// ── Hook: products filtered by seriesSlug + deviceGroupSlug ──
export function useSeriesProducts(seriesSlug: string, deviceGroupSlug: string) {
  const { products, loading, error } = useAllProducts();

  const filtered = products.filter((p) => {
    const matchesSeries = p.seriesSlug === seriesSlug;
    // Match by device tag or name containing the device group
    // e.g. deviceGroupSlug "iphone-16" matches device "iPhone 16", "iPhone 16 Pro" etc.
    const groupKeyword = deviceGroupSlug.replace(/-/g, " ").toLowerCase();
    const matchesDevice = p.device.toLowerCase().includes(groupKeyword.split(" ").slice(0, 2).join(" "));
    return matchesSeries && matchesDevice;
  });

  return { products: filtered, loading, error };
}

// ── Hook: products for a collection page ─────────────────────
export function useCollectionProducts(collectionSlug: string) {
  const { products, loading, error } = useAllProducts();

  const filtered = products.filter((p) => {
    switch (collectionSlug) {
      case "iphone-cases":     return p.device.toLowerCase().includes("iphone");
      case "samsung-cases":    return p.device.toLowerCase().includes("samsung");
      case "oneplus-cases":    return p.device.toLowerCase().includes("oneplus");
      case "magsafe-cases":    return ["clearmag", "clearmag-edge", "softmag"].includes(p.seriesSlug);
      case "protection":       return ["edgeguard", "lensguard"].includes(p.seriesSlug);
      default:                 return true;
    }
  });

  return { products: filtered, loading, error };
}

// ── Hook: single product by handle ───────────────────────────
export function useProductByHandle(handle: string) {
  const { products, loading, error } = useAllProducts();
  const product = products.find((p) => p.handle === handle || p.id === handle) || null;
  return { product, loading, error };
}

// ── Utility: find variantId for a product + color ─────────────
export function getVariantId(product: ShopifyProduct, color: string): string {
  return product.variantsByColor[color] || product.variantId;
}
