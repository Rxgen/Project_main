import OurValuesContent from '@/components/OurValuesContent';
import { getOurValue, mapOurValueData } from '@/lib/strapi-pages';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import '@/scss/pages/our-values.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the our-values page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-value',
    'https://www.lupin.com/about-us/our-values'
  );
}

export default async function OurValuesPage() {
  let ourValueData = null;
  let error = null;
  
  try {
    const rawData = await getOurValue();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Our Value - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasIntroSection: !!(rawData?.data?.OurValueIntroSection || rawData?.OurValueIntroSection),
        hasValuesOverview: !!(rawData?.data?.ValuesOverviewSection || rawData?.ValuesOverviewSection),
        hasVideoSection: !!(rawData?.data?.CulturePrinciplesVideoSection || rawData?.CulturePrinciplesVideoSection)
      });
    }
    
    if (rawData) {
      ourValueData = mapOurValueData(rawData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Our Value - Mapped data:', {
          hasBanner: !!ourValueData?.banner,
          hasIntroSection: !!ourValueData?.introSection,
          valuesCount: ourValueData?.valuesOverview?.length || 0,
          hasVideoSection: !!ourValueData?.videoSection
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Our Value - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch our value data from Strapi';
    console.error('Error fetching Our Value data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return <OurValuesContent data={ourValueData} error={error} />;
}

