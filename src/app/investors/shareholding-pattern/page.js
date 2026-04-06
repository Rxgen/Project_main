import InnerBanner from '@/components/InnerBanner';
import ShareholdingPattern from '@/components/ShareholdingPattern';
import NavigationLinks from '@/components/NavigationLinks';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getShareholdingPattern, mapShareholdingPatternData } from '@/lib/strapi-reports';
import { mapTopBannerData, fetchAPI } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the shareholding pattern page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'shareholding-pattern',
    'https://www.lupin.com/investors/shareholding-pattern'
  );
}

export default async function ShareholdingPatternPage() {
  let shareholdingData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getShareholdingPattern();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Shareholding Pattern - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner)
      });
    }
    
    if (rawData) {
      shareholdingData = mapShareholdingPatternData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Shareholding Pattern - Mapped data:', {
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Shareholding Pattern - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch shareholding pattern data from Strapi';
    console.error('Error fetching Shareholding Pattern data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Fetch iframe data (keep existing iframe logic as fallback)
  let iframeData = null;
  try {
    const data = await fetchAPI('shareholding-pattern?populate=*', {
      cache: 'no-store',
    });
    
    // Handle null response (404 or other errors)
    if (data && data.data && data.data.attributes) {
      const attributes = data.data.attributes;
      iframeData = {
        iframeUrl: attributes.iframeUrl || attributes.iframe?.url || "",
        iframeTitle: attributes.iframeTitle || attributes.iframe?.title || "Shareholding Pattern"
      };
    }
  } catch (error) {
    console.error('Error fetching iframe data from Strapi:', error);
  }

  // Merge shareholding data with iframe data
  // Ensure we always have a valid iframe URL
  const iframeUrlValue = iframeData?.iframeUrl;
  const validIframeUrl = (iframeUrlValue && 
    typeof iframeUrlValue === 'string' && 
    iframeUrlValue.trim() !== '' && 
    iframeUrlValue !== 'null' && 
    iframeUrlValue !== 'undefined') 
    ? iframeUrlValue 
    : "https://content.dionglobal.in/lupinworldnew/ShareHolding.aspx";
  
  const finalShareholdingData = {
    ...shareholdingData,
    iframeUrl: validIframeUrl,
    iframeTitle: iframeData?.iframeTitle || "Shareholding Pattern"
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <section className="shareholding-pattern">
        <div className="shareholding-pattern__container">
          <NavigationLinks />
          <div className="shareholding-pattern__iframe-wrapper">
            {finalShareholdingData?.iframeUrl ? (
              <iframe
                src={finalShareholdingData.iframeUrl}
                title={finalShareholdingData.iframeTitle || "Shareholding Pattern"}
                className="shareholding-pattern__iframe"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="shareholding-pattern__placeholder">
                <p>Iframe content will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <SubscriberUpdated />
    </div>
  );
}

