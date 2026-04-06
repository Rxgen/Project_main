import InnerBanner from '@/components/InnerBanner';
import QuarterlyResultsWithTabs from '@/components/QuarterlyResultsWithTabs';
import IntegratedReportAnnualReport from '@/components/IntegratedReportAnnualReport';
import AnnualReturns from '@/components/AnnualReturns';
import ExchangeFilings from '@/components/ExchangeFilings';
import ReportsAndFilings from '@/components/ReportsAndFilings';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { 
  getReportFiling, 
  mapReportFilingData,
  transformQuarterlyResultsForComponent,
  transformAnnualReportsForComponent,
  transformAnnualReturnsForComponent,
  transformBoardMeetingFilingsForComponent,
  transformOthersFilingsForComponent
} from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';
import '@/scss/components/ReportsAndFilings.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Reports and Filings page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'report-filing',
    'https://www.lupin.com/investors/reports-filings'
  );
}

export default async function ReportsAndFilingsPage() {
  // Fetch Reports and Filings data from Strapi (single API call for all sections and banner)
  let reportFilingData = null;
  let bannerData = null;
  let quarterlyData = null;
  let annualReportData = null;
  let annualReturnsData = [];
  let boardMeetingData = null;
  let othersFilingsData = null;
  let error = null;
  
  try {
    const rawData = await getReportFiling();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Reports & Filings - Raw API data received:', {
        hasData: !!rawData,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasQuarterlyResultsSection: !!(rawData?.data?.QuarterlyResultsSection || rawData?.QuarterlyResultsSection),
        hasAnnualReportSection: !!(rawData?.data?.AnnualReportSection || rawData?.AnnualReportSection),
        hasAnnualReturnsSection: !!(rawData?.data?.AnnualReturnsSection || rawData?.AnnualReturnsSection),
        hasBoardMeetingFilingsSection: !!(rawData?.data?.BoardMeetingFilingsSection || rawData?.BoardMeetingFilingsSection),
        hasOtherExchangeFilingsSection: !!(rawData?.data?.OtherExchangeFilingsSection || rawData?.OtherExchangeFilingsSection)
      });
    }
    
    if (rawData) {
      reportFilingData = mapReportFilingData(rawData);
      
      // Map banner data
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      // Transform data for each component
      quarterlyData = transformQuarterlyResultsForComponent(reportFilingData);
      annualReportData = transformAnnualReportsForComponent(reportFilingData);
      annualReturnsData = transformAnnualReturnsForComponent(reportFilingData);
      boardMeetingData = transformBoardMeetingFilingsForComponent(reportFilingData);
      othersFilingsData = transformOthersFilingsForComponent(reportFilingData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Reports & Filings - Mapped data:', {
          quarterlyData,
          annualReportData,
          annualReturnsData,
          boardMeetingData,
          othersFilingsData,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Reports & Filings - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch reports and filings data from Strapi';
    console.error('Error fetching Reports and Filings data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Fetch subscriber data from Strapi (optional - component has default data)
  let subscriberData = null;
  
  try {
    // This would typically fetch from a Strapi endpoint
    // For now, component will use default data
  } catch (error) {
    console.error('Error fetching subscriber data from Strapi:', error);
    // Will use default data from component
  }

  // Use transformed data from API ONLY - NO FALLBACK DATA
  const quarterlyTabs = quarterlyData?.tabs || [];
  const quarterlyTabsData = quarterlyData?.tabsData || {};
  // Legacy props - ONLY USE IF API DATA EXISTS, OTHERWISE EMPTY ARRAYS
  const quarterlyItems = quarterlyData?.quarterlyItems || [];
  const quarterlyCardsQ1 = quarterlyData?.cards || [];
  const quarterlyItemsAfterCards = quarterlyData?.quarterlyItemsAfterCards || [];
  const quarterlyCardsQ2 = quarterlyData?.cardsAfterQ2 || [];

  if (process.env.NODE_ENV === 'development') {
    console.log('ReportsAndFilingsPage - Quarterly data:', {
      tabs: quarterlyTabs,
      tabsDataKeys: Object.keys(quarterlyTabsData),
      quarterlyItemsCount: quarterlyItems.length,
      quarterlyCardsQ1Count: quarterlyCardsQ1.length,
      quarterlyItemsAfterCardsCount: quarterlyItemsAfterCards.length,
      quarterlyCardsQ2Count: quarterlyCardsQ2.length,
      firstTabData: quarterlyTabsData[quarterlyTabs[0]] || null
    });
  }

  const integratedReportTabs = annualReportData?.tabs || [];
  const integratedReportTabsData = annualReportData?.tabsData || {};

  // Remove all fallback data - using only API data
  const annualReturnsCards = annualReturnsData || [];

  const exchangeFilingsTabs = boardMeetingData?.tabs || [];
  const exchangeFilingsTabsData = boardMeetingData?.tabsData || {};

  const exchangeFilingsOthersTabs = othersFilingsData?.tabs || [];
  const exchangeFilingsOthersTabsData = othersFilingsData?.tabsData || {};


  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      
      {/* Tabs and Quarterly Results Section */}
      <QuarterlyResultsWithTabs 
        tabs={quarterlyTabs}
        tabsData={quarterlyTabsData}
        quarterlyItems={quarterlyItems}
        cards={quarterlyCardsQ1}
        quarterlyItemsAfterCards={quarterlyItemsAfterCards}
        cardsAfterQ2={quarterlyCardsQ2}
      />
      
      {/* Integrated Report/Annual Report Section - id for View All link from investors page */}
      <IntegratedReportAnnualReport 
        id="integrated-report-annual-report"
        title="Integrated Report/Annual Report"
        tabs={integratedReportTabs}
        tabsData={integratedReportTabsData}
      />
      
      {/* Annual Returns Section */}
      <AnnualReturns 
        title="Annual Returns"
        cards={annualReturnsCards}
      />
      
      {/* Exchange Filings (Board meeting) Section */}
      <ExchangeFilings 
        title="Exchange Filings (Board Meeting)"
        tabs={exchangeFilingsTabs}
        tabsData={exchangeFilingsTabsData}
      />
      
      {/* Exchange Filings (Others) Section - id for View All link from investors page */}
      <ExchangeFilings 
        id="exchange-filings-others"
        title="Exchange Filings (Others)"
        tabs={exchangeFilingsOthersTabs}
        tabsData={exchangeFilingsOthersTabsData}
      />
      
      <SubscriberUpdated data={subscriberData} />
    </div>
  );
}

