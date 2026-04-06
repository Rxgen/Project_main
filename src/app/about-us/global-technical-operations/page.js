import InnerBanner from '@/components/InnerBanner';
import AlliedBusinessLookingAhead from '@/components/AlliedBusinessLookingAhead';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getOurManufacturingApproach, mapOurManufacturingApproachData } from '@/lib/strapi-pages';
import GTOTabs from './components/GTOTabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '@/scss/pages/global-technical-operations.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Global Technical Operations page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-manufacturing-approach',
    'https://www.lupin.com/about-us/global-technical-operations'
  );
}

export default async function GlobalTechnicalOperationsPage() {
  // Fetch data from Strapi
  let gtoData = {
    banner: null,
    pageIntroSection: null,
    commentSection: null,
    strategicPerformanceAreaSection: null,
    gtoStructureSection: null,
    tabsData: null
  };

  try {
    const strapiData = await getOurManufacturingApproach();

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('GlobalTechnicalOperationsPage - Raw Strapi data:', strapiData);
    }

    gtoData = mapOurManufacturingApproachData(strapiData);

    // Debug logging after mapping
    if (process.env.NODE_ENV === 'development') {
      console.log('GlobalTechnicalOperationsPage - Mapped gtoData:', gtoData);
    }
  } catch (error) {
    console.error('Error fetching our-manufacturing-approach data from Strapi:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {gtoData.banner && <InnerBanner data={gtoData.banner} />}

      {/* Page Intro Section */}
      {gtoData.pageIntroSection && (
        <section className="global-technical-operations-content">
          <div className="global-technical-operations-content__container">
            <div className="global-technical-operations-content__wrapper">
              <div className="global-technical-operations-content__section">
                {/* Background Petals SVG */}
                <div className="global-technical-operations-content__bg-petals">
                  <img
                    src={gtoData.pageIntroSection.petalImage?.url || "/assets/global-technical/peatals.svg"}
                    alt={gtoData.pageIntroSection.petalImage?.alt || ""}
                    className="global-technical-operations-content__bg-petals-img"
                  />
                </div>

                {/* Text Content */}
                <div className="global-technical-operations-content__text">
                  <div className="global-technical-operations-content__text-main">
                    {gtoData.pageIntroSection.heading && (
                      <h2 className="global-technical-operations-content__heading">
                        {gtoData.pageIntroSection.heading.split('\n').map((line, index) => (
                          <p key={index} className="global-technical-operations-content__heading-line">
                            {line}
                          </p>
                        ))}
                      </h2>
                    )}
                    {gtoData.pageIntroSection.description && (
                      <div className="global-technical-operations-content__paragraph-main">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {gtoData.pageIntroSection.description}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comment Section (Quote) */}
      {gtoData.commentSection && gtoData.commentSection.description && (
        <section className="global-technical-operations-quote">
          <div className="global-technical-operations-quote__wrapper">
            {/* Top Quote SVG */}
            <div className="global-technical-operations-quote__top">
              <img
                src="/assets/community/top-quote.svg"
                alt=""
                className="global-technical-operations-quote__top-img"
              />
            </div>

            {/* Quote Text */}
            <div className="global-technical-operations-quote__text">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {gtoData.commentSection.description}
              </ReactMarkdown>
            </div>

            {/* Bottom Quote SVG */}
            <div className="global-technical-operations-quote__bottom">
              <img
                src="/assets/community/bottom-quote.svg"
                alt=""
                className="global-technical-operations-quote__bottom-img"
              />
            </div>
          </div>
        </section>
      )}

      {/* Certification Section (ParagraphDescription from CommentSection) */}
      {gtoData.commentSection && gtoData.commentSection.paragraphDescription && (
        <section className="global-technical-operations-certification">
          <div className="global-technical-operations-certification__container">
            <div className="global-technical-operations-certification__text">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {gtoData.commentSection.paragraphDescription}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* Strategic Performance Areas Section */}
      {gtoData.strategicPerformanceAreaSection && (
        <section className="global-technical-operations-spa">
          <div className="global-technical-operations-spa__bg"></div>
          <div className="global-technical-operations-spa__container">
            {/* Heading and Subheading */}
            <div className="global-technical-operations-spa__header">
              {gtoData.strategicPerformanceAreaSection.sectionTitle && (
                <h2 className="global-technical-operations-spa__heading">
                  {gtoData.strategicPerformanceAreaSection.sectionTitle}
                </h2>
              )}
              {gtoData.strategicPerformanceAreaSection.description && (
                <p className="global-technical-operations-spa__subheading">
                  {gtoData.strategicPerformanceAreaSection.description}
                </p>
              )}
            </div>

            {/* Content: Text and Image */}
            <div className="global-technical-operations-spa__content">
              {/* Text List */}
              {gtoData.strategicPerformanceAreaSection.cards && gtoData.strategicPerformanceAreaSection.cards.length > 0 && (
                <div className="global-technical-operations-spa__list">
                  {gtoData.strategicPerformanceAreaSection.cards.map((card, index) => (
                    <div key={index} className="global-technical-operations-spa__item">
                      <div className="global-technical-operations-spa__item-icon">
                        {index === 0 ? (
                          <div className="global-technical-operations-spa__item-icon-bg">
                            <div className="global-technical-operations-spa__item-icon-inner">
                              {card.icon ? (
                                <img
                                  src={card.icon.url}
                                  alt={card.icon.alt}
                                  className="global-technical-operations-spa__item-icon-img"
                                />
                              ) : (
                                <img
                                  src="/assets/global-technical/Icon1.svg"
                                  alt={card.heading}
                                  className="global-technical-operations-spa__item-icon-img"
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          card.icon ? (
                            <img
                              src={card.icon.url}
                              alt={card.icon.alt}
                              className="global-technical-operations-spa__item-icon-img"
                            />
                          ) : (
                            <img
                              src={`/assets/global-technical/Icon${index + 1}.svg`}
                              alt={card.heading}
                              className="global-technical-operations-spa__item-icon-img"
                            />
                          )
                        )}
                      </div>
                      <div className="global-technical-operations-spa__item-text">
                        <div className="global-technical-operations-spa__item-content">
                          {card.heading && (
                            <h3 className="global-technical-operations-spa__item-title">
                              {card.heading}
                            </h3>
                          )}
                          {card.subheading && (
                            <div className="global-technical-operations-spa__item-description">
                              {card.subheading}
                            </div>
                          )}
                        </div>
                        <div className="global-technical-operations-spa__item-divider"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Image */}
              {gtoData.strategicPerformanceAreaSection.image && (
                <div className="global-technical-operations-spa__image">
                  <div className="global-technical-operations-spa__image-wrapper">
                    <div className="global-technical-operations-spa__image-mask">
                      <img
                        src={gtoData.strategicPerformanceAreaSection.image.url}
                        alt={gtoData.strategicPerformanceAreaSection.image.alt}
                        className="global-technical-operations-spa__image-img"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Integrated GTO Structure Section */}
      {gtoData.gtoStructureSection && (
        <section className="global-technical-operations-structure">
          <div className="global-technical-operations-structure__bg-petals">
            <img
              src="/assets/global-technical/patelsb.svg"
              alt=""
              className="global-technical-operations-structure__bg-petals-img"
            />
          </div>
          {/* Background Petals SVG */}
          {gtoData.gtoStructureSection.petalImage && (
            <div className="global-technical-operations-structure__bg-petals">
              <img
                src={gtoData.gtoStructureSection.petalImage.url}
                alt={gtoData.gtoStructureSection.petalImage.alt}
                className="global-technical-operations-structure__bg-petals-img"
              />
            </div>
          )}
          <div className="global-technical-operations-structure__container">
            <div className="global-technical-operations-structure__text">
              <div className="global-technical-operations-structure__header">
                {gtoData.gtoStructureSection.heading && (
                  <h2 className="global-technical-operations-structure__heading">
                    {gtoData.gtoStructureSection.heading}
                  </h2>
                )}
                {gtoData.gtoStructureSection.subHeading && (
                  <p className="global-technical-operations-structure__subheading">
                    {gtoData.gtoStructureSection.subHeading}
                  </p>
                )}
              </div>
              {gtoData.gtoStructureSection.description && (
                <div className="global-technical-operations-structure__paragraph">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {gtoData.gtoStructureSection.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tabs Section */}
      {gtoData.tabsData && (
        <section className="global-technical-operations-tabs-section">
          <div className="global-technical-operations-tabs-section__container">
            <GTOTabs tabs={gtoData.tabsData} />
          </div>
        </section>
      )}

      {/* Way Forward section - same as allied-business-looking-ahead */}
      <AlliedBusinessLookingAhead
        data={
          gtoData.wayForwardSection || {
            heading: 'Looking Ahead',
            content: [
              "As we continue to strengthen our integrated operational capabilities, we are focused on delivering quality, reliability, and sustainability. By leveraging GTO, Lupin integrates manufacturing, procurement, and supply chain operations to effectively address changing industry demands and deliver sustainable long-term value for patients, partners, and the environment."
            ],
            image: {
              url: '/assets/images/global-way.webp',
              alt: 'Global technical operations and research facility'
            },
            pointerIcon: {
              url: '/assets/images/AlliedBusiness/Group.svg',
              alt: 'Pointer Icon'
            }
          }
        }
      />
    </div>
  );
}
