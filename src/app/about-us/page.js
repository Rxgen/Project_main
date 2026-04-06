import InnerBanner from '@/components/InnerBanner';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getAboutUs, mapAboutUsData } from '@/lib/strapi-pages';
import '@/scss/pages/about-us.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the About Us page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'about-us',
    'https://www.lupin.com/about-us'
  );
}

export default async function AboutUsPage() {
  // Fetch data from Strapi
  let bannerData = null;
  let pageIntroData = null;
  let overviewSections = null;
  let redirectSection = null;

  try {
    const strapiData = await getAboutUs();

    // Map all data using the new mapping function
    const mappedData = mapAboutUsData(strapiData);

    // Map TopBanner data for InnerBanner
    bannerData = mappedData.banner;

    // Map PageIntroSection (Topfold)
    pageIntroData = mappedData.pageIntro;

    // Map AboutOverviewSection (Folds)
    overviewSections = mappedData.overviewSections || [];

    // Map RedirectSection
    redirectSection = mappedData.redirectSection;
  } catch (error) {
    console.error('Error fetching about-us data from Strapi:', error);
    // Will use default data below
  }

  const CustomHeading = ({ children }) => {
    return <div className="about-us-content__topfold-heading">{children}</div>;
  }

  const CustomParagraph = ({ children }) => {
    return <p className="about-us-content__topfold-description">{children}</p>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <section className="about-us-content">
        <div className="about-us-content__container">
          <div className="about-us-content__wrapper">
            <div className="about-us-content__topfold">
              <div className="about-us-content__topfold-content">
                <ReactMarkdown
                  remarkPlugins={[remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: CustomHeading,
                  }}
                >
                  {pageIntroData.heading}
                </ReactMarkdown>

                <div className="about-us-content__topfold-petals">
                  <Image
                    src={pageIntroData?.image?.url || "/assets/about/petalsabout.svg"}
                    alt={pageIntroData?.image?.alt || "Decorative petals"}
                    width={270}
                    height={388}
                    quality={100}
                  />
                </div>
                {pageIntroData?.description && (
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: CustomParagraph,
                    }}
                  >
                    {pageIntroData.description}
                  </ReactMarkdown>
                )}
              </div>
            </div>

            {(() => {
              // Default fold data with headings and text content

              // Use Strapi data if available, otherwise use defaults
              // Follow the defaultFolds structure and use colors from defaultFolds
              const foldsToRender = overviewSections || [];

              return foldsToRender.map((fold, index) => {
                return (
                  <section key={index} className={`about-us-content__fold about-us-content__fold--${fold.color}`}>
                    <div className="about-us-content__fold-container">
                      <div className={`about-us-content__fold-image about-us-content__fold-image--${fold.imagePosition}`}>
                        <Image
                          src={fold.image?.url || "/assets/about/image.png"}
                          alt={fold.image?.alt || "About Us"}
                          width={800}
                          height={623}
                          quality={100}
                        />
                      </div>
                      {fold.icon && fold.icon.url && (
                        <div className={`about-us-content__fold-svg about-us-content__fold-svg--${fold.svgPosition}`}>
                          <Image
                            src={fold.icon.url}
                            alt={fold.icon.alt || "Decorative SVG"}
                            width={fold.svg === 'svg1' ? 251 : 531}
                            height={fold.svg === 'svg1' ? 284 : 384}
                            quality={100}
                          />
                        </div>
                      )}
                      <div className="about-us-content__fold-text">
                        <h2 className="about-us-content__fold-text-heading">
                          {fold.title}
                        </h2>
                        <ReactMarkdown
                          remarkPlugins={[remarkBreaks]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {fold.description}
                        </ReactMarkdown>
                        {fold.cta && fold.cta.href && fold.cta.href !== '#' && (() => {
                          const ctaHref = fold.cta.href;
                          const isOurStoryLink = ctaHref.includes('our-story') || ctaHref.includes('ourstory');
                          
                          // Normalize the href for our-story links
                          let normalizedHref = ctaHref;
                          if (isOurStoryLink) {
                            normalizedHref = '/about-us/our-story';
                          } else if (ctaHref.startsWith('http')) {
                            normalizedHref = ctaHref;
                          } else {
                            normalizedHref = ctaHref.startsWith('/') ? ctaHref : `/${ctaHref}`;
                          }
                          
                          return (
                            <Link 
                              href={normalizedHref}
                              className="about-us-content__fold-text-cta"
                              target={ctaHref.startsWith('http') ? '_blank' : undefined}
                              rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              <span className="about-us-content__fold-text-cta-text">
                                {fold.cta.text || 'Read More'}
                              </span>
                              <svg
                                className="about-us-content__fold-text-cta-icon"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 17L17 1M17 1H1M17 1V17"
                                  stroke="rgb(8, 160, 63)"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  </section>
                );
              });
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}
