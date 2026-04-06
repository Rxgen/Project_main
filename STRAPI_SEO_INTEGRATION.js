/**
 * STRAPI-FRIENDLY SEO INTEGRATION EXAMPLE
 * 
 * This file demonstrates how to use the SEO system with Strapi CMS
 */

// ============================================
// 1. STRAPI SEO COMPONENT STRUCTURE
// ============================================

/**
 * In your Strapi admin panel, create a "SEO" component with these fields:
 * 
 * Component: shared.seo
 * {
 *   metaTitle: Text (required)
 *   metaDescription: Text (required, 150-160 chars)
 *   keywords: Text
 *   canonicalURL: Text
 *   metaImage: Media (Single)
 *   metaSocial: Component (repeatable) {
 *     socialNetwork: Enumeration (Facebook, Twitter)
 *     title: Text
 *     description: Text
 *     image: Media
 *   }
 *   preventIndexing: Boolean (default: false)
 *   structuredData: JSON
 * }
 */

// ============================================
// 2. EXAMPLE: FETCH DATA FROM STRAPI
// ============================================

import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

/**
 * Fetch page data from Strapi
 */
async function fetchPageData(slug) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=seo,seo.metaImage,seo.metaSocial,seo.metaSocial.image`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store', // Revalidate every 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch page data');
  }

  const data = await response.json();
  return data.data[0];
}

// ============================================
// 3. EXAMPLE: USE STRAPI DATA IN PAGE
// ============================================

/**
 * Example page using Strapi data
 * NOTE: In your actual page.js file, use: export async function generateMetadata({ params })
 */
export async function generateMetadataExample({ params }) {
  try {
    // Fetch data from Strapi
    const pageData = await fetchPageData('about'); // or params.slug

    // Extract SEO data
    const seo = pageData?.attributes?.seo;

    if (!seo) {
      // Fallback to default SEO if no Strapi data
      return generateSEOMetadata({
        title: "About Us - Lupin",
        description: "Learn about Lupin's mission and values",
        canonicalUrl: "https://www.lupin.com/about",
      });
    }

    // Get image URL from Strapi
    const imageUrl = seo.metaImage?.data?.attributes?.url;
    const fullImageUrl = imageUrl 
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}`
      : null;

    // Generate metadata from Strapi data
    return generateSEOMetadata({
      title: seo.metaTitle,
      description: seo.metaDescription,
      canonicalUrl: seo.canonicalURL || `https://www.lupin.com/about`,
      keywords: seo.keywords,
      ogImage: fullImageUrl,
      noIndex: seo.preventIndexing || false,
    });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    
    // Fallback to default SEO
    return generateSEOMetadata({
      title: "About Us - Lupin",
      description: "Learn about Lupin's mission and values",
      canonicalUrl: "https://www.lupin.com/about",
    });
  }
}

export default async function AboutPage() {
  const pageData = await fetchPageData('about');
  
  return (
    <div>
      <h1>{pageData.attributes.title}</h1>
      {/* Your page content */}
    </div>
  );
}

// ============================================
// 4. EXAMPLE: DYNAMIC ROUTES WITH STRAPI
// ============================================

/**
 * Example: app/blog/[slug]/page.js
 * NOTE: In your actual page.js file, use: export async function generateMetadata({ params })
 */
export async function generateMetadataForBlog({ params }) {
  const article = await fetchArticle(params.slug);
  const seo = article?.attributes?.seo;

  return generateSEOMetadata({
    title: seo?.metaTitle || article.attributes.title,
    description: seo?.metaDescription || article.attributes.excerpt,
    canonicalUrl: `https://www.lupin.com/blog/${params.slug}`,
    keywords: seo?.keywords || article.attributes.tags?.join(', '),
    ogImage: article.attributes.coverImage?.url,
  });
}

// ============================================
// 5. EXAMPLE: HOME PAGE WITH STRAPI
// ============================================

/**
 * Example: app/page.js with Strapi data
 */
