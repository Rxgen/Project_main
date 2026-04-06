// SEO Configuration (Strapi-ready)
// This will be replaced by CMS data in production

export const defaultSEO = {
  title: "Lupin - Global Pharmaceutical Leader | Innovations in Healthcare",
  description: "Lupin is a leading pharmaceutical company committed to improving lives through innovative medicines, global reach, and sustainable healthcare solutions across 100+ countries.",
  keywords: "Lupin, pharmaceutical, healthcare, medicines, global pharma, innovation, sustainability, therapeutic solutions",
  author: "Lupin Limited",
  siteUrl: "https://www.lupin.com", // Update with your actual domain
  siteName: "Lupin",
  locale: "en_US",
  type: "website",
  
  // Social Media
  social: {
    twitter: "@LupinGlobal",
    facebook: "LupinGlobal",
    linkedin: "company/lupin",
  },
  
  // Open Graph Images
  ogImage: {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Lupin - Global Pharmaceutical Leader",
  },
  
  // Twitter Card
  twitter: {
    cardType: "summary_large_image",
    site: "@LupinGlobal",
  },
};

/**
 * Generate metadata for Next.js pages
 * @param {Object} seo - SEO data from Strapi or custom data
 * @param {string} seo.title - Page title
 * @param {string} seo.description - Page description
 * @param {string} seo.keywords - Page keywords
 * @param {string} seo.canonicalUrl - Canonical URL
 * @param {string} seo.ogImage - Open Graph image URL
 * @param {boolean} seo.noIndex - Whether to prevent indexing
 * @param {boolean} seo.noFollow - Whether to prevent following links
 * @returns {Object} Next.js metadata object
 */
export function generateMetadata(seo = {}) {
  const title = seo.title || defaultSEO.title;
  const description = seo.description || defaultSEO.description;
  const canonicalUrl = seo.canonicalUrl || defaultSEO.siteUrl;
  const ogImage = seo.ogImage || `${defaultSEO.siteUrl}${defaultSEO.ogImage.url}`;
  
  // Robots meta tag
  const robots = {
    index: !seo.noIndex,
    follow: !seo.noFollow,
    googleBot: {
      index: !seo.noIndex,
      follow: !seo.noFollow,
    },
  };
  
  return {
    title,
    description,
    keywords: seo.keywords || defaultSEO.keywords,
    authors: [{ name: defaultSEO.author }],
    creator: defaultSEO.author,
    publisher: defaultSEO.author,
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Robots
    robots,
    
    // Open Graph
    openGraph: {
      type: defaultSEO.type,
      locale: defaultSEO.locale,
      url: canonicalUrl,
      title,
      description,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: ogImage,
          width: defaultSEO.ogImage.width,
          height: defaultSEO.ogImage.height,
          alt: seo.ogImageAlt || defaultSEO.ogImage.alt,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: defaultSEO.twitter.cardType,
      site: defaultSEO.twitter.site,
      creator: defaultSEO.twitter.site,
      title,
      description,
      images: [ogImage],
    },
    
    // Verification (add your verification codes)
    // Only include verification if at least one code is provided
    ...(seo.googleVerification || seo.yandexVerification || seo.bingVerification ? {
      verification: {
        ...(seo.googleVerification && { google: seo.googleVerification }),
        ...(seo.yandexVerification && { yandex: seo.yandexVerification }),
        ...(seo.bingVerification && { bing: seo.bingVerification }),
      },
    } : {}),
    
    // Additional meta tags
    other: {
      'application-name': defaultSEO.siteName,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': defaultSEO.siteName,
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'theme-color': '#1b6b59',
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 * @returns {Object} JSON-LD structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: defaultSEO.siteName,
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/assets/logo-lupin.png`,
    description: defaultSEO.description,
    sameAs: [
      `https://twitter.com/${defaultSEO.social.twitter}`,
      `https://www.facebook.com/${defaultSEO.social.facebook}`,
      `https://www.linkedin.com/${defaultSEO.social.linkedin}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 * @param {Array} items - Breadcrumb items
 * @returns {Object} JSON-LD structured data
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${defaultSEO.siteUrl}${item.path}`,
    })),
  };
}
