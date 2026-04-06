// Strapi API helper functions
// Update STRAPI_URL when you set up Strapi

import { normalizeUploadUrl } from './strapi-utils';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1380';

/**
 * Fetch data from Strapi API
 * @param {string} endpoint - API endpoint (e.g., 'homepage', 'articles')
 * @param {object} options - Fetch options
 * @returns {Promise} - API response data
 */
export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization token if available
  if (process.env.STRAPI_API_TOKEN) {
    defaultOptions.headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  // Merge headers properly
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  const requestUrl = `${STRAPI_URL}/api/${endpoint}`;

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    //console.log('Fetching from Strapi:', requestUrl);
    //console.log('Token present:', !!process.env.STRAPI_API_TOKEN);
  }

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      // Handle 404 errors gracefully - return null instead of throwing
      // This allows pages to use fallback data when Strapi content doesn't exist
      if (response.status === 404) {
        if (process.env.NODE_ENV === 'development') {
          //console.warn(`Strapi endpoint not found (404): ${endpoint}. Using fallback data.`);
        }
        return null;
      }

      // Get error details from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage += ` - ${errorData.error.message || JSON.stringify(errorData.error)}`;
        }
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage += ` - ${response.statusText}`;
      }

      // Provide helpful error messages
      if (response.status === 403) {
        errorMessage += '\n\n403 Forbidden: Check that STRAPI_API_TOKEN is set in your .env.local file and has proper permissions.';
      } else if (response.status === 401) {
        errorMessage += '\n\n401 Unauthorized: Check that your STRAPI_API_TOKEN is valid.';
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Only log and throw for non-404 errors
    // 404 errors are handled above and return null
    if (error.message && !error.message.includes('404')) {
      console.error('Error fetching from Strapi:', error);
    }
    throw error;
  }
}

/**
 * Fetch from Strapi using a path that may start with /api/ (e.g. "/api/therapies?filters...")
 * @param {string} pathWithQuery - Path after the host, with or without a leading /api/
 * @param {object} options - Passed through to fetch (cache, next, headers, etc.)
 */
export async function fetchStrapi(pathWithQuery, options = {}) {
  const path = String(pathWithQuery).replace(/^\/?api\/?/, '');
  return fetchAPI(path, options);
}

/**
 * Get full Strapi media URL
 * @param {string|object} media - Media path or object
 * @returns {string} - Full URL
 */
export function getStrapiMedia(media) {
  if (!media) return null;

  // Handle direct media object from API (with url property)
  let imageUrl = null;
  if (typeof media === 'string') {
    imageUrl = media;
  } else if (media.url) {
    imageUrl = media.url;
  } else if (media.data?.attributes?.url) {
    imageUrl = media.data.attributes.url;
  } else if (media.data?.url) {
    imageUrl = media.data.url;
  }

  if (!imageUrl) return null;

  // Return full URL if it's already a complete URL
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Otherwise prepend Strapi URL
  return `${STRAPI_URL}${imageUrl}`;
}

/**
 * Fetch homepage data from Strapi
 * Example usage in page.js:
 * const homepage = await getHomepage();
 * 
 * Populates the hero component and all its nested fields recursively
 */
