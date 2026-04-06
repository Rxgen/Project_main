import InnerBanner from '@/components/InnerBanner';
import TermsOfServiceContent from '@/components/TermsOfServiceContent';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { fetchAPI } from '@/lib/strapi';

// Generate metadata for the Terms of Service page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'terms-of-service',
    'https://www.lupin.com/terms-of-service'
  );
}

// Fetch terms of service data from Strapi
async function getTermsOfServiceData() {
  try {
    // Check if Strapi is configured
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      return null; // Use default data
    }

    // Fetch from Strapi - adjust endpoint based on your Strapi content type name
    const data = await fetchAPI('terms-of-service?populate=deep', {
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
    console.error('Error fetching terms of service data from Strapi:', error);
    // Return null to use default data on error
    return null;
  }
}

export default async function TermsOfServicePage() {
  // Fetch data from Strapi
  const strapiData = await getTermsOfServiceData();

  const bannerData = {
    title: {
      line1: "Disclaimer",
  
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Terms of Service - Lupin"
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
      <TermsOfServiceContent data={strapiData} />
    </div>
  );
}

