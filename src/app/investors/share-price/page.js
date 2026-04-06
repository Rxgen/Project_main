import InnerBanner from '@/components/InnerBanner';
import SharePrice from '@/components/SharePrice';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getSharePrice, mapSharePriceData } from '@/lib/strapi-reports';
import { mapTopBannerData, fetchAPI } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the share price page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'share-price',
    'https://www.lupin.com/investors/share-price'
  );
}

export default async function SharePricePage() {
  let sharePriceData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getSharePrice();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Share Price - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasSharePriceSection: !!(rawData?.data?.SharePriceSection || rawData?.SharePriceSection)
      });
    }
    
    if (rawData) {
      sharePriceData = mapSharePriceData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Share Price - Mapped data:', {
          hasShareCapital: !!sharePriceData?.shareCapital,
          hasListingOfSecurities: !!sharePriceData?.listingOfSecurities,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Share Price - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch share price data from Strapi';
    console.error('Error fetching Share Price data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Fetch iframe data (keep existing iframe logic)
  let iframeData = null;
  try {
    const data = await fetchAPI('share-price?populate=*', {
      cache: 'no-store',
    });
    
    // Handle null response (404 or other errors)
    if (data && data.data && data.data.attributes) {
      const attributes = data.data.attributes;
      iframeData = {
        iframeUrl: attributes.iframeUrl || attributes.iframe?.url || "",
        iframeTitle: attributes.iframeTitle || attributes.iframe?.title || "Share Price"
      };
    }
  } catch (error) {
    console.error('Error fetching iframe data from Strapi:', error);
  }

  // Merge share price sections with iframe data
  const finalSharePriceData = {
    ...sharePriceData,
    iframeUrl: iframeData?.iframeUrl || "",
    iframeTitle: iframeData?.iframeTitle || "Share Price"
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <SharePrice data={finalSharePriceData} error={error} />
      <SubscriberUpdated />
    </div>
  );
}

