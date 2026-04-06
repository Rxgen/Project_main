import InnerBanner from '@/components/InnerBanner';
import CookiePolicyContent from '@/components/CookiePolicyContent';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { fetchAPI } from '@/lib/strapi';

// Generate metadata for the Cookie Policy page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'cookie-policy',
    'https://www.lupin.com/cookie-policy',
    {
      title: 'Cookie Policy - Lupin',
      description: 'Read Lupin’s cookie policy to understand how cookies are used, managed, and controlled to improve website functionality and user experience.',
    }
  );
}

// Fetch cookie policy data from Strapi
async function getCookiePolicyData() {
  try {
    // Check if Strapi is configured
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      return null; // Use default data
    }

    // Fetch from Strapi - adjust endpoint based on your Strapi content type name
    const data = await fetchAPI('cookie-policy?populate=deep', {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    // Handle null response (404 or other errors)
    if (!data) {
      return null;
    }

    // Map Strapi response to component format
    if (data.data) {
      // Collection type response
      const attributes = Array.isArray(data.data) ? data.data[0]?.attributes : data.data?.attributes;
      return attributes || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching cookie policy data from Strapi:', error);
    // Return null to use default data on error
    return null;
  }
}

export default async function CookiePolicyPage() {
  // Fetch data from Strapi
  const strapiData = await getCookiePolicyData();

  const bannerData = {
    title: {
      line1: "Cookie",
      line2: "Policy",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Cookie Policy - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <CookiePolicyContent data={strapiData} />
    </div>
  );
}

