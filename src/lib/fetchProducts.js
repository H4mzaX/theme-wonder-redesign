import { shopifyConfig, SHOPIFY_GRAPHQL_URL } from './shopify';

export async function fetchProducts() {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
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
                }
              }
            }
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
