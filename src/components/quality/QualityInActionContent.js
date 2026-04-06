'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import '../../scss/components/quality/QualityInActionContent.scss';

const CONCLUSION_IMAGE_FALLBACK = '/assets/images/quality/2.png';

/**
 * Quality in Action content – intro box + sections (same structure as GlobalPresenceContent).
 * Content from Figma node 3221-166 and provided copy.
 */
const FIGMA_INTRO = {
  heading: 'Ensuring Quality and Safety in Everything We Do',
  introDescription: `At Lupin, quality and compliance are cornerstones of our operations and organizational culture, guiding every stage of the product lifecycle, from research and development through manufacturing and distribution. Our steadfast dedication to quality and adherence to regulations guarantees the utmost standards of safety, efficacy, and reliability for patients and healthcare professionals globally. We strive to be best-in-class through continuous collaboration with global regulatory bodies and industry experts. Our goal is to lead with excellence, establishing industry standards through innovation, integrity, and continuous improvement.`,
  // introPolicyCtaLinkText: 'Click here',
  // introPolicyCtaSuffixBefore: ' to learn more about ',
  // introPolicyCtaSuffixBold: "Lupin's Quality Policy Statement",
  // introPolicyCtaSuffixAfter: '.',
  // introPolicyCtaHref: '/about-us/quality-in-action#quality-policy',
};

const QUALITY_SECTIONS = [
  {
    id: 'house-of-quality',
    heading: "Lupin's House of Quality",
    description: `Lupin’s House of Quality is anchored on the Quality Management Maturity (QMM) model, demonstrating a mature, enterprise-wide approach to quality. It integrates robust systems, digital enablement, and a deeply embedded culture of accountability across the organization.

To strengthen quality execution, Lupin has implemented advanced technologies and
automation, that include the following:

- Next-Gen Robotics
- Electronic Batch Processing Systems
- Laboratory Information Management Systems (LIMS)
- Electronic Document Management Systems (EDMS)
- Quality Assurance Management Systems
- Integrated ERP platforms`,


    image: '/assets/images/quality/1.png',
    imageAlt: "Lupin's House of Quality - cleanroom and manufacturing",
  },
  {
    id: 'our-key-focus-areas',
    heading: 'Our key focus areas',
    description: `**Advanced Pharmaceutical Quality Systems:** We employ robust, data-driven systems to ensure consistent product quality.

**SMART Quality:** We establish an Integrated Smart Quality Control and Digital/AI Infrastructure (such as application of automated PQR, NIR and bar code enabled quality control operations, E-Investigator, continuous regulatory monitor and regulatory intelligence) as the blueprint of Quality Management Maturity (QMM). This is structured around a three-core framework.

- Predictive and Proactive Quality Platforms
- Transforming the Core Platforms
- AI-Based Next-Generation Solutions

**Technical Excellence:** We continually enhance our team's technical skills via dedicated training and knowledge transfer programs, which include governance through a specialized training academy.

**Management Commitment:** We foster a culture in which every employee is empowered and committed to quality and patient safety.

**Continuous Improvement:** We benchmark our processes globally and leverage AI and analytics to reduce errors and enhance efficiency.`,
    image: '/assets/images/quality/areas.webp',
    imageAlt: 'Our key focus areas - quality excellence',
  },
  {
    id: 'culture-of-excellence',
    heading: 'Culture of Excellence',
    // tagline: [
    //   'We Do. We Build Trust. We Care.',
    // ],
    description: `Lupin’s quality governance is led by 2,000+ quality professionals and a dedicated Corporate Quality Assurance (CQA) organization. As a team, we ensure:

- **Robust Regulatory Systems:** Our systems are developed based on decades of global expertise and are aligned with international standards including the US FDA, UK MHRA, EU GMP, and others.
- **Transparent Reporting:** We adhere to comprehensive reporting frameworks, including the GRI standards and the IIRC's International Integrated Reporting Framework, demonstrating transparency to all stakeholders.
- **Cutting-Edge Technology:** We integrate advanced technologies and automated operations in our facilities to meet and exceed global standards.
- **Integrated Assurance and Resilience:** We redefine how we safeguard our operations, assets, and reputation through our Integrated Assurance approach.`,
    image: '/assets/images/quality/2.png',
    imageAlt: 'Culture of Excellence - quality professionals',
  },
  {
    id: 'regulatory-track-record',
    heading: 'Regulatory Track Record',
    description: `Lupin maintains a strong record of successful inspections and approvals from stringent global regulatory authorities. Our sites remain inspection-ready at all times. We are committed to manufacturing and supplying products of the highest quality from all our manufacturing sites, ensuring reliability and trust in the global market.`,
    image: '/assets/images/quality/3.png',
    imageAlt: 'Regulatory Track Record - quality inspection',
  },
  {
    id: 'community-of-practices',
    heading: 'Community of Practices',
    description: `Lupin’s **Community of Practices (CoP)** brings together experts across quality systems, sterile operations, inhalation and combination products, laboratories, and other GMP-critical functions to share knowledge, standardize best practices, and continuously elevate quality standards across all global sites.`,
    image: '/assets/images/quality/4.png',
    imageAlt: 'Community of Practices - collaboration and quality',
  },
  {
    id: 'conclusion',
    heading: 'Conclusion',
    description: 'At Lupin, quality and trust go hand in hand. Guided by a patient-first philosophy, we embed quality across our operations to deliver safe, effective, and affordable medicines worldwide.',
    image: '/assets/images/quality/conclusion.webp',
    imageAlt: 'Quality and precision in pharmaceutical manufacturing - hand placing vial in controlled facility',
  },
];

