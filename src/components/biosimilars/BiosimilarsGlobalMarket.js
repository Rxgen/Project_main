import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsGlobalMarket.scss';

export default function BiosimilarsGlobalMarket({ data }) {
  // Default data
  const contentData = data || {
    heading: "Our Global Market Focus",
    paragraphs: [
      "Lupin's biosimilars range is designed with a global outlook in mind, from inception to reaching the very end of the supply chain. Lupin has introduced biosimilars in more than 30 countries (United States, Europe, Japan, Canada, Australia, India, emerging markets such as Latin America, Asia Pacific, the Middle East, North Africa, CIS and Russia) and is continually expanding into newer geographies, breaking barriers to access and strengthening its global footprint. Its global reach is driven by a hybrid commercial model: with direct presence in key regions and strategic partnerships elsewhere."
    ],
    image: {
      url: "/assets/images/biosimilars/global-healthcare-earth-stethoscope-white-isolated-background-3d 2.png",
      alt: "Global market focus"
    }
  };

  return (
    <div className="biosimilars-global-market" data-node-id="biosimilars-global-market">
      {/* Background Petals - Top Right */}
      <div className="biosimilars-global-market__petals">
        <Image
          src="/assets/images/specialty/petals.svg"
          alt="Decorative petals"
          width={1452}
          height={767}
          className="biosimilars-global-market__petals-img"
          quality={100}
        />
      </div>

      {/* Top Section - Image and Content */}
      <div className="biosimilars-global-market__wrapper">
        {/* Left Side - Circular Image */}
        <div className="biosimilars-global-market__image-wrapper">
          <div className="biosimilars-global-market__image-circle">
            <Image
              src={contentData.image.url}
              alt={contentData.image.alt}
              fill
              className="biosimilars-global-market__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="biosimilars-global-market__content">
          {/* Heading */}
          <h2 className="biosimilars-global-market__heading">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs */}
          <div className="biosimilars-global-market__intro">
            {contentData.paragraphs.map((paragraph, index) => (
              <p key={index} className="biosimilars-global-market__paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

