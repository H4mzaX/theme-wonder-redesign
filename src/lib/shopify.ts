// ─────────────────────────────────────────────────────────────
//  src/lib/shopify.ts
//  Shopify Storefront API client — 2025-07
// ─────────────────────────────────────────────────────────────

// Storefront API must use .myshopify.com domain
const SHOPIFY_DOMAIN = "t8we0d-bu.myshopify.com";  // ← revert this back

// But checkout URL should use your custom domain
const SHOPIFY_CUSTOM_DOMAIN = "shop.vcase.in";

const SHOPIFY_TOKEN  = "50acefd46d2bb8e4a2ccd3d6d851b106";
const SHOPIFY_API_VERSION = "2025-07";

const STOREFRONT_API = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// ── Raw GraphQL fetcher (internal — returns data only) ────────
async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(STOREFRONT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

// ── Public raw fetcher (returns full JSON with { data: ... }) ─
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(STOREFRONT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────
export interface ShopifyProduct {
  id: string;
  numericId: string;
  handle: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  hoverImage?: string;
  colors: string[];
  tag?: string;
  brand: string;
  category: string;
  device: string;
  series: string;
  seriesSlug: string;
  variantId: string;
  variantsByColor: Record<string, string>;
  node?: any;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: { amount: string; currencyCode: string };
    product: { title: string; featuredImage: { url: string } };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
  cost: { totalAmount: { amount: string; currencyCode: string } };
}

export interface ShopifyCartItem {
  product: any;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

// ─────────────────────────────────────────────────────────────
//  GraphQL fragments
// ─────────────────────────────────────────────────────────────
const PRODUCT_FIELDS = `
  id handle title productType vendor tags
  featuredImage { url altText }
  images(first: 5) { edges { node { url altText } } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  variants(first: 20) {
    edges {
      node {
        id title
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url }
        availableForSale
      }
    }
  }
  metafields(identifiers: [
    { namespace: "custom", key: "subtitle" }
    { namespace: "custom", key: "series_slug" }
    { namespace: "custom", key: "device" }
    { namespace: "custom", key: "rating" }
    { namespace: "custom", key: "reviews" }
  ]) { namespace key value }
`;

// ─────────────────────────────────────────────────────────────
//  Mapping helpers
// ─────────────────────────────────────────────────────────────
function formatINR(amount: string): string {
  const num = Math.round(parseFloat(amount));
  return `₹${num.toLocaleString("en-IN")}`;
}

function computeDiscount(price: string, compare: string): string {
  const p = parseFloat(price);
  const c = parseFloat(compare);
  if (!c || c <= p) return "";
  return `Save ${Math.round(((c - p) / c) * 100)}%`;
}

function meta(metafields: any[], key: string): string {
  return metafields?.find((m: any) => m?.key === key)?.value || "";
}

function tagValue(tags: string[], prefix: string): string {
  const t = tags?.find((t: string) => t.startsWith(`${prefix}:`));
  return t ? t.split(":")[1] : "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(node: any): ShopifyProduct {
  const variants = node.variants.edges.map((e: any) => e.node);
  const images = node.images.edges.map((e: any) => e.node.url);
  const metafields = node.metafields || [];
  const tags = node.tags || [];

  const price = node.priceRange.minVariantPrice.amount;
  const compareAt = node.compareAtPriceRange?.minVariantPrice?.amount;

  const variantsByColor: Record<string, string> = {};
  const colors: string[] = [];
  for (const v of variants) {
    const colorOpt = v.selectedOptions.find((o: any) => o.name.toLowerCase() === "color");
    const colorName = colorOpt?.value || "Default";
    if (!variantsByColor[colorName]) {
      variantsByColor[colorName] = v.id;
      colors.push(colorName);
    }
  }

  const seriesSlug = meta(metafields, "series_slug") || tagValue(tags, "series") || node.productType?.toLowerCase().replace(/\s+/g, "-") || "clearmag";
  const device = meta(metafields, "device") || tagValue(tags, "device") || node.vendor || "";

  return {
    id: node.handle,
    numericId: node.id.split("/").pop() || "",
    handle: node.handle,
    name: node.title,
    subtitle: meta(metafields, "subtitle") || node.productType || "",
    price: formatINR(price),
    originalPrice: compareAt ? formatINR(compareAt) : formatINR(price),
    discount: compareAt ? computeDiscount(price, compareAt) : "",
    rating: parseFloat(meta(metafields, "rating")) || 5,
    reviews: parseInt(meta(metafields, "reviews")) || 120,
    image: images[0] || node.featuredImage?.url || "",
    hoverImage: images[1],
    colors: colors.length ? colors : ["Default"],
    tag: tagValue(tags, "tag") || undefined,
    brand: "VCASE",
    category: node.productType || "Cases",
    device,
    series: node.title,
    seriesSlug,
    variantId: variants[0]?.id || "",
    variantsByColor,
  };
}

// ─────────────────────────────────────────────────────────────
//  Public API functions
// ─────────────────────────────────────────────────────────────

export async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<any>(`
    query AllProducts { products(first: 250) { edges { node { ${PRODUCT_FIELDS} } } } }
  `);
  return data.products.edges.map((e: any) => mapProduct(e.node));
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<any>(`
    query ProductByHandle($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }
  `, { handle });
  if (!data.product) return null;
  return mapProduct(data.product);
}

export async function fetchCollection(handle: string): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<any>(`
    query Collection($handle: String!) {
      collection(handle: $handle) { products(first: 100) { edges { node { ${PRODUCT_FIELDS} } } } }
    }
  `, { handle });
  if (!data.collection) return [];
  return data.collection.products.edges.map((e: any) => mapProduct(e.node));
}

// ─────────────────────────────────────────────────────────────
//  Cart API
// ─────────────────────────────────────────────────────────────

const CART_FIELDS = `
  id checkoutUrl
  lines(first: 50) {
    edges {
      node {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title
            priceV2: price { amount currencyCode }
            product { title featuredImage { url } }
          }
        }
      }
    }
  }
  cost { totalAmount { amount currencyCode } }
`;

export async function createCart(): Promise<ShopifyCart> {
  const existingCartId = localStorage.getItem("vcase-shopify-cart-id");
  if (existingCartId) {
    const existing = await fetchCart(existingCartId);
    if (existing) return existing;
  }
  const data = await shopifyFetch<any>(
    `mutation CartCreate { cartCreate { cart { ${CART_FIELDS} } } }`
  );
  const cart = normalizeCart(data.cartCreate.cart);
  localStorage.setItem("vcase-shopify-cart-id", cart.id);
  return cart;
}

export async function addToShopifyCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<any>(`
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] });
  const cart = normalizeCart(data.cartLinesAdd.cart);
  localStorage.setItem("vcase-shopify-cart-id", cart.id);
  return cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<any>(`
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] });
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLine(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<any>(`
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } }
    }
  `, { cartId, lineIds });
  return normalizeCart(data.cartLinesRemove.cart);
}

export async function fetchCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<any>(`
    query Cart($cartId: ID!) { cart(id: $cartId) { ${CART_FIELDS} } }
  `, { cartId });
  if (!data.cart) return null;
  return normalizeCart(data.cart);
}

function normalizeCart(raw: any): ShopifyCart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl.replace("t8we0d-bu.myshopify.com", "shop.vcase.in"),
    lines: raw.lines.edges.map((e: any) => e.node),
    cost: raw.cost,
  };
}