export default function QualityInActionContent({ data }) {
  const [conclusionImageFailed, setConclusionImageFailed] = useState(false);
  const pageIntro = data?.pageIntro || FIGMA_INTRO;
  const heading = pageIntro.heading ?? FIGMA_INTRO.heading;
  const introDescription = pageIntro.introDescription ?? FIGMA_INTRO.introDescription;
  const introPolicyCtaLinkText = pageIntro.introPolicyCtaLinkText ?? FIGMA_INTRO.introPolicyCtaLinkText;
  const introPolicyCtaSuffixBefore = pageIntro.introPolicyCtaSuffixBefore ?? FIGMA_INTRO.introPolicyCtaSuffixBefore;
  const introPolicyCtaSuffixBold = pageIntro.introPolicyCtaSuffixBold ?? FIGMA_INTRO.introPolicyCtaSuffixBold;
  const introPolicyCtaSuffixAfter = pageIntro.introPolicyCtaSuffixAfter ?? FIGMA_INTRO.introPolicyCtaSuffixAfter;
  const introPolicyCtaHref = pageIntro.introPolicyCtaHref ?? FIGMA_INTRO.introPolicyCtaHref;
  const sections = data?.sections ?? QUALITY_SECTIONS;

  const CustomParagraph = ({ children }) => (
    <p className="quality-in-action-content__section-paragraph">{children}</p>
  );

  return (
    <section className="quality-in-action-content" data-node-id="3221-166">
      <div className="quality-in-action-content__container">
        <div className="quality-in-action-content__wrapper">
          {/* Intro Box */}
          <div className="quality-in-action-content__box">
            <div className="quality-in-action-content__box-border" />
            <div className="quality-in-action-content__box-icon">
              <Image
                src="/assets/images/quality/petals.svg"
                alt=""
                width={69}
                height={68}
                className="quality-in-action-content__icon-img"
              />
            </div>
            <div className="quality-in-action-content__text">
              {heading && (
                <h2 className="quality-in-action-content__heading">
                  {heading}
                </h2>
              )}
              {introDescription && (
                <div className="quality-in-action-content__paragraph">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {introDescription}
                  </ReactMarkdown>
                </div>
              )}
              {(introPolicyCtaLinkText || introPolicyCtaSuffixBefore || introPolicyCtaSuffixBold) && (
                <p className="quality-in-action-content__paragraph quality-in-action-content__paragraph--cta">
                  {introPolicyCtaLinkText && (
                    <a
                      href={introPolicyCtaHref || '#'}
                      className="quality-in-action-content__policy-link"
                    >
                      {introPolicyCtaLinkText}
                    </a>
                  )}
                  {introPolicyCtaSuffixBefore}
                  {introPolicyCtaSuffixBold && <strong>{introPolicyCtaSuffixBold}</strong>}
                  {introPolicyCtaSuffixAfter}
                </p>
              )}
            </div>
          </div>

          {/* CTA: Quality Policy Statement */}
          {/* <div className="quality-in-action-content__cta-wrap">
            <a
              href="/about-us/quality-in-action#quality-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="quality-in-action-content__cta"
            >
              <span className="quality-in-action-content__cta-text">
                Click here for <strong>Lupin&apos;s Quality Policy Statement.</strong>
              </span>
              <span className="quality-in-action-content__cta-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L16 4M16 4H6M16 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div> */}

          {/* Sections (same structure as GlobalPresenceContent country sections) */}
          {sections.length > 0 &&
            sections.map((section, index) => {
              const isConclusion = section.id === 'conclusion';
              // Conclusion: image always right. Others: alternate by index.
              const imagePosition = isConclusion ? 'right' : (section.imagePosition ?? (index % 2 === 0 ? 'left' : 'right'));
              const isReversed = imagePosition === 'right';
              const isOdd = index % 2 === 0;

              return (
                <div
                  key={section.id || index}
                  id={section.id || undefined}
                  className={`quality-in-action-content__section ${isReversed ? 'quality-in-action-content__section--reversed' : ''} ${isOdd ? 'quality-in-action-content__section--odd' : 'quality-in-action-content__section--even'} ${isConclusion ? 'quality-in-action-content__section--conclusion' : ''}`}
                >
                  {!isConclusion && (
                    <div className="quality-in-action-content__section-bg-petals">
                      <img
                        src="/assets/global-presence/bg-petals.svg"
                        alt=""
                        className="quality-in-action-content__section-bg-petals-img"
                      />
                    </div>
                  )}

                  <div className="quality-in-action-content__section-image-wrapper">
                    <div className={`quality-in-action-content__section-image-mask ${isConclusion ? 'quality-in-action-content__section-image-mask--conclusion' : ''}`}>
                      <Image
                        src={section.id === 'conclusion' && conclusionImageFailed ? CONCLUSION_IMAGE_FALLBACK : section.image}
                        alt={section.imageAlt || section.heading}
                        width={622}
                        height={622}
                        quality={100}
                        className="quality-in-action-content__section-image"
                        onError={section.id === 'conclusion' ? () => setConclusionImageFailed(true) : undefined}
                      />
                    </div>
                  </div>

                  {isConclusion && (
                    <div className="quality-in-action-content__pointer-wrapper" aria-hidden="true">
                      <div className="quality-in-action-content__vertical-line" />
                      <div className="quality-in-action-content__pointer-icon">
                        <Image
                          src="/assets/images/quality/petals.svg"
                          alt=""
                          width={31}
                          height={31}
                          className="quality-in-action-content__pointer-svg"
                        />
                      </div>
                    </div>
                  )}

                  <div className="quality-in-action-content__section-content">
                    <div className="quality-in-action-content__section-text">
                      {section.heading && (
                        <h2 className="quality-in-action-content__section-heading">
                          {section.heading}
                        </h2>
                      )}
                      {section.subheading && (
                        <h3 className="quality-in-action-content__section-subheading">
                          {section.subheading}
                        </h3>
                      )}
                      {section.tagline && Array.isArray(section.tagline) && section.tagline.length > 0 && (
                        <div className="quality-in-action-content__section-tagline">
                          {section.tagline.map((line, i) => (
                            <span key={i} className="quality-in-action-content__section-tagline-line">
                              {line}
                            </span>
                          ))}
                        </div>
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
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