export async function getHomepage() {
  // Populate hero component and all nested components/fields recursively
  return fetchAPI('homepage?populate[hero][populate]=*&populate[ourStory][populate][sectionData][populate]=*&populate[ourPurpose][populate][sectionData][populate]=*&populate[ourPurpose][populate][cards][populate]=*&populate[overView][populate][sectionData][populate]=*&populate[overView][populate][stats][populate]=*&populate[ourBusiness][populate][sectionData][populate]=*&populate[sustainability][populate][sectionData][populate]=*&populate[csr][populate][sectionData][populate]=*&populate[life][populate][sectionData][populate]=*&populate[news][populate][items][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map Strapi homepage hero data to Hero component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. heading as array: { heading: ["Line 1", "Line 2"] }
 * 2. heading as object: { heading: { line1: "Text", line2: "Text" } } (will be converted to array)
 * 3. heading as string: { heading: "Line 1, Line 2" } (will be split into array)
 * 4. Nested in hero: { hero: { heading: [...] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted hero data with structure:
 *   { heading: [string, string], subheading: [...], cta: {...}, stickyNotes: [...] }
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageHeroData(strapiData) {
  // Handle Strapi v4 response structure
  // For single types: data.hero.heading (no attributes wrapper)
  // For collection types: data.attributes.hero.heading
  // For array types: data.hero[0].heading
  const data = strapiData?.data || strapiData;

  // If no data, throw error instead of using fallback
  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  // Handle hero as array or object
  // If hero is an array, get the first item; otherwise use hero directly
  const heroData = Array.isArray(data.hero) ? data.hero[0] : data.hero;

  // Helper function to extract heading - NO FALLBACK, only from API
  // Returns array format: ["Line 1", "Line 2"]
  const extractHeading = (data) => {
    const heading = heroData?.heading || data.hero?.heading || data.heading;

    // If heading is already an array, return it
    if (Array.isArray(heading)) {
      if (heading.length === 0) {
        throw new Error('Heading array is empty. Please provide at least one line in Strapi.');
      }
      return heading.filter(line => line && line.trim());
    }

    // If heading is an object with line1/line2, convert to array
    if (heading && typeof heading === 'object') {
      if (heading.line1 && heading.line2) {
        return [heading.line1, heading.line2];
      }
      if (heading.line1) {
        throw new Error('Heading has line1 but missing line2. Please provide both line1 and line2 in Strapi, or use an array format.');
      }
    }

    // If heading is a string, split it (try common separators)
    if (typeof heading === 'string' && heading.trim()) {
      // Try splitting by newline, comma, or common patterns
      const parts = heading.split(/\n|, | - | — | \| /).filter(p => p.trim());
      if (parts.length >= 1) {
        return parts.map(p => p.trim());
      }
      throw new Error(`Heading is a single string "${heading}" but could not be split. Expected array, object with line1/line2, or string with separator (newline, comma, dash).`);
    }

    throw new Error(`Heading data not found in Strapi response. Available keys: ${Object.keys(data).join(', ')}. Please add heading field to your homepage content.`);
  };

  // Helper function to extract subheading - flexible, can be optional
  const extractSubheading = (data) => {
    const subheading = heroData?.subheading || data.hero?.subheading || data.subheading;
    if (Array.isArray(subheading)) {
      return subheading;
    }
    if (typeof subheading === 'string' && subheading.trim()) {
      // Split by newlines or return as single-item array
      return subheading.split('\n').filter(s => s.trim());
    }
    // Return empty array if not found (optional field)
    return [];
  };

  // Extract CTA - flexible, can have defaults
  const extractCTA = (data) => {
    const cta = heroData?.cta || data.hero?.cta || data.cta;
    if (!cta) {
      return { text: 'know more', href: '#' };
    }
    return {
      text: cta.text || 'know more',
      href: cta.href || '#'
    };
  };

  // Extract sticky notes - make optional since they might not be in CMS yet
  const extractStickyNotes = (data) => {
    const stickyNotes = heroData?.stickyNotes || data.hero?.stickyNotes || data.stickyNotes;
    // Make stickyNotes optional - return default if not present (Hero component needs at least 2 items)
    if (!stickyNotes || !Array.isArray(stickyNotes) || stickyNotes.length === 0) {
      return [
        { text: 'Product Finder', href: 'product-finder' },
        { text: 'Chat', href: '#chat' }
      ];
    }
    return stickyNotes;
  };

  // Extract image from Strapi - NO FALLBACK, must come from API
  const extractImage = (data) => {
    const image = heroData?.image || data.hero?.image || data.image;
    if (!image) {
      throw new Error('Image not found in Strapi response. Please add image field to your hero component in Strapi.');
    }

    if (!image.url) {
      throw new Error('Image URL is missing in Strapi response. Please ensure the image is properly uploaded in Strapi.');
    }

    // Get full image URL using getStrapiMedia
    const imageUrl = getStrapiMedia(image);

    if (!imageUrl) {
      throw new Error('Failed to generate image URL from Strapi data.');
    }

    return {
      url: imageUrl,
      alt: image.alternativeText || image.caption || '',
      width: image.width,
      height: image.height
    };
  };

  // Map Strapi data to Hero component format
  return {
    heading: extractHeading(data),
    subheading: extractSubheading(data),
    cta: extractCTA(data),
    stickyNotes: extractStickyNotes(data),
    image: extractImage(data),
  };
}

/**
 * Fetch all articles from Strapi
 * Example usage:
 * const articles = await getArticles();
 */
export async function getArticles() {
  return fetchAPI('articles?populate=*', {
    cache: 'no-store',
  });
}

/**
 * Fetch single article by slug
 * Example usage:
 * const article = await getArticle('my-article-slug');
 * Returns null if article doesn't exist or on error
 */
export async function getArticle(slug) {
  if (!slug) {
    return null;
  }

  try {
    const articles = await fetchAPI(
      `articles?filters[slug][$eq]=${slug}&populate=media&populate=author`,
      {
        cache: 'no-store',
      }
    );
    return articles?.data?.[0] || null;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch articles by category slug from Strapi
 * Example usage:
 * const articles = await getArticlesByCategory('press-releases', 10);
 * Returns empty data structure if category doesn't exist or has no articles
 */
export async function getArticlesByCategory(categorySlug, limit = 10, sort = 'desc') {
  try {
    // Sort by publishedOn first, then publishedAt as fallback
    const response = await fetchAPI(
      `articles?filters[category][slug][$eq]=${categorySlug}&pagination[page]=1&pagination[pageSize]=${limit}&sort[0]=publishedOn:${sort}&sort[1]=publishedAt:${sort}&populate=media`,
      {
        cache: 'no-store',
      }
    );
    // Return response with empty data array if no articles found
    return response || { data: [], meta: { pagination: { page: 1, pageSize: limit, pageCount: 0, total: 0 } } };
  } catch (error) {
    console.error(`Error fetching articles for category ${categorySlug}:`, error);
    // Return empty structure instead of throwing
    return { data: [], meta: { pagination: { page: 1, pageSize: limit, pageCount: 0, total: 0 } } };
  }
}

/**
 * Fetch all articles by category from Strapi (handles pagination automatically)
 * This function fetches all pages to get all records, handling Strapi's 100 record limit per request
 * 
 * @param {string} categorySlug - Category slug to filter by
 * @param {string} sort - Sort order ('asc' or 'desc')
 * @returns {Promise<Object>} Combined response with all articles
 * 
 * Example usage:
 * const allPressReleases = await getAllArticlesByCategory('press-releases', 'desc');
 */
export async function getAllArticlesByCategory(categorySlug, sort = 'desc') {
  try {
    const pageSize = 100; // Strapi's maximum per request
    let allData = [];
    let currentPage = 1;
    let totalPages = 1;
    let total = 0;

    // Fetch first page to get total count
    const firstPageResponse = await fetchAPI(
      `articles?filters[category][slug][$eq]=${categorySlug}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&sort[0]=publishedOn:${sort}&sort[1]=publishedAt:${sort}&populate=media`,
      {
        cache: 'no-store',
      }
    );

    if (!firstPageResponse || !firstPageResponse.data) {
      return { data: [], meta: { pagination: { page: 1, pageSize: pageSize, pageCount: 0, total: 0 } } };
    }

    allData = [...firstPageResponse.data];
    total = firstPageResponse.meta?.pagination?.total || 0;
    totalPages = firstPageResponse.meta?.pagination?.pageCount || 1;

    // If there are more pages, fetch them all
    if (totalPages > 1) {
      const remainingPages = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPages.push(
          fetchAPI(
            `articles?filters[category][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedOn:${sort}&sort[1]=publishedAt:${sort}&populate=media`,
            {
              cache: 'no-store',
            }
          )
        );
      }

      // Fetch all remaining pages in parallel
      const remainingResponses = await Promise.all(remainingPages);

      // Combine all data
      remainingResponses.forEach((response) => {
        if (response && response.data) {
          allData = [...allData, ...response.data];
        }
      });
    }

    return {
      data: allData,
      meta: {
        pagination: {
          page: 1,
          pageSize: total,
          pageCount: 1,
          total: total
        }
      }
    };
  } catch (error) {
    console.error(`Error fetching all articles for category ${categorySlug}:`, error);
    // Return empty structure instead of throwing
    return { data: [], meta: { pagination: { page: 1, pageSize: 100, pageCount: 0, total: 0 } } };
  }
}

/**
 * Fetch press releases from Strapi
 * If limit is 100 or more, fetches all pages automatically
 * Example usage:
 * const pressReleases = await getPressReleases(10); // Fetches 10 items
 * const allPressReleases = await getPressReleases(100); // Fetches all items across multiple pages
 */
export async function getPressReleases(limit = 10) {
  // If limit is 100 or more, fetch all pages
  if (limit >= 100) {
    return getAllArticlesByCategory('press-releases', 'desc');
  }
  return getArticlesByCategory('press-releases', limit, 'desc');
}

/**
 * Fetch perspectives articles from Strapi
 * If limit is 100 or more, fetches all pages automatically
 * Example usage:
 * const perspectives = await getPerspectives(10); // Fetches 10 items
 * const allPerspectives = await getPerspectives(100); // Fetches all items across multiple pages
 */
export async function getPerspectives(limit = 10) {
  // If limit is 100 or more, fetch all pages
  if (limit >= 100) {
    return getAllArticlesByCategory('perspectives', 'desc');
  }
  return getArticlesByCategory('perspectives', limit, 'desc');
}

/**
 * Fetch media coverage articles from Strapi
 * If limit is 100 or more, fetches all pages automatically
 * Example usage:
 * const mediaCoverage = await getMediaCoverage(10); // Fetches 10 items
 * const allMediaCoverage = await getMediaCoverage(100); // Fetches all items across multiple pages
 */
export async function getMediaCoverage(limit = 10) {
  // If limit is 100 or more, fetch all pages
  if (limit >= 100) {
    return getAllArticlesByCategory('media-coverage', 'desc');
  }
  return getArticlesByCategory('media-coverage', limit, 'desc');
}

/**
 * Fetch featured articles by category slug from Strapi
 * Example usage:
 * const featuredArticles = await getFeaturedArticlesByCategory('media-coverage', 3);
 */
export async function getFeaturedArticlesByCategory(categorySlug, limit = 10, sort = 'desc') {
  try {
    // Filter by category and featured=true, sort by publishedOn first, then publishedAt as fallback
    const response = await fetchAPI(
      `articles?filters[category][slug][$eq]=${categorySlug}&filters[featured][$eq]=true&pagination[page]=1&pagination[pageSize]=${limit}&sort[0]=publishedOn:${sort}&sort[1]=publishedAt:${sort}&populate=media`,
      {
        cache: 'no-store',
      }
    );
    // Return response with empty data array if no articles found
    return response || { data: [], meta: { pagination: { page: 1, pageSize: limit, pageCount: 0, total: 0 } } };
  } catch (error) {
    console.error(`Error fetching featured articles for category ${categorySlug}:`, error);
    // Return empty structure instead of throwing
    return { data: [], meta: { pagination: { page: 1, pageSize: limit, pageCount: 0, total: 0 } } };
  }
}

/**
 * Fetch media kit articles from Strapi
 * If limit is 100 or more, fetches all pages automatically
 * Example usage:
 * const mediaKit = await getMediaKit(10); // Fetches 10 items
 * const allMediaKit = await getMediaKit(100); // Fetches all items across multiple pages
 */
export async function getMediaKit(limit = 10) {
  // If limit is 100 or more, fetch all pages
  if (limit >= 100) {
    return getAllArticlesByCategory('media-kit', 'desc');
  }
  return getArticlesByCategory('media-kit', limit, 'desc');
}

/**
 * Fetch awards and recognition articles from Strapi
 * If limit is 100 or more, fetches all pages automatically
 * Example usage:
 * const awards = await getAwardsAndRecognition(100); // Fetches all items across multiple pages
 */
export async function getAwardsAndRecognition(limit = 100) {
  // If limit is 100 or more, fetch all pages
  if (limit >= 100) {
    return getAllArticlesByCategory('awards-and-recognition', 'desc');
  }
  return getArticlesByCategory('awards-and-recognition', limit, 'desc');
}

/**
 * Map Strapi homepage ourStory data to OurStory component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted ourStory data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageOurStoryData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const sectionData = data.ourStory?.sectionData;
  if (!sectionData) {
    throw new Error('OurStory sectionData not found in Strapi response. Please add ourStory component to your homepage content.');
  }

  // Extract eyebrow
  if (!sectionData.eyebrow) {
    throw new Error('Eyebrow not found in ourStory sectionData. Please add eyebrow field in Strapi.');
  }

  // Extract and split heading by newlines
  if (!sectionData.heading) {
    throw new Error('Heading not found in ourStory sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract and split paragraphs by newlines
  if (!sectionData.paragraphs) {
    throw new Error('Paragraphs not found in ourStory sectionData. Please add paragraphs field in Strapi.');
  }
  const paragraphs = typeof sectionData.paragraphs === 'string'
    ? sectionData.paragraphs.split('\n').filter(para => para.trim())
    : sectionData.paragraphs;

  // Extract image - NO FALLBACK
  const image = sectionData.image;
  if (!image) {
    throw new Error('Image not found in ourStory sectionData. Please add image field in Strapi.');
  }
  if (!image.url) {
    throw new Error('Image URL is missing in ourStory sectionData. Please ensure the image is properly uploaded in Strapi.');
  }
  const imageUrl = getStrapiMedia(image);
  if (!imageUrl) {
    throw new Error('Failed to generate image URL from Strapi data.');
  }

  // Extract CTA - required, throw error if missing
  if (!sectionData.cta) {
    throw new Error('CTA not found in ourStory sectionData. Please add cta field in Strapi.');
  }
  if (!sectionData.cta.text || !sectionData.cta.href) {
    throw new Error('CTA data incomplete in ourStory sectionData. Please provide both text and href in Strapi.');
  }

  return {
    eyebrow: sectionData.eyebrow,
    heading,
    paragraphs,
    image: {
      url: imageUrl,
      alt: image.alternativeText || image.caption || '',
      width: image.width,
      height: image.height
    },
    cta: {
      text: sectionData.cta.text,
      href: sectionData.cta.href
    }
  };
}

/**
 * Map Strapi homepage ourPurpose data to OurPurpose component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted ourPurpose data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageOurPurposeData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const ourPurpose = data.ourPurpose;
  if (!ourPurpose) {
    throw new Error('OurPurpose data not found in Strapi response. Please add ourPurpose component to your homepage content.');
  }

  const sectionData = ourPurpose.sectionData;
  if (!sectionData) {
    throw new Error('OurPurpose sectionData not found in Strapi response. Please add sectionData to your ourPurpose component.');
  }

  // Extract eyebrow
  if (!sectionData.eyebrow) {
    throw new Error('Eyebrow not found in ourPurpose sectionData. Please add eyebrow field in Strapi.');
  }

  // Extract and split heading by newlines
  if (!sectionData.heading) {
    throw new Error('Heading not found in ourPurpose sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract and split paragraphs/description by newlines
  if (!sectionData.paragraphs) {
    throw new Error('Paragraphs not found in ourPurpose sectionData. Please add paragraphs field in Strapi.');
  }
  const description = typeof sectionData.paragraphs === 'string'
    ? sectionData.paragraphs.split('\n').filter(para => para.trim())
    : sectionData.paragraphs;

  // Extract cards - required, throw error if missing
  const cards = ourPurpose.cards;
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    throw new Error('Cards not found in ourPurpose data. Please add cards array in Strapi.');
  }

  // Map cards array
  const mappedCards = cards.map((card, index) => {
    if (!card.title) {
      throw new Error(`Card ${index + 1} is missing title. Please add title field in Strapi.`);
    }
    if (!card.description) {
      throw new Error(`Card ${index + 1} is missing description. Please add description field in Strapi.`);
    }
    // CTA is optional - only include when both text and href are present
    const hasCta = card.cta && card.cta.text && card.cta.href;

    // Split description by newlines
    const cardDescription = typeof card.description === 'string'
      ? card.description.split('\n').filter(line => line.trim())
      : card.description;

    return {
      id: card.id || index + 1,
      title: card.title,
      description: cardDescription,
      ...(hasCta && {
        ctaText: card.cta.text,
        ctaHref: card.cta.href
      })
    };
  });

  return {
    eyebrow: sectionData.eyebrow,
    heading,
    description,
    cards: mappedCards,
    // Image and CTA are optional - only include if not null
    ...(sectionData.image && {
      image: {
        url: getStrapiMedia(sectionData.image),
        alt: sectionData.image.alternativeText || sectionData.image.caption || '',
        width: sectionData.image.width,
        height: sectionData.image.height
      }
    }),
    ...(sectionData.cta && sectionData.cta.text && sectionData.cta.href && {
      cta: {
        text: sectionData.cta.text,
        href: sectionData.cta.href
      }
    })
  };
}

/**
 * Map Strapi homepage overview data to Overview component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted overview data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageOverviewData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const overView = data.overView;
  if (!overView) {
    throw new Error('Overview data not found in Strapi response. Please add overView component to your homepage content.');
  }

  const sectionData = overView.sectionData;
  if (!sectionData) {
    throw new Error('Overview sectionData not found in Strapi response. Please add sectionData to your overView component.');
  }

  // Extract eyebrow
  if (!sectionData.eyebrow) {
    throw new Error('Eyebrow not found in overview sectionData. Please add eyebrow field in Strapi.');
  }

  // Extract and split heading by newlines
  if (!sectionData.heading) {
    throw new Error('Heading not found in overview sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract stats - required, throw error if missing
  const stats = overView.stats;
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    throw new Error('Stats not found in overview data. Please add stats array in Strapi.');
  }

  // Map stats array - extract suffix from number if present, otherwise default to "+"
  const mappedStats = stats.map((stat, index) => {
    if (!stat.label) {
      throw new Error(`Stat ${index + 1} is missing label. Please add label field in Strapi.`);
    }
    if (!stat.number) {
      throw new Error(`Stat ${index + 1} is missing number. Please add number field in Strapi.`);
    }

    // Extract suffix from number if it exists (e.g., "15+", "100+")
    // Otherwise default to "+"
    let number = stat.number.toString().trim();
    let suffix = '+';

    // Check if number ends with a non-digit character (like +, %, etc.)
    const suffixMatch = number.match(/[^\d]+$/);
    if (suffixMatch) {
      suffix = suffixMatch[0];
      number = number.replace(/[^\d]+$/, '').trim();
    }

    return {
      number,
      suffix,
      label: stat.label,
      // Include CTA with fallback
      cta: {
        text: stat.cta?.text || 'Know More',
        href: stat.cta?.href || '#'
      }
    };
  });

  return {
    eyebrow: sectionData.eyebrow,
    heading,
    stats: mappedStats,
    // paragraphs, image, and cta are optional - only include if not null
    ...(sectionData.paragraphs && {
      paragraphs: typeof sectionData.paragraphs === 'string'
        ? sectionData.paragraphs.split('\n').filter(para => para.trim())
        : sectionData.paragraphs
    }),
    ...(sectionData.image && {
      image: {
        url: getStrapiMedia(sectionData.image),
        alt: sectionData.image.alternativeText || sectionData.image.caption || '',
        width: sectionData.image.width,
        height: sectionData.image.height
      }
    }),
    ...(sectionData.cta && sectionData.cta.text && sectionData.cta.href && {
      cta: {
        text: sectionData.cta.text,
        href: sectionData.cta.href
      }
    })
  };
}

/**
 * Map Strapi homepage ourBusiness data to OurBusiness component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted ourBusiness data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageOurBusinessData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const ourBusiness = data.ourBusiness;
  if (!ourBusiness) {
    throw new Error('OurBusiness data not found in Strapi response. Please add ourBusiness component to your homepage content.');
  }

  const sectionData = ourBusiness.sectionData;
  if (!sectionData) {
    throw new Error('OurBusiness sectionData not found in Strapi response. Please add sectionData to your ourBusiness component.');
  }

  // Extract heading - required
  if (!sectionData.heading) {
    throw new Error('Heading not found in ourBusiness sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract paragraphs/description - required
  if (!sectionData.paragraphs) {
    throw new Error('Paragraphs not found in ourBusiness sectionData. Please add paragraphs field in Strapi.');
  }
  const description = typeof sectionData.paragraphs === 'string'
    ? sectionData.paragraphs.split('\n').filter(para => para.trim())
    : sectionData.paragraphs;

  // Extract image - required
  if (!sectionData.image) {
    throw new Error('Image not found in ourBusiness sectionData. Please add image field in Strapi.');
  }
  if (!sectionData.image.url) {
    throw new Error('Image URL is missing in ourBusiness sectionData. Please ensure the image is properly uploaded in Strapi.');
  }
  const imageUrl = getStrapiMedia(sectionData.image);
  if (!imageUrl) {
    throw new Error('Failed to generate image URL from Strapi data.');
  }

  // Extract CTA - required
  if (!sectionData.cta) {
    throw new Error('CTA not found in ourBusiness sectionData. Please add cta field in Strapi.');
  }
  if (!sectionData.cta.text || !sectionData.cta.href) {
    throw new Error('CTA data incomplete in ourBusiness sectionData. Please provide both text and href in Strapi.');
  }

  return {
    heading,
    description,
    image: imageUrl,
    imageAlt: sectionData.image.alternativeText || sectionData.image.caption || 'Healthcare Professional with Patient',
    cta: {
      text: sectionData.cta.text,
      href: sectionData.cta.href
    },
    // Eyebrow is optional - only include if not null
    ...(sectionData.eyebrow && { eyebrow: sectionData.eyebrow })
  };
}

/**
 * Map Strapi homepage sustainability data to Sustainability component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted sustainability data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageSustainabilityData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const sustainability = data.sustainability;
  if (!sustainability) {
    throw new Error('Sustainability data not found in Strapi response. Please add sustainability component to your homepage content.');
  }

  const sectionData = sustainability.sectionData;
  if (!sectionData) {
    throw new Error('Sustainability sectionData not found in Strapi response. Please add sectionData to your sustainability component.');
  }

  // Extract eyebrow - required
  if (!sectionData.eyebrow) {
    throw new Error('Eyebrow not found in sustainability sectionData. Please add eyebrow field in Strapi.');
  }

  // Extract and split heading by newlines
  if (!sectionData.heading) {
    throw new Error('Heading not found in sustainability sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract paragraphs/description - required
  if (!sectionData.paragraphs) {
    throw new Error('Paragraphs not found in sustainability sectionData. Please add paragraphs field in Strapi.');
  }
  const description = typeof sectionData.paragraphs === 'string'
    ? sectionData.paragraphs.split('\n').filter(para => para.trim())
    : sectionData.paragraphs;

  // Extract image/backgroundImage - required
  if (!sectionData.image) {
    throw new Error('Image not found in sustainability sectionData. Please add image field in Strapi.');
  }
  if (!sectionData.image.url) {
    throw new Error('Image URL is missing in sustainability sectionData. Please ensure the image is properly uploaded in Strapi.');
  }
  const imageUrl = getStrapiMedia(sectionData.image);
  if (!imageUrl) {
    throw new Error('Failed to generate image URL from Strapi data.');
  }

  // Extract CTA - required
  if (!sectionData.cta) {
    throw new Error('CTA not found in sustainability sectionData. Please add cta field in Strapi.');
  }
  if (!sectionData.cta.text || !sectionData.cta.href) {
    throw new Error('CTA data incomplete in sustainability sectionData. Please provide both text and href in Strapi.');
  }

  return {
    eyebrow: sectionData.eyebrow,
    heading,
    description,
    backgroundImage: imageUrl,
    imageAlt: sectionData.image.alternativeText || sectionData.image.caption || 'Sustainability',
    cta: {
      text: sectionData.cta.text,
      href: sectionData.cta.href
    }
  };
}

/**
 * Map Strapi homepage CSR data to CSR component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted CSR data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageCSRData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const csr = data.csr;
  if (!csr) {
    throw new Error('CSR data not found in Strapi response. Please add csr component to your homepage content.');
  }

  const sectionData = csr.sectionData;
  if (!sectionData) {
    throw new Error('CSR sectionData not found in Strapi response. Please add sectionData to your csr component.');
  }

  // Extract eyebrow - required
  if (!sectionData.eyebrow) {
    throw new Error('Eyebrow not found in CSR sectionData. Please add eyebrow field in Strapi.');
  }

  // Extract heading - required
  if (!sectionData.heading) {
    throw new Error('Heading not found in CSR sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract subheading - at csr level, not sectionData
  if (!csr.subheading) {
    throw new Error('Subheading not found in CSR data. Please add subheading field in Strapi.');
  }

  // Extract paragraphs/description - required
  if (!sectionData.paragraphs) {
    throw new Error('Paragraphs not found in CSR sectionData. Please add paragraphs field in Strapi.');
  }
  const description = typeof sectionData.paragraphs === 'string'
    ? sectionData.paragraphs.split('\n').filter(para => para.trim())
    : sectionData.paragraphs;

  // Extract image - required
  if (!sectionData.image) {
    throw new Error('Image not found in CSR sectionData. Please add image field in Strapi.');
  }
  if (!sectionData.image.url) {
    throw new Error('Image URL is missing in CSR sectionData. Please ensure the image is properly uploaded in Strapi.');
  }
  const imageUrl = getStrapiMedia(sectionData.image);
  if (!imageUrl) {
    throw new Error('Failed to generate image URL from Strapi data.');
  }

  // Extract CTA - required
  if (!sectionData.cta) {
    throw new Error('CTA not found in CSR sectionData. Please add cta field in Strapi.');
  }
  if (!sectionData.cta.text || !sectionData.cta.href) {
    throw new Error('CTA data incomplete in CSR sectionData. Please provide both text and href in Strapi.');
  }

  return {
    eyebrow: sectionData.eyebrow,
    heading,
    subheading: csr.subheading,
    description,
    image: imageUrl,
    imageAlt: sectionData.image.alternativeText || sectionData.image.caption || 'CSR Activities',
    cta: {
      text: sectionData.cta.text,
      href: sectionData.cta.href
    }
  };
}

/**
 * Map Strapi homepage life data to Life component format
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted life data
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageLifeData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  const life = data.life;
  if (!life) {
    throw new Error('Life data not found in Strapi response. Please add life component to your homepage content.');
  }

  const sectionData = life.sectionData;
  if (!sectionData) {
    throw new Error('Life sectionData not found in Strapi response. Please add sectionData to your life component.');
  }

  // Extract heading - required
  if (!sectionData.heading) {
    throw new Error('Heading not found in life sectionData. Please add heading field in Strapi.');
  }
  const heading = typeof sectionData.heading === 'string'
    ? sectionData.heading.split('\n').filter(line => line.trim())
    : sectionData.heading;

  // Extract paragraphs/description - required
  if (!sectionData.paragraphs) {
    throw new Error('Paragraphs not found in life sectionData. Please add paragraphs field in Strapi.');
  }
  const description = typeof sectionData.paragraphs === 'string'
    ? sectionData.paragraphs.split('\n').filter(para => para.trim())
    : sectionData.paragraphs;

  // Extract image/backgroundImage - required
  if (!sectionData.image) {
    throw new Error('Image not found in life sectionData. Please add image field in Strapi.');
  }
  if (!sectionData.image.url) {
    throw new Error('Image URL is missing in life sectionData. Please ensure the image is properly uploaded in Strapi.');
  }
  const imageUrl = getStrapiMedia(sectionData.image);
  if (!imageUrl) {
    throw new Error('Failed to generate image URL from Strapi data.');
  }

  // Extract CTA - required
  if (!sectionData.cta) {
    throw new Error('CTA not found in life sectionData. Please add cta field in Strapi.');
  }
  if (!sectionData.cta.text || !sectionData.cta.href) {
    throw new Error('CTA data incomplete in life sectionData. Please provide both text and href in Strapi.');
  }

  return {
    heading,
    description,
    backgroundImage: imageUrl,
    imageAlt: sectionData.image.alternativeText || sectionData.image.caption || 'Life at Lupin',
    cta: {
      text: sectionData.cta.text,
      href: sectionData.cta.href
    },
    // Eyebrow is optional - only include if not null
    ...(sectionData.eyebrow && { eyebrow: sectionData.eyebrow })
  };
}

/**
 * Map Strapi homepage newsInsights data to NewsInsights component format
 * 
 * Expected Strapi structure:
 * {
 *   news: {
 *     titile: "News & Insights",  // Section title (note: typo in Strapi)
 *     items: [
 *       {
 *         id: number,
 *         date: "12 September, 2025",
 *         headline: "Headline text",
 *         circleInner: { image object },
 *         cta: { text: "Know More", href: "/" }
 *       }
 *     ]
 *   }
 * }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object} Formatted newsInsights data with structure:
 *   { title: string, items: [{ id, date, headline, image: { url, width, height, alt }, href }] }
 * @throws {Error} If required data is missing from Strapi
 */
export function mapHomepageNewsInsightsData(strapiData) {
  // Handle Strapi v4 response structure
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the homepage endpoint returns data.');
  }

  // Extract news object - required
  if (!data.news) {
    throw new Error('news not found in Strapi response. Please add news field in Strapi homepage.');
  }

  // Extract title from news.titile (note: typo in Strapi field name)
  const title = data.news.titile || data.news.title;
  if (!title) {
    throw new Error('News title not found in Strapi response. Please add titile or title field in news component.');
  }

  // Extract items array - required
  if (!data.news.items) {
    throw new Error('news.items not found in Strapi response. Please add items field in news component.');
  }
  if (!Array.isArray(data.news.items) || data.news.items.length === 0) {
    throw new Error('news.items is empty or not an array. Please add at least one item in Strapi.');
  }

  // Map each news item
  const items = data.news.items.map((item, index) => {
    if (!item.id) {
      throw new Error(`News item at index ${index} is missing id field. Please provide id in Strapi.`);
    }

    // Extract date - required
    if (!item.date) {
      throw new Error(`News item with id ${item.id} is missing date field. Please add date in Strapi.`);
    }

    // Extract headline - required
    if (!item.headline) {
      throw new Error(`News item with id ${item.id} is missing headline field. Please add headline in Strapi.`);
    }

    // Extract circleInner image - required
    if (!item.circleInner) {
      throw new Error(`News item with id ${item.id} is missing circleInner field. Please add circleInner image in Strapi.`);
    }
    if (!item.circleInner.url) {
      throw new Error(`News item with id ${item.id} has circleInner but image URL is missing. Please ensure the image is properly uploaded in Strapi.`);
    }
    const imageUrl = getStrapiMedia(item.circleInner);
    if (!imageUrl) {
      throw new Error(`Failed to generate image URL for news item with id ${item.id}.`);
    }

    // Extract CTA href - required
    if (!item.cta) {
      throw new Error(`News item with id ${item.id} is missing cta field. Please add cta in Strapi.`);
    }
    if (!item.cta.href) {
      throw new Error(`News item with id ${item.id} has cta but href is missing. Please provide href in Strapi.`);
    }

    return {
      id: item.id,
      date: item.date,
      headline: item.headline,
      image: {
        url: imageUrl,
        width: item.circleInner.width || 627,
        height: item.circleInner.height || 627,
        alt: item.circleInner.alternativeText || item.circleInner.caption || ''
      },
      href: item.cta.href
    };
  });

  return {
    title: title,
    items: items
  };
}

/**
 * Fetch global settings from Strapi (header, footer, etc.)
 */
export async function getGlobalSettings() {
  return fetchAPI('global?populate=deep', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
}

/**
 * Fetch analyst coverage data from Strapi
 * This is a Single Type, so it returns one entry with AnalystCard array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getAnalystCoverage() {
  // Populate TopBanner and AnalystCard
  return fetchAPI('analyst-coverage?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[AnalystCard][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map analyst coverage data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array} Mapped analyst data array
 */
export function mapAnalystCoverageData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the analyst-coverage endpoint returns data.');
  }

  // Map AnalystCard array to component format
  const analystCards = Array.isArray(data.AnalystCard)
    ? data.AnalystCard.map((card, index) => ({
      id: card.id || index + 1,
      institution: card.company_name || '',
      analyst: card.name || '',
      email: card.email || '',
      isActive: false // Default to false, can be set in Strapi if needed
    }))
    : [];

  return analystCards;
}

/**
 * Fetch policy data from Strapi
 * This is a Single Type, so it returns one entry with PdfCard array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
/* export async function getPolicy() {
  // Populate TopBanner, PdfCard and pdf media
  return fetchAPI('policy?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[PdfCard][populate][pdf][populate]=*', {
    cache: 'no-store',
  });
} */

/**
 * Map policy data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped policy data for component
 */
export function mapPolicyData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the policy endpoint returns data.');
  }

  // Map PdfCard array to component format
  const policies = Array.isArray(data.PdfCard)
    ? data.PdfCard.map((card) => {
      const pdf = card.pdf?.data?.attributes || card.pdf;
      const pdfUrl = pdf ? getStrapiMedia(pdf) : null;

      return {
        id: card.id,
        title: card.title || '',
        pdfUrl: normalizeUploadUrl(pdfUrl) || '#',
        isActive: card.isActive !== undefined ? card.isActive : false,
        publishedDate: card.publishedDate || null
      };
    })
    : [];

  // Return in component-expected format
  return {
    policies: policies,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorativeGroup: "/assets/policies/group.svg"
    }
  };
}

