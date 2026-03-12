export const shopifyConfig = {
  domain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'sjbzya-jq.myshopify.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01'
};

export const SHOPIFY_GRAPHQL_URL = `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;
