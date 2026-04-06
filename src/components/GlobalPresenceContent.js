'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/pages/global-presence.scss';

export default function GlobalPresenceContent({ data, error }) {
  if (error) {
    return (
      <section className="global-presence-content">
        <div className="global-presence-content__container">
          <div className="global-presence-content__placeholder">
            <p>Unable to load global presence content at this time. Please try again later.</p>
            {process.env.NODE_ENV === 'development' && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Error: {error}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="global-presence-content">
        <div className="global-presence-content__container">
          <div className="global-presence-content__placeholder">
            <p>No global presence content available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  const pageIntro = data?.pageIntro;
  const globalPresenceSections = data?.globalPresenceSections || [];
  // Follow Strapi order (DisplayOrder / order) – sort numerically so 2 comes before 10
  const sortedSections = [...globalPresenceSections].sort((a, b) => {
    const rawA = a.order ?? a.displayOrder ?? 999;
    const rawB = b.order ?? b.displayOrder ?? 999;
    const numA = Number(rawA);
    const numB = Number(rawB);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA - numB;
    }
    return String(rawA).localeCompare(String(rawB));
  });

  const CustomParagraph = ({ children }) => {
    return <p className="global-presence-content__country-paragraph">{children}</p>;
  }

  return (
    <section className="global-presence-content">
      <div className="global-presence-content__container">
        <div className="global-presence-content__wrapper">
          {/* Page Intro Section */}
          {pageIntro && (
            <div className="global-presence-content__box" data-node-id="2885:381">
              <div className="global-presence-content__box-border" data-node-id="2885:383"></div>
              <div className="global-presence-content__box-icon" data-node-id="2885:384">
                <img
                  src="/assets/images/icon-global-presence.svg"
                  alt=""
                  className="global-presence-content__icon-img"
                />
              </div>
              <div className="global-presence-content__text" data-node-id="2885:396">
                {pageIntro.heading && (
                  <div className="global-presence-content__heading" data-node-id="2885:397">
                    {pageIntro.heading}
                  </div> 
                )}
                {pageIntro.introDescription && (
                  <div className="global-presence-content__paragraph" data-node-id="2885:398">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {pageIntro.introDescription}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Global Presence Sections - Dynamic with ImagePosition (Strapi order) */}
          {sortedSections.length > 0 && sortedSections.map((section, index) => {
            // Use ImagePosition from API, fallback to alternating pattern
            const imagePosition = section.imagePosition || 'left';
            const isReversed = imagePosition === 'right';
            // Odd sections (index 0, 2, 4...) for bottom center, even (index 1, 3, 5...) for bottom right
            const isOdd = index % 2 === 0;

            return (
              <div
                key={section.id}
                className={`global-presence-content__country-section ${isReversed ? 'global-presence-content__country-section--reversed' : ''} ${isOdd ? 'global-presence-content__country-section--odd' : 'global-presence-content__country-section--even'}`}
                data-node-id={`country-${section.id || index}`}
              >
                {/* Background Petals SVG */}
                <div className="global-presence-content__country-bg-petals">
                  <img
                    src="/assets/global-presence/bg-petals.svg"
                    alt=""
                    className="global-presence-content__country-bg-petals-img"
                  />
                </div>

                <div className="global-presence-content__country-image-wrapper" data-node-id={`country-image-${section.id || index}`}>
                  <div className="global-presence-content__country-image-mask" data-node-id={`country-mask-${section.id || index}`}>
                    {section.image && (
                      <Image
                        src={section.image.url}
                        alt={section.image.alt || section.countryName}
                        width={758}
                        height={553}
                        quality={100}
                        className="global-presence-content__country-image"
                      />
                    )}
                  </div>
                </div>
                <div className="global-presence-content__country-content" data-node-id={`country-content-${section.id || index}`}>
                  <div className="global-presence-content__country-text" data-node-id={`country-text-${section.id || index}`}>
                    {section.countryName && (
                      <h2 className="global-presence-content__country-heading" data-node-id={`country-heading-${section.id || index}`}>
                        {section.countryName}
                      </h2>
                    )}
                    {section.description && (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: CustomParagraph,
                        }}
                      >
                        {section.description}
                      </ReactMarkdown>
                    )}
                  </div>
                  {section.cta && section.cta.href && (
                    <div className="global-presence-content__country-cta" data-node-id={`country-cta-${section.id || index}`}>
                      <a href={section.cta.href} className="global-presence-content__country-button" data-node-id={`country-button-${section.id || index}`}>
                        <span className="global-presence-content__country-button-text" data-node-id={`country-button-text-${section.id || index}`}>
                          {section.cta.text || "Visit Website"}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

