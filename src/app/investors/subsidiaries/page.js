import InnerBanner from '@/components/InnerBanner';
import Subsidiaries from '@/components/Subsidiaries';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getSubsidiary, mapSubsidiaryData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the subsidiaries page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'subsidiary',
    'https://www.lupin.com/investors/subsidiaries'
  );
}

export default async function SubsidiariesPage() {
  let subsidiariesData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getSubsidiary();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Subsidiaries - Raw API data received:', {
        hasData: !!rawData,
        isDataArray: Array.isArray(rawData?.data),
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasSubsidiaries: !!(rawData?.data?.Subsidiaries || rawData?.Subsidiaries),
        subsidiariesCount: (rawData?.data?.Subsidiaries || rawData?.Subsidiaries || []).length
      });
    }
    
    if (rawData) {
      subsidiariesData = mapSubsidiaryData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Subsidiaries - Mapped data:', {
          subsidiariesCount: subsidiariesData?.subsidiaries?.length || 0,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Subsidiaries - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch subsidiaries data from Strapi';
    console.error('Error fetching Subsidiaries data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <Subsidiaries data={subsidiariesData} error={error} />
      <SubscriberUpdated />
    </div>
  );
}

