import InnerBanner from '@/components/InnerBanner';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getCommunity, mapCommunityInfoData, mapTopBannerData, mapLivelihoodTabsData, mapLivelihoodSectionData, mapImpactSectionData, mapLiveProgramSectionData } from '@/lib/strapi';
import LivelihoodSection from '@/components/community/LivelihoodSection';
import LivelihoodTabs from '@/components/community/LivelihoodTabs';
import LivesProgram from '@/components/community/LivesProgram';
import FoundationLink from '@/components/community/FoundationLink';
import ImpactAtGlance from '@/components/community/ImpactAtGlance';
import '@/scss/pages/community.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Community page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'community',
    'https://www.lupin.com/community'
  );
}

export default async function CommunityPage() {
  // Fetch data from Strapi
  let bannerData = null;
  let infoData = null;
  let impactData = null;
  let livelihoodData = null;
  let tabsData = null;
  let liveProgramData = null;
  let sectionData = null;

  try {
    const strapiData = await getCommunity();
    
    // Map TopBanner data for InnerBanner
    const data = strapiData?.data || strapiData;
    if (data?.TopBanner) {
      bannerData = mapTopBannerData(data.TopBanner);
    }

    // Map InfoSection data
    infoData = mapCommunityInfoData(strapiData);

    // Map ImpactSection data
    impactData = mapImpactSectionData(strapiData);

    // Map LivelihoodSection data
    livelihoodData = mapLivelihoodSectionData(strapiData);

    // Map LivelihoodTabs data
    tabsData = mapLivelihoodTabsData(strapiData);

    // Map LiveProgramSection data
    liveProgramData = mapLiveProgramSectionData(strapiData);

    // Extract SectionData for FoundationLink
    sectionData = data?.SectionData;
  } catch (error) {
    console.error('Error fetching community data from Strapi:', error);
  }

  // Custom paragraph component for ReactMarkdown
  const CustomParagraph = ({ children }) => {
    return <p className="community-info__paragraph">{children}</p>;
  };

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      {infoData && (
        <section className="community-info">
          <div className="community-info__container">
            <div className="community-info__content">
              <div className="community-info__text">
                {infoData.content && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: CustomParagraph,
                    }}
                  >
                    {infoData.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
            {infoData.image && infoData.image.url && infoData.image.width && infoData.image.height && (
              <div className="community-info__image-wrapper">
                <Image
                  src={infoData.image.url}
                  alt={infoData.image.alt || ''}
                  width={infoData.image.width}
                  height={infoData.image.height}
                  className="community-info__image"
                  quality={100}
                />
              </div>
            )}
          </div>
        </section>
      )}
      {impactData && <ImpactAtGlance impactData={impactData} />}
      <LivelihoodSection livelihoodData={livelihoodData} />
      <LivelihoodTabs tabs={tabsData || []} />
      {liveProgramData && <LivesProgram programData={liveProgramData} />}
      <FoundationLink detailDescription={sectionData?.DetailDescription || null} />
      
    </div>
  );
}

