export const shopifyConfig = {
  domain: 'www.vcase.in',
  storefrontAccessToken: '990cb76e05a8adb2df1d79deadacc65f', // Paste your token from this page
  apiVersion: '2024-01'
};

export const SHOPIFY_GRAPHQL_URL = `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;

