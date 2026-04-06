import Image from 'next/image';
import '../scss/components/AlliedBusinessLookingAhead.scss';

export default function AlliedBusinessLookingAhead({ data }) {
  // Default data from Figma design
  const lookingAheadData = data || {
    heading: "Looking Ahead",
    content: [
      "By combining the power of science, technology and empathy, Lupin is continuing to create integrated care models and services that serve as touchpoints across various stages of the patient journey."
    ],
    image: {
      url: "/assets/images/AlliedBusiness/biopharmaceutical-industry-laboratory-with-scientist-handling-vials-modern-research-facility (1) 1.png",
      alt: "Biopharmaceutical Industry Laboratory"
    },
    pointerIcon: {
      url: "/assets/images/AlliedBusiness/Group.svg",
      alt: "Pointer Icon"
    }
  };

  return (
    <section className="allied-business-looking-ahead" data-node-id="3067:1457">
      <div className="allied-business-looking-ahead__container">
        {/* Image Section (Left) */}
        {lookingAheadData.image?.url && lookingAheadData.image.url.trim() !== '' && (
          <div className="allied-business-looking-ahead__image-wrapper" data-node-id="3067:684">
            <div className="allied-business-looking-ahead__image-mask">
              <Image
                src={lookingAheadData.image.url}
                alt={lookingAheadData.image.alt || "Looking Ahead"}
                fill
                className="allied-business-looking-ahead__image"
                quality={100}
              />
            </div>
          </div>
        )}

        {/* Vertical Line with Pointer (Middle) */}
        <div className="allied-business-looking-ahead__pointer-wrapper" data-node-id="3067:1455">
          <div className="allied-business-looking-ahead__vertical-line"></div>
          <div className="allied-business-looking-ahead__pointer-icon">
            <Image
              src={lookingAheadData.pointerIcon.url}
              alt={lookingAheadData.pointerIcon.alt || "Pointer"}
              width={31}
              height={31}
              className="allied-business-looking-ahead__pointer-svg"
            />
          </div>
        </div>

        {/* Text Section (Right) */}
        <div className="allied-business-looking-ahead__content" data-node-id="3067:1456">
          <h2 className="allied-business-looking-ahead__heading" data-node-id="3067:683">
            {lookingAheadData.heading}
          </h2>
          <div className="allied-business-looking-ahead__text" data-node-id="3067:682">
            {lookingAheadData.content.map((paragraph, index) => (
              <p key={index} className="allied-business-looking-ahead__paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

