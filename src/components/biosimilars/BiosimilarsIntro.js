'use client';

import '../../scss/components/biosimilars/BiosimilarsIntro.scss';

export default function BiosimilarsIntro({ data }) {
  const defaultData = {
    heading: "Advancing Access to High-Quality Medication Worldwide",
    paragraphs: [
      "Lupin's biosimilars business is a fundamental building block of our global healthcare vision. It combines deep scientific excellence, cutting-edge technology, high-end manufacturing and vast regulatory expertise to improve access to affordable yet advanced, research-driven therapies.",
      "Established in Pune, India, in 2008, Lupin Biotech is our dedicated research center and state-of-the-art manufacturing facility to develop biosimilars. From development, including cell line, process, assays, to clinical testing, regulatory submissions and commercial manufacturing, our Biotech center continues to expand its biosimilar capabilities for global markets."
    ]
  };

  const introData = data || defaultData;
  const heading = introData?.heading || defaultData.heading;
  const paragraphs = introData?.paragraphs || introData?.content || defaultData.paragraphs;

  return (
    <section className="biosimilars-intro" data-node-id="2875:510">
      <div className="biosimilars-intro__container">
        <div className="biosimilars-intro__box">
          <div className="biosimilars-intro__content">
            <h2 className="biosimilars-intro__heading">
              {heading.includes('High-Quality') ? (
                <>
                  <p className="biosimilars-intro__heading-line">Advancing Access to High-Quality</p>
                  <p className="biosimilars-intro__heading-line">Medication Worldwide</p>
                </>
              ) : (
                heading.split('\n').map((line, index) => (
                  <p key={index} className="biosimilars-intro__heading-line">{line}</p>
                ))
              )}
            </h2>
            <div className="biosimilars-intro__text">
              {Array.isArray(paragraphs) ? (
                paragraphs.map((paragraph, index) => (
                  <p key={index} className="biosimilars-intro__paragraph">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="biosimilars-intro__paragraph">{paragraphs}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

