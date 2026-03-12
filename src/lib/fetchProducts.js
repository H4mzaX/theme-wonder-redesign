import { shopifyConfig, SHOPIFY_GRAPHQL_URL } from '../config/shopify';

export async function fetchProducts() {
  const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            availableForSale
          }
        }
      }
    }
  `;

  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  return data.data.products.edges;
}
