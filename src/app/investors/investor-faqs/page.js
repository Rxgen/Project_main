import InnerBanner from '@/components/InnerBanner';
import InvestorFAQs from '@/components/InvestorFAQs';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getInvestorFAQs, mapInvestorFAQsData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the investor FAQs page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'investor-faq',
    'https://www.lupin.com/investors/investor-faqs'
  );
}

export default async function InvestorFAQSPage() {
  // Fetch investor FAQs data from Strapi (single API call for both FAQs and banner)
  let faqsData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getInvestorFAQs();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Investor FAQs - Raw API data received:', {
        hasData: !!rawData,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasFaqSection: !!(rawData?.data?.FaqSection || rawData?.FaqSection)
      });
    }
    
    if (rawData) {
      faqsData = mapInvestorFAQsData(rawData);
      
      // Map banner data
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Investor FAQs - Mapped data:', {
          faqsCount: faqsData?.faqs?.length || 0,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Investor FAQs - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch investor FAQs data from Strapi';
    console.error('Error fetching Investor FAQs data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <InvestorFAQs faqs={faqsData?.faqs || []} error={error} />
      <SubscriberUpdated />
    </div>
  );
}

