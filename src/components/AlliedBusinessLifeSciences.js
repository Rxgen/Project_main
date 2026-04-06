import Image from 'next/image';
import { getLogoForHeading } from '@/lib/allied-business-logos';
import '../scss/components/AlliedBusinessLifeSciences.scss';

export default function AlliedBusinessLifeSciences({ data }) {
  // Default data from Figma design
  const lifeSciencesData = data || {
    heading: 'Lupin Life Sciences',
    content: [
      "Lupin Life Sciences (LLS) is Lupin's trade generics business unit, created as our wholly owned subsidiary. The intent of this unit is to sharpen focus in a fast-growing and high-impact segment. With a portfolio of 350+ products spanning across pain management, gastrointestinal care, anti-infectives, respiratory care, dermatology, and multivitamins, LLS takes a step forward in Lupin's commitment to making affordable healthcare accessible to all.",
      "The business has undergone a strategic transformation by streamlining its operations and expanding its national footprint. LLS efforts are shifting and directed towards demand generation at the last mile, with a strong field force, and deeper chemist engagement.",
      "LLS is enhancing patient access to quality medicines. Its renewed approach positions it as a market shaper in India's evolving trade generics landscape."
    ],
    image: {
      url: "/assets/images/AlliedBusiness/sci.png",
      alt: "Lupin Life Sciences - Laboratory Research"
    }
  };

  const headingLogoSrc = getLogoForHeading(lifeSciencesData.heading);

  return (
    <section className="allied-business-life-sciences" data-node-id="3067:1454">
      <div className="allied-business-life-sciences__container">
        {/* Image Section */}
        {lifeSciencesData.image?.url && lifeSciencesData.image.url.trim() !== '' && (
          <div className="allied-business-life-sciences__image-wrapper" data-node-id="3067:579">
            <div className="allied-business-life-sciences__image-mask">
              <Image
                src={lifeSciencesData.image.url}
                alt={lifeSciencesData.image.alt || "Lupin Life Sciences"}
                fill
                className="allied-business-life-sciences__image"
                quality={100}
              />
            </div>
          </div>
        )}

        {/* Text Section */}
        <div className="allied-business-life-sciences__content" data-node-id="3067:1453">
          {/* Heading */}
          <div className="allied-business-life-sciences__heading" data-node-id="3067:1451">
            <h2 className="allied-business-life-sciences__heading-text" data-node-id="3067:588">
              {lifeSciencesData.heading}
            </h2>
            {headingLogoSrc && (
              <div className="allied-business-life-sciences__heading-logo">
                <Image
                  key={lifeSciencesData.heading || 'life-sciences'}
                  src={headingLogoSrc}
                  alt=""
                  width={120}
                  height={56}
                  className="allied-business-life-sciences__heading-logo-img"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Content Box */}
          <div className="allied-business-life-sciences__content-box" data-node-id="3067:1452">
            <div className="allied-business-life-sciences__text" data-node-id="3067:586">
              {lifeSciencesData.content.map((paragraph, index) => (
                <p key={index} className="allied-business-life-sciences__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

