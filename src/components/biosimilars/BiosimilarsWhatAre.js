import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsWhatAre.scss';

export default function BiosimilarsWhatAre({ data }) {
  // Default data
  const contentData = data || {
    heading: "What Are Biosimilars?",
    paragraphs: [
      "Biosimilars are biologic medicines that are highly similar to an already approved reference biologic in terms of their quality, efficacy and safety. Unlike other small-molecule drugs made through chemical synthesis, biosimilars are manufactured using living systems, making their development scientifically complex and highly regulated."
    ],
    image: {
      url: "/assets/images/biosimilars/young-woman-using-phone-while-sitting-table 2.png",
      alt: "Biosimilars research"
    }
  };

  return (
    <div className="biosimilars-what-are" data-node-id="biosimilars-what-are">
      {/* Background Petals - Top Right */}
      <div className="biosimilars-what-are__petals">
        <Image
          src="/assets/images/specialty/petals.svg"
          alt="Decorative petals"
          width={1452}
          height={767}
          className="biosimilars-what-are__petals-img"
          quality={100}
        />
      </div>

      {/* Top Section - Image and Content */}
      <div className="biosimilars-what-are__wrapper">
        {/* Left Side - Circular Image */}
        <div className="biosimilars-what-are__image-wrapper">
          <div className="biosimilars-what-are__image-circle">
            <Image
              src={contentData.image.url}
              alt={contentData.image.alt}
              fill
              className="biosimilars-what-are__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="biosimilars-what-are__content">
          {/* Heading */}
          <h2 className="biosimilars-what-are__heading">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs */}
          <div className="biosimilars-what-are__intro">
            {contentData.paragraphs.map((paragraph, index) => (
              <p key={index} className="biosimilars-what-are__paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

