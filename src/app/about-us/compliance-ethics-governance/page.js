import InnerBanner from '@/components/InnerBanner';
import EthicsComplianceIntro from '@/components/EthicsComplianceIntro';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getEthicsAndCompliance, mapEthicsAndComplianceData } from '@/lib/strapi-pages';
import { mapTopBannerData } from '@/lib/strapi';
import '@/scss/pages/ethics-compliance-governance.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Ethics, Compliance and Governance page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'ethics-and-compliance',
    'https://www.lupin.com/about-us/compliance-ethics-governance'
  );
}

export default async function EthicsComplianceGovernancePage() {
  let ethicsData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getEthicsAndCompliance();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Ethics and Compliance - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasPageIntroSection: !!(rawData?.data?.PageIntroSection || rawData?.PageIntroSection)
      });
    }
    
    if (rawData) {
      ethicsData = mapEthicsAndComplianceData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Ethics and Compliance - Mapped data:', {
          hasPageIntro: !!ethicsData?.pageIntro,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Ethics and Compliance - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch ethics and compliance data from Strapi';
    console.error('Error fetching Ethics and Compliance data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      {ethicsData?.pageIntro && <EthicsComplianceIntro data={ethicsData.pageIntro} />}
    </div>
  );
}

