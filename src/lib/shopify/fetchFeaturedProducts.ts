import { shopifyConfig, SHOPIFY_GRAPHQL_URL } from '@/config/shopify';

export async function fetchFeaturedProducts(limit: number = 8) {
  const query = `
    {
      products(first: ${limit}, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            handle
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
                  altText
                }
              }
            }
            availableForSale
            tags
          }
        }
      }
    }
  `;

  try {
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
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}
