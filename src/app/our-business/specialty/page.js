import InnerBanner from '@/components/InnerBanner';
import SpecialtyIntro from '@/components/specialty/SpecialtyIntro';
import SpecialtyHeading from '@/components/specialty/SpecialtyHeading';
import SpecialtyContent from '@/components/specialty/SpecialtyContent';
import SpecialtyUnitedStates from '@/components/specialty/SpecialtyUnitedStates';
import SpecialtyEurope from '@/components/specialty/SpecialtyEurope';
import SpecialtyCanada from '@/components/specialty/SpecialtyCanada';
import SpecialtyBrazil from '@/components/specialty/SpecialtyBrazil';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { mapTopBannerData, mapSpecialtyIntroData, mapSpecialtyHeadingData, mapSpecialtyUnitedStatesData, mapSpecialtyEuropeData, mapSpecialtyCanadaData, mapSpecialtyBrazilData, fetchAPI } from '@/lib/strapi';
import '@/scss/pages/specialty.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Specialty page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'specialty',
    'https://www.lupin.com/our-business/specialty'
  );
}

export default async function SpecialtyPage() {
  // Fetch data from Strapi with specific populate query (single API call)
  const populateQuery = 'populate[hero][populate]=*&populate[intro][populate]=*&populate[snapshotSection][populate][snapshot][populate][image][populate]=*&populate[snapshotSection][populate][snapshot][populate][cta][populate]=*&populate[snapshotSection][populate][snapshot][populate][moreInfo][populate][cta][populate]=*';
  
  let strapiData = null;
  let bannerData = null;
  let specialtyIntroData = null;
  let specialtyHeadingData = null;
  let unitedStatesData = null;
  let europeData = null;
  let canadaData = null;
  let brazilData = null;

  try {
    strapiData = await fetchAPI(`specialty?${populateQuery}`, {
      cache: 'no-store',
    });


    // Extract data from response
    const data = strapiData?.data || strapiData;

    // Map hero data for InnerBanner
    if (data?.hero) {
      bannerData = mapTopBannerData(data.hero);
    }

    // Map intro data
    specialtyIntroData = mapSpecialtyIntroData(strapiData);

    // Map heading data
    specialtyHeadingData = mapSpecialtyHeadingData(strapiData);

    // Map each region's data separately
    unitedStatesData = mapSpecialtyUnitedStatesData(strapiData);
    europeData = mapSpecialtyEuropeData(strapiData);
    canadaData = mapSpecialtyCanadaData(strapiData);
    brazilData = mapSpecialtyBrazilData(strapiData);
  } catch (error) {
    console.error('Error fetching specialty data from Strapi:', error);
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}

      {specialtyIntroData && <SpecialtyIntro data={specialtyIntroData} />}

      {specialtyHeadingData && <SpecialtyHeading data={specialtyHeadingData} />}

      {unitedStatesData && (
        <SpecialtyContent>
          <SpecialtyUnitedStates data={unitedStatesData} />
        </SpecialtyContent>
      )}

      {europeData && <SpecialtyEurope data={europeData} />}

      {canadaData && (
        <SpecialtyContent>
          <SpecialtyCanada data={canadaData} />
        </SpecialtyContent>
      )}

      {brazilData && <SpecialtyBrazil data={brazilData} />}
    </div>
  );
}