/**
 * Fetch financial data from Strapi
 * This is a Single Type, so it returns one entry with PdfCard array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getFinancial() {
  // Populate TopBanner, PdfCard and pdf media
  return fetchAPI('financial?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[PdfCard][populate][pdf][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map financial data from Strapi for Related Party Transactions
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array} Mapped related party transactions cards
 */
export function mapFinancialData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the financial endpoint returns data.');
  }

  // Map PdfCard array to component format
  const relatedPartyTransactions = Array.isArray(data.PdfCard)
    ? data.PdfCard.map((card) => {
      const pdf = card.pdf?.data?.attributes || card.pdf;
      const pdfUrl = pdf ? getStrapiMedia(pdf) : null;

      return {
        id: card.id,
        title: card.title || '',
        pdfUrl: normalizeUploadUrl(pdfUrl) || '#',
        isActive: card.isActive !== undefined ? card.isActive : false,
        publishedDate: card.publishedDate || null
      };
    })
    : [];

  return relatedPartyTransactions;
}

/**
 * Map TopBanner component from Strapi to InnerBanner format
 * 
 * @param {Object} topBanner - TopBanner component from Strapi
 * @returns {Object|null} Mapped banner data for InnerBanner component or null
 */
export function mapTopBannerData(topBanner) {
  // Use chaining method with fallbacks - return null if no banner data
  if (!topBanner) return null;

  // Get desktop and mobile images using optional chaining with fallbacks
  // Support both direct structure (DesktopImage) and nested structure (DesktopImage.data.attributes)
  // Also support snake_case (desktop_image) for backward compatibility
  const desktopImage = topBanner?.DesktopImage?.data?.attributes
    || topBanner?.DesktopImage
    || topBanner?.desktop_image?.data?.attributes
    || topBanner?.desktop_image;

  const mobileImage = topBanner?.MobileImage?.data?.attributes
    || topBanner?.MobileImage
    || topBanner?.mobile_image?.data?.attributes
    || topBanner?.mobile_image;

  // Get URLs for both desktop and mobile images
  const desktopImageUrl = desktopImage ? getStrapiMedia(desktopImage) : null;
  const mobileImageUrl = mobileImage ? getStrapiMedia(mobileImage) : null;

  // Use desktop image as primary banner, fallback to mobile if desktop not available
  const bannerImage = desktopImage || mobileImage;
  const bannerImageUrl = desktopImageUrl || mobileImageUrl;

  // Get heading and subheading using optional chaining with fallbacks
  // Support both camelCase (Heading, SubHeading) and legacy fields (BannerTitle, subHeading)
  const heading = topBanner?.Heading || topBanner?.heading || topBanner?.BannerTitle || '';
  const subHeading = topBanner?.SubHeading || topBanner?.subHeading || '';
  const subHeadingEnabled = topBanner?.SubHeadingText || topBanner?.SubHeadingText || false;

  // Parse heading - could be single line or two lines separated by newline/space
  const titleParts = heading ? heading.split(/\n|\\n/).filter(part => part.trim()) : [];

  // Use Heading as line1, SubHeading as line2, or split Heading if SubHeading not available
  const line1 = titleParts[0]?.trim() || '';
  const line2 = titleParts[1]?.trim() || '';

  // Build banner data object
  const bannerData = {
    title: {
      line1: line1,
      line2: line2,
    },
    subHeading: {
      text: subHeading || '',
      enabled: subHeadingEnabled
    },
    images: {}
  };

  // Add desktop banner image if available
  if (desktopImageUrl && desktopImage) {
    bannerData.images.banner = {
      url: desktopImageUrl,
      alt: desktopImage?.alternativeText || desktopImage?.caption || 'Banner image'
    };
  }

  // Add mobile banner image if available (for responsive display)
  if (mobileImageUrl && mobileImage) {
    bannerData.images.bannerMobile = {
      url: mobileImageUrl,
      alt: mobileImage?.alternativeText || mobileImage?.caption || 'Banner image mobile'
    };
  }

  // Fallback: if no desktop but mobile exists, use mobile as banner
  if (!bannerData.images.banner && mobileImageUrl && mobileImage) {
    bannerData.images.banner = {
      url: mobileImageUrl,
      alt: mobileImage?.alternativeText || mobileImage?.caption || 'Banner image'
    };
  }

  // Add petal image (default - can be overridden if needed)
  bannerData.images.petal = {
    url: "/assets/inner-banner/petal-2.svg",
    alt: "Decorative petal"
  };

  return bannerData;
}

/**
 * Fetch about-us data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner and Topfold content
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getAboutUs() {
  // Populate TopBanner, Topfold, and Fold sections content
  return fetchAPI('about-us?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[Topfold][populate]=*&populate[folds][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map about-us topfold data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped topfold data
 */
export function mapAboutUsTopfoldData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const topfold = data.Topfold || data.topfold;
  if (!topfold) {
    return null;
  }

  // Extract heading - can be string or array
  let heading = topfold.heading || topfold.title || '';
  if (typeof heading === 'string') {
    // Split by newlines or common separators
    heading = heading.split(/\n|, | - /).filter(line => line.trim());
  }
  if (!Array.isArray(heading) || heading.length === 0) {
    return null;
  }

  // Extract description/paragraph
  const description = topfold.description || topfold.paragraph || topfold.text || '';

  return {
    heading: heading,
    description: description
  };
}

/**
 * Map about-us folds data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped folds data with text content for each fold
 */
export function mapAboutUsFoldsData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  // Check if folds is an array or object
  const folds = data.folds || data.Folds;

  if (!folds) {
    return null;
  }

  // If folds is an array, map each fold
  if (Array.isArray(folds)) {
    return folds.map(fold => ({
      heading: fold.heading || fold.title || 'Our Purpose',
      text: fold.text || fold.content || fold.description || '',
    }));
  }

  // If folds is an object with teal and green properties
  if (folds.teal || folds.green) {
    return {
      teal: {
        heading: folds.teal?.heading || folds.teal?.title || 'Our Purpose',
        text: folds.teal?.text || folds.teal?.content || folds.teal?.description || ''
      },
      green: {
        heading: folds.green?.heading || folds.green?.title || 'Our Purpose',
        text: folds.green?.text || folds.green?.content || folds.green?.description || ''
      }
    };
  }

  // If folds is an array of fold objects
  if (Array.isArray(folds) && folds.length > 0) {
    return folds.map((fold, index) => ({
      heading: fold.heading || fold.title || 'Our Purpose',
      text: fold.text || fold.content || fold.description || '',
      index: index
    }));
  }

  // Single fold object
  return {
    heading: folds.heading || folds.title || 'Our Purpose',
    text: folds.text || folds.content || folds.description || ''
  };
}

/**
 * Fetch our-values data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner and ContentSection
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurValues() {
  // Populate TopBanner and ContentSection with decoration image
  return fetchAPI('our-values?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[ContentSection][populate][decoration][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map our-values content section data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped content section data
 */
export function mapOurValuesContentData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const contentSection = data.ContentSection || data.contentSection;
  if (!contentSection) {
    return null;
  }

  // Extract heading
  const heading = contentSection.heading || contentSection.title || '';

  // Extract description
  const description = contentSection.description || contentSection.text || contentSection.paragraph || '';

  // Extract decoration image
  const decoration = contentSection.decoration?.data?.attributes || contentSection.decoration;
  const decorationUrl = decoration ? getStrapiMedia(decoration) : null;

  return {
    heading: heading,
    description: description,
    decoration: decorationUrl ? {
      url: decorationUrl,
      alt: decoration.alternativeText || decoration.caption || 'Decorative element',
      width: decoration.width || 1228,
      height: decoration.height || 576
    } : null
  };
}

/**
 * Fetch community data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner and InfoSection
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getCommunity() {
  // Populate all fields from the community single type
  // Structure:
  // - TopBanner: DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
  // - PageIntroSection: Image, PageIntroContent
  // - ImpactSection: SectionTitle, ImpactHeadingSection (repeatable), Map, MetricSection (repeatable)
  // - LivelihoodSection: SectionTitle, Heading, Description, Image (GlobalImage with DesktopImage, MobileImage)
  // - TabSectionDetails (repeatable): TabTitle, isActive, TabSectionData (with SectionHeading, KeyHighlites, SectionData)
  // - LiveProgramSection: Heading, SubHeading, Description, Image, KeyHighlitesSection, SectionData
  return fetchAPI(
    'community?' +
    // TopBanner
    'populate[TopBanner][populate][DesktopImage][populate]=*&' +
    'populate[TopBanner][populate][MobileImage][populate]=*&' +
    // PageIntroSection
    'populate[PageIntroSection][populate][Image][populate]=*&' +
    // ImpactSection
    'populate[ImpactSection][populate][ImpactHeadingSection][populate]=*&' +
    'populate[ImpactSection][populate][Map][populate]=*&' +
    'populate[ImpactSection][populate][MetricSection][populate][Icon][populate]=*&' +
    // LivelihoodSection
    'populate[LivelihoodSection][populate][Image][populate][DesktopImage][populate]=*&' +
    'populate[LivelihoodSection][populate][Image][populate][MobileImage][populate]=*&' +
    // TabSectionDetails (repeatable) - nested TabSectionData
    'populate[TabSectionDetails][populate][TabSectionData][populate][SectionHeading][populate][Image][populate]=*&' +
    'populate[TabSectionDetails][populate][TabSectionData][populate][KeyHighlites][populate][KeyHighlites][populate][Icon][populate]=*&' +
    'populate[TabSectionDetails][populate][TabSectionData][populate][SectionData][populate][Image][populate]=*&' +
    // LiveProgramSection
    'populate[LiveProgramSection][populate][Image][populate]=*&' +
    'populate[SectionData]=*&' +
    'populate[LiveProgramSection][populate][KeyHighlitesSection][populate][KeyHighlites][populate][Icon][populate]=*',
    {
      cache: 'no-store',
    }
  );
}



/**
 * Map community info section data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped info section data with paragraphs and image
 */
