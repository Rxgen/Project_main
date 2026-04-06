import GlobalPresenceContent from '@/components/GlobalPresenceContent';
import TopBanner from '@/components/TopBanner';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getGlobalPresence, mapGlobalPresenceData } from '@/lib/strapi-pages';
import '@/scss/pages/global-presence.scss';
import '@/scss/pages/map.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Global Presence page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'global-presence',
    'https://www.lupin.com/about-us/global-presence'
  );
}

export default async function GlobalPresencePage() {
  // Static banner data (keeping as static as requested)
  const bannerData = {
    title: {
      line1: "Global Presence",
    },
    subheading: {
      enabled: true,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Global Presence - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  let globalPresenceData = null;
  let error = null;
  
  try {
    const rawData = await getGlobalPresence();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Global Presence - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasPageIntroSection: !!(rawData?.data?.PageIntroSection || rawData?.PageIntroSection),
        hasGlobalPresenceSection: !!(rawData?.data?.GlobalPresenceSection || rawData?.GlobalPresenceSection)
      });
    }
    
    if (rawData) {
      globalPresenceData = mapGlobalPresenceData(rawData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Global Presence - Mapped data:', {
          hasPageIntro: !!globalPresenceData?.pageIntro,
          sectionsCount: globalPresenceData?.globalPresenceSections?.length || 0
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Global Presence - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch global presence data from Strapi';
    console.error('Error fetching Global Presence data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      <TopBanner />
      <GlobalPresenceContent data={globalPresenceData} error={error} />
    </div>
  );
}
