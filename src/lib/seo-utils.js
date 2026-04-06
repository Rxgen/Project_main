/**
 * Global SEO Utilities for Strapi Integration
 * 
 * This module provides utilities to fetch SEO data from Strapi CMS
 * and generate Next.js metadata for any page.
 */

import { generateMetadata as generateSEOMetadata } from './seo';
import { mapStrapiSEO } from './strapi-utils';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1380';

/**
 * Fetch SEO data from Strapi API endpoint
 * @param {string} endpoint - Strapi endpoint (e.g., 'our-story', 'about-us')
 * @param {object} options - Fetch options
 * @returns {Promise<Object|null>} SEO data from Strapi or null if not found
 */
export async function fetchStrapiSEO(endpoint, options = {}) {
  try {
    const populateQuery = options.populate || 'seo';
    const url = `${STRAPI_URL}/api/${endpoint}?populate=${populateQuery}`;
    
    const revalidateVal = options.revalidate ?? parseInt(process.env.STRAPI_REVALIDATE || '60', 10);
    const revalidate = revalidateVal > 0 ? revalidateVal : 60;

    const fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN && {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
        }),
        ...(options.headers || {}),
      },
      next: {
        revalidate,
      },
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching SEO from Strapi:', url);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      if (response.status === 404 || response.status === 403) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`SEO data not available for endpoint: ${endpoint} (${response.status})`);
        }
        return null;
      }
      throw new Error(`Failed to fetch SEO data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle different response structures
    // Structure 1: { data: { seo: {...} } }
    // Structure 2: { data: { attributes: { seo: {...} } } }
    if (data?.data?.seo) {
      return data.data.seo;
    } else if (data?.data?.attributes?.seo) {
      return data.data.attributes.seo;
    } else if (data?.seo) {
      return data.seo;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching SEO data for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Generate Next.js metadata from Strapi SEO data
 * 
 * @param {string} endpoint - Strapi endpoint (e.g., 'our-story')
 * @param {string} baseUrl - Base URL for canonical URL (e.g., 'https://www.lupin.com')
 * @param {object} fallback - Fallback SEO values if Strapi data is not available
 * @param {object} options - Additional options
 * @returns {Promise<Object>} Next.js metadata object
 * 
 * @example
 * // In your page.js file:
 * export const metadata = await generateSEOMetadataFromStrapi(
 *   'our-story',
 *   'https://www.lupin.com/about-us/our-story',
 *   {
 *     title: 'Our Story - Lupin',
 *     description: 'Default description'
 *   }
 * );
 */
export async function generateSEOMetadataFromStrapi(endpoint, baseUrl, fallback = {}, options = {}) {
  try {
    // Fetch SEO data from Strapi
    const strapiSEO = await fetchStrapiSEO(endpoint, options);

    // Map Strapi SEO format to our SEO format
    const seoData = mapStrapiSEO(strapiSEO, baseUrl, fallback);

    // Generate Next.js metadata
    return generateSEOMetadata(seoData);
  } catch (error) {
    console.error(`Error generating SEO metadata for ${endpoint}:`, error);
    
    // Return fallback metadata
    return generateSEOMetadata({
      title: fallback.title || 'Lupin',
      description: fallback.description || 'Lupin Pharmaceuticals',
      canonicalUrl: baseUrl,
      keywords: fallback.keywords || null,
    });
  }
}

/**
 * Generate SEO metadata synchronously (for static pages)
 * Use this when you already have the SEO data
 * 
 * @param {Object} strapiSEO - SEO data from Strapi
 * @param {string} baseUrl - Base URL for canonical URL
 * @param {object} fallback - Fallback SEO values
 * @returns {Object} Next.js metadata object
 */
export function generateSEOMetadataSync(strapiSEO, baseUrl, fallback = {}) {
  const seoData = mapStrapiSEO(strapiSEO, baseUrl, fallback);
  return generateSEOMetadata(seoData);
}