export function mapCommunityInfoData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const pageIntroSection = data.PageIntroSection || data.pageIntroSection;
  if (!pageIntroSection) {
    return null;
  }

  // Get content directly from API data - similar to mapGlobalGenericsComplexData
  const content = pageIntroSection.PageIntroContent || pageIntroSection.content || pageIntroSection.description || pageIntroSection.text || '';

  // Get image data
  const image = pageIntroSection.Image || pageIntroSection.image;
  let imageUrl = null;
  let imageAlt = '';
  let imageWidth = null;
  let imageHeight = null;

  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else {
      // Use getStrapiMedia to get full URL from Strapi media object
      imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
      imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
      imageWidth = image?.width || null;
      imageHeight = image?.height || null;
    }
  }

  return {
    content: content,
    image: imageUrl ? {
      url: imageUrl,
      alt: imageAlt,
      width: imageWidth,
      height: imageHeight
    } : null
  };
}

/**
 * Map community livelihood section data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped livelihood section data
 */
export function mapLivelihoodSectionData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const livelihoodSection = data?.LivelihoodSection || data?.livelihoodSection;
  if (!livelihoodSection) {
    return null;
  }

  // Extract SectionTitle as heading
  const heading = livelihoodSection?.SectionTitle || '';

  // Extract Heading as subheading
  const subheading = livelihoodSection?.Heading || '';

  // Extract Description (Rich text Markdown) - split into paragraphs
  const description = livelihoodSection?.Description || '';
  let paragraphs = [];
  if (description) {
    // Split by double newlines to create paragraphs
    paragraphs = description.split(/\n\n+/).filter(p => p.trim());
    // If no double newlines, split by single newlines
    if (paragraphs.length === 1) {
      paragraphs = description.split(/\n+/).filter(p => p.trim());
    }
  }

  // Extract Image component (GlobalImage)
  const imageComponent = livelihoodSection?.Image;
  const desktopImage = imageComponent?.DesktopImage;
  const mobileImage = imageComponent?.MobileImage;

  // Get image URLs
  const desktopImageUrl = desktopImage ? getStrapiMedia(desktopImage) : null;
  const mobileImageUrl = mobileImage ? getStrapiMedia(mobileImage) : null;

  return {
    heading,
    subheading,
    paragraphs,
    backgroundImage: desktopImageUrl,
    mobileImage: mobileImageUrl
  };
}

/**
 * Map community livelihood tabs data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array} Mapped tabs data
 */
export function mapLivelihoodTabsData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const tabSectionDetails = data?.TabSectionDetails || data?.tabSectionDetails;
  if (!tabSectionDetails || !Array.isArray(tabSectionDetails)) {
    return null;
  }

  // Map each tab from TabSectionDetails
  const mappedTabs = tabSectionDetails
    .filter(tab => tab?.isActive !== false)
    .map((tab, index) => {
      const tabId = parseInt(tab?.id) || index + 1;

      // Extract TabTitle
      const title = tab?.TabTitle || '';

      // Extract TabSectionData
      const tabSectionData = tab?.TabSectionData;
      if (!tabSectionData) {
        return {
          id: tabId,
          title: title,
          content: null
        };
      }

      // Extract SectionHeading
      const sectionHeading = tabSectionData?.SectionHeading;
      let heading = '';
      let description = '';
      let image = null;
      let imagePosition = 'Right';

      if (sectionHeading) {
        heading = sectionHeading?.Heading || '';
        description = sectionHeading?.Description || '';
        imagePosition = sectionHeading?.Image_Position || 'Right';

        const headingImage = sectionHeading?.Image;
        if (headingImage) {
          const imageUrl = getStrapiMedia(headingImage);
          if (imageUrl) {
            image = {
              url: imageUrl,
              alt: headingImage?.alternativeText || headingImage?.caption || heading || 'Tab Image',
              width: headingImage?.width || 600,
              height: headingImage?.height || 600
            };
          }
        }
      }

      // Split description into paragraphs
      let paragraphs = [];
      if (description) {
        paragraphs = description.split(/\n\n+/).filter(p => p.trim());
        if (paragraphs.length === 1) {
          paragraphs = description.split(/\n+/).filter(p => p.trim());
        }
      }

      // Extract KeyHighlites
      const keyHighlites = tabSectionData?.KeyHighlites || [];
      let highlights = [];
      if (keyHighlites.length > 0) {
        // Get the first KeyHighlites object (it has SectionTitle and KeyHighlites array)
        const keyHighlitesSection = keyHighlites[0];
        const keyHighlitesArray = keyHighlitesSection?.KeyHighlites || [];

        highlights = keyHighlitesArray.map((item) => {
          // Format number with commas
          const formatNumber = (num) => {
            if (num === null || num === undefined || num === '') {
              return '';
            }
            if (typeof num === 'string') {
              const cleanNum = num.replace(/,/g, '').trim();
              if (!cleanNum) return '';
              if (isNaN(parseFloat(cleanNum))) return cleanNum;
              return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            if (typeof num === 'number') {
              return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            return num.toString();
          };

          const formattedValue = formatNumber(item?.Value);
          const suffix = item?.Suffix || '';
          const displayNumber = suffix ? `${formattedValue}${suffix}` : formattedValue;

          const icon = item?.Icon;
          const iconUrl = icon ? getStrapiMedia(icon) : null;

          return {
            id: item?.id || Math.random(),
            number: displayNumber,
            description: item?.Description || '',
            icon: iconUrl
          };
        });
      }

      // Extract SectionData (Market Quote)
      const sectionData = tabSectionData?.SectionData;
      let quoteData = null;
      if (sectionData) {
        const quoteDescription = sectionData?.Description || '';
        const quoteHeading = sectionData?.Heading || '';

        // Parse heading to extract author and designation
        // Format: "Chotelal Saini Farmer" or "Pankaj Kumbhare CEO Mankaimata FPC"
        let author = '';
        let designation = '';
        if (quoteHeading) {
          const parts = quoteHeading.split(/\s+/);
          if (parts.length >= 2) {
            author = parts.slice(0, -1).join(' ');
            designation = parts[parts.length - 1];
          } else {
            author = quoteHeading;
          }
        }

        const quoteImage = sectionData?.Image;
        const quoteImageUrl = quoteImage ? getStrapiMedia(quoteImage) : null;

        quoteData = {
          quote: quoteDescription,
          author: author,
          designation: designation,
          image: quoteImageUrl ? {
            url: quoteImageUrl,
            alt: quoteImage?.alternativeText || quoteImage?.caption || author || 'Quote Image',
            width: quoteImage?.width || 332,
            height: quoteImage?.height || 330
          } : null
        };
      }

      return {
        id: tabId,
        title: title,
        content: {
          heading: heading,
          paragraphs: paragraphs,
          image: image,
          imagePosition: imagePosition,
          highlights: highlights,
          quote: quoteData
        }
      };
    });

  return mappedTabs.length > 0 ? mappedTabs : null;
}

/**
 * Map community impact section data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped impact section data
 */
export function mapImpactSectionData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const impactSection = data?.ImpactSection || data?.impactSection;
  if (!impactSection) {
    return null;
  }

  // Map ImpactHeadingSection (for subtitle)
  const impactHeadingSection = impactSection?.ImpactHeadingSection || [];
  const headings = impactHeadingSection
    .filter(item => item?.isActive !== false)
    .map((item) => ({
      value: item?.Value || 0,
      description: item?.Description || ''
    }));

  // Create subtitle from headings (e.g., "8 states | 26 districts | 5,431 villages...")
  const subtitle = headings
    .map(h => {
      // Format number with commas (e.g., 5431 -> 5,431)
      const formattedValue = Number(h.value).toLocaleString('en-US');
      return `${formattedValue} ${h.description}`;
    })
    .join(' | ');

  // Map MetricSection
  const metricSection = impactSection?.MetricSection || [];
  const metrics = metricSection.map((metric) => {
    // Format number with commas
    const formatNumber = (num) => {
      if (num === null || num === undefined || num === '') {
        return '';
      }
      if (typeof num === 'string') {
        const cleanNum = num.replace(/,/g, '').trim();
        if (!cleanNum) return '';
        if (isNaN(parseFloat(cleanNum))) return cleanNum;
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      if (typeof num === 'number') {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return num.toString();
    };

    const formattedValue = formatNumber(metric?.Value);
    const suffix = metric?.Suffix || '';
    const displayNumber = suffix ? `${formattedValue}${suffix}` : formattedValue;

    // Get icon URL from Strapi
    const icon = metric?.Icon;
    const iconUrl = icon ? getStrapiMedia(icon) : null;

    return {
      id: metric?.id || Math.random(),
      number: displayNumber,
      description: metric?.Description || '',
      icon: iconUrl
    };
  });

  // Get map URL from Strapi
  const mapImage = impactSection?.Map;
  const mapUrl = mapImage ? getStrapiMedia(mapImage) : null;

  return {
    title: impactSection?.SectionTitle || null,
    subtitle: subtitle || null,
    map: mapUrl,
    metrics: metrics
  };
}

/**
 * Map community live program section data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped live program section data
 */
export function mapLiveProgramSectionData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const liveProgramSection = data?.LiveProgramSection || data?.liveProgramSection;
  if (!liveProgramSection) {
    return null;
  }

  // Extract Heading
  const title = liveProgramSection?.Heading || '';

  // Extract SubHeading
  const subtitle = liveProgramSection?.SubHeading || '';

  // Extract Description (Rich text Markdown) - split into paragraphs
  const description = liveProgramSection?.Description || '';
  let paragraphs = [];
  if (description) {
    // Split by double newlines to create paragraphs
    paragraphs = description.split(/\n\n+/).filter(p => p.trim());
    // If no double newlines, split by single newlines
    if (paragraphs.length === 1) {
      paragraphs = description.split(/\n+/).filter(p => p.trim());
    }
  }

  // Convert paragraphs to content array format
  const content = paragraphs.map(para => ({
    type: 'paragraph',
    text: para
  }));

  // Extract Image
  const programImage = liveProgramSection?.Image;
  const imageUrl = programImage ? getStrapiMedia(programImage) : null;
  const image = imageUrl ? {
    url: imageUrl,
    alt: programImage?.alternativeText || programImage?.caption || 'Lives Program',
    width: programImage?.width || 872,
    height: programImage?.height || 600
  } : null;

  // Extract KeyHighlitesSection
  const keyHighlitesSection = liveProgramSection?.KeyHighlitesSection;
  const keyHighlitesArray = keyHighlitesSection?.KeyHighlites || [];

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') {
      return '';
    }
    if (typeof num === 'string') {
      const cleanNum = num.replace(/,/g, '').trim();
      if (!cleanNum) return '';
      if (isNaN(parseFloat(cleanNum))) return cleanNum;
      return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    if (typeof num === 'number') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return num.toString();
  };

  const highlights = keyHighlitesArray.map((item) => {
    const formattedValue = formatNumber(item?.Value);
    const suffix = item?.Suffix || '';
    const displayNumber = suffix ? `${formattedValue}${suffix}` : formattedValue;

    const icon = item?.Icon;
    const iconUrl = icon ? getStrapiMedia(icon) : null;

    return {
      id: item?.id || Math.random(),
      number: displayNumber,
      description: item?.Description || '',
      icon: iconUrl
    };
  });

  return {
    title: title,
    subtitle: subtitle,
    content: content,
    image: image,
    highlights: highlights
  };
}

/**
 * Map community key highlights data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array} Mapped highlights data
 */
export function mapKeyHighlightsData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const keyHighlights = data.KeyHighlights || data.keyHighlights;
  if (!keyHighlights || !keyHighlights.highlights || !Array.isArray(keyHighlights.highlights)) {
    return null;
  }

  // Map each highlight
  const mappedHighlights = keyHighlights.highlights.map((highlight, index) => {
    const highlightId = highlight.id || index + 1;

    return {
      id: highlightId,
      number: highlight.number || highlight.metric || '',
      description: highlight.description || highlight.text || ''
    };
  });

  return mappedHighlights.length > 0 ? mappedHighlights : null;
}

/**
 * Fetch leaders page data from Strapi
 * Populates TopBanner with nested data
 */
