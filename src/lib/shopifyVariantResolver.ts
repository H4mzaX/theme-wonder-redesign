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
    products(first: 10, query: $query) {
      edges {
        node {
          title
          variants(first: 20) {
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

async function searchVariant(query: string, device?: string, color?: string): Promise<string | null> {
  try {
    const data = await storefrontApiRequest(SEARCH_QUERY, { query });
    const products = data?.data?.products?.edges || [];
    if (!products.length) return null;

    for (const pe of products) {
      const variants = pe.node.variants.edges.map((e: any) => e.node);

      // Filter variants by device model option (e.g. "iPhone 16", "iPhone 16 Pro")
      // This prevents "iPhone 16 Pro" variant being returned when "iPhone 16" was selected
      let candidateVariants = variants;
      if (device) {
        const deviceNorm = device.toLowerCase().trim();
        const deviceFiltered = variants.filter((v: any) =>
          v.selectedOptions.some((o: any) => {
            const optName = o.name.toLowerCase();
            const optVal = o.value.toLowerCase().trim();
            return (
              (optName === "model" || optName === "device" || optName === "title") &&
              optVal === deviceNorm
            );
          })
        );
        // Only use device-filtered if we got results, else fallback to all variants
        if (deviceFiltered.length > 0) candidateVariants = deviceFiltered;
      }

      // Among candidates, prefer color match, then available, then first
      if (color) {
        const colorMatch = candidateVariants.find((v: any) =>
          v.selectedOptions.some(
            (o: any) =>
              o.name.toLowerCase() === "color" &&
              o.value.toLowerCase() === color.toLowerCase()
          )
        );
        if (colorMatch) return colorMatch.id;
      }
      const available = candidateVariants.find((v: any) => v.availableForSale);
      if (available) return available.id;
      if (candidateVariants[0]) return candidateVariants[0].id;
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
    const key = `${q}::${device || ""}::${color || ""}`;
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (cached) return cached;
      continue;
    }
    let promise = inflight.get(key);
    if (!promise) {
      promise = searchVariant(q, device, color).then((id) => {
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
