# SEO Quick Reference Card

## 🚀 Quick Start

### 1. Basic Page SEO (Server Component)
```javascript
// app/your-page/page.js
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: "Your Page Title - Lupin",
  description: "Your page description (150-160 chars)",
  canonicalUrl: "https://www.lupin.com/your-page",
});

export default function YourPage() {
  return <div>Your content</div>;
}
```

### 2. Page with Structured Data
```javascript
import { generateMetadata as generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: "Your Page Title",
  description: "Your description",
  canonicalUrl: "https://www.lupin.com/your-page",
});

export default function YourPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Your Page', path: '/your-page' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div>Your content</div>
    </>
  );
}
```

### 3. Prevent Indexing (Private Pages)
```javascript
export const metadata = generateSEOMetadata({
  title: "Admin Panel",
  description: "Admin panel",
  canonicalUrl: "https://www.lupin.com/admin",
  noIndex: true,  // ⚠️ Don't index this page
  noFollow: true, // ⚠️ Don't follow links
});
```

### 4. Custom Open Graph Image
```javascript
export const metadata = generateSEOMetadata({
  title: "Your Page",
  description: "Description",
  canonicalUrl: "https://www.lupin.com/page",
  ogImage: "https://www.lupin.com/images/custom-og-image.jpg",
  ogImageAlt: "Description of the image",
});
```

### 5. Strapi Integration
```javascript
// Fetch data from Strapi
const data = await fetchFromStrapi('api/pages/about');

export const metadata = generateSEOMetadata({
  title: data.seo?.metaTitle || "Default Title",
  description: data.seo?.metaDescription || "Default description",
  canonicalUrl: data.seo?.canonicalURL || "https://www.lupin.com/about",
  keywords: data.seo?.keywords,
  ogImage: data.seo?.metaImage?.url,
  noIndex: data.seo?.preventIndexing || false,
});
```

---

## 📋 Available Functions

### `generateMetadata(options)`
**Options:**
- `title` - Page title
- `description` - Page description
- `canonicalUrl` - Canonical URL
- `keywords` - Keywords (comma-separated)
- `ogImage` - Open Graph image URL
- `ogImageAlt` - OG image alt text
- `noIndex` - Prevent indexing (boolean)
- `noFollow` - Prevent following links (boolean)
- `googleVerification` - Google verification code
- `bingVerification` - Bing verification code
- `yandexVerification` - Yandex verification code

### `generateOrganizationSchema()`
Returns JSON-LD organization schema

### `generateBreadcrumbSchema(items)`
**Items:** `[{ name: 'Page', path: '/page' }, ...]`

---

## 🎯 Common Patterns

### Article/Blog Post
```javascript
export const metadata = generateSEOMetadata({
  title: "Article Title - Lupin Blog",
  description: "Article summary",
  canonicalUrl: "https://www.lupin.com/blog/article-slug",
  keywords: "healthcare, innovation, lupin",
  ogImage: "https://www.lupin.com/images/article-cover.jpg",
});
```

### Product Page
```javascript
export const metadata = generateSEOMetadata({
  title: "Product Name - Lupin Pharmaceuticals",
  description: "Product description and benefits",
  canonicalUrl: "https://www.lupin.com/products/product-name",
  keywords: "product, pharmaceutical, medicine",
});
```

### News/Media Page
```javascript
export const metadata = generateSEOMetadata({
  title: "Latest News - Lupin Media Center",
  description: "Stay updated with latest news and press releases",
  canonicalUrl: "https://www.lupin.com/media",
});
```

---

## ⚡ Tips

✅ **DO:**
- Use unique title and description for each page
- Keep titles under 60 characters
- Keep descriptions between 150-160 characters
- Use absolute URLs for canonical
- Include relevant keywords naturally
- Test with Google Rich Results Test

❌ **DON'T:**
- Duplicate titles across pages
- Keyword stuff
- Use relative URLs for canonical
- Forget to set noIndex for private pages
- Use generic descriptions

---

## 🔍 Testing URLs

- **Sitemap:** `/sitemap.xml`
- **Robots:** `/robots.txt`
- **Manifest:** `/manifest.json`

---

## 📞 Need Help?

Check:
1. `SEO_GUIDE.md` - Complete documentation
2. `SEO_IMPLEMENTATION_SUMMARY.md` - Implementation details
3. `src/app/about/page.example.js` - Example page

---

**Remember:** Good SEO = Good content + Technical optimization 🚀
