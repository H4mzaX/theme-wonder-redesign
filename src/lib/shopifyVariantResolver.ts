// ─────────────────────────────────────────────────────────────
//  src/lib/shopifyVariantResolver.ts
//  Resolves a Shopify variantId for any mock product so that
//  every "Add to cart" / "Buy Now" routes through Shopify checkout.
// ─────────────────────────────────────────────────────────────

import { storefrontApiRequest } from "@/lib/shopify";

const cache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

const SEARCH_QUERY = `
  query SearchVariant($query: String!) {
    products(first: 5, query: $query) {
      edges {
        node {
          variants(first: 5) {
            edges {
              node {
                id
                availableForSale
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

async function searchVariant(query: string, color?: string): Promise<string | null> {
  try {
    const data = await storefrontApiRequest(SEARCH_QUERY, { query });
    const products = data?.data?.products?.edges || [];
    if (!products.length) return null;

    // Prefer a variant whose color option matches, else first available, else first.
    for (const pe of products) {
      const variants = pe.node.variants.edges.map((e: any) => e.node);
      if (color) {
        const colorMatch = variants.find((v: any) =>
          v.selectedOptions.some(
            (o: any) =>
              o.name.toLowerCase() === "color" &&
              o.value.toLowerCase() === color.toLowerCase()
          )
        );
        if (colorMatch) return colorMatch.id;
      }
      const available = variants.find((v: any) => v.availableForSale);
      if (available) return available.id;
      if (variants[0]) return variants[0].id;
    }
    return null;
  } catch (e) {
    console.warn("[shopifyVariantResolver] search failed", e);
    return null;
  }
}

/**
 * Resolve a Shopify variantId from loose hints (device, series term, name, color).
 * Tries progressively broader queries so checkout always works.
 */
export async function resolveShopifyVariantId(opts: {
  device?: string;
  seriesTerm?: string; // e.g. "Clear MagSafe Case"
  name?: string;
  color?: string;
}): Promise<string | null> {
  const { device, seriesTerm, name, color } = opts;
  const queries: string[] = [];
  if (device && seriesTerm) queries.push(`${device} ${seriesTerm}`);
  if (device && name) queries.push(`${device} ${name}`);
  if (seriesTerm) queries.push(seriesTerm);
  if (name) queries.push(name);
  if (device) queries.push(device);

  for (const q of queries) {
    const key = `${q}::${color || ""}`;
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (cached) return cached;
      continue;
    }
    let promise = inflight.get(key);
    if (!promise) {
      promise = searchVariant(q, color).then((id) => {
        cache.set(key, id);
        inflight.delete(key);
        return id;
      });
      inflight.set(key, promise);
    }
    const id = await promise;
    if (id) return id;
  }
  return null;
}
