/** @type {import('next').NextConfig} */

// CMS redirects: resolved at runtime in src/proxy.js so Azure App Service application settings
// work without pipeline/build-time Strapi env.

// Helper function to parse Strapi URL and create remote pattern
function getStrapiImagePattern() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1380';

  try {
    const url = new URL(strapiUrl);
    const protocol = url.protocol.replace(':', '') || 'http';
    const hostname = url.hostname;

    const pattern = {
      protocol,
      hostname,
      pathname: '/uploads/**',
    };

    const defaultPort = protocol === 'https' ? '443' : '80';
    if (url.port && url.port !== defaultPort) {
      pattern.port = url.port;
    }

    return pattern;
  } catch (error) {
    return {
      protocol: 'https',
      hostname: 'lupin-cms.devmaffia.in',
      port: '1380',
      pathname: '/uploads/**',
    };
  }
}

const nextConfig = {
  /**
   * REQUIRED FOR AZURE + PIPELINE
   */
  output: 'standalone',

  turbopack: {},

  /**
   * Image optimization (Strapi + Azure Blob + Lupin)
   */
  images: {
    formats: ['image/webp'],
    deviceSizes: [414, 768, 1024, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      getStrapiImagePattern(),
      {
        protocol: 'https',
        hostname: 'www.lupin.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cmsuatlupin.blob.core.windows.net',
        pathname: '/public/uploads/**',
      },
    ],
  },

  /**
   * CSS / SCSS handling
   */
  webpack(config) {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      ?.oneOf?.filter((rule) => Array.isArray(rule.use));

    if (rules) {
      rules.forEach((rule) => {
        rule.use?.forEach((loader) => {
          if (
            loader.loader?.includes('css-loader') &&
            loader.options?.modules
          ) {
            if (typeof loader.options.modules === 'object') {
              loader.options.modules.auto = (resourcePath) =>
                /\.module\.(css|scss|sass)$/i.test(resourcePath);
            }
          }
        });
      });
    }

    return config;
  },

  /**
   * Redirects: static only (CMS redirects run in middleware at runtime).
   */
  async redirects() {
    return [
      {
        source: '/video/semanext-how-to-use',
        destination: '/video/semanext-how-to-use.mp4',
        permanent: false,
      },

      { source: '/a-healthy-india', destination: '/media/perspectives/a-healthy-india/', permanent: false },
      { source: '/a-healthy-india/', destination: '/media/perspectives/a-healthy-india/', permanent: false },
      // ESG reports: redirect folder path to index.html so URL works without typing index.html
      { source: '/esg-report', destination: '/esg-report/index.html', permanent: false },
      { source: '/esg-report/', destination: '/esg-report/index.html', permanent: false },
      { source: '/esg-report-2023', destination: '/esg-report-2023/index.html', permanent: false },
      { source: '/esg-report-2023/', destination: '/esg-report-2023/index.html', permanent: false },
      { source: '/esg-report-2024', destination: '/esg-report-2024/index.html', permanent: false },
      { source: '/esg-report-2024/', destination: '/esg-report-2024/index.html', permanent: false },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination:
          "https://cmsuatlupin.blob.core.windows.net/public/wp-content/:path*",
      },
      {
        source: "/uploads/:path*",
        destination:
          "https://cmsuatlupin.blob.core.windows.net/public/uploads/:path*",
      },
    ];
  },

  /**
   * SECURITY HEADERS – VAPT FIX
   */
  async headers() {
    return [
      {
        source: '/_next/static/chunks/(.*).js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()',
          },
          // CSP (strict-dynamic + nonce) is set in src/proxy.js per request.
        ],
      },
    ];
  }


};

export default nextConfig;