export async function getLeaders() {
  return fetchAPI('leaders?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Fetch ethics-compliance-governance page data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner, Pledge, and TextContent
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getEthicsComplianceGovernance() {
  return fetchAPI('ethics-compliance-governance?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[Pledge][populate]=*&populate[TextContent][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map ethics-compliance-governance pledge data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object|null} Mapped pledge data
 */
export function mapEthicsPledgeData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const pledge = data.Pledge || data.pledge;
  if (!pledge) {
    return null;
  }

  return {
    text: pledge.text || pledge.content || ''
  };
}

/**
 * Map ethics-compliance-governance text content data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array|null} Mapped paragraphs array
 */
export function mapEthicsTextContentData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const textContent = data.TextContent || data.textContent;
  if (!textContent) {
    return null;
  }

  // Handle paragraphs - can be array, string with newlines, or single text field
  let paragraphs = [];

  if (Array.isArray(textContent.paragraphs)) {
    paragraphs = textContent.paragraphs;
  } else if (textContent.content) {
    // If content is a string, split by double newlines or use as single paragraph
    if (typeof textContent.content === 'string') {
      paragraphs = textContent.content.split(/\n\n+/).filter(p => p.trim());
    } else if (Array.isArray(textContent.content)) {
      paragraphs = textContent.content;
    }
  } else if (textContent.text) {
    paragraphs = textContent.text.split(/\n\n+/).filter(p => p.trim());
  }

  return paragraphs.length > 0 ? paragraphs : null;
}

/**
 * Fetch global-presence page data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner and content sections
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getGlobalPresence() {
  return fetchAPI('global-presence?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[ContentBox][populate][icon][populate]=*&populate[CountrySections][populate][image][populate]=*&populate=*', {
    cache: 'no-store',
  });
}

/**
 * Fetch global-technical-operations page data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner and content sections
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getGlobalTechnicalOperations() {
  return fetchAPI('global-technical-operations?populate[TopBanner][populate][desktop_image][populate]=*&populate[TopBanner][populate][mobile_image][populate]=*&populate[GTOTabs][populate][tabs][populate][sections][populate][image][populate]=*&populate[GTOTabs][populate][tabs][populate][sections][populate][link][populate]=*&populate=*', {
    cache: 'no-store',
  });
}

/**
 * Map global-technical-operations tabs data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object|null} Mapped tabs data
 */
export function mapGTOTabsData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const gtoTabs = data.GTOTabs || data.gtoTabs;
  if (!gtoTabs || !gtoTabs.tabs || !Array.isArray(gtoTabs.tabs)) {
    return null;
  }

  // Map each tab
  const mappedTabs = gtoTabs.tabs.map((tab, index) => {
    const tabId = tab.id || tab.slug || `tab-${index + 1}`;
    const tabLabel = tab.label || tab.title || tab.name || '';

    // Map sections for this tab
    const sections = Array.isArray(tab.sections)
      ? tab.sections.map((section, sectionIndex) => {
        // Extract heading
        const heading = section.heading || section.title || '';

        // Extract paragraphs - can be array or string
        let paragraphs = section.paragraphs || section.paragraph || section.text || section.description || [];
        if (typeof paragraphs === 'string') {
          // Split by double newlines or single newlines
          paragraphs = paragraphs.split(/\n\n+/).filter(p => p.trim());
          if (paragraphs.length === 0 && section.text) {
            paragraphs = [section.text];
          }
        }
        if (!Array.isArray(paragraphs)) {
          paragraphs = paragraphs ? [paragraphs] : [];
        }

        // Extract image
        const image = section.image?.data?.attributes || section.image;
        const imageUrl = image ? getStrapiMedia(image) : null;

        // Extract link/CTA
        const link = section.link || section.cta;
        const linkData = link ? {
          text: link.text || link.label || '',
          href: link.href || link.url || '#'
        } : null;

        // Extract imageFirst flag (controls layout - image first or text first)
        const imageFirst = section.imageFirst !== undefined ? section.imageFirst : undefined;

        return {
          heading,
          paragraphs,
          image: imageUrl ? {
            url: imageUrl,
            alt: image.alternativeText || image.caption || section.imageAlt || '',
            width: image.width,
            height: image.height
          } : null,
          link: linkData,
          imageFirst: imageFirst
        };
      })
      : [];

    return {
      id: tabId,
      label: tabLabel,
      dataNodeId: tab.dataNodeId || null,
      sections: sections
    };
  });

  return mappedTabs.length > 0 ? mappedTabs : null;
}

/**
 * Map global-presence content box data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object|null} Mapped content box data
 */
export function mapGlobalPresenceContentBoxData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const contentBox = data.ContentBox || data.contentBox;
  if (!contentBox) {
    return null;
  }

  // Get icon - can be media object or URL string
  let iconUrl = '/assets/images/icon-global-presence.svg'; // default
  if (contentBox.icon) {
    if (typeof contentBox.icon === 'string') {
      iconUrl = contentBox.icon;
    } else if (contentBox.icon.url) {
      iconUrl = getStrapiMedia(contentBox.icon);
    } else if (contentBox.icon.data?.attributes?.url) {
      iconUrl = getStrapiMedia(contentBox.icon.data.attributes);
    }
  }

  return {
    heading: contentBox.heading || contentBox.title || '',
    paragraph: contentBox.paragraph || contentBox.text || contentBox.description || '',
    icon: iconUrl
  };
}

/**
 * Map global-presence country sections data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array|null} Mapped country sections array
 */
export function mapGlobalPresenceCountrySectionsData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const countrySections = data.CountrySections || data.countrySections || data.countries;
  if (!countrySections || !Array.isArray(countrySections)) {
    return null;
  }

  // Map each country section
  return countrySections.map((country, index) => {
    // Get image - can be media object or URL string
    let imageUrl = '/assets/global-presence/image-usa.png'; // default
    if (country.image) {
      if (typeof country.image === 'string') {
        imageUrl = country.image;
      } else if (country.image.url) {
        imageUrl = getStrapiMedia(country.image);
      } else if (country.image.data?.attributes?.url) {
        imageUrl = getStrapiMedia(country.image.data.attributes);
      }
    }

    return {
      id: country.id || index + 1,
      name: country.name || country.title || country.country || '',
      description: country.description || country.text || country.paragraph || '',
      image: imageUrl,
      imageAlt: country.imageAlt || country.image?.alternativeText || `${country.name || 'Country'} Office`,
      websiteUrl: country.websiteUrl || country.website || country.url || '#',
      ctaText: country.ctaText || country.buttonText || 'Visit Website',
      order: country.order !== undefined ? country.order : index
    };
  }).sort((a, b) => a.order - b.order); // Sort by order field
}

/**
 * Map our-manufacturing-sites intro section data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object|null} Mapped intro section data
 */
export function mapManufacturingIntroData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return null;
  }

  const introSection = data.IntroSection || data.introSection || data.Introduction || data.introduction;
  if (!introSection) {
    return null;
  }

  return {
    text: introSection.text || introSection.description || introSection.content || ''
  };
}

/**
 * Map Strapi Science Intro data to ScienceIntro component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { IntroSection: { headingLine1: "...", headingLine2: "...", description: "..." } }
 * 2. { introSection: { heading: { line1: "...", line2: "..." }, description: "..." } }
 * 3. { Introduction: { headingLine1: "...", headingLine2: "...", text: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted intro data with structure:
 *   { heading: { line1: string, line2: string }, description: string }
 */
export function mapScienceIntroData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const introSection = data.IntroSection || data.introSection || data.Introduction || data.introduction;
  if (!introSection) return null;

  // Handle different heading structures
  let headingLine1 = '';
  let headingLine2 = '';

  if (introSection.heading) {
    if (typeof introSection.heading === 'object') {
      headingLine1 = introSection.heading.line1 || introSection.heading.lineOne || '';
      headingLine2 = introSection.heading.line2 || introSection.heading.lineTwo || '';
    } else if (Array.isArray(introSection.heading)) {
      headingLine1 = introSection.heading[0] || '';
      headingLine2 = introSection.heading[1] || '';
    }
  } else {
    headingLine1 = introSection.headingLine1 || introSection.heading_line1 || '';
    headingLine2 = introSection.headingLine2 || introSection.heading_line2 || '';
  }

  const description = introSection.description || introSection.text || introSection.paragraph || '';

  return {
    heading: {
      line1: headingLine1,
      line2: headingLine2
    },
    description: description
  };
}

/**
 * Map Strapi Science Research data to ScienceResearch component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { ResearchSection: { heading: "...", content: ["...", "..."], image: { url: "...", alt: "..." } } }
 * 2. { researchSection: { title: "...", paragraphs: ["...", "..."], image: "..." } }
 * 3. { Research: { heading: "...", text: "...", imageUrl: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted research data with structure:
 *   { heading: string, content: string[], image: { url: string, alt: string } }
 */
export function mapScienceResearchData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const researchSection = data.ResearchSection || data.researchSection || data.Research || data.research;
  if (!researchSection) return null;

  const heading = researchSection.heading || researchSection.title || researchSection.headingLine || '';

  let content = [];
  if (researchSection.content && Array.isArray(researchSection.content)) {
    content = researchSection.content;
  } else if (researchSection.paragraphs && Array.isArray(researchSection.paragraphs)) {
    content = researchSection.paragraphs;
  } else if (researchSection.text) {
    // If it's a single string, split by sentences or paragraphs
    content = typeof researchSection.text === 'string'
      ? researchSection.text.split(/\n\n+/).filter(p => p.trim())
      : [researchSection.text];
  } else if (Array.isArray(researchSection)) {
    content = researchSection;
  }

  const image = researchSection.image || researchSection.imageData;
  const imageUrl = typeof image === 'string'
    ? image
    : image?.url || image?.src || researchSection.imageUrl || '';
  const imageAlt = typeof image === 'object'
    ? (image?.alt || image?.altText || '')
    : '';

  return {
    heading: heading,
    content: content.length > 0 ? content : [],
    image: {
      url: imageUrl,
      alt: imageAlt
    }
  };
}

/**
 * Map Strapi Science Digital data to ScienceDigital component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { DigitalSection: { mainHeading: "...", introParagraph: "...", sectionHeading: { line1: "...", line2: "..." }, description: "...", image: { url: "...", alt: "..." } } }
 * 2. { digitalSection: { heading: "...", intro: "...", title: { line1: "...", line2: "..." }, text: "...", image: "..." } }
 * 3. { Digital: { mainHeading: "...", intro: "...", sectionTitle: "...", description: "...", imageUrl: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted digital data with structure:
 *   { mainHeading: string, introParagraph: string, sectionHeading: { line1: string, line2: string }, description: string, image: { url: string, alt: string } }
 */
export function mapScienceDigitalData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const digitalSection = data.DigitalSection || data.digitalSection || data.Digital || data.digital;
  if (!digitalSection) return null;

  const mainHeading = digitalSection.mainHeading || digitalSection.heading || digitalSection.title || '';
  const introParagraph = digitalSection.introParagraph || digitalSection.intro || digitalSection.introText || '';

  let sectionHeading = { line1: '', line2: '' };
  if (digitalSection.sectionHeading) {
    if (typeof digitalSection.sectionHeading === 'object') {
      sectionHeading = {
        line1: digitalSection.sectionHeading.line1 || digitalSection.sectionHeading.lineOne || '',
        line2: digitalSection.sectionHeading.line2 || digitalSection.sectionHeading.lineTwo || ''
      };
    } else if (typeof digitalSection.sectionHeading === 'string') {
      // Try to split by newline or "Our Digital" pattern
      const parts = digitalSection.sectionHeading.split(/\n+/);
      sectionHeading = {
        line1: parts[0] || '',
        line2: parts[1] || ''
      };
    }
  } else if (digitalSection.sectionTitle) {
    const parts = digitalSection.sectionTitle.split(/\n+/);
    sectionHeading = {
      line1: parts[0] || '',
      line2: parts[1] || ''
    };
  }

  const description = digitalSection.description || digitalSection.text || digitalSection.content || '';

  const image = digitalSection.image || digitalSection.imageData;
  const imageUrl = typeof image === 'string'
    ? image
    : image?.url || image?.src || digitalSection.imageUrl || '';
  const imageAlt = typeof image === 'object'
    ? (image?.alt || image?.altText || '')
    : '';

  return {
    mainHeading: mainHeading,
    introParagraph: introParagraph,
    sectionHeading: sectionHeading,
    description: description,
    image: {
      url: imageUrl,
      alt: imageAlt
    }
  };
}

/**
 * Map Strapi Science Capability data to ScienceCapability component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { CapabilitySection: { text: "..." } }
 * 2. { capabilitySection: { content: "..." } }
 * 3. { Capability: { description: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted capability data with structure:
 *   { text: string }
 */
export function mapScienceCapabilityData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const capabilitySection = data.CapabilitySection || data.capabilitySection || data.Capability || data.capability;
  if (!capabilitySection) return null;

  const text = capabilitySection.text || capabilitySection.content || capabilitySection.description || capabilitySection.paragraph || '';

  return {
    text: text
  };
}

/**
 * Map Strapi Science Architecture data to ScienceArchitecture component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { ArchitectureSection: { content: [...] } }
 * 2. { architectureSection: { paragraphs: [...] } }
 * 3. { Architecture: { text: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted architecture data with structure:
 *   { content: array of strings or objects with text/bold/after }
 */
export function mapScienceArchitectureData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const architectureSection = data.ArchitectureSection || data.architectureSection || data.Architecture || data.architecture;
  if (!architectureSection) return null;

  let content = [];
  if (architectureSection.content && Array.isArray(architectureSection.content)) {
    content = architectureSection.content;
  } else if (architectureSection.paragraphs && Array.isArray(architectureSection.paragraphs)) {
    content = architectureSection.paragraphs;
  } else if (architectureSection.text) {
    // If it's a single string, split by paragraphs
    content = typeof architectureSection.text === 'string'
      ? architectureSection.text.split(/\n\n+/).filter(p => p.trim())
      : [architectureSection.text];
  } else if (Array.isArray(architectureSection)) {
    content = architectureSection;
  }

  return {
    content: content.length > 0 ? content : []
  };
}

/**
 * Map Strapi Global Generics Intro data to GlobalGenericsIntro component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { IntroSection: { content: [...] } }
 * 2. { introSection: { paragraphs: [...] } }
 * 3. { Intro: { text: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted intro data with structure:
 *   { content: array of strings }
 */
export function mapGlobalGenericsIntroData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Get content directly from API data
  const introSection = data.description || data.IntroSection || data.introSection || data.Intro || data.intro;
  if (!introSection) return null;

  // Return content as-is from API
  const content = introSection.content || introSection.description || introSection.text || introSection.paragraphs || introSection;

  return {
    content: content
  };
}

/**
 * Map Strapi Global Generics Section data to GlobalGenericsSection component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { GenericsSection: { heading: "...", content: [...] } }
 * 2. { genericsSection: { title: "...", paragraphs: [...] } }
 * 3. { Section: { heading: "...", text: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted section data with structure:
 *   { heading: string, content: array of strings }
 */
export function mapGlobalGenericsSectionData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (GenericsSection) and new structure (genericsAndComplexGenerics)
  const section = data.genericsAndComplexGenerics || data.GenericsSection || data.genericsSection || data.Section || data.section;
  if (!section) return null;

  const heading = section.title || section.heading || section.Heading || '';

  let content = [];
  if (section.description) {
    // Split markdown-style text by double newlines and extract plain text from markdown links
    const description = typeof section.description === 'string' ? section.description : '';
    // Convert markdown links [text](url) to just text, then split by paragraphs
    const plainText = description.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    content = plainText.split(/\n\n+/).filter(p => p.trim());
  } else if (section.content && Array.isArray(section.content)) {
    content = section.content;
  } else if (section.paragraphs && Array.isArray(section.paragraphs)) {
    content = section.paragraphs;
  } else if (section.text) {
    // If it's a single string, split by paragraphs
    const text = typeof section.text === 'string' ? section.text : '';
    const plainText = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    content = plainText.split(/\n\n+/).filter(p => p.trim());
  } else if (Array.isArray(section)) {
    content = section;
  }

  return {
    heading: heading,
    content: content.length > 0 ? content : []
  };
}

/**
 * Map Strapi Global Generics Portfolio data to GlobalGenericsPortfolio component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { PortfolioSection: { description: "...", link: { text: "...", url: "..." }, image: {...} } }
 * 2. { portfolioSection: { text: "...", linkText: "...", linkUrl: "...", imageUrl: "..." } }
 * 3. { Portfolio: { description: "...", link: "...", image: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted portfolio data with structure:
 *   { description: string, link: { text: string, url: string }, image: { url: string, alt: string } }
 */
export function mapGlobalGenericsPortfolioData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (PortfolioSection) and new structure (genericsAndComplexGenerics.subSectionOne)
  const portfolioSection = data.genericsAndComplexGenerics?.subSectionOne || data.PortfolioSection || data.portfolioSection || data.Portfolio || data.portfolio;
  if (!portfolioSection) return null;

  // Get data directly from API
  const description = portfolioSection.description || portfolioSection.text || portfolioSection.content || '';
  
  // Get CTA data (prefer cta over link)
  const ctaText = portfolioSection.cta?.text || portfolioSection.link?.text || portfolioSection.linkText || portfolioSection.ctaText || '';
  const ctaUrl = portfolioSection.cta?.href || portfolioSection.cta?.url || portfolioSection.link?.url || portfolioSection.linkUrl || portfolioSection.ctaUrl || '';

  // Get image data
  const image = portfolioSection.image || portfolioSection.imageData;
  let imageUrl = null;
  let imageAlt = '';

  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else {
      // Use getStrapiMedia to get full URL from Strapi media object
      imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
      imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
    }
  }

  return {
    description: description,
    cta: {
      text: ctaText,
      href: ctaUrl
    },
    image: {
      url: imageUrl,
      alt: imageAlt
    }
  };
}

/**
 * Map Strapi Global Generics Complex data to GlobalGenericsComplex component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { ComplexSection: { content: [...], image: {...} } }
 * 2. { complexSection: { paragraphs: [...], imageUrl: "..." } }
 * 3. { Complex: { text: "...", image: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted complex data with structure:
 *   { content: array of strings, image: { url: string, alt: string } }
 */
