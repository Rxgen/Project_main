# SEO Implementation Guide

This project includes a comprehensive SEO solution with support for:
- Dynamic meta tags (title, description, keywords)
- Canonical URLs
- Open Graph tags (Facebook, LinkedIn)
- Twitter Cards
- Structured Data (JSON-LD)
- Robots meta tags
- Social media integration

## File Structure

```
src/
├── lib/
│   └── seo.js              # SEO configuration and utilities
├── app/
│   ├── layout.js           # Root layout with default SEO
│   ├── page.js             # Home page with SEO metadata
│   └── [page]/
│       └── page.js         # Individual pages with custom SEO
```

## Usage

### 1. Default SEO Configuration

Edit `src/lib/seo.js` to update default SEO values:

```javascript
export const defaultSEO = {
  title: "Your Site Title",
  description: "Your site description",
  siteUrl: "https://www.yoursite.com",
  // ... other settings
};
```

### 2. Page-Specific SEO

Use the `generateMetadata` function in any page:

```javascript
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: "Page Title - Site Name",
  description: "Page description for SEO",
  canonicalUrl: "https://www.yoursite.com/page-url",
  keywords: "keyword1, keyword2, keyword3",
  ogImage: "https://www.yoursite.com/og-image.jpg",
  noIndex: false,  // Set to true to prevent indexing
  noFollow: false, // Set to true to prevent following links
});
```

### 3. Structured Data (JSON-LD)

Add structured data to your pages:

```javascript
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo';

export default function Page() {
  const organizationSchema = generateOrganizationSchema();
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Current Page', path: '/current-page' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* Your page content */}
    </>
  );
}
```

## Integration with Strapi CMS

The SEO system is designed to work with Strapi. When fetching data from Strapi:

```javascript
export const metadata = generateSEOMetadata({
  title: strapiData.seo.metaTitle,
  description: strapiData.seo.metaDescription,
  canonicalUrl: strapiData.seo.canonicalURL,
  keywords: strapiData.seo.keywords,
  ogImage: strapiData.seo.metaImage?.url,
  noIndex: strapiData.seo.preventIndexing,
});
```

### Strapi SEO Component Structure

In your Strapi CMS, create an SEO component with these fields:

- **metaTitle** (Text)
- **metaDescription** (Text Area)
- **keywords** (Text)
- **canonicalURL** (Text)
- **metaImage** (Media)
- **metaSocial** (Component - repeatable)
  - socialNetwork (Enumeration: Facebook, Twitter)
  - title (Text)
  - description (Text Area)
  - image (Media)
- **preventIndexing** (Boolean)

## SEO Features

### 1. Meta Tags
- Title tag with custom titles per page
- Meta description
- Meta keywords
- Canonical URL to prevent duplicate content
- Robots meta (index/noindex, follow/nofollow)

### 2. Open Graph (Facebook, LinkedIn)
- og:title
- og:description
- og:image
- og:url
- og:type
- og:site_name

### 3. Twitter Cards
- twitter:card
- twitter:site
- twitter:title
- twitter:description
- twitter:image

### 4. Structured Data
- Organization schema
- Breadcrumb schema
- Custom schemas can be added

### 5. Mobile & PWA
- Theme color
- Apple mobile web app tags
- Manifest link

## Verification Codes

Add search engine verification codes in `src/lib/seo.js`:

```javascript
verification: {
  google: "your-google-verification-code",
  yandex: "your-yandex-verification-code",
  bing: "your-bing-verification-code",
}
```

## Best Practices

1. **Title Length**: Keep titles under 60 characters
2. **Description Length**: Keep descriptions between 150-160 characters
3. **Keywords**: Use 5-10 relevant keywords
4. **Canonical URLs**: Always use absolute URLs
5. **Images**: Use images with 1200x630px for optimal Open Graph display
6. **Unique Content**: Each page should have unique title and description

## Testing SEO

Test your SEO implementation:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Lighthouse**: Run Lighthouse audit in Chrome DevTools

## Dynamic Sitemap (Optional)

Create `app/sitemap.js` for automatic sitemap generation:

```javascript
export default function sitemap() {
  return [
    {
      url: 'https://www.yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.yoursite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add more URLs
  ];
}
```

## Robots.txt (Optional)

Create `app/robots.js`:

```javascript
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://www.yoursite.com/sitemap.xml',
  };
}
```

## Support

For more information about Next.js metadata:
https://nextjs.org/docs/app/building-your-application/optimizing/metadata
