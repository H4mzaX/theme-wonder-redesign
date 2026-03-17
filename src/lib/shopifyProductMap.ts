/**
 * Maps series slugs to the naming pattern used in Shopify product titles.
 * This bridges the gap between the frontend series nomenclature and actual Shopify product names.
 */

const seriesSearchTerms: Record<string, string> = {
  clearmag: "Clear MagSafe Case",
  "clearmag-edge": "Clear MagSafe Edge Case",
  softmag: "Silicone Case",
  "armor-edge": "Protective Case",
  edgeguard: "Screen Protector",
  lensguard: "Camera Protector",
};

/**
 * Builds a Shopify search query that matches actual product titles.
 * E.g. ("clearmag", "iPhone 17 Pro") → "iPhone 17 Pro Clear MagSafe Case"
 */
export function buildShopifySearchQuery(seriesSlug: string, deviceName: string): string {
  const term = seriesSearchTerms[seriesSlug];
  if (!term) return deviceName;
  return `${deviceName} ${term}`;
}

/**
 * Builds a simpler fallback query using just the device name.
 */
export function buildFallbackQuery(seriesSlug: string): string {
  return seriesSearchTerms[seriesSlug] || seriesSlug;
}
