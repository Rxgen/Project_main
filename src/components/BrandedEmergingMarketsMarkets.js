'use client';

import '../scss/components/BrandedEmergingMarketsMarkets.scss';

export default function BrandedEmergingMarketsMarkets({ data }) {
  const defaultData = {
    heading: "MARKETS",
    content: "Lupin's business across emerging markets, including South Africa, Brazil, Mexico, and the Philippines is integral to Lupin's global expansion and influencing patient care. These dynamic markets demand affordable, effective and high-quality treatments. The focus on generic drug manufacturing to create high accessibility at lower costs reflects volume growth, market-specific strategies and efficient cost structures."
  };

  const marketsData = data || defaultData;
  const heading = marketsData?.heading || marketsData?.title || defaultData.heading;
  const content = marketsData?.content || marketsData?.text || marketsData?.paragraph || defaultData.content;

  return (
    <section className="branded-emerging-markets-markets" data-node-id="3120:1559">
      <div className="branded-emerging-markets-markets__container">
        <h2 className="branded-emerging-markets-markets__heading">
          {heading}
        </h2>
        <p className="branded-emerging-markets-markets__content">
          {content}
        </p>
      </div>
    </section>
  );
}

