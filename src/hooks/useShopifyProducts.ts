import { useState, useEffect } from "react";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";

export function useShopifyProducts(count = 20, query?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: count, query: query || null })
      .then((data) => {
        if (cancelled) return;
        const edges = data?.data?.products?.edges || [];
        setProducts(edges);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [count, query]);

  return { products, loading, error };
}
