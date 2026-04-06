'use client';

import '../scss/components/IndiaOverview.scss';

export default function IndiaOverview({ data }) {
  const defaultData = {
    heading: "Overview",
    content: [
      "India is one of the fastest-growing pharma markets globally, with an aging population, an increase in lifestyle diseases, and rising consumer demand for healthcare. At the same time, large gaps in early diagnosis, long-term disease management, and access to affordable quality treatment continue to put pressure on India's healthcare system, intensifying the need for timely and scalable solutions. This urgent need has led businesses to strategize localized innovation and develop holistic care.",
      "Our India Region Formulations (IRF) business is at the forefront of this healthcare revolution and continues to outperform the market, driven by strong performance across our top four therapies, namely, cardiac, respiratory, anti-diabetic, and gastrointestinal, which constitutes 74.5% of our domestic sales."
    ]
  };

  const overviewData = data || defaultData;
  const heading = overviewData?.heading || overviewData?.title || defaultData.heading;
  const content = overviewData?.content || overviewData?.paragraphs || overviewData?.text || defaultData.content;

  // Process content to handle bold text (74.5%)
  const processContent = (text) => {
    if (!text) return '';
    // Bold "74.5%"
    return text.replace(/\b(74\.5%)\b/g, '<strong>$1</strong>');
  };

  return (
    <section className="india-overview" data-node-id="3067:3088">
      <div className="india-overview__container">
        <h2 className="india-overview__heading">
          {heading}
        </h2>
        <div className="india-overview__content">
          {Array.isArray(content) ? (
            content.map((paragraph, index) => (
              paragraph && paragraph.trim() ? (
                <p 
                  key={index} 
                  className="india-overview__paragraph"
                  dangerouslySetInnerHTML={{ __html: processContent(paragraph) }}
                />
              ) : null
            ))
          ) : (
            <p 
              className="india-overview__paragraph"
              dangerouslySetInnerHTML={{ __html: processContent(content) }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

