import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsTherapyAreas.scss';

export default function BiosimilarsTherapyAreas({ data }) {
  // Default data from Figma design
  const contentData = data || {
    heading: "Focused Therapy Areas and Hero Products",
    paragraphs: [
      "Our biosimilars portfolio spans multiple disease areas where biologics play a critical role in patient care, including:"
    ],
    therapyAreas: [
      "Immunology and Inflammatory Diseases",
      "Oncology and Supportive Care",
      "Ophthalmology",
      "Respiratory"
    ],
    image: {
      url: "/assets/images/biosimilars/middleaged-male-doctor-with-clipboard-wearing-white-lab-coat-microscopic-cells-background 1.png",
      alt: "Biosimilars therapy areas"
    }
  };

  return (
    <div className="biosimilars-therapy-areas" data-node-id="2875:143">
      {/* Top Section - Content and Image (content left, image right) */}
      <div className="biosimilars-therapy-areas__wrapper">
        {/* Left Side - Content */}
        <div className="biosimilars-therapy-areas__content">
          {/* Heading */}
          <h2 className="biosimilars-therapy-areas__heading">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs */}
          <div className="biosimilars-therapy-areas__intro">
            {contentData.paragraphs.map((paragraph, index) => (
              <p key={index} className="biosimilars-therapy-areas__paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Therapy Areas List */}
          <div className="biosimilars-therapy-areas__list">
            {contentData.therapyAreas.map((area, index) => (
              <div key={index} className="biosimilars-therapy-areas__list-item">
                <div className="biosimilars-therapy-areas__pointer">
                  <Image
                    src="/assets/images/biosimilars/greenpointer.svg"
                    alt="Pointer"
                    width={19}
                    height={19}
                    className="biosimilars-therapy-areas__pointer-icon"
                    quality={100}
                  />
                </div>
                <p className="biosimilars-therapy-areas__list-text">
                  {area}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Circular Image */}
        <div className="biosimilars-therapy-areas__image-wrapper">
          <div className="biosimilars-therapy-areas__image-circle">
            <Image
              src={contentData.image.url}
              alt={contentData.image.alt}
              fill
              className="biosimilars-therapy-areas__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