export function mapGlobalGenericsComplexData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (ComplexSection) and new structure (genericsAndComplexGenerics.subSectionTwo)
  const complexSection = data.genericsAndComplexGenerics?.subSectionTwo || data.ComplexSection || data.complexSection || data.Complex || data.complex;
  if (!complexSection) return null;

  // Get content directly from API data
  const content = complexSection.content || complexSection.description || complexSection.text || complexSection.paragraphs || complexSection;

  // Get image data
  const image = complexSection.image || complexSection.imageData;
  let imageUrl = null;
  let imageAlt = '';

  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else {
      // Use getStrapiMedia to get full URL from Strapi media object
      imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
      imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
    }
  }

  return {
    content: content,
    image: {
      url: imageUrl,
      alt: imageAlt
    }
  };
}

/**
 * Map Strapi Global Generics Inhalation data to GlobalGenericsInhalation component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { InhalationSection: { heading: "...", description: "...", link: {...} } }
 * 2. { inhalationSection: { title: "...", text: "...", linkText: "...", linkUrl: "..." } }
 * 3. { Inhalation: { heading: "...", description: "...", link: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted inhalation data with structure:
 *   { heading: string, description: string, link: { text: string, url: string } }
 */
export function mapGlobalGenericsInhalationData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (InhalationSection) and new structure (ourInhalationBusiness)
  const inhalationSection = data.ourInhalationBusiness || data.InhalationSection || data.inhalationSection || data.Inhalation || data.inhalation;
  if (!inhalationSection) return null;

  // Get data directly from API
  const heading = inhalationSection.title || inhalationSection.heading || inhalationSection.Heading || '';
  const description = inhalationSection.description || inhalationSection.text || inhalationSection.content || '';
  const linkText = inhalationSection.cta?.text || inhalationSection.link?.text || inhalationSection.linkText || inhalationSection.ctaText || '';
  const linkUrl = inhalationSection.cta?.href || inhalationSection.link?.url || inhalationSection.linkUrl || inhalationSection.ctaUrl || '';

  return {
    heading: heading,
    description: description,
    link: {
      text: linkText,
      url: linkUrl
    }
  };
}

/**
 * Map Strapi Science Capabilities data to ScienceCapabilities component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { CapabilitiesSection: { capabilities: [{ title: "...", description: "...", icon: "..." }] } }
 * 2. { capabilitiesSection: { items: [{ title: "...", description: "...", icon: "..." }] } }
 * 3. { Capabilities: [{ title: "...", description: "...", icon: "..." }] }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted capabilities data with structure:
 *   { capabilities: [{ title: string, description: string, icon: string }] }
 */
export function mapScienceCapabilitiesData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const capabilitiesSection = data.CapabilitiesSection || data.capabilitiesSection || data.Capabilities || data.capabilities;
  if (!capabilitiesSection) return null;

  let capabilities = [];
  if (capabilitiesSection.capabilities && Array.isArray(capabilitiesSection.capabilities)) {
    capabilities = capabilitiesSection.capabilities;
  } else if (capabilitiesSection.items && Array.isArray(capabilitiesSection.items)) {
    capabilities = capabilitiesSection.items;
  } else if (Array.isArray(capabilitiesSection)) {
    capabilities = capabilitiesSection;
  }

  // Map each capability to ensure proper structure
  const mappedCapabilities = capabilities.map(cap => ({
    title: cap.title || cap.name || cap.heading || '',
    description: cap.description || cap.text || cap.content || '',
    icon: typeof cap.icon === 'string'
      ? cap.icon
      : cap.icon?.url || cap.iconUrl || cap.image?.url || cap.image || "/assets/images/our-sci/icon22.svg"
  }));

  return {
    capabilities: mappedCapabilities.length > 0 ? mappedCapabilities : []
  };
}

/**
 * Map Strapi Global Generics Regional Presence data to GlobalGenericsRegionalPresence component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { RegionalPresenceSection: { heading: "...", background: {...}, regions: [...] } }
 * 2. { regionalPresenceSection: { title: "...", backgroundImage: {...}, items: [...] } }
 * 3. { RegionalPresence: { heading: "...", background: {...}, regions: [...] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted regional presence data with structure:
 *   { heading: string, background: { desktop: string, mobile: string }, regions: [...] }
 */
export function mapGlobalGenericsRegionalPresenceData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (RegionalPresenceSection) and new structure (regionalPresence)
  const regionalSection = data.regionalPresence || data.RegionalPresenceSection || data.regionalPresenceSection || data.RegionalPresence;
  if (!regionalSection) return null;

  const heading = regionalSection.title || regionalSection.heading || regionalSection.Heading || '';

  // Handle background images - use getStrapiMedia if it's a Strapi media object
  let backgroundDesktop = '';
  let backgroundMobile = '';

  if (regionalSection.BackgroundImage) {
    const bgImage = regionalSection.BackgroundImage;
    if (bgImage.DesktopImage) {
      backgroundDesktop = getStrapiMedia(bgImage.DesktopImage) || '';
    }
    if (bgImage.MobileImage) {
      backgroundMobile = getStrapiMedia(bgImage.MobileImage) || backgroundDesktop;
    } else {
      backgroundMobile = backgroundDesktop;
    }
  } else if (regionalSection.background) {
    if (typeof regionalSection.background === 'object') {
      const bgDesktop = regionalSection.background.desktop || regionalSection.background;
      const bgMobile = regionalSection.background.mobile || bgDesktop;
      backgroundDesktop = getStrapiMedia(bgDesktop) || (typeof bgDesktop === 'string' ? bgDesktop : '');
      backgroundMobile = getStrapiMedia(bgMobile) || (typeof bgMobile === 'string' ? bgMobile : backgroundDesktop);
    } else {
      backgroundDesktop = regionalSection.background;
      backgroundMobile = backgroundDesktop;
    }
  } else if (regionalSection.backgroundImage) {
    if (typeof regionalSection.backgroundImage === 'object') {
      const bgDesktop = regionalSection.backgroundImage.desktop || regionalSection.backgroundImage;
      const bgMobile = regionalSection.backgroundImage.mobile || bgDesktop;
      backgroundDesktop = getStrapiMedia(bgDesktop) || (typeof bgDesktop === 'string' ? bgDesktop : '');
      backgroundMobile = getStrapiMedia(bgMobile) || (typeof bgMobile === 'string' ? bgMobile : backgroundDesktop);
    } else {
      backgroundDesktop = regionalSection.backgroundImage;
      backgroundMobile = backgroundDesktop;
    }
  }

  // Handle regions/items/cards
  let regions = [];
  if (regionalSection.card && Array.isArray(regionalSection.card)) {
    regions = regionalSection.card;
  } else if (regionalSection.cards && Array.isArray(regionalSection.cards)) {
    regions = regionalSection.cards;
  } else if (regionalSection.regions && Array.isArray(regionalSection.regions)) {
    regions = regionalSection.regions;
  } else if (regionalSection.items && Array.isArray(regionalSection.items)) {
    regions = regionalSection.items;
  } else if (Array.isArray(regionalSection)) {
    regions = regionalSection;
  }

  // Map each region to ensure proper structure
  // Note: API response has card array with title and description, but no highlights or position
  // We'll need to map based on title to assign positions and highlights
  const positionMap = {
    'United States': 'top-left',
    'Canada': 'top-right',
    'United Kingdom': 'middle-left',
    'Europe': 'middle-right',
    'Australia': 'bottom'
  };

  const backgroundColorMap = {
    'United States': '#08a03f',
    'Canada': '#034a1d',
    'United Kingdom': '#05461d',
    'Europe': '#0a933c',
    'Australia': '#0a933c'
  };

  const highlightsMap = {
    'United States': [
      "#3 largest generics company by prescriptions filled",
      "#3 in U.S. generics respiratory sales"
    ],
    'Canada': [
      "~18% CAGR growth (FY20–FY25)",
      "First generic Tolvaptan – affordable access to critical kidney therapy"
    ],
    'United Kingdom': [
      "Luforbec: #1 primary care respiratory brand",
      "Leadership in sustainable inhalers",
      "230,000+ patients treated monthly for respiratory disorders"
    ],
    'Europe': [
      "Contributes ~11% of global revenues",
      "Growth led by respiratory, neurology and injectables"
    ],
    'Australia': [
      "#4 generics Company (Generic Health)",
      "Strategic Expansion into Complex Generics"
    ]
  };

  const mappedRegions = regions.map(region => {
    const title = region.title || region.name || region.heading || '';
    
    // Handle highlights - can be array of strings or array of objects with title property
    let highlights = [];
    if (Array.isArray(region.highlights)) {
      highlights = region.highlights.map(h => 
        typeof h === 'string' ? h : (h.title || h.text || '')
      ).filter(h => h);
    } else if (region.highlight) {
      highlights = [region.highlight];
    } else {
      highlights = highlightsMap[title] || [];
    }

    return {
      id: region.id,
      title: title,
      link: region.Link || region.link || region.href || null,
      position: region.position || region.positionType || positionMap[title] || 'top-left',
      backgroundColor: region.cardColor || region.backgroundColor || region.bgColor || region.color || regionalSection.cardColor || backgroundColorMap[title] || '#08a03f',
      highlights: highlights,
      description: region.description || region.text || region.content || ''
    };
  });

  return {
    heading: heading,
    background: {
      desktop: backgroundDesktop,
      mobile: backgroundMobile
    },
    regions: mappedRegions.length > 0 ? mappedRegions : []
  };
}

/**
 * Map Strapi Branded Emerging Markets Intro data to BrandedEmergingMarketsIntro component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { IntroSection: { content: [...] } }
 * 2. { introSection: { paragraphs: [...] } }
 * 3. { Intro: { content: [...] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted intro data with structure:
 *   { content: [{ text: string, link?: { text: string, url: string } }] }
 */
export function mapBrandedEmergingMarketsIntroData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (IntroSection) and new structure (description)
  const introSection = data.description || data.IntroSection || data.introSection || data.Intro || data.intro;
  if (!introSection) return null;

  let content = [];

  // Handle description field (new API structure)
  if (introSection.description) {
    // Split markdown-style text by double newlines and extract plain text from markdown links
    const description = typeof introSection.description === 'string' ? introSection.description : '';
    // Convert markdown links [text](url) to extract link info, then split by paragraphs
    const paragraphs = description.split(/\n\n+/).filter(p => p.trim());

    content = paragraphs.map(paragraph => {
      // Check if paragraph contains markdown links
      const linkMatches = paragraph.match(/\[([^\]]+)\]\(([^\)]+)\)/g);
      if (linkMatches && linkMatches.length > 0) {
        // Extract first link
        const firstLink = linkMatches[0];
        const linkMatch = firstLink.match(/\[([^\]]+)\]\(([^\)]+)\)/);
        if (linkMatch) {
          const linkText = linkMatch[1];
          const linkUrl = linkMatch[2];
          // Replace markdown link with plain text in the paragraph
          const text = paragraph.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
          return {
            text: text,
            link: {
              text: linkText,
              url: linkUrl
            }
          };
        }
      }
      // Extract plain text from markdown links
      const plainText = paragraph.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
      return plainText;
    });
  } else if (introSection.content && Array.isArray(introSection.content)) {
    content = introSection.content;
  } else if (introSection.paragraphs && Array.isArray(introSection.paragraphs)) {
    content = introSection.paragraphs;
  } else if (introSection.text) {
    // If it's a single string, split by paragraphs
    content = typeof introSection.text === 'string'
      ? introSection.text.split(/\n\n+/).filter(p => p.trim())
      : [introSection.text];
  } else if (Array.isArray(introSection)) {
    content = introSection;
  }

  // Map content to ensure proper structure
  const mappedContent = content.map(item => {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'object') {
      return {
        text: item.text || item.content || item.paragraph || '',
        link: item.link || (item.linkText && item.linkUrl ? {
          text: item.linkText,
          url: item.linkUrl
        } : null)
      };
    }
    return item;
  });

  return {
    content: mappedContent.length > 0 ? mappedContent : []
  };
}

/**
 * Map Strapi Branded Emerging Markets Markets data to BrandedEmergingMarketsMarkets component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { MarketsSection: { heading: "...", content: "..." } }
 * 2. { marketsSection: { title: "...", text: "..." } }
 * 3. { Markets: { heading: "...", content: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted markets data with structure:
 *   { heading: string, content: string }
 */
export function mapBrandedEmergingMarketsMarketsData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (MarketsSection) and new structure (markets)
  const marketsSection = data.markets || data.MarketsSection || data.marketsSection || data.Markets;
  if (!marketsSection) return null;

  const heading = marketsSection.title || marketsSection.heading || marketsSection.Heading || '';

  // Extract plain text from markdown description
  let content = marketsSection.description || marketsSection.content || marketsSection.text || marketsSection.paragraph || '';
  if (typeof content === 'string') {
    content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  }

  return {
    heading: heading,
    content: content
  };
}

/**
 * Map Strapi Branded Emerging Markets Items data to BrandedEmergingMarketsItems component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { ItemsSection: { items: [...] } }
 * 2. { itemsSection: { markets: [...] } }
 * 3. { Items: [...] }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted items data with structure:
 *   { items: [{ title: string, content: string[], link: { text: string, url: string }, image: { url: string, alt: string } }] }
 */
export function mapBrandedEmergingMarketsItemsData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (ItemsSection) and new structure (markets.marketCard)
  const marketsSection = data.markets || data.ItemsSection || data.itemsSection || data.Items || data.items || data.MarketsItems || data.marketsItems;
  if (!marketsSection) return null;

  let items = [];
  if (marketsSection.marketCard && Array.isArray(marketsSection.marketCard)) {
    items = marketsSection.marketCard;
  } else if (marketsSection.items && Array.isArray(marketsSection.items)) {
    items = marketsSection.items;
  } else if (marketsSection.markets && Array.isArray(marketsSection.markets)) {
    items = marketsSection.markets;
  } else if (Array.isArray(marketsSection)) {
    items = marketsSection;
  }

  // Map each item to ensure proper structure
  const mappedItems = items.map(item => {
    // Extract plain text from markdown description and split into paragraphs
    let content = [];
    if (item.description) {
      const description = typeof item.description === 'string' ? item.description : '';
      const plainText = description.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
      content = plainText.split(/\n\n+/).filter(p => p.trim());
    } else if (Array.isArray(item.content)) {
      content = item.content;
    } else if (item.text) {
      content = [item.text];
    }

    const image = item.image || item.imageData;
    let imageUrl = null;
    let imageAlt = '';

    if (image) {
      if (typeof image === 'string') {
        imageUrl = image;
      } else {
        // Use getStrapiMedia to get full URL from Strapi media object
        imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
        imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
      }
    }

    // Use fallback image if no image from API
    if (!imageUrl) {
      imageUrl = "/assets/images/branded/image1.png";
      imageAlt = imageAlt || item.title || 'Market image';
    }

    // Handle link/cta mapping - support multiple structures
    let link = null;
    if (item.link) {
      link = item.link;
    } else if (item.cta && item.cta.text && item.cta.href) {
      // Handle cta structure with text and href
      link = {
        text: item.cta.text,
        url: item.cta.href
      };
    } else if (item.linkText && item.linkUrl) {
      link = {
        text: item.linkText,
        url: item.linkUrl
      };
    }

    return {
      title: item.title || item.name || item.heading || '',
      content: content.length > 0 ? content : [],
      link: link,
      image: {
        url: imageUrl,
        alt: imageAlt
      }
    };
  });

  return {
    items: mappedItems.length > 0 ? mappedItems : []
  };
}

