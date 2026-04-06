# Strapi CMS Integration Guide

## ✅ Yes, it's 100% Strapi-Friendly!

The SEO system is designed from the ground up to work seamlessly with Strapi CMS. Here's everything you need to know:

---

## 🎯 Quick Answer

**All SEO fields are Strapi-ready:**
- ✅ Meta title and description
- ✅ Canonical URLs
- ✅ Keywords
- ✅ Open Graph images
- ✅ Social media meta tags
- ✅ Prevent indexing (noindex)
- ✅ Custom structured data

---

## 📦 Step 1: Set Up Strapi SEO Component

### In your Strapi Admin Panel:

1. **Go to:** Content-Type Builder > Create new component
2. **Category:** `shared`
3. **Name:** `seo`

### Add these fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `metaTitle` | Text | Yes | Max 60 characters |
| `metaDescription` | Text | Yes | 150-160 characters |
| `keywords` | Text | No | Comma-separated |
| `canonicalURL` | Text | No | Full URL |
| `metaImage` | Media (Single) | No | 1200x630px recommended |
| `preventIndexing` | Boolean | No | Default: false |
| `preventFollowing` | Boolean | No | Default: false |
| `metaSocial` | Component (repeatable) | No | For custom social cards |

### MetaSocial Component (optional):

| Field Name | Type |
|------------|------|
| `socialNetwork` | Enumeration (Facebook, Twitter) |
| `title` | Text |
| `description` | Text |
| `image` | Media |

---

## 📋 Step 2: Add SEO Component to Your Content Types

### For any Collection Type (Pages, Articles, etc.):

1. Open your content type in Content-Type Builder
2. Add field > Component > Select `shared.seo`
3. Display name: `SEO`
4. Type: Single component
5. Save and restart Strapi

### Example Content Types:

```
Collection Type: Page
├── title (Text)
├── slug (UID)
├── content (Rich Text)
└── seo (Component - shared.seo) ✅

Collection Type: Article
├── title (Text)
├── slug (UID)
├── excerpt (Text)
├── content (Rich Text)
├── coverImage (Media)
└── seo (Component - shared.seo) ✅

Single Type: Home
├── hero (Component)
├── sections (Dynamic Zone)
└── seo (Component - shared.seo) ✅
```

---

## 🔧 Step 3: Configure Environment Variables

Create `.env.local` in your Next.js project:

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
STRAPI_REVALIDATE=60

# Site URL (for canonical URLs)
NEXT_PUBLIC_SITE_URL=https://www.lupin.com
```

### Get your API Token:

1. In Strapi: Settings > API Tokens
2. Create new API Token
3. Name: `Next.js Frontend`
4. Token type: `Read-only` (or custom with find/findOne permissions)
5. Copy the token to your `.env.local`

---

## 💻 Step 4: Use in Your Pages

### Option 1: Simple Page (Recommended)

```javascript
// app/about/page.js
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { mapStrapiSEO, fetchStrapiPage } from '@/lib/strapi-utils';

export async function generateMetadata() {
  try {
    const pageData = await fetchStrapiPage('about');
    
    const seoData = mapStrapiSEO(
      pageData?.attributes?.seo,
      'https://www.lupin.com/about',
      {
        title: 'About Us - Lupin', // Fallback
        description: 'Learn about Lupin',
      }
    );

    return generateSEOMetadata(seoData);
  } catch (error) {
    // Fallback if Strapi is unavailable
    return generateSEOMetadata({
      title: 'About Us - Lupin',
      description: 'Learn about Lupin',
      canonicalUrl: 'https://www.lupin.com/about',
    });
  }
}

export default async function AboutPage() {
  const pageData = await fetchStrapiPage('about');
  
  return (
    <div>
      <h1>{pageData?.attributes?.title}</h1>
      <div>{pageData?.attributes?.content}</div>
    </div>
  );
}
```

### Option 2: Dynamic Routes

```javascript
// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const article = await fetchStrapiPage(params.slug, 'articles');
  
  const seoData = mapStrapiSEO(
    article?.attributes?.seo,
    `https://www.lupin.com/blog/${params.slug}`,
    {
      title: article?.attributes?.title,
      description: article?.attributes?.excerpt,
    }
  );

  return generateSEOMetadata(seoData);
}
```

### Option 3: Home Page (Single Type)

```javascript
// app/page.js
import { fetchStrapiSingleType } from '@/lib/strapi-utils';

