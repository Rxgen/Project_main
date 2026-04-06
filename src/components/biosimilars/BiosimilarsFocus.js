import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsFocus.scss';

export default function BiosimilarsFocus({ data }) {
  // Default data from Figma design
  const contentData = data || {
    heading: "Our Biosimilars Focus",
    paragraphs: [
      "In recent years, Lupin has strengthened its biosimilars presence through technology-based differentiation, strategic launches, regulatory filings, and commercial partnerships, supported by a resilient supply chain and scalable manufacturing infrastructure. Looking ahead, our biosimilars strategy is guided by three priorities"
    ],
    priorities: [
      "Expanding access to vital biologic therapies.",
      "Increasing relevance across global markets.",
      "Excellence in scientific innovation and operational tactics."
    ],
    image: {
      url: "/assets/images/biosimilars/female-doctors-checking-results-digital-tablet 1.png",
      alt: "Biosimilars focus"
    }
  };

  return (
    <div className="biosimilars-focus" data-node-id="2875:321">
      {/* Background Petals - Top Right */}
      <div className="biosimilars-focus__petals">
        <Image
          src="/assets/images/specialty/petals.svg"
          alt="Decorative petals"
          width={1452}
          height={767}
          className="biosimilars-focus__petals-img"
          quality={100}
        />
      </div>

      {/* Top Section - Image and Content */}
      <div className="biosimilars-focus__wrapper">
        {/* Left Side - Circular Image */}
        <div className="biosimilars-focus__image-wrapper">
          <div className="biosimilars-focus__image-circle">
            <Image
              src={contentData.image.url}
              alt={contentData.image.alt}
              fill
              className="biosimilars-focus__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="biosimilars-focus__content">
          {/* Heading */}
          <h2 className="biosimilars-focus__heading">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs */}
          <div className="biosimilars-focus__intro">
            {contentData.paragraphs.map((paragraph, index) => (
              <p key={index} className="biosimilars-focus__paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Priorities List */}
          <div className="biosimilars-focus__priorities">
            {contentData.priorities.map((priority, index) => (
              <div key={index} className="biosimilars-focus__priority-item">
                <div className="biosimilars-focus__pointer">
                  <Image
                    src="/assets/images/biosimilars/pointer.svg"
                    alt="Pointer"
                    width={19}
                    height={19}
                    className="biosimilars-focus__pointer-icon"
                    quality={100}
                  />
                </div>
                <p className="biosimilars-focus__priority-text">
                  {priority}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Manufacturing Text */}
      {contentData.manufacturingText && (
        <div className="biosimilars-focus__manufacturing">
          <div className="biosimilars-focus__manufacturing-container">
            <p className="biosimilars-focus__manufacturing-text">
              {contentData.manufacturingText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