/**
 * Map Strapi Branded Emerging Markets Footer data to BrandedEmergingMarketsFooter component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { FooterSection: { heading: {...}, content: [...], image: {...} } }
 * 2. { footerSection: { title: {...}, paragraphs: [...], imageUrl: "..." } }
 * 3. { Footer: { heading: {...}, content: [...], image: {...} } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted footer data with structure:
 *   { heading: { line1: string, line2: string }, content: string[], image: { url: string, alt: string } }
 */
export function mapBrandedEmergingMarketsFooterData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (FooterSection) and new structure (globalInstitutionalBusiness)
  const footerSection = data.globalInstitutionalBusiness || data.FooterSection || data.footerSection || data.Footer || data.footer;
  if (!footerSection) return null;

  // Handle heading - split title by pattern or newline
  let heading = { line1: '', line2: '' };
  if (footerSection.title) {
    // Split title like "GLOBAL INSTITUTIONAL BUSINESS (GIB)" into two lines
    // Try to split by "(" or newline
    if (footerSection.title.includes('(')) {
      const parts = footerSection.title.split(/\s*\(/);
      heading = {
        line1: parts[0]?.trim() || '',
        line2: parts[1] ? `(${parts[1].trim()}` : ''
      };
    } else {
      const parts = footerSection.title.split(/\n+/);
      heading = {
        line1: parts[0] || '',
        line2: parts[1] || ''
      };
    }
  } else if (footerSection.heading) {
    if (typeof footerSection.heading === 'object') {
      heading = {
        line1: footerSection.heading.line1 || footerSection.heading.lineOne || '',
        line2: footerSection.heading.line2 || footerSection.heading.lineTwo || ''
      };
    } else if (typeof footerSection.heading === 'string') {
      const parts = footerSection.heading.split(/\n+/);
      heading = {
        line1: parts[0] || '',
        line2: parts[1] || ''
      };
    }
  }

  // Handle content - extract plain text from markdown description
  let content = [];
  if (footerSection.description) {
    const description = typeof footerSection.description === 'string' ? footerSection.description : '';
    // Extract plain text from markdown links, then split by paragraphs
    const plainText = description.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    content = plainText.split(/\n\n+/).filter(p => p.trim());
  } else if (footerSection.content && Array.isArray(footerSection.content)) {
    content = footerSection.content;
  } else if (footerSection.paragraphs && Array.isArray(footerSection.paragraphs)) {
    content = footerSection.paragraphs;
  } else if (footerSection.text) {
    content = typeof footerSection.text === 'string'
      ? footerSection.text.split(/\n\n+/).filter(p => p.trim())
      : [footerSection.text];
  }

  // Handle image
  const image = footerSection.image || footerSection.imageData;
  let imageUrl = null;
  let imageAlt = '';

  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else {
      // Use getStrapiMedia to get full URL from Strapi media object
      imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
      imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
    }
  }

  // Use fallback image if no image from API
  if (!imageUrl) {
    imageUrl = "/assets/images/branded/Firefly_Gemini Flash_Premium global public health image showing healthcare professionals collaborating acr 448492 1.png";
    imageAlt = imageAlt || "Healthcare professionals collaborating";
  }

  return {
    heading: heading,
    content: content.length > 0 ? content : [],
    image: {
      url: imageUrl,
      alt: imageAlt
    }
  };
}

/**
 * Map Strapi India Overview data to IndiaOverview component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { OverviewSection: { heading: "...", content: [...] } }
 * 2. { overviewSection: { title: "...", paragraphs: [...] } }
 * 3. { Overview: { heading: "...", content: [...] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted overview data with structure:
 *   { heading: string, content: string[] }
 */
export function mapIndiaOverviewData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (OverviewSection) and new structure (overview)
  const overviewSection = data.overview || data.OverviewSection || data.overviewSection || data.Overview;
  if (!overviewSection) return null;

  const heading = overviewSection.title || overviewSection.heading || overviewSection.Heading || '';

  let content = [];
  if (overviewSection.description) {
    // Split markdown-style text by double newlines
    const description = typeof overviewSection.description === 'string' ? overviewSection.description : '';
    content = description.split(/\n\n+/).filter(p => p.trim());
  } else if (overviewSection.content && Array.isArray(overviewSection.content)) {
    content = overviewSection.content;
  } else if (overviewSection.paragraphs && Array.isArray(overviewSection.paragraphs)) {
    content = overviewSection.paragraphs;
  } else if (overviewSection.text) {
    // If it's a single string, split by paragraphs
    content = typeof overviewSection.text === 'string'
      ? overviewSection.text.split(/\n\n+/).filter(p => p.trim())
      : [overviewSection.text];
  } else if (Array.isArray(overviewSection)) {
    content = overviewSection;
  }

  return {
    heading: heading,
    content: content.length > 0 ? content : []
  };
}

/**
 * Map Strapi India At a Glance data to IndiaAtAGlance component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { AtAGlanceSection: { heading: "...", items: [...] } }
 * 2. { atAGlanceSection: { title: "...", list: [...] } }
 * 3. { AtAGlance: { heading: "...", points: [...] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted at a glance data with structure:
 *   { heading: string, items: string[] }
 */
export function mapIndiaAtAGlanceData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (AtAGlanceSection) and new structure (IndiaAtAGlance)
  const glanceSection = data.IndiaAtAGlance || data.AtAGlanceSection || data.atAGlanceSection || data.AtAGlance || data.atAGlance || data.GlanceSection || data.glanceSection;
  if (!glanceSection) return null;

  const heading = glanceSection.title || glanceSection.heading || glanceSection.Heading || '';

  let items = [];
  if (glanceSection.feature && Array.isArray(glanceSection.feature)) {
    // Extract feature text from feature objects
    items = glanceSection.feature.map(f => f.feature || f.text || f.description || '');
  } else if (glanceSection.items && Array.isArray(glanceSection.items)) {
    items = glanceSection.items;
  } else if (glanceSection.list && Array.isArray(glanceSection.list)) {
    items = glanceSection.list;
  } else if (glanceSection.points && Array.isArray(glanceSection.points)) {
    items = glanceSection.points;
  } else if (glanceSection.content && Array.isArray(glanceSection.content)) {
    items = glanceSection.content;
  } else if (Array.isArray(glanceSection)) {
    items = glanceSection;
  }

  return {
    heading: heading,
    items: items.filter(item => item && item.trim()).length > 0 ? items.filter(item => item && item.trim()) : []
  };
}

/**
 * Map Strapi India What We Do data to IndiaWhatWeDo component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { WhatWeDoSection: { heading: "...", content: [...] } }
 * 2. { whatWeDoSection: { title: "...", paragraphs: [...] } }
 * 3. { WhatWeDo: { heading: "...", content: [...] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted what we do data with structure:
 *   { heading: string, content: string[] }
 */
export function mapIndiaWhatWeDoData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (WhatWeDoSection) and new structure (WhatWeDo)
  const whatWeDoSection = data.WhatWeDo || data.WhatWeDoSection || data.whatWeDoSection || data.whatWeDo;
  if (!whatWeDoSection) return null;

  const heading = whatWeDoSection.title || whatWeDoSection.heading || whatWeDoSection.Heading || '';

  let content = [];
  if (whatWeDoSection.description) {
    // Split markdown-style text by double newlines
    const description = typeof whatWeDoSection.description === 'string' ? whatWeDoSection.description : '';
    content = description.split(/\n\n+/).filter(p => p.trim());
  } else if (whatWeDoSection.content && Array.isArray(whatWeDoSection.content)) {
    content = whatWeDoSection.content;
  } else if (whatWeDoSection.paragraphs && Array.isArray(whatWeDoSection.paragraphs)) {
    content = whatWeDoSection.paragraphs;
  } else if (whatWeDoSection.text) {
    // If it's a single string, split by paragraphs
    content = typeof whatWeDoSection.text === 'string'
      ? whatWeDoSection.text.split(/\n\n+/).filter(p => p.trim())
      : [whatWeDoSection.text];
  } else if (Array.isArray(whatWeDoSection)) {
    content = whatWeDoSection;
  }

  return {
    heading: heading,
    content: content.length > 0 ? content : []
  };
}

/**
 * Map Strapi India Digital Initiatives data to IndiaDigitalInitiatives component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { DigitalInitiativesSection: { heading: "...", description: [...], link: {...} } }
 * 2. { digitalInitiativesSection: { title: "...", text: [...], link: {...} } }
 * 3. { DigitalInitiatives: { heading: "...", description: [...], link: {...} } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted digital initiatives data with structure:
 *   { heading: string, description: string[], link: { text: string, url: string } }
 */
export function mapIndiaDigitalInitiativesData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (DigitalInitiativesSection) and new structure (WhatWeDo.ourDigitalInitiatives)
  const whatWeDoSection = data.WhatWeDo || data.WhatWeDoSection || data.whatWeDoSection || data.whatWeDo;
  const digitalSection = whatWeDoSection?.ourDigitalInitiatives || data.DigitalInitiativesSection || data.digitalInitiativesSection || data.DigitalInitiatives || data.digitalInitiatives;
  if (!digitalSection) return null;

  const heading = digitalSection.title || digitalSection.heading || digitalSection.Heading || '';

  let description = [];
  if (digitalSection.description) {
    // Split markdown-style text by double newlines
    const desc = typeof digitalSection.description === 'string' ? digitalSection.description : '';
    description = desc.split(/\n\n+/).filter(p => p.trim());
  } else if (digitalSection.description && Array.isArray(digitalSection.description)) {
    description = digitalSection.description;
  } else if (digitalSection.text && Array.isArray(digitalSection.text)) {
    description = digitalSection.text;
  } else if (digitalSection.content && Array.isArray(digitalSection.content)) {
    description = digitalSection.content;
  } else if (digitalSection.paragraphs && Array.isArray(digitalSection.paragraphs)) {
    description = digitalSection.paragraphs;
  } else if (digitalSection.text && typeof digitalSection.text === 'string') {
    description = digitalSection.text.split(/\n\n+/).filter(p => p.trim());
  } else if (Array.isArray(digitalSection)) {
    description = digitalSection;
  }

  const link = digitalSection.link ? {
    text: digitalSection.link.text || digitalSection.link.linkText || '',
    url: digitalSection.link.url || digitalSection.link.linkUrl || ''
  } : null;

  return {
    heading: heading,
    description: description.length > 0 ? description : [],
    link: link
  };
}

/**
 * Map Strapi India Therapies data to IndiaTherapies component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { TherapiesSection: { heading: "...", description: "..." } }
 * 2. { therapiesSection: { title: "...", text: "..." } }
 * 3. { Therapies: { heading: "...", description: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted therapies data with structure:
 *   { heading: string, description: string }
 */
export function mapIndiaTherapiesData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (TherapiesSection) and new structure (therapies)
  const therapiesSection = data.therapies || data.TherapiesSection || data.therapiesSection || data.Therapies;
  if (!therapiesSection) return null;

  const heading = therapiesSection.title || therapiesSection.heading || therapiesSection.Heading || '';
  const description = therapiesSection.description || therapiesSection.text || therapiesSection.content || '';

  return {
    heading: heading,
    description: description
  };
}

/**
 * Map Strapi India Therapy Section data to IndiaTherapySection component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { TherapySection: { ... } }
 * 2. { therapySection: { ... } }
 * 3. { TherapyContent: { ... } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted therapy section data
 */
export function mapIndiaTherapySectionData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (TherapySection) and new structure (therapies.therapyTab)
  const therapiesSection = data.therapies || data.TherapySection || data.therapySection || data.TherapyContent || data.therapyContent;
  if (!therapiesSection) return null;

  // Map therapyTab array to content structure
  let content = {};
  if (therapiesSection.therapyTab && Array.isArray(therapiesSection.therapyTab)) {
    // Title to ID mapping for known therapies
    const titleToIdMap = {
      'Anti-Tuberculosis (TB)': 'anti-tb',
      'Respiratory': 'respiratory',
      'Anti-Diabetes': 'anti-diabetes',
      'Cardiology': 'cardiology',
      "Women's Health": 'womens-health-1',
      'Gastrointestinal ': 'gastrointestinal',
      'Gastrointestinal': 'gastrointestinal',
      'Oncology': 'oncology',
      'Pain Management': 'pain-management',
      'Anti-Infectives': 'anti-infectives',
      'Vitamins/Minerals/Nutrients': 'vitamins',
      'Ophthalmology': 'ophthalmology',
      'Urology': 'urology',
      'Dermatology': 'dermatology',
      'Bone and Muscle Health ': 'bone-muscle',
      'Bone and Muscle Health': 'bone-muscle',
      'Central Nervous System (CNS)': 'cns'
    };

    // Convert therapyTab array to content object keyed by normalized IDs
    therapiesSection.therapyTab.forEach(tab => {
      if (tab.title && tab.description) {
        // Use mapping if available, otherwise normalize title
        const key = titleToIdMap[tab.title] || tab.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Handle image
        const image = tab.image || tab.imageData;
        let imageUrl = null;
        let imageAlt = '';

        if (image) {
          if (typeof image === 'string') {
            imageUrl = image;
          } else {
            imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
            imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
          }
        }

        // Use fallback image if no image from API
        if (!imageUrl) {
          imageUrl = "/assets/images/india/lady.png";
          imageAlt = imageAlt || tab.title || 'Therapy image';
        }

        content[key] = {
          heading: tab.title,
          description: tab.description,
          image: {
            url: imageUrl,
            alt: imageAlt
          }
        };
      }
    });
  } else if (therapiesSection.tabs && Array.isArray(therapiesSection.tabs)) {
    // Old structure
    therapiesSection.tabs.forEach(tab => {
      if (tab.id || tab.key) {
        content[tab.id || tab.key] = tab;
      }
    });
  } else if (therapiesSection.content && typeof therapiesSection.content === 'object') {
    content = therapiesSection.content;
  } else if (therapiesSection.therapies && typeof therapiesSection.therapies === 'object') {
    content = therapiesSection.therapies;
  }

  return {
    tabs: null, // Tabs are generated from content in component
    content: Object.keys(content).length > 0 ? content : null
  };
}

/**
 * Map Strapi India Patient Support data to IndiaPatientSupport component format
 * 
 * Expected Strapi data structures (any of these will work):
 * 1. { PatientSupportSection: { heading: "...", description: "...", button: {...} } }
 * 2. { patientSupportSection: { title: "...", text: "...", button: {...} } }
 * 3. { PatientSupport: { heading: "...", description: "...", button: {...} } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted patient support data with structure:
 *   { heading: string, description: string, button: { text: string, url: string } }
 */
export function mapIndiaPatientSupportData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  // Support both old structure (PatientSupportSection) and new structure (patientSupportPrograms)
  const supportSection = data.patientSupportPrograms || data.PatientSupportSection || data.patientSupportSection || data.PatientSupport || data.patientSupport;
  if (!supportSection) return null;

  const heading = supportSection.title || supportSection.heading || supportSection.Heading || '';
  const description = supportSection.description || supportSection.text || supportSection.content || '';

  const button = supportSection.cta ? {
    text: supportSection.cta.text || supportSection.cta.buttonText || '',
    url: supportSection.cta.href || supportSection.cta.url || supportSection.cta.linkUrl || '#'
  } : (supportSection.button ? {
    text: supportSection.button.text || supportSection.button.buttonText || '',
    url: supportSection.button.url || supportSection.button.linkUrl || supportSection.button.link || '#'
  } : null);

  return {
    heading: heading,
    description: description,
    button: button
  };
}