export async function generateMetadata() {
  const homeData = await fetchStrapiSingleType('home-page');
  
  const seoData = mapStrapiSEO(
    homeData?.attributes?.seo,
    'https://www.lupin.com',
    {
      title: 'Lupin - Global Pharmaceutical Leader',
      description: 'Leading pharmaceutical company',
    }
  );

  return generateSEOMetadata(seoData);
}
```

---

## 🎨 Step 5: Fill SEO Data in Strapi

### In Strapi Admin:

1. Open your content (e.g., About Us page)
2. Scroll to **SEO** section
3. Fill in the fields:
   - **Meta Title:** About Us - Lupin | Our Story & Mission
   - **Meta Description:** Learn about Lupin's journey as a global pharmaceutical leader...
   - **Keywords:** lupin, about us, pharmaceutical company, healthcare
   - **Canonical URL:** https://www.lupin.com/about
   - **Meta Image:** Upload 1200x630px image
   - **Prevent Indexing:** Keep unchecked (or check for private pages)
4. Save and Publish

---

## 🔍 How It Works

### Data Flow:

```
Strapi CMS → API → Next.js → SEO System → HTML Meta Tags
```

### Step-by-step:

1. **You edit** SEO data in Strapi admin panel
2. **Next.js fetches** data from Strapi API using `fetchStrapiPage()`
3. **Data is mapped** using `mapStrapiSEO()` to our format
4. **Metadata is generated** using `generateSEOMetadata()`
5. **Next.js outputs** proper meta tags in HTML

---

## 📊 Example: What You Get in HTML

### When you fill this in Strapi:
```json
{
  "metaTitle": "About Us - Lupin",
  "metaDescription": "Learn about our mission",
  "canonicalURL": "https://www.lupin.com/about",
  "metaImage": { "url": "/uploads/about-og.jpg" }
}
```

### You automatically get this in HTML:
```html
<title>About Us - Lupin</title>
<meta name="description" content="Learn about our mission" />
<link rel="canonical" href="https://www.lupin.com/about" />

<!-- Open Graph -->
<meta property="og:title" content="About Us - Lupin" />
<meta property="og:description" content="Learn about our mission" />
<meta property="og:image" content="https://www.lupin.com/uploads/about-og.jpg" />
<meta property="og:url" content="https://www.lupin.com/about" />

<!-- Twitter -->
<meta name="twitter:title" content="About Us - Lupin" />
<meta name="twitter:description" content="Learn about our mission" />
<meta name="twitter:image" content="https://www.lupin.com/uploads/about-og.jpg" />
```

---

## 🛠️ Helper Functions Available

### Fetching Data:
- `fetchStrapiPage(slug, contentType)` - Fetch collection type item
- `fetchStrapiSingleType(name)` - Fetch single type

### Mapping Data:
- `mapStrapiSEO(strapiSEO, fallbackUrl, fallback)` - Convert Strapi SEO to our format

### Image Handling:
- `getStrapiImageUrl(image)` - Get full image URL
- `getStrapiImageAlt(image)` - Get image alt text
- `getStrapiImageWithTransform(image, options)` - Get optimized image

### Text Extraction:
- `extractTextFromRichText(richText, maxLength)` - Extract plain text from Strapi rich text

---

## 🚀 Advanced: Populate Strategy

### For better performance, use specific populate:

```javascript
// Only populate what you need
const response = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate[seo][populate]=metaImage`,
  // ...
);
```

### Or use `populate=deep` for everything:

```javascript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=deep`,
  // ...
);
```

---

## ✨ Benefits

### 1. **Content Editors Can Manage SEO**
No need for developers to change code for SEO updates.

### 2. **Preview in Strapi**
See SEO data while editing content.

### 3. **Consistent Structure**
All pages follow the same SEO pattern.

### 4. **Fallbacks Built-in**
If Strapi is down, site still works with fallback SEO.

### 5. **Type Safety**
All data is validated and typed.

---

## 🧪 Testing

### Test your integration:

1. **Fill SEO data in Strapi** for a page
2. **View page source** in browser (right-click > View Page Source)
3. **Check meta tags** in `<head>` section
4. **Test with tools:**
   - Google Rich Results Test
   - Facebook Sharing Debugger
   - Twitter Card Validator

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `src/lib/seo.js` | Core SEO functions |
| `src/lib/strapi-utils.js` | Strapi helper functions |
| `STRAPI_SEO_INTEGRATION.js` | Complete examples |
| `src/app/about/page-strapi-example.js` | Working page example |
| `ENV_TEMPLATE.txt` | Environment variables template |

---

## ❓ FAQ

**Q: Do I need to restart Next.js when I update Strapi content?**
A: No! Next.js revalidates every 60 seconds (configurable with `STRAPI_REVALIDATE`).

**Q: What if Strapi is down?**
A: Fallback SEO values are used automatically.

**Q: Can I use different SEO for Facebook and Twitter?**
A: Yes! Use the `metaSocial` repeatable component in Strapi.

**Q: Do I need to fill all SEO fields?**
A: No. Only `metaTitle` and `metaDescription` are recommended. Others are optional.

**Q: Can I use this with Strapi v3?**
A: This is designed for Strapi v4+. For v3, adjust the API response structure.

---

## 🎉 Summary

**Your SEO system is 100% Strapi-ready!**

✅ Just add the SEO component to Strapi
✅ Fill in the fields when creating content
✅ Everything else is automatic!

No code changes needed for SEO updates. Content editors have full control! 🚀
