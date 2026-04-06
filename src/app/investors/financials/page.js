import InnerBanner from '@/components/InnerBanner';
import FinancialBarSection from '@/components/FinancialBarSection';
import SmallCard from '@/components/global/SmallCard';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getFinancial, mapFinancialData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';
import '@/scss/pages/financials.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the financials page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'financial',
    'https://www.lupin.com/investors/financials'
  );
}

export default async function FinancialsPage() {
  let financialData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getFinancial();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Financial - Raw API data received:', {
        hasData: !!rawData,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasRevenueProfitabilitySection: !!(rawData?.data?.RevenueProfitabilitySection || rawData?.RevenueProfitabilitySection),
        hasFinancial_Document_Item: !!(rawData?.data?.Financial_Document_Item || rawData?.Financial_Document_Item),
        hasRelatedPartyTransactionsSection: !!(rawData?.data?.RelatedPartyTransactionsSection || rawData?.RelatedPartyTransactionsSection)
      });
    }
    
    if (rawData) {
      financialData = mapFinancialData(rawData);
      
      // Map banner data
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Financial - Mapped data:', {
          revenueProfitability: financialData?.revenueProfitability,
          financialDocumentsCount: financialData?.financialDocuments?.length || 0,
          relatedPartyTransactionsCount: financialData?.relatedPartyTransactions?.length || 0,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Financial - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch financial data from Strapi';
    console.error('Error fetching Financial data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Extract data for components
  const revenueProfitabilityData = financialData?.revenueProfitability || null;
  const financialCards = financialData?.financialDocuments || [];
  const relatedPartyTransactions = financialData?.relatedPartyTransactions || [];

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      
      {/* Revenue and Profitability Section */}
      {revenueProfitabilityData && (
        <FinancialBarSection data={revenueProfitabilityData} />
      )}
      
      {/* Financial Documents Section */}
      {financialCards.length > 0 && (
        <section className="financial-documents">
          <div className="financial-documents__container">
            <div className="financial-documents__grid">
              {financialCards.map((card) => (
                <SmallCard
                  key={card.id}
                  title={card.title}
                  pdfUrl={card.pdfUrl}
                  isActive={card.isActive}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Party Transactions Section */}
      {relatedPartyTransactions.length > 0 && (
        <section className="related-party-transactions">
          <div className="related-party-transactions__container">
            <h2 className="related-party-transactions__title">Related Party Transactions</h2>
            <div className="related-party-transactions__grid">
              {relatedPartyTransactions.map((card) => (
                <SmallCard
                  key={card.id}
                  title={card.title}
                  pdfUrl={card.pdfUrl}
                  isActive={card.isActive}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {error && process.env.NODE_ENV === 'development' && (
        <div style={{ padding: '20px', background: '#fee', color: '#c00' }}>
          <p>Error loading financial data: {error}</p>
        </div>
      )}

      <SubscriberUpdated />
    </div>
  );
}

