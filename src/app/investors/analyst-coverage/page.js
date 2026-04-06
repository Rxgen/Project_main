import InnerBanner from '@/components/InnerBanner';
import AnalystCoverage from '@/components/AnalystCoverage';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getAnalystCoverage, mapAnalystCoverageData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the analyst coverage page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'analyst-coverage',
    'https://www.lupin.com/investors/analyst-coverage'
  );
}

export default async function AnalystCoveragePage() {
  // Fetch analyst coverage data from Strapi (single API call for both analysts and banner)
  let analystsData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getAnalystCoverage();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Analyst Coverage - Raw API data received:', {
        hasData: !!rawData,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasAnalystCoverageSection: !!(rawData?.data?.AnalystCoverageSection || rawData?.AnalystCoverageSection)
      });
    }
    
    // Map analyst coverage data
    if (rawData) {
      analystsData = mapAnalystCoverageData(rawData);
      
      // Map banner data
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Analyst Coverage - Mapped data:', {
          analystsCount: analystsData?.length || 0,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Analyst Coverage - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch analyst coverage data from Strapi';
    console.error('Error fetching Analyst Coverage data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <AnalystCoverage analysts={analystsData} error={error} />
    </div>
  );
}

