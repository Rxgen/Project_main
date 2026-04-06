# Global SEO Utilities Usage Guide

This guide explains how to use the global SEO utilities to fetch and apply SEO metadata from Strapi CMS for any page.

## Overview

The `src/lib/seo-utils.js` module provides utilities to:
- Fetch SEO data from Strapi API endpoints
- Generate Next.js metadata automatically
- Handle fallback values when Strapi data is unavailable

## Basic Usage

### For Pages with Strapi SEO Data

```javascript
// src/app/about-us/our-story/page.js
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

// Generate metadata from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-story',  // Strapi endpoint
    'https://www.lupin.com/about-us/our-story',  // Canonical URL
    {
      // Fallback values (used if Strapi data is unavailable)
      title: 'Our Story - Lupin',
      description: 'Default description if Strapi fails',
      keywords: 'default, keywords',
    }
  );
}

export default function OurStoryPage() {
  // Your page content
  return <div>...</div>;
}
```

## API Response Structure

The utility expects Strapi to return data in this format:

```json
{
  "data": {
    "seo": {
      "metaTitle": "Our Story, Journey and Milestones - Lupin",
      "metaDescription": "The Lupin story began in 1968...",
      "keywords": "keyword1, keyword2",
      "canonicalURL": "https://www.lupin.com/about-us/our-story",
      "metaRobots": "index, follow",
      "metaImage": { ... }
    }
  }
}
```

## Function Reference

### `generateSEOMetadataFromStrapi(endpoint, baseUrl, fallback, options)`

Main function to generate SEO metadata from Strapi.

**Parameters:**
- `endpoint` (string, required): Strapi API endpoint (e.g., 'our-story', 'about-us')
- `baseUrl` (string, required): Full canonical URL for the page
- `fallback` (object, optional): Fallback SEO values
  - `title` (string): Fallback page title
  - `description` (string): Fallback meta description
  - `keywords` (string): Fallback keywords
  - `ogImage` (string): Fallback Open Graph image URL
- `options` (object, optional): Additional options
  - `populate` (string): Strapi populate query (default: 'seo')
  - `revalidate` (number): Revalidation time in seconds
  - `headers` (object): Custom headers

**Returns:** Promise<Object> - Next.js metadata object

**Example:**
```javascript
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-story',
    'https://www.lupin.com/about-us/our-story',
    {
      title: 'Our Story - Lupin',
      description: 'Default description',
    },
    {
      revalidate: 3600, // Cache for 1 hour
    }
  );
}
```

### `fetchStrapiSEO(endpoint, options)`

Fetch SEO data directly from Strapi (lower-level function).

**Parameters:**
- `endpoint` (string): Strapi API endpoint
- `options` (object): Fetch options

**Returns:** Promise<Object|null> - SEO data or null if not found

**Example:**
```javascript
import { fetchStrapiSEO } from '@/lib/seo-utils';

const seoData = await fetchStrapiSEO('our-story');
console.log(seoData.metaTitle);
```

### `generateSEOMetadataSync(strapiSEO, baseUrl, fallback)`

Generate metadata synchronously when you already have SEO data.

**Parameters:**
- `strapiSEO` (object): SEO data from Strapi
- `baseUrl` (string): Canonical URL
- `fallback` (object): Fallback values

**Returns:** Object - Next.js metadata object

**Example:**
```javascript
import { generateSEOMetadataSync } from '@/lib/seo-utils';

// If you already fetched the data
const pageData = await fetchPageData();
export const metadata = generateSEOMetadataSync(
  pageData.seo,
  'https://www.lupin.com/page',
  { title: 'Fallback Title' }
);
```

## Examples

### Example 1: Simple Page with Strapi SEO

```javascript
// src/app/about-us/our-story/page.js
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-story',
    'https://www.lupin.com/about-us/our-story',
    {
      title: 'Our Story - Lupin',
      description: 'Learn about Lupin\'s journey',
    }
  );
}

export default function OurStoryPage() {
  return <div>Our Story Content</div>;
}
```

### Example 2: Page with Custom Revalidation

```javascript
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'news-article',
    'https://www.lupin.com/news/article',
    {
      title: 'News Article - Lupin',
      description: 'Latest news from Lupin',
    },
    {
      revalidate: 300, // Revalidate every 5 minutes
    }
  );
}
```

### Example 3: Using with Existing Data Fetch

```javascript
import { generateSEOMetadataSync } from '@/lib/seo-utils';
import { fetchStrapiPage } from '@/lib/strapi-utils';

export async function generateMetadata() {
  // Fetch page data (including SEO)
  const pageData = await fetchStrapiPage('about-us');
  
  if (pageData?.attributes?.seo) {
    return generateSEOMetadataSync(
      pageData.attributes.seo,
      'https://www.lupin.com/about-us',
      {
        title: 'About Us - Lupin',
        description: 'About Lupin',
      }
    );
  }
  
  // Fallback if no SEO data
  return {
    title: 'About Us - Lupin',
    description: 'About Lupin',
  };
}
```

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=https://cms-lupin-uat-ckhucnecaybdhdhv.centralindia-01.azurewebsites.net
STRAPI_API_TOKEN=your-api-token
STRAPI_REVALIDATE=60
```

## Supported Strapi SEO Fields

The utility supports these Strapi SEO component fields:

- ✅ `metaTitle` - Page title
- ✅ `metaDescription` - Meta description
- ✅ `keywords` - Meta keywords
- ✅ `canonicalURL` - Canonical URL
- ✅ `metaRobots` - Robots meta tag (e.g., "noindex, nofollow")
- ✅ `metaImage` - Open Graph image
- ✅ `preventIndexing` - Boolean (alternative to metaRobots)
- ✅ `preventFollowing` - Boolean (alternative to metaRobots)

## Error Handling

The utility handles errors gracefully:

1. **404 Not Found**: Returns fallback metadata
2. **Network Errors**: Returns fallback metadata
3. **Invalid Data**: Returns fallback metadata

All errors are logged to the console in development mode.

## Best Practices

1. **Always provide fallback values** - Ensure your page has SEO even if Strapi is unavailable
2. **Use appropriate revalidation** - Set `revalidate` based on how often SEO data changes
3. **Test fallback behavior** - Verify pages work when Strapi is unavailable
4. **Use canonical URLs** - Always provide the full canonical URL for proper SEO

## Migration from Static SEO

If you're migrating from static SEO metadata:

**Before:**
```javascript
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: "Our Story - Lupin",
  description: "Description",
  canonicalUrl: "https://www.lupin.com/about-us/our-story",
});
```

**After:**
```javascript
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-story',
    'https://www.lupin.com/about-us/our-story',
    {
      title: "Our Story - Lupin",
      description: "Description",
    }
  );
}
```

