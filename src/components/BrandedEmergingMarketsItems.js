'use client';

import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/BrandedEmergingMarketsItems.scss';

export default function BrandedEmergingMarketsItems({ data }) {
  const defaultData = {
    items: [
      {
        title: "South Africa",
        content: [
          "South Africa is one of Lupin's most promising emerging markets, a nation where access to affordable, accessible and quality healthcare remains imperative.",
          "The region hosts a diverse portfolio with a plethora of therapy areas, including cardiac care, anti-diabetes, CNS, and women's health, to name a few.",
          "Lupin's subsidiary, Pharma Dynamics, is a leading provider of generic medication and the largest supplier of heart medication in South Africa, with 25 market-leading brands. Today, we host a broad portfolio of products that consistently rank among the top in key therapy areas, while our OTC franchise also demonstrates strong market leadership.",
          "Through plans of active expansion in the coming years, South Africa market is one of the canvases where Lupin's purpose comes alive."
        ],
        link: {
          text: "Know more about South Africa market",
          url: "https://medquimica.ind.br/en/"
        },
        image: {
          url: "/assets/images/branded/image1.png",
          alt: "South Africa market"
        }
      },
      {
        title: "Brazil",
        content: [
          "MedQuímica, our subsidiary in Brazil, develops various solid and liquid medications that include OTC, branded generics, hospital medications, and food supplements. Certified by the Brazilian Health Regulatory Agency, MedQuímica has penetrated the Brazilian pharma market and impacted millions of lives through affordable and highly accessible medicines."
        ],
        link: {
          text: "Know more about Brazil market",
          url: "#"
        },
        image: {
          url: "/assets/images/branded/image1.png",
          alt: "Brazil market"
        }
      },
      {
        title: "Mexico",
        content: [
          "Lupin's subsidiary Laboratories Grin continues to play a vital role in Mexico, showcasing steady growth, making it one of the top pharma players in Latin America.",
          "Laboratories Grin has a particularly strong presence in the Ophthalmology segment, where it is recognized as one of the leading players.",
          "As we move forward, Laboratories Grin will reinforce its position in the Ophthalmology segment by expanding into adjacent therapies to reach a broader audience. We aim to deepen our innovative capabilities and local insights to offer accessible care to our patients."
        ],
        link: {
          text: "Know more about Mexico market",
          url: "#"
        },
        image: {
          url: "/assets/images/branded/image1.png",
          alt: "Mexico market"
        }
      },
      {
        title: "Philippines",
        content: [
          "Lupin's subsidiary in the Philippines, Multicare Pharmaceuticals, aims to diversify our portfolio, scale operations, and elevate healthcare standards. We are the leading Indian pharmaceutical company in the Philippines and rank in the top five in the branded generics segment, covering various therapeutic areas such as rheumatology, women's health, oncology, neuroscience, diabetes, gastroenterology, respiratory conditions, and tuberculosis.",
          "Multicare Pharmaceuticals not only believes in developing high-quality medication but also demonstrates holistic patient care through its patient access programs, offering free consultation to over 15,000 patients."
        ],
        link: {
          text: "Know more about Philippines market",
          url: "#"
        },
        image: {
          url: "/assets/images/branded/image1.png",
          alt: "Philippines market"
        }
      },
      {
        title: "India",
        content: [
          "India's pharmaceutical landscape is undergoing rapid transformation, fuelled by demographic shifts, an increase in chronic and lifestyle-related diseases, and growing expectations for better healthcare solutions. This momentum has intensified the focus on patient-centric approaches, localized innovation, and integrated care, making India one of the most dynamic and promising pharma markets globally.",
          "Within this environment, Lupin's India Region Formulations (IRF) business has emerged as a strong growth engine, consistently outperforming the market. Ranked 8th in the Indian Pharmaceutical Market, India region accounts for 34% of Lupin's global turnover, with 74.5% of domestic sales driven by its core therapies—cardiac, respiratory, anti-diabetic, and gastrointestinal."
        ],
        link: {
          text: "Know more about India market",
          url: "#"
        },
        image: {
          url: "/assets/images/branded/image1.png",
          alt: "India market"
        }
      },
      {
        title: "MENA",
        content: [
          "MENA pharmaceutical market is experiencing significant growth, driven by factors such as the increasing prevalence of chronic diseases, rising healthcare expenditures, government initiatives aimed at localizing manufacturing and improving healthcare access. MENA generic pharmaceutical market is dominated by local companies while Indian companies have a low share. Key opportunities for pharmaceutical companies in the MENA region include Government Investment, Market Expansion, Digital Transformation and Innovation and Research. These factors position MENA as promising market for growth from future perspective.",
          "Lupin is entering into strategic collaborations and partnerships with leading local companies in the MENA region. Lupin, with its wide product portfolio and R&D capabilities, is committed to providing affordable access to high quality medicines to the patients across the MENA region."
        ],
        link: {
          text: "Know more about MENA market",
          url: "#"
        },
        image: {
          url: "/assets/images/branded/image1.png",
          alt: "MENA market"
        }
      }
    ]
  };

  const itemsData = data || defaultData;
  const items = itemsData?.items || itemsData?.markets || defaultData.items;

  return (
    <section className="branded-emerging-markets-items">
      {items.map((item, index) => {
        const isOdd = (index + 1) % 2 === 1; // 1, 3, 5 are odd
        const isEven = (index + 1) % 2 === 0; // 2, 4, 6 are even

        return (
          <div 
            key={index} 
            className={`branded-emerging-markets-items__item ${isOdd ? 'branded-emerging-markets-items__item--odd' : 'branded-emerging-markets-items__item--even'}`}
            data-node-id={`3030:1428-${index}`}
          >
            <div className="branded-emerging-markets-items__content">
              {isOdd ? (
                <>
                  {/* Odd: Image then Content */}
                  {item.image?.url && item.image.url.trim() !== '' && (
                    <div className="branded-emerging-markets-items__image-wrapper">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt || item.title || ''}
                        fill
                        className="branded-emerging-markets-items__image"
                        quality={100}
                      />
                    </div>
                  )}
                  <div className="branded-emerging-markets-items__text-wrapper">
                    <div className="branded-emerging-markets-items__background"></div>
                    <div className="branded-emerging-markets-items__text-content">
                      <div className="branded-emerging-markets-items__title-wrapper">
                        <div className="branded-emerging-markets-items__icon">
                          <Image
                            src="/assets/images/branded/darksmall.svg"
                            alt=""
                            width={32}
                            height={32}
                            quality={100}
                          />
                        </div>
                        <h3 className="branded-emerging-markets-items__title">
                          {item.title || item.name || ''}
                        </h3>
                      </div>
                      <div className="branded-emerging-markets-items__paragraphs">
                        {Array.isArray(item.content) ? (
                          item.content.map((paragraph, pIndex) => (
                            paragraph && paragraph.trim() ? (
                              <p key={pIndex} className="branded-emerging-markets-items__paragraph">
                                {paragraph}
                              </p>
                            ) : null
                          ))
                        ) : (
                          <p className="branded-emerging-markets-items__paragraph">
                            {item.content || item.text || item.description || ''}
                          </p>
                        )}
                      </div>
                      <div className="branded-emerging-markets-items__divider">
                        <div className="branded-emerging-markets-items__divider-line"></div>
                        <div className="branded-emerging-markets-items__divider-icon">
                          <Image
                            src="/assets/images/branded/lightsmall.svg"
                            alt=""
                            width={32}
                            height={32}
                            quality={100}
                          />
                        </div>
                      </div>
                      {(item.link?.text || item.cta?.text) && (
                        <Link href={item.link?.url || item.linkUrl || item.cta?.href || '#'} className="branded-emerging-markets-items__link">
                          <span>{item.link?.text || item.linkText || item.cta?.text}</span>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="branded-emerging-markets-items__link-arrow">
                            <path d="M1 12L12 1M12 1H1M12 1V12" stroke="#08a03f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Even: Content then Image */}
                  <div className="branded-emerging-markets-items__text-wrapper">
                    <div className="branded-emerging-markets-items__background"></div>
                    <div className="branded-emerging-markets-items__text-content">
                      <div className="branded-emerging-markets-items__title-wrapper">
                        <div className="branded-emerging-markets-items__icon">
                          <Image
                            src="/assets/images/branded/darksmall.svg"
                            alt=""
                            width={32}
                            height={32}
                            quality={100}
                          />
                        </div>
                        <h3 className="branded-emerging-markets-items__title">
                          {item.title || item.name || ''}
                        </h3>
                      </div>
                      <div className="branded-emerging-markets-items__paragraphs">
                        {Array.isArray(item.content) ? (
                          item.content.map((paragraph, pIndex) => (
                            paragraph && paragraph.trim() ? (
                              <p key={pIndex} className="branded-emerging-markets-items__paragraph">
                                {paragraph}
                              </p>
                            ) : null
                          ))
                        ) : (
                          <p className="branded-emerging-markets-items__paragraph">
                            {item.content || item.text || item.description || ''}
                          </p>
                        )}
                      </div>
                      <div className="branded-emerging-markets-items__divider">
                        <div className="branded-emerging-markets-items__divider-line"></div>
                        <div className="branded-emerging-markets-items__divider-icon">
                          <Image
                            src="/assets/images/branded/lightsmall.svg"
                            alt=""
                            width={32}
                            height={32}
                            quality={100}
                          />
                        </div>
                      </div>
                      {(item.link?.text || item.cta?.text) && (
                        <Link href={item.link?.url || item.linkUrl || item.cta?.href || '#'} className="branded-emerging-markets-items__link">
                          <span>{item.link?.text || item.linkText || item.cta?.text}</span>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="branded-emerging-markets-items__link-arrow">
                            <path d="M1 12L12 1M12 1H1M12 1V12" stroke="#08a03f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                  {item.image?.url && item.image.url.trim() !== '' && (
                    <div className="branded-emerging-markets-items__image-wrapper">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt || item.title || ''}
                        fill
                        className="branded-emerging-markets-items__image"
                        quality={100}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

