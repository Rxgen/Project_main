// Test comment
import React from 'react';
import Header from '@/components/Header';
import InnerBanner from '@/components/InnerBanner';
import PurposeVideo from '@/components/PurposeVideo';
import Image from 'next/image';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getOurPurpose, mapOurPurposeData } from '@/lib/strapi-pages';
import '@/scss/components/Purpose.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

export const dynamic = 'force-dynamic';

// Generate metadata for the purpose page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-purpose',
    'https://www.lupin.com/about-us/our-purpose'
  );
}

export default async function PurposePage() {
  let purposeData = null;
  let error = null;

  try {
    const rawData = await getOurPurpose();
    if (rawData) {
      purposeData = mapOurPurposeData(rawData);
    } else {
      error = new Error('No data received from Strapi API');
    }
  } catch (err) {
    console.error('Error fetching our-purpose data from Strapi:', err);
    error = err instanceof Error ? err : new Error('Failed to fetch our-purpose data');
  }

  const bannerData = purposeData?.banner || null;

  const pageIntro = purposeData?.pageIntro;
  const treatmentSection = purposeData?.treatmentSection;
  const commitmentSection = purposeData?.commitmentSection;
  const guidedFrameworkSection = purposeData?.guidedFrameworkSection;

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Our Purpose Page - treatmentSection:', treatmentSection);
    console.log('Our Purpose Page - purposeData:', purposeData);
  }

  const CustomHeading = ({ children }) => {
    return <h2 className="purpose-story__title">{children}</h2>;
  }

  const CustomParagraph = ({ children }) => {
    return <p className="purpose-story__paragraph">{children}</p>;
  }

  const CustomHeading2 = ({ children }) => {
    return <h2 className="purpose-mountain__title">{children}</h2>;
  }

  const CustomParagraph2 = ({ children }) => {
    return <p className="purpose-mountain__paragraph">{children}</p>;
  }

  const CustomHeading3 = ({ children }) => {
    return <h2 className="purpose-commitments__title">{children}</h2>;
  }

  return (
    <>
      <Header />
      <InnerBanner data={bannerData} />
      <main className="wrapper">


        {/* Section 2: Catalyzing Hope Into Healing */}
        {pageIntro && (
          <section className="purpose-story">
            <div className="container-para">
              <div className="purpose-story__content">
                <div className="purpose-story__text">
                  {pageIntro.heading && (
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: CustomHeading,
                      }}
                    >
                      {pageIntro.heading}
                    </ReactMarkdown>
                  )}
                  {pageIntro.paragraphDescription && (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: CustomParagraph,
                      }}
                    >
                      {pageIntro.paragraphDescription}
                    </ReactMarkdown>
                  )}
                </div>
                <PurposeVideo youtubeLink={pageIntro.youtubeLink} image={pageIntro.image} />
              </div>
            </div>
          </section>
        )}

        {/* Section 3: We Catalyze Treatments */}
        {treatmentSection && (treatmentSection.heading || treatmentSection.paragraphDescription) && (
          <section className="purpose-mountain">
            {(treatmentSection.desktopImage?.url || treatmentSection.mobileImage?.url) && (
              <div className="purpose-mountain__bg-wrapper">
                <picture>
                  {treatmentSection.mobileImage?.url && (
                    <source media="(max-width: 767px)" srcSet={treatmentSection.mobileImage.url} />
                  )}
                  {treatmentSection.desktopImage?.url ? (
                    <img
                      src={treatmentSection.desktopImage.url}
                      alt={treatmentSection.desktopImage.alt || 'Treatment background'}
                      className="purpose-mountain__bg"
                    />
                  ) : treatmentSection.mobileImage?.url ? (
                    <img
                      src={treatmentSection.mobileImage.url}
                      alt={treatmentSection.mobileImage.alt || 'Treatment background'}
                      className="purpose-mountain__bg"
                    />
                  ) : null}
                </picture>
              </div>
            )}
            <div className="container-mountain">
              <div className="purpose-mountain__content">
                <div className="purpose-mountain__text">
                  {treatmentSection.heading && (
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: CustomHeading2,
                      }}
                    >
                      {treatmentSection.heading}
                    </ReactMarkdown>
                  )}
                  {treatmentSection.paragraphDescription && (
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: CustomParagraph2,
                      }}
                    >
                      {treatmentSection.paragraphDescription}
                    </ReactMarkdown>
                  )}
                </div>
                <div className="purpose-mountain__media">
                  <Image
                    src="/assets/images/purpose/healingflower.webp"
                    alt="Transformation"
                    width={600}
                    height={600}
                    quality={100}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Our Purpose Is Rooted In 3 Core Commitments */}
        {commitmentSection && (
          <section className="purpose-commitments">
            <div className="container-commitments">
              <div className="purpose-commitments__header">
                {commitmentSection.sectionTitle && (
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: CustomHeading3,
                    }}
                  >
                    {commitmentSection.sectionTitle}
                  </ReactMarkdown>
                )}
              </div>
              {commitmentSection.cards && commitmentSection.cards.length > 0 && (
                <div className="purpose-commitments__grid">
                  {commitmentSection.cards.map((card) => (
                    <div key={card.id} className="purpose-commitments__card purpose-commitments__card--image">
                      {card.image?.url && (
                        <div className="purpose-commitments__card-media">
                          <Image
                            src={card.image.url}
                            alt={card.image.alt || `${card.titleLine1} ${card.titleLine2}`}
                            fill
                            quality={100}
                          />
                        </div>
                      )}
                      <div className="purpose-commitments__card-content">
                        <h3 className="purpose-commitments__card-title">
                          {card.titleLine1 && (
                            <span className="purpose-commitments__card-title-word">{card.titleLine1}</span>
                          )}
                          {card.titleLine2 && (
                            <>
                              <br />
                              <span className="purpose-commitments__card-title-word">{card.titleLine2}</span>
                            </>
                          )}
                        </h3>
                        {card.description && (
                          <p className="purpose-commitments__card-text">
                            {card.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 5: Our Guiding Framework */}
        {guidedFrameworkSection && (
          <section className="purpose-framework">
            <div className="container-framework">
              {guidedFrameworkSection.sectionTitle && (
                <h2 className="purpose-framework__title">
                  {guidedFrameworkSection.sectionTitle.trim()}
                </h2>
              )}
              <div className="purpose-framework__line">
                <Image
                  src="/assets/images/purpose/frameworkline.webp"
                  alt="Line"
                  width={200}
                  height={10}
                  quality={100}
                />
              </div>
              {guidedFrameworkSection.cards && guidedFrameworkSection.cards.length > 0 && (
                <div className="purpose-framework__circles">
                  {guidedFrameworkSection.cards.map((card, index) => {
                    return (
                      <div
                        key={card.id}
                        className="purpose-framework__circle purpose-framework__circle--green"
                      >
                        <h3 className="purpose-framework__circle-title">
                          {card.titleLine1 && (
                            <span className="purpose-framework__circle-title-word">{card.titleLine1}</span>
                          )}
                          {card.titleLine2 && (
                            <>
                              <br />
                              {card.titleLine2}
                            </>
                          )}
                        </h3>
                        {card.description && (
                          <p className="purpose-framework__circle-text">
                            {card.description}
                          </p>
                        )}
                        {card.image?.url && (
                          <div className="purpose-framework__circle-icon">
                            <Image
                              src={card.image.url}
                              alt={card.image.alt || `${card.titleLine1} ${card.titleLine2}`}
                              width={200}
                              height={200}
                              quality={100}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

