# Lupin Frontend - Next.js with SCSS & Strapi Ready

A modern Next.js 16.1.0 frontend with SCSS utilities, VW-based responsive design, and Strapi CMS integration ready.

## Features

- ✅ **Next.js 16.1.0** - Latest version with App Router (SSR by default)
- ✅ **SCSS with VW Functions** - Responsive design using viewport units
- ✅ **Media Query Mixins** - Easy responsive breakpoints
- ✅ **No CSS Modules** - Use normal `className="classname"`
- ✅ **Component-wise SCSS** - Organized in `scss/components/`
- ✅ **Strapi Ready** - Easy CMS integration structure
- ✅ **SSR by Default** - All pages render server-side

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## SCSS Structure

```
src/scss/
├── utils/
│   ├── _variables.scss    # Colors, spacing, typography
│   ├── _functions.scss     # VW functions (vw, vw-mobile)
│   └── _mixins.scss        # Media queries, flex, grid
├── base/
│   ├── _reset.scss         # CSS reset
│   └── _typography.scss    # Typography styles
├── components/
│   ├── Hero.scss           # Hero component styles
│   ├── Card.scss           # Card component styles
│   └── Header.scss         # Header/nav styles
└── main.scss               # Main entry point
```

## Using VW Functions

### Desktop (base 1920px)

```scss
.element {
  width: vw(100);        // 100px on 1920px screen
  padding: vw(40);       // 40px on 1920px screen
}
```

### Mobile (base 414px)

```scss
@include media('mobile') {
  .element {
    width: vw-mobile(50, 414);    // 50px on 414px screen
    padding: vw-mobile(20, 414);  // 20px on 414px screen
  }
}
```

## Media Query Mixins

```scss
// Max-width (mobile-first)
@include media('mobile') {
  // Styles for mobile (max-width: 414px)
}

@include media('tablet') {
  // Styles for tablet (max-width: 768px)
}

// Min-width
@include media('desktop', 'min') {
  // Styles for desktop and up (min-width: 1024px)
}

// Between breakpoints
@include media-between('mobile', 'tablet') {
  // Styles between mobile and tablet
}

// Custom breakpoint
@include media-custom($min: 600px, $max: 900px) {
  // Custom range
}
```

## Component Structure (Strapi Ready)

All components are designed to receive data from Strapi:

```javascript
// Component expects data prop
export default function Hero({ data }) {
  // data structure matches Strapi API response
  return (
    <section className="hero">
      <h1>{data.title}</h1>
      {/* ... */}
    </section>
  );
}
```

## Integrating Strapi

### 1. Set up environment variable

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update with your Strapi URL:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 2. Fetch data in your page

```javascript
// src/app/page.js
import { getHomepage } from '@/lib/strapi';

export default async function Home() {
  const homepage = await getHomepage();
  
  return (
    <>
      <Hero data={homepage.data.attributes.hero} />
      {/* ... */}
    </>
  );
}
```

### 3. Available Strapi helpers

```javascript
import {
  fetchAPI,           // Generic API fetch
  getStrapiMedia,     // Get full media URL
  getHomepage,        // Get homepage data
  getArticles,        // Get all articles
  getArticle,         // Get single article
  getGlobalSettings   // Get global settings
} from '@/lib/strapi';
```

## Example Strapi Content Structure

### Homepage Collection

```json
{
  "hero": {
    "title": "Welcome",
    "subtitle": "Subtitle text",
    "backgroundImage": { "url": "..." },
    "ctaButtons": [
      { "text": "Get Started", "link": "#", "style": "primary" }
    ]
  }
}
```

### Article Collection

```json
{
  "title": "Article Title",
  "slug": "article-slug",
  "description": "Description",
  "image": { "url": "...", "alt": "..." },
  "category": "Category Name",
  "content": "Rich text content..."
}
```

## Available Breakpoints

```scss
$breakpoints: (
  'mobile': 414px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px,
  'ultra-wide': 1920px
);
```

## Utilities

### Container

```javascript
<div className="container">
  {/* Max-width 1440px, responsive padding */}
</div>

<div className="container-fluid">
  {/* Full width, responsive padding */}
</div>
```

### Text Utilities

```javascript
<p className="text-center">Centered text</p>
<p className="text-left">Left aligned</p>
<p className="text-right">Right aligned</p>
<code className="font-mono">Monospace font</code>
```

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
lupin-frontend/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   ├── scss/            # SCSS files
│   └── lib/             # Utilities (Strapi helpers)
├── public/              # Static assets
└── package.json
```

## Tips

1. **Always use SSR** - All components render server-side by default
2. **Use 'use client'** - Only when you need client-side features (useState, onClick, etc.)
3. **Component-wise SCSS** - Create separate SCSS file for each component
4. **VW units** - Use `vw()` for desktop, `vw-mobile()` for mobile
5. **Strapi structure** - Design data structures that match your Strapi collections

## License

MIT
