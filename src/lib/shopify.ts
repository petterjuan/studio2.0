import { ShopifyArticle, ShopifyProduct } from './definitions';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

function areShopifyCredentialsValid() {
    const isValid = domain && storefrontAccessToken;
    if (!isValid) {
      console.warn("ADVERTENCIA: Las credenciales de Shopify no están configuradas. Los productos y artículos no se cargarán. Por favor, añádelas a tu archivo .env.");
    }
    return isValid;
}

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ status: number; body: T } | never> {
  // Solo intentar el fetch si las credenciales podrían ser válidas, para evitar errores en tiempo de construcción.
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      console.error('Error: Las variables de entorno de Shopify no están definidas.');
      throw {
          status: 500,
          error: 'Credenciales de Shopify no definidas.',
      };
  }
  try {
    const endpoint = `https://${domain}/api/2023-10/graphql.json`;
    const key = storefrontAccessToken;

    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
      },
      body: JSON.stringify({ query, variables }),
      // Change cache strategy to 'no-store' to force re-fetching
      cache: 'no-store',
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    console.error('Error al obtener datos de Shopify:', e);
    // Lanzar el error permite que Next.js lo maneje (por ejemplo, mostrando una página de error en lugar de una sección vacía)
    throw {
      status: 500,
      error: e,
    };
  }
}

const ProductFragment = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      width
      height
    }
  }
`;

function formatPrice(amount: string, currencyCode: string) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(parseFloat(amount));
}


function reshapeProduct(product: any): ShopifyProduct {
    const { minVariantPrice } = product.priceRange;
    return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        price: formatPrice(minVariantPrice.amount, minVariantPrice.currencyCode),
        rawPrice: parseFloat(minVariantPrice.amount),
        imageUrl: product.featuredImage?.url || '',
        tags: product.tags || [],
    };
}

function reshapeArticle(article: any): ShopifyArticle {
    return {
        id: article.id,
        handle: article.handle,
        title: article.title,
        contentHtml: article.contentHtml,
        excerpt: article.excerpt,
        imageUrl: article.image?.url || '',
        publishedAt: article.publishedAt,
    };
}


export async function getProducts(first: number = 10): Promise<ShopifyProduct[]> {
    if (!areShopifyCredentialsValid()) {
        return [];
    }
    try {
        const query = `
            query getProducts($first: Int!) {
                products(first: $first, sortKey: TITLE, reverse: false) {
                    edges {
                        node {
                            ...ProductFragment
                        }
                    }
                }
            }
            ${ProductFragment}
        `;
        const res = await shopifyFetch<{ data: { products: { edges: { node: any }[] } } }>({
            query,
            variables: { first }
        });

        return res.body.data.products.edges.map(edge => reshapeProduct(edge.node));
    } catch (error) {
        return [];
    }
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    if (!areShopifyCredentialsValid()) {
        return null;
    }
    try {
        const query = `
          query getProductByHandle($handle: String!) {
            product(handle: $handle) {
              ...ProductFragment
            }
          }
          ${ProductFragment}
        `;
        const res = await shopifyFetch<{ data: { product: any } }>({
            query,
            variables: { handle }
        });

        if (!res.body.data.product) {
          return null;
        }
        
        return reshapeProduct(res.body.data.product);
    } catch (error) {
        return null;
    }
}


const ArticleFragment = `
  fragment ArticleFragment on Article {
    id
    title
    handle
    contentHtml
    excerpt(truncateAt: 120)
    publishedAt
    image {
      url
      width
      height
    }
  }
`;

export async function getArticles(first: number = 10): Promise<ShopifyArticle[]> {
    if (!areShopifyCredentialsValid()) {
        return [];
    }
    try {
        const query = `
            query getArticles($first: Int!) {
                articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
                    edges {
                        node {
                            ...ArticleFragment
                        }
                    }
                }
            }
            ${ArticleFragment}
        `;
        const res = await shopifyFetch<{ data: { articles: { edges: { node: any }[] } } }>({
            query,
            variables: { first }
        });
        
        return res.body.data.articles.edges.map(edge => reshapeArticle(edge.node));
    } catch (error) {
        return [];
    }
}


export async function getArticleByHandle(handle: string): Promise<ShopifyArticle | null> {
    if (!areShopifyCredentialsValid()) {
        return null;
    }
    try {
        const query = `
            query getArticleByHandle($handle: String!) {
                blog(handle: "news") {
                    articleByHandle(handle: $handle) {
                        ...ArticleFragment
                    }
                }
            }
            ${ArticleFragment}
        `;

        const res = await shopifyFetch<{ data: { blog: { articleByHandle: any } } }>({
            query,
            variables: { handle }
        });

        if (!res.body.data.blog?.articleByHandle) {
            return null;
        }

        return reshapeArticle(res.body.data.blog.articleByHandle);
    } catch (error) {
        return null;
    }
}

export async function getAllArticleHandles(): Promise<string[]> {
    if (!areShopifyCredentialsValid()) {
        return [];
    }
    try {
        const query = `
            query getAllArticleHandles {
            articles(first: 100) {
                edges {
                node {
                    handle
                }
                }
            }
            }
        `;

        const res = await shopifyFetch<{ data: { articles: { edges: { node: { handle: string } }[] } } }>({ query });

        return res.body.data.articles.edges.map(edge => edge.node.handle);
    } catch (error) {
        return [];
    }
}

export async function getAllProductHandles(): Promise<string[]> {
    if (!areShopifyCredentialsValid()) {
        return [];
    }
    try {
        const query = `
        query getAllProductHandles {
            products(first: 100) {
            edges {
                node {
                handle
                }
            }
            }
        }
        `;
    
        const res = await shopifyFetch<{ data: { products: { edges: { node: { handle: string } }[] } } }>({ query });
    
        return res.body.data.products.edges.map(edge => edge.node.handle);
    } catch (error) {
        return [];
    }
  }