async function fetchHomePageData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home-page?populate=seo,seo.metaImage`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    }
  );

  const data = await response.json();
  return data.data;
}

export async function generateMetadataForHome() {
  const homeData = await fetchHomePageData();
  const seo = homeData?.attributes?.seo;

  return generateSEOMetadata({
    title: seo?.metaTitle || "Lupin - Global Pharmaceutical Leader",
    description: seo?.metaDescription || "Leading pharmaceutical company...",
    canonicalUrl: seo?.canonicalURL || "https://www.lupin.com",
    keywords: seo?.keywords,
    ogImage: seo?.metaImage?.data?.attributes?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${seo.metaImage.data.attributes.url}`
      : null,
    noIndex: seo?.preventIndexing || false,
  });
}

// ============================================
// 6. ENVIRONMENT VARIABLES
// ============================================

/**
 * Add these to your .env.local file:
 * 
 * NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
 * STRAPI_API_TOKEN=your-api-token-here
 */

// ============================================
// 7. STRAPI COLLECTION TYPES EXAMPLE
// ============================================

/**
 * Collection Type: Page
 * {
 *   title: Text (required)
 *   slug: UID (required)
 *   content: Rich Text
 *   seo: Component (shared.seo)
 *   publishedAt: DateTime
 * }
 * 
 * Collection Type: Article (Blog)
 * {
 *   title: Text (required)
 *   slug: UID (required)
 *   excerpt: Text
 *   content: Rich Text
 *   coverImage: Media
 *   author: Relation (User)
 *   category: Relation (Category)
 *   tags: JSON
 *   seo: Component (shared.seo)
 *   publishedAt: DateTime
 * }
 */

// ============================================
// 8. UTILITY: STRAPI IMAGE HELPER
// ============================================

export function getStrapiImageUrl(image) {
  if (!image?.data?.attributes?.url) return null;
  
  const url = image.data.attributes.url;
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) return url;
  
  // Otherwise, prepend Strapi URL
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

// ============================================
// 9. UTILITY: STRAPI SEO MAPPER
// ============================================

/**
 * Helper function to map Strapi SEO data to our SEO format
 */
export function mapStrapiSEO(strapiSEO, fallbackUrl) {
  if (!strapiSEO) return null;

  return {
    title: strapiSEO.metaTitle,
    description: strapiSEO.metaDescription,
    canonicalUrl: strapiSEO.canonicalURL || fallbackUrl,
    keywords: strapiSEO.keywords,
    ogImage: getStrapiImageUrl(strapiSEO.metaImage),
    ogImageAlt: strapiSEO.metaImage?.data?.attributes?.alternativeText,
    noIndex: strapiSEO.preventIndexing || false,
  };
}

// Usage:
// const seoData = mapStrapiSEO(pageData.attributes.seo, 'https://www.lupin.com/page');
// export const metadata = generateSEOMetadata(seoData);

// ============================================
// 10. COMPLETE EXAMPLE WITH ERROR HANDLING
// ============================================

export async function generateMetadataComplete({ params }) {
  try {
    // Fetch from Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?filters[slug][$eq]=${params.slug}&populate=deep`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const page = data.data[0];

    // Map Strapi data to SEO format
    const seoData = mapStrapiSEO(
      page?.attributes?.seo,
      `https://www.lupin.com/${params.slug}`
    );

    // Generate metadata
    return generateSEOMetadata(
      seoData || {
        title: page?.attributes?.title || 'Lupin',
        description: page?.attributes?.description || 'Lupin Pharmaceuticals',
        canonicalUrl: `https://www.lupin.com/${params.slug}`,
      }
    );
  } catch (error) {
    console.error('SEO metadata error:', error);

    // Return fallback metadata
    return generateSEOMetadata({
      title: 'Lupin - Pharmaceutical Leader',
      description: 'Leading pharmaceutical company',
      canonicalUrl: `https://www.lupin.com/${params.slug}`,
    });
  }
}
