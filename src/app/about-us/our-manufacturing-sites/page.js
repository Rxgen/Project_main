import Image from 'next/image';
import InnerBanner from '@/components/InnerBanner';
import ManufacturingCountrySection from '@/components/ManufacturingCountrySection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getOurManufacturingSite, mapOurManufacturingSiteData } from '@/lib/strapi-reports';
import '@/scss/pages/our-manufacturing-sites.scss';
import '@/scss/components/ManufacturingIntro.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Our Manufacturing Sites page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-manufacturing-site',
    'https://www.lupin.com/about-us/our-manufacturing-sites'
  );
}

export default async function OurManufacturingSitesPage() {
  // Fetch data from Strapi
  let manufacturingData = null;

  try {
    const strapiData = await getOurManufacturingSite();
    manufacturingData = mapOurManufacturingSiteData(strapiData);
  } catch (error) {
    console.error('Error fetching our-manufacturing-site data from Strapi:', error);
  }

  // Extract data from mapped result - no fallbacks
  const bannerData = manufacturingData?.banner || null;
  const introData = manufacturingData?.introSection || null;
  const indiaData = manufacturingData?.countryAddressSection || null;
  const northAmericaData = manufacturingData?.northAmericaSection || null;
  const latamData = manufacturingData?.latamSection || null;

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      {introData && introData.description && (
        <section className="manufacturing-intro">
          <div className="manufacturing-intro__container">
            <div className="manufacturing-intro__text">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {introData.description}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {indiaData && <ManufacturingCountrySection data={indiaData} />}
      {(northAmericaData || latamData) && (
        <div className="manufacturing-regions-wrapper">
          {/* Map - Keep static as requested */}
          <div className="manufacturing-regions-wrapper__map">
            <Image
              src="/assets/images/map2.svg"
              alt="World Map"
              width={881}
              height={1296}
              quality={100}
            />
          </div>
          {northAmericaData && <ManufacturingCountrySection data={northAmericaData} />}
          {latamData && <ManufacturingCountrySection data={latamData} />}
        </div>
      )}
    </div>
  );
}
