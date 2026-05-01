const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export async function shopifyFetch(query, variables = {}) {
  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  return res.json();
}

//////////////////////////////////////////////////
// 🛒 CREATE CART
//////////////////////////////////////////////////
export async function createCart() {
  const data = await shopifyFetch(`
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `);

  return data.data.cartCreate.cart;
}

//////////////////////////////////////////////////
// 🛒 FETCH CART
//////////////////////////////////////////////////
export async function fetchCart(cartId) {
  const data = await shopifyFetch(
    `
    query ($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    { cartId }
  );

  return data.data.cart;
}

//////////////////////////////////////////////////
// ➕ ADD ITEM
//////////////////////////////////////////////////
export async function addToCart(cartId, variantId, quantity = 1) {
  const data = await shopifyFetch(
    `
    mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    }
  );

  return data.data.cartLinesAdd.cart;
}

//////////////////////////////////////////////////
// ✏️ UPDATE ITEM
//////////////////////////////////////////////////
export async function updateCartLine(cartId, lineId, quantity) {
  return shopifyFetch(
    `
    mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    }
  );
}

//////////////////////////////////////////////////
// ❌ REMOVE ITEM
//////////////////////////////////////////////////
export async function removeCartLine(cartId, lineId) {
  return shopifyFetch(
    `
    mutation ($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
      }
    }
  `,
    {
      cartId,
      lineIds: [lineId],
    }
  );
}
