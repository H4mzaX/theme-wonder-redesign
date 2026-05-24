/**
 * Shopify CDN image transform helper.
 * Shopify's CDN supports query-param resizing/format conversion.
 * Example: my-image.jpg?width=600&format=webp
 *
 * Use this on any image URL coming from cdn.shopify.com to drastically
 * reduce payload size and let the browser pick WebP.
 */
export function shopifyImg(url: string | undefined | null, width = 800): string {
  if (!url) return "";
  if (!url.includes("cdn.shopify.com")) return url; // not a Shopify image, leave alone
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

/** Build a srcSet from a Shopify image URL for responsive loading. */
export function shopifySrcSet(url: string | undefined | null, widths: number[] = [400, 800, 1200]): string {
  if (!url || !url.includes("cdn.shopify.com")) return "";
  return widths.map((w) => `${shopifyImg(url, w)} ${w}w`).join(", ");
}
