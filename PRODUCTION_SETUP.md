# Production Setup Guide

## How Image Loading Works

### Development Mode
- **Image Optimization**: Disabled (`unoptimized={true}`) when using localhost URLs
- **Why**: Next.js image optimization API can't reliably fetch from localhost
- **Behavior**: Images load directly from Strapi server

### Production Mode
- **Image Optimization**: Enabled (`unoptimized={false}`)
- **Behavior**: Next.js automatically optimizes images on-the-fly:
  - Converts to WebP format
  - Generates responsive sizes
  - Caches optimized images
  - Serves optimized versions to users

## Production Configuration

### 1. Set Environment Variables

In your hosting platform (Vercel, Netlify, etc.), set these environment variables:

```env
NEXT_PUBLIC_STRAPI_URL=http://65.2.155.211:1380
STRAPI_API_TOKEN=your-production-api-token
```

**Note**: Your production Strapi URL is `http://65.2.155.211:1380`. Make sure:
- The IP address is accessible from your Next.js hosting server
- Port 1380 is open and accessible
- Consider using HTTPS in the future for better security

### 2. How It Works

The `next.config.mjs` file automatically reads `NEXT_PUBLIC_STRAPI_URL` at **build time** and configures the `remotePatterns` for Next.js Image component.

#### Example Flow (with your production URL):

1. **Build Time**:
   - `getStrapiImagePattern()` reads `NEXT_PUBLIC_STRAPI_URL=http://65.2.155.211:1380`
   - Creates remote pattern: `{ protocol: 'http', hostname: '65.2.155.211', port: '1380', pathname: '/uploads/**' }`
   - Next.js config is generated with this pattern

2. **Runtime**:
   - Hero component receives image URL: `http://65.2.155.211:1380/uploads/hero_image.png`
   - Next.js Image component checks if URL matches `remotePatterns` ✅
   - Image optimization is enabled (`unoptimized={false}`) - **only in production**
   - Next.js server fetches image from Strapi and optimizes it
   - Optimized image is served to the browser

### 3. Requirements

#### Strapi Server Must Be:
- ✅ Publicly accessible (not behind a firewall)
- ✅ Accessible from your Next.js hosting server
- ✅ HTTPS enabled (recommended for production)
- ✅ CORS configured to allow requests from your Next.js domain

#### Strapi CORS Configuration

Make sure your Strapi server allows requests from your Next.js domain. In Strapi's `config/middlewares.js`:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://your-nextjs-domain.com'],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

And in `config/plugins.js` or `config/middlewares.js`, configure CORS:

```javascript
module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        'https://your-nextjs-domain.com',
        'https://www.your-nextjs-domain.com',
      ],
    },
  },
};
```

### 4. Image URL Format

The `getStrapiMedia()` function automatically converts Strapi image paths to full URLs:

- **Strapi returns**: `/uploads/hero_image.png`
- **Becomes**: `https://strapi.example.com/uploads/hero_image.png`
- **Next.js optimizes**: Converts to WebP, generates sizes, caches

### 5. Testing Production Setup

Before deploying, test locally with production URL:

1. Set `NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com` in `.env.local`
2. Restart dev server
3. Check console logs - you should see the remote pattern with your production domain
4. Images should load and be optimized

## Troubleshooting

### Images not loading in production

1. **Check remotePatterns**: Look at build logs to see what pattern was configured
2. **Check Strapi accessibility**: Can your Next.js server reach the Strapi URL?
3. **Check CORS**: Are requests being blocked?
4. **Check image URLs**: Are they using the correct domain?
5. **Check Next.js logs**: Look for image optimization errors

### Fallback to unoptimized

If Next.js can't fetch images for optimization, you can temporarily use:

```javascript
unoptimized={process.env.NODE_ENV === 'development'}
```

But this is not recommended for production as it disables all image optimizations.

