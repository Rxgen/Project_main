import InnerBanner from '@/components/InnerBanner';
import NavigationLinks from '@/components/NavigationLinks';
import TdsDividendSection from '@/components/TdsDividendSection';
import VotingTable from '@/components/VotingTable';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getDividend, mapDividendData, getFallbackDividendHistoryTable } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';
import '@/scss/pages/dividend.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the dividend page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'divedend',
    'https://www.lupin.com/investors/dividend'
  );
}


export default async function DividendPage() {
  let dividendData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getDividend();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Dividend - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasDividendTdsCommunicationSection: !!(rawData?.data?.DividendTdsCommunicationSection || rawData?.DividendTdsCommunicationSection),
        hasDivedendHistorySection: !!(rawData?.data?.DivedendHistorySection || rawData?.DivedendHistorySection)
      });
    }
    
    if (rawData) {
      dividendData = mapDividendData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Dividend - Mapped data:', {
          hasTdsSection: !!dividendData?.tdsSection,
          hasHistorySection: !!dividendData?.historySection,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Dividend - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch dividend data from Strapi';
    console.error('Error fetching Dividend data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div className="dividend-page-wrapper" style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <section className="dividend-page">
        <NavigationLinks />
        <TdsDividendSection data={dividendData?.tdsSection} error={error} />
      </section>

      {/* Dividend History Section - always show table from fallback data */}
      <VotingTable data={getFallbackDividendHistoryTable()} />
     
      <SubscriberUpdated />
    </div>
  );
}

