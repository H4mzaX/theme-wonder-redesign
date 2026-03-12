import { shopifyConfig, SHOPIFY_GRAPHQL_URL } from '@/config/shopify';

export async function fetchCollectionProducts(collectionHandle: string, limit: number = 20) {
  const query = `
    {
      collection(handle: "${collectionHandle}") {
        title
        description
        products(first: ${limit}) {
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
            }
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
    return data.data.collection;
  } catch (error) {
    console.error('Error fetching collection products:', error);
    throw error;
  }
}