/**
 * Map Strapi Patient Support Programs Intro data to PatientSupportProgramsSection component format
 * 
 * Expected Strapi data structures:
 * 1. { intro: { description: "...", image: {...} } }
 * 2. { IntroSection: { description: "...", image: {...} } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted intro data with structure:
 *   { content: string[], image: { url: string, alt: string }, backgroundSvg: { url: string, alt: string } }
 */
export function mapPatientSupportProgramsIntroData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const introSection = data.intro || data.IntroSection || data.introSection || data.Intro;
  if (!introSection) return null;

  // Split description by double newlines to create content array
  let content = [];
  if (introSection.description) {
    const description = typeof introSection.description === 'string' ? introSection.description : '';
    content = description.split(/\n\n+/).filter(p => p.trim());
  } else if (introSection.content && Array.isArray(introSection.content)) {
    content = introSection.content;
  } else if (introSection.paragraphs && Array.isArray(introSection.paragraphs)) {
    content = introSection.paragraphs;
  }

  // Handle image
  const image = introSection.image || introSection.imageData;
  let imageUrl = null;
  let imageAlt = '';

  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else {
      // Use getStrapiMedia to get full URL from Strapi media object
      imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
      imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
    }
  }

  // Use fallback image if no image from API
  if (!imageUrl) {
    imageUrl = "/assets/images/patient-support-programs/top.png";
    imageAlt = imageAlt || "Patient Support Programs - Healthcare Professional and Patient";
  }

  return {
    content: content.length > 0 ? content : [],
    image: {
      url: imageUrl,
      alt: imageAlt
    },
    backgroundSvg: {
      url: "/assets/images/patient-support-programs/lefpetals.svg",
      alt: "Decorative petals"
    }
  };
}

/**
 * Map Strapi Patient Support Programs Cards data to PatientSupportProgramsCard component format
 * 
 * Expected Strapi data structures:
 * 1. { card: [{ description: "...", logo: {...}, image: {...} }] }
 * 2. { cards: [{ description: "...", logo: {...}, image: {...} }] }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted cards data with structure:
 *   { cards: [{ logo: { url: string, alt: string }, content: string, image: { url: string, alt: string } }] }
 */
export function mapPatientSupportProgramsCardsData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  let cards = [];
  if (data.card && Array.isArray(data.card)) {
    cards = data.card;
  } else if (data.cards && Array.isArray(data.cards)) {
    cards = data.cards;
  } else if (data.programs && Array.isArray(data.programs)) {
    cards = data.programs;
  }

  // Map each card to ensure proper structure
  const mappedCards = cards.map(card => {
    // Handle logo
    const logo = card.logo || card.logoData;
    let logoUrl = null;
    let logoAlt = '';

    if (logo) {
      if (typeof logo === 'string') {
        logoUrl = logo;
      } else {
        logoUrl = getStrapiMedia(logo) || logo?.url || logo?.src || null;
        logoAlt = logo?.alternativeText || logo?.caption || logo?.alt || logo?.altText || '';
      }
    }

    // Use fallback logo if no logo from API
    if (!logoUrl) {
      logoUrl = "/assets/images/patient-support-programs/logo1.png";
      logoAlt = logoAlt || "Program Logo";
    }

    // Handle image
    const image = card.image || card.imageData;
    let imageUrl = null;
    let imageAlt = '';

    if (image) {
      if (typeof image === 'string') {
        imageUrl = image;
      } else {
        imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
        imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
      }
    }

    // Use fallback image if no image from API
    if (!imageUrl) {
      imageUrl = "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png";
      imageAlt = imageAlt || "Program Image";
    }

    // Extract plain text from description
    let content = card.description || card.content || card.text || '';
    if (typeof content === 'string') {
      content = content.trim();
    }

    return {
      logo: {
        url: logoUrl,
        alt: logoAlt
      },
      content: content,
      image: {
        url: imageUrl,
        alt: imageAlt
      }
    };
  });

  return {
    cards: mappedCards.length > 0 ? mappedCards : []
  };
}

/**
 * Map Strapi Patient Support Programs Looking Ahead data to PatientSupportProgramsLookingAhead component format
 * 
 * Expected Strapi data structures:
 * 1. { lookingAhead: { title: "...", description: "..." } }
 * 2. { LookingAheadSection: { heading: "...", content: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted looking ahead data with structure:
 *   { heading: string, content: string }
 */
export function mapPatientSupportProgramsLookingAheadData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const lookingAheadSection = data.lookingAhead || data.LookingAheadSection || data.lookingAheadSection || data.LookingAhead;
  if (!lookingAheadSection) return null;

  const heading = lookingAheadSection.title || lookingAheadSection.heading || lookingAheadSection.Heading || '';
  const content = lookingAheadSection.description || lookingAheadSection.content || lookingAheadSection.text || '';

  return {
    heading: heading,
    content: content
  };
}

/**
 * Map Strapi Specialty Intro data to SpecialtyIntro component format
 * 
 * Expected Strapi data structures:
 * 1. { intro: { description: "..." } }
 * 2. { IntroSection: { description: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted intro data with structure:
 *   { text: string }
 */
export function mapSpecialtyIntroData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const introSection = data.intro || data.IntroSection || data.introSection || data.Intro;
  if (!introSection) return null;

  const text = introSection.description || introSection.text || introSection.content || '';

  return {
    text: text.trim()
  };
}

/**
 * Map Strapi Specialty Heading data to SpecialtyHeading component format
 * 
 * Expected Strapi data structures:
 * 1. { snapshotSection: { title: "..." } }
 * 2. { SnapshotSection: { title: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted heading data with structure:
 *   { text: string }
 */
export function mapSpecialtyHeadingData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const snapshotSection = data.snapshotSection || data.SnapshotSection || data.snapshotSection || data.Snapshot;
  if (!snapshotSection) return null;

  const text = snapshotSection.title || snapshotSection.heading || snapshotSection.text || '';

  return {
    text: text.trim()
  };
}

/**
 * Map Strapi Specialty Snapshot data to region components format
 * 
 * Expected Strapi data structures:
 * 1. { snapshotSection: { snapshot: [{ title: "...", description: "..." }] } }
 * 2. { SnapshotSection: { snapshots: [{ title: "...", description: "..." }] } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted snapshot data with structure:
 *   { regions: [{ heading: string, paragraphs: string[], buttons: array }] }
 */
/**
 * Map a single snapshot to component format
 * @param {object} snapshot - Single snapshot object from API
 * @returns {object} Formatted data with heading, paragraphs, and buttons
 */
function mapSingleSnapshot(snapshot) {
  if (!snapshot) return null;

  const heading = snapshot.title || snapshot.heading || '';

  // Split main description by double newlines to create paragraphs array
  let paragraphs = [];
  if (snapshot.description) {
    const description = typeof snapshot.description === 'string' ? snapshot.description : '';
    paragraphs = description.split(/\n\n+/).filter(p => p.trim());
  } else if (snapshot.paragraphs && Array.isArray(snapshot.paragraphs)) {
    paragraphs = snapshot.paragraphs;
  } else if (snapshot.content && Array.isArray(snapshot.content)) {
    paragraphs = snapshot.content;
  }

  // Build buttons array from cta and moreInfo
  let buttons = [];

  // Add main cta as first button (outline variant)
  if (snapshot.cta && snapshot.cta.text && snapshot.cta.href) {
    buttons.push({
      text: snapshot.cta.text,
      href: snapshot.cta.href || snapshot.cta.url || '#',
      variant: 'outline'
    });
  }

  // Process moreInfo array - each item's description becomes a paragraph, cta becomes a button
  if (snapshot.moreInfo && Array.isArray(snapshot.moreInfo)) {
    snapshot.moreInfo.forEach((infoItem, index) => {
      // Add description as a paragraph
      if (infoItem.description) {
        const infoDescription = typeof infoItem.description === 'string' ? infoItem.description : '';
        if (infoDescription.trim()) {
          paragraphs.push(infoDescription.trim());
        }
      }

      // Add cta as a button (outline for middle buttons, filled for last)
      if (infoItem.cta && infoItem.cta.text && infoItem.cta.href) {
        const isLastButton = index === snapshot.moreInfo.length - 1;
        buttons.push({
          text: infoItem.cta.text,
          href: infoItem.cta.href || infoItem.cta.url || '#',
          variant: isLastButton ? 'filled' : 'outline'
        });
      }
    });
  }

  return {
    heading: heading.trim(),
    paragraphs: paragraphs.length > 0 ? paragraphs : [],
    buttons: buttons
  };
}

/**
 * Map Strapi Specialty United States data to SpecialtyUnitedStates component format
 */
export function mapSpecialtyUnitedStatesData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const snapshotSection = data.snapshotSection || data.SnapshotSection;
  if (!snapshotSection || !snapshotSection.snapshot) return null;

  // Find United States snapshot
  const usSnapshot = snapshotSection.snapshot.find(s => {
    const title = (s.title || '').trim().toLowerCase();
    return title.includes('united states') || title === 'united states';
  });

  return mapSingleSnapshot(usSnapshot);
}

/**
 * Map Strapi Specialty Europe data to SpecialtyEurope component format
 */
export function mapSpecialtyEuropeData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const snapshotSection = data.snapshotSection || data.SnapshotSection;
  if (!snapshotSection || !snapshotSection.snapshot) return null;

  // Find Europe snapshot
  const europeSnapshot = snapshotSection.snapshot.find(s => {
    const title = (s.title || '').trim().toLowerCase();
    return title.includes('europe') || title === 'europe';
  });

  return mapSingleSnapshot(europeSnapshot);
}

/**
 * Map Strapi Specialty Canada data to SpecialtyCanada component format
 */
export function mapSpecialtyCanadaData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const snapshotSection = data.snapshotSection || data.SnapshotSection;
  if (!snapshotSection || !snapshotSection.snapshot) return null;

  // Find Canada snapshot
  const canadaSnapshot = snapshotSection.snapshot.find(s => {
    const title = (s.title || '').trim().toLowerCase();
    return title.includes('canada') || title === 'canada';
  });

  return mapSingleSnapshot(canadaSnapshot);
}

/**
 * Map Strapi Specialty Brazil data to SpecialtyBrazil component format
 */
export function mapSpecialtyBrazilData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const snapshotSection = data.snapshotSection || data.SnapshotSection;
  if (!snapshotSection || !snapshotSection.snapshot) return null;

  // Find Brazil snapshot
  const brazilSnapshot = snapshotSection.snapshot.find(s => {
    const title = (s.title || '').trim().toLowerCase();
    return title.includes('brazil') || title === 'brazil';
  });

  return mapSingleSnapshot(brazilSnapshot);
}

/**
 * Map Strapi Allied Business Intro data to AlliedBusinessIntro component format
 * 
 * Expected Strapi data structures:
 * 1. { intro: { description: "..." } }
 * 2. { IntroSection: { description: "..." } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted intro data with structure:
 *   { text: string }
 */
export function mapAlliedBusinessIntroData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const introSection = data.intro || data.IntroSection || data.introSection || data.Intro;
  if (!introSection) return null;

  const text = introSection.description || introSection.text || introSection.content || '';

  return {
    text: text.trim()
  };
}

/**
 * Map Strapi Allied Business Looking Ahead data to AlliedBusinessLookingAhead component format
 * 
 * Expected Strapi data structures:
 * 1. { lookingAhead: { title: "...", description: "...", image: {...} } }
 * 2. { LookingAheadSection: { heading: "...", content: "...", image: {...} } }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted looking ahead data with structure:
 *   { heading: string, content: string[], image: { url: string, alt: string }, pointerIcon: { url: string, alt: string } }
 */
export function mapAlliedBusinessLookingAheadData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  const lookingAheadSection = data.lookingAhead || data.LookingAheadSection || data.lookingAheadSection || data.LookingAhead;
  if (!lookingAheadSection) return null;

  const heading = lookingAheadSection.title || lookingAheadSection.heading || lookingAheadSection.Heading || '';

  // Split description by double newlines to create content array
  let content = [];
  if (lookingAheadSection.description) {
    const description = typeof lookingAheadSection.description === 'string' ? lookingAheadSection.description : '';
    content = description.split(/\n\n+/).filter(p => p.trim());
  } else if (lookingAheadSection.content && Array.isArray(lookingAheadSection.content)) {
    content = lookingAheadSection.content;
  } else if (lookingAheadSection.paragraphs && Array.isArray(lookingAheadSection.paragraphs)) {
    content = lookingAheadSection.paragraphs;
  }

  // Handle image
  const image = lookingAheadSection.image || lookingAheadSection.imageData;
  let imageUrl = null;
  let imageAlt = '';

  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else {
      imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
      imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
    }
  }

  // Use fallback image if no image from API
  if (!imageUrl) {
    imageUrl = "/assets/images/AlliedBusiness/biopharmaceutical-industry-laboratory-with-scientist-handling-vials-modern-research-facility (1) 1.png";
    imageAlt = imageAlt || "Biopharmaceutical Industry Laboratory";
  }

  return {
    heading: heading.trim(),
    content: content.length > 0 ? content : [],
    image: {
      url: imageUrl,
      alt: imageAlt
    },
    pointerIcon: {
      url: "/assets/images/AlliedBusiness/Group.svg",
      alt: "Pointer Icon"
    }
  };
}

/**
 * Map Strapi Allied Business items data to component format
 * 
 * Expected Strapi data structures:
 * 1. { business: [{ title: "...", description: "...", image: {...}, cta: {...} }] }
 * 2. { businesses: [{ title: "...", description: "...", image: {...}, cta: {...} }] }
 * 
 * @param {object} strapiData - Raw Strapi API response
 * @returns {object|null} Formatted business data with structure:
 *   { businesses: [{ heading: string, content: string[], image: { url: string, alt: string }, websiteUrl: string, websiteText: string }] }
 */
export function mapAlliedBusinessItemsData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) return null;

  let businesses = [];
  if (data.business && Array.isArray(data.business)) {
    businesses = data.business;
  } else if (data.businesses && Array.isArray(data.businesses)) {
    businesses = data.businesses;
  } else if (data.items && Array.isArray(data.items)) {
    businesses = data.items;
  }

  // Map each business to component format
  const mappedBusinesses = businesses.map(business => {
    const heading = business.title || business.heading || '';

    // Split description by double newlines to create content array
    let content = [];
    if (business.description) {
      const description = typeof business.description === 'string' ? business.description : '';
      content = description.split(/\n\n+/).filter(p => p.trim());
    } else if (business.content && Array.isArray(business.content)) {
      content = business.content;
    } else if (business.paragraphs && Array.isArray(business.paragraphs)) {
      content = business.paragraphs;
    }

    // Handle image
    const image = business.image || business.imageData;
    let imageUrl = null;
    let imageAlt = '';

    if (image) {
      if (typeof image === 'string') {
        imageUrl = image;
      } else {
        imageUrl = getStrapiMedia(image) || image?.url || image?.src || null;
        imageAlt = image?.alternativeText || image?.caption || image?.alt || image?.altText || '';
      }
    }

    // Handle CTA (website link)
    const websiteUrl = business.cta?.href || business.cta?.url || business.websiteUrl || business.linkUrl || '#';
    const websiteText = business.cta?.text || business.cta?.buttonText || business.websiteText || business.linkText || heading;

    return {
      heading: heading.trim(),
      content: content.length > 0 ? content : [],
      image: {
        url: imageUrl,
        alt: imageAlt || heading
      },
      websiteUrl: websiteUrl,
      websiteText: websiteText
    };
  });

  return {
    businesses: mappedBusinesses.length > 0 ? mappedBusinesses : []
  };
}

