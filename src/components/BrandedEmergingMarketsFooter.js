'use client';

import Image from 'next/image';
import '../scss/components/BrandedEmergingMarketsFooter.scss';

export default function BrandedEmergingMarketsFooter({ data }) {
  const defaultData = {
    heading: {
      line1: "GLOBAL INSTITUTIONAL",
      line2: "BUSINESS (GIB)"
    },
    content: [
      "Lupin is dedicated to patient communities, and this is reflected through specific programs that aim at battling disease burden globally. Through our Global Institutional Business (GIB), we work closely with public health institutions and regulatory bodies across more than 50 countries in Africa, Latin America, CIS (Commonwealth of Independent States) and Asia. For decades, Lupin has delivered affordable and accessible healthcare to underserved communities, with a sharp focus on fighting TB and HIV.",
      "Today, Lupin has forayed into being a one-stop shop for all relevant first-line, second-line and preventive TB and HIV medications. Lupin is one of the world's largest suppliers of first-line anti-TB medicines. Our proven capability in fermentation technology enables the manufacture of Rifa-based products including Rifampicin, Rifapentine and Rifabutin.",
      "Our regulatory reach across the globe has ensured in-country registrations of anti-TB and HIV drugs across all high-burden countries in Africa, Asia, LATAM and CIS. A key milestone was recently achieved with Lupin becoming the first company globally to receive WHO approval for Rifapentine 150 mg dispersible tablets, a pediatric formulation for TB prevention.",
      "We have large installed production capacities to meet the global requirements of anti-TB and HIV drugs. Our API and formulation facilities have approvals from various regulatory authorities across the globe, including WHOPQ, USFDA, CDSCO, SAHPRA etc. With its scale, robust capabilities, and a commitment to help those who need care the most, Lupin, through GIB, reaffirms its commitment to a TB-free world, while continuing to address other high-burden diseases in underserved communities. Lupin stands committed to being a strong and reliable company in the domain of tuberculosis and HIV."
    ],
    image: {
      url: "/assets/images/branded/Firefly_Gemini Flash_Premium global public health image showing healthcare professionals collaborating acr 448492 1.png",
      alt: "Healthcare professionals collaborating"
    }
  };

  const footerData = data || defaultData;
  const heading = footerData?.heading || defaultData.heading;
  const content = footerData?.content || footerData?.paragraphs || footerData?.text || defaultData.content;
  const imageUrl = footerData?.image?.url || footerData?.imageUrl || defaultData.image.url;
  const imageAlt = footerData?.image?.alt || footerData?.imageAlt || defaultData.image.alt;

  return (
    <section id="branded-emerging-markets-footer" className="branded-emerging-markets-footer" data-node-id="3124:1601">
      <div className="branded-emerging-markets-footer__container">
        <div className="branded-emerging-markets-footer__content">
          <div className="branded-emerging-markets-footer__left">
            <h2 className="branded-emerging-markets-footer__heading">
              <span className="branded-emerging-markets-footer__heading-line">{heading.line1 || heading.lineOne || ''}</span>
              <span className="branded-emerging-markets-footer__heading-line">{heading.line2 || heading.lineTwo || ''}</span>
            </h2>
            <div className="branded-emerging-markets-footer__text">
              {Array.isArray(content) ? (
                content.map((paragraph, index) => (
                  paragraph && paragraph.trim() ? (
                    <p key={index} className="branded-emerging-markets-footer__paragraph">
                      {paragraph}
                    </p>
                  ) : null
                ))
              ) : (
                <p className="branded-emerging-markets-footer__paragraph">{content}</p>
              )}
            </div>
          </div>
          <div className="branded-emerging-markets-footer__divider"></div>
          {imageUrl && imageUrl.trim() !== '' && (
            <div className="branded-emerging-markets-footer__right">
              <div className="branded-emerging-markets-footer__image-wrapper">
                <div className="branded-emerging-markets-footer__image-mask">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="branded-emerging-markets-footer__image"
                    quality={100}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

