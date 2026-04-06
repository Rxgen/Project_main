import Image from 'next/image';
import Link from 'next/link';
import { getLogoForHeading } from '@/lib/allied-business-logos';
import '../scss/components/AlliedBusinessManufacturingSolutions.scss';

export default function AlliedBusinessManufacturingSolutions({ data }) {
  // Default data from Figma design
  const manufacturingSolutionsData = data || {
    heading: "Lupin Manufacturing Solutions",
    content: [
      "Lupin Manufacturing Solutions (LMS) is a subsidiary of Lupin that specializes in manufacturing and supplying high-quality, cost-effective Active Pharmaceutical Ingredients (APIs) and are the \"Partner of Choice\" in the Contract Development and Manufacturing Operations (CDMO) space. LMS strengthens Lupin's credibility in complex chemistry, manufacturing, and global regulatory excellence. It provides end-to-end development and manufacturing support across the pharmaceutical value chain, spanning early development, scale-up, commercial manufacturing, and lifecycle management for global partners.",
      "With cutting-edge technology, best-in-class manufacturing facilities, and deep scientific expertise, LMS enables pharmaceutical and biotech companies to accelerate time-to-market reach while maintaining the highest standards of quality, compliance, and sustainability. Lupin Manufacturing Solutions is a business that focuses on building long-term strategic partnerships and delivering reliable, scalable solutions across APIs and integrated CDMO services."
    ],
    websiteUrl: "https://www.lupin.com/LMS/",
    websiteText: "Lupin Manufacturing Solutions",
    image: {
      url: "/assets/images/AlliedBusiness/manufacturing-solutions.png",
      alt: "Lupin Manufacturing Solutions - CDMO Services"
    }
  };

  return (
    <section className="allied-business-manufacturing-solutions" data-node-id="3067:1450">
      <div className="allied-business-manufacturing-solutions__container">
        {/* Text Section */}
        <div className="allied-business-manufacturing-solutions__content" data-node-id="3067:1447">
          {/* Heading */}
          <div className="allied-business-manufacturing-solutions__heading" data-node-id="3067:731">
            <h2 className="allied-business-manufacturing-solutions__heading-text" data-node-id="3067:633">
              {manufacturingSolutionsData.heading}
            </h2>
            <div className="allied-business-manufacturing-solutions__heading-logo">
              <Image
                key={manufacturingSolutionsData.heading || 'manufacturing'}
                src={getLogoForHeading(manufacturingSolutionsData.heading)}
                alt=""
                width={120}
                height={56}
                className="allied-business-manufacturing-solutions__heading-logo-img"
                unoptimized
              />
            </div>
          </div>

          {/* Content Box */}
          <div className="allied-business-manufacturing-solutions__content-box" data-node-id="3067:1445">
            <div className="allied-business-manufacturing-solutions__text-wrapper" data-node-id="3067:1444">
              <div className="allied-business-manufacturing-solutions__text" data-node-id="3067:624">
                {manufacturingSolutionsData.content.map((paragraph, index) => (
                  <p key={index} className="allied-business-manufacturing-solutions__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Visit Website Link */}
              <div className="allied-business-manufacturing-solutions__link-wrapper" data-node-id="3067:1443">
                <span className="allied-business-manufacturing-solutions__link-label" data-node-id="3067:626">
                  Visit Website:
                </span>
                <Link 
                  href={manufacturingSolutionsData.websiteUrl} 
                  className="allied-business-manufacturing-solutions__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="3067:628"
                >
                  {manufacturingSolutionsData.websiteText}
                </Link>
                <svg 
                  className="allied-business-manufacturing-solutions__link-icon" 
                  width="13" 
                  height="13" 
                  viewBox="0 0 13 13" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  data-node-id="3067:1441"
                >
                  <path d="M11.5 1.5L1.5 11.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="#08a03f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section (Right Side) */}
        {manufacturingSolutionsData.image?.url && manufacturingSolutionsData.image.url.trim() !== '' && (
          <div className="allied-business-manufacturing-solutions__image-wrapper" data-node-id="3067:1448">
            <div className="allied-business-manufacturing-solutions__image-mask">
              <Image
                src={manufacturingSolutionsData.image.url}
                alt={manufacturingSolutionsData.image.alt || "Lupin Manufacturing Solutions"}
                fill
                className="allied-business-manufacturing-solutions__image"
                quality={100}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

