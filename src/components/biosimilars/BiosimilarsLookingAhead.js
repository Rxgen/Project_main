import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsLookingAhead.scss';

export default function BiosimilarsLookingAhead({ data }) {
  // Default data
  const contentData = data || {
    heading: "Looking Ahead",
    paragraphs: [
      "Lupin remains committed to expanding its biosimilars portfolio and capabilities by fostering a culture of scientific excellence, collaboration and continuous improvement. We will keep focusing on unmet medical needs through advances in research on biosimilars, ensuring that complex therapies become more accessible for all."
    ],
    image: {
      url: "/assets/images/biosimilars/medium-shot-doctors-working-together 1.png",
      alt: "Looking ahead"
    }
  };

  return (
    <div className="biosimilars-looking-ahead" data-node-id="biosimilars-looking-ahead">
      {/* Top Section - Content and Image (content left, image right) */}
      <div className="biosimilars-looking-ahead__wrapper">
        {/* Left Side - Content */}
        <div className="biosimilars-looking-ahead__content">
          {/* Heading */}
          <h2 className="biosimilars-looking-ahead__heading">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs */}
          <div className="biosimilars-looking-ahead__intro">
            {contentData.paragraphs.map((paragraph, index) => (
              <p key={index} className="biosimilars-looking-ahead__paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right Side - Circular Image */}
        <div className="biosimilars-looking-ahead__image-wrapper">
          <div className="biosimilars-looking-ahead__image-circle">
            <Image
              src={contentData.image.url}
              alt={contentData.image.alt}
              fill
              className="biosimilars-looking-ahead__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

