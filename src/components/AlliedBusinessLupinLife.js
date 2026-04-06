import Image from 'next/image';
import Link from 'next/link';
import { getLogoForHeading } from '@/lib/allied-business-logos';
import '../scss/components/AlliedBusinessLupinLife.scss';

export default function AlliedBusinessLupinLife({ data }) {
  // Default data from Figma design
  const lupinLifeData = data || {
    heading: "LupinLife Consumer Healthcare",
    content: [
      "LupinLife is our consumer healthcare arm, focused on delivering science-led, trusted wellness solutions that are aligned with India's evolving healthcare needs. As a strategic arm of Lupin's prescription business, LupinLife represents a strong pivot towards the holistic over-the-counter (OTC) medication segment.",
      "Since its inception in 2017, LupinLife has built a diversified portfolio across gastro care, health supplements, women's health, and pain management. Its flagship brand Softovac leads the bulk laxatives category with a 42% market share and has doubled in size over 5 years, driven by innovations like Softovac Liquid Fibre.",
      "In the children's health category, Aptivate has strengthened emotional engagement with families through high-impact activations. Our OTC segment accelerates portfolio innovation and unlocks sharper consumer focus for sustainable future growth."
    ],
    websiteUrl: "https://lupinlife.com/",
    websiteText: "LupinLife",
    image: {
      url: "/assets/images/AlliedBusiness/joyful-family-moments-children-play-parents-laugh-umbrella-protection 1.png",
      alt: "Joyful family moments"
    }
  };

  return (
    <section className="allied-business-lupinlife" data-node-id="3067:713">
      <div className="allied-business-lupinlife__container">
        {/* Image Section */}
        {lupinLifeData.image?.url && lupinLifeData.image.url.trim() !== '' && (
          <div className="allied-business-lupinlife__image-wrapper" data-node-id="3067:712">
            <div className="allied-business-lupinlife__image-mask">
              <Image
                src={lupinLifeData.image.url}
                alt={lupinLifeData.image.alt || "LupinLife Consumer Healthcare"}
                fill
                className="allied-business-lupinlife__image"
                quality={100}
              />
            </div>
          </div>
        )}

        {/* Text Section */}
        <div className="allied-business-lupinlife__content" data-node-id="3067:711">
          {/* Heading */}
          <div className="allied-business-lupinlife__heading" data-node-id="3067:706">
            <h2 className="allied-business-lupinlife__heading-text" data-node-id="3067:555">
              {lupinLifeData.heading}
            </h2>
            <div className="allied-business-lupinlife__heading-logo">
              <Image
                key={lupinLifeData.heading || 'lupinlife'}
                src={getLogoForHeading(lupinLifeData.heading)}
                alt=""
                width={120}
                height={56}
                className="allied-business-lupinlife__heading-logo-img"
                unoptimized
              />
            </div>
          </div>

          {/* Content Box */}
          <div className="allied-business-lupinlife__content-box" data-node-id="3067:707">
            <div className="allied-business-lupinlife__text" data-node-id="3067:546">
              {lupinLifeData.content.map((paragraph, index) => (
                <p key={index} className="allied-business-lupinlife__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Visit Website Link */}
            <div className="allied-business-lupinlife__link-wrapper" data-node-id="3067:710">
              <span className="allied-business-lupinlife__link-label" data-node-id="3067:548">
                Visit Website:
              </span>
              <Link 
                href={lupinLifeData.websiteUrl} 
                className="allied-business-lupinlife__link"
                target="_blank"
                rel="noopener noreferrer"
                data-node-id="3067:550"
              >
                {lupinLifeData.websiteText}
              </Link>
              <svg 
                className="allied-business-lupinlife__link-icon" 
                width="13" 
                height="13" 
                viewBox="0 0 13 13" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                data-node-id="3067:709"
              >
                <path d="M11.5 1.5L1.5 11.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

