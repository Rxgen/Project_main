import InnerBanner from '@/components/InnerBanner';
import SakshamNiveshak from '@/components/SakshamNiveshak';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getSakshamNiveshak, mapSakshamNiveshakData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the Saksham Niveshak page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'saksham-niveshak',
    'https://www.lupin.com/investors/iepf-saksham-niveshak'
  );
}

export default async function SakshamNiveshakPage() {
  let sakshamData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getSakshamNiveshak();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Saksham Niveshak - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasDescription: !!(rawData?.data?.Description || rawData?.Description)
      });
    }
    
    if (rawData) {
      sakshamData = mapSakshamNiveshakData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Saksham Niveshak - Mapped data:', {
          hasDescription: !!sakshamData?.description,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Saksham Niveshak - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch saksham niveshak data from Strapi';
    console.error('Error fetching Saksham Niveshak data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <SakshamNiveshak data={sakshamData} error={error} />
    </div>
  );
}

