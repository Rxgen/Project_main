import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsMarketTrends.scss';

export default function BiosimilarsMarketTrends({ data }) {
  // Default data from Figma design
  const contentData = data || {
    heading: "Global Biosimilars Market Trends",
    paragraphs: [
      "As per a latest study, the global biosimilars market is expected to surge to USD 72.29 billion by 2035. There is significant potential for growth in the biosimilars market, particularly in oncology, immunology, and ophthalmology. Consistent with these global trends, Lupin's biosimilars operations are expanding across comparable therapeutic domains, through a vast and evolving portfolio."
    ],
    image: {
      url: "/assets/images/biosimilars/man-holds-globe-with-world-his-hands 1.png",
      alt: "Global biosimilars market"
    }
  };

  return (
    <div className="biosimilars-market-trends" data-node-id="2875:475">
      {/* Top Section - Content and Image (content left, image right) */}
      <div className="biosimilars-market-trends__wrapper">
        {/* Left Side - Content */}
        <div className="biosimilars-market-trends__content">
          {/* Heading */}
          <h2 className="biosimilars-market-trends__heading">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs */}
          <div className="biosimilars-market-trends__intro">
            {contentData.paragraphs.map((paragraph, index) => (
              <p key={index} className="biosimilars-market-trends__paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right Side - Circular Image */}
        <div className="biosimilars-market-trends__image-wrapper">
          <div className="biosimilars-market-trends__image-circle">
            <Image
              src={contentData.image.url}
              alt={contentData.image.alt}
              fill
              className="biosimilars-market-trends__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

