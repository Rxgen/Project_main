import InnerBanner from '@/components/InnerBanner';
import UnclaimedDividend from '@/components/UnclaimedDividend';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getUnclaimedDividend, mapUnclaimedDividendData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the unclaimed dividend page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'unclaimed-dividend',
    'https://www.lupin.com/investors/unclaimed-dividend'
  );
}

export default async function UnclaimedDividendPage() {
  let unclaimedData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getUnclaimedDividend();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Unclaimed Dividend - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasUnclaimedDivendSection: !!(rawData?.data?.UnclaimedDivendSection || rawData?.UnclaimedDivendSection)
      });
    }
    
    if (rawData) {
      unclaimedData = mapUnclaimedDividendData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Unclaimed Dividend - Mapped data:', {
          hasSectionTitle: !!unclaimedData?.sectionTitle,
          hasDividendInfoSection: !!unclaimedData?.dividendInfoSection,
          hasDividendNotice: !!unclaimedData?.dividendNotice,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Unclaimed Dividend - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch unclaimed dividend data from Strapi';
    console.error('Error fetching Unclaimed Dividend data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <UnclaimedDividend data={unclaimedData} error={error} />
    </div>
  );
}

