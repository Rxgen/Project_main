import Image from 'next/image';
import Link from 'next/link';
import { getLogoForHeading } from '@/lib/allied-business-logos';
import '../scss/components/AlliedBusinessLightBox.scss';

export default function AlliedBusinessLightBox({ data }) {
  // Default data from Figma design
  const lightBoxData = data || {
    heading: "Lupin Diagnostics",
    content: [
      "Lupin Diagnostics plays a pivotal role in India's shift toward preventive and personalized healthcare by delivering high-quality, accessible diagnostic services. Launched in 2021, the business has rapidly built a pan-India presence with 44 processing labs across 250+ cities, including Tier 3 and Tier 4 towns.",
      "Serving 150,000+ patients every month, Lupin Diagnostics has achieved strong revenue growth in just three years. Quality is central to our operations, with NABL-accredited greenfield labs and a 450,000 sq ft state-of-the-art National Reference Laboratory in Navi Mumbai that's equipped with advanced genomic and molecular technologies.",
      "With 750+ collection centers, 200+ trained field executives, and a robust home-collection network, Lupin Diagnostics ensures last-mile access and reliable results."
    ],
    websiteUrl: "https://www.lupindiagnostics.com/",
    websiteText: "Lupin Diagnostics",
    image: {
      url: "/assets/images/AlliedBusiness/Image.png",
      alt: "Lupin Diagnostics - Healthcare Services"
    }
  };

  return (
    <section className="allied-business-lightbox" data-node-id="3067:722">
      <div className="allied-business-lightbox__container">
        {/* Text Section */}
        <div className="allied-business-lightbox__content" data-node-id="3067:721">
          {/* Heading */}
          <div className="allied-business-lightbox__heading" data-node-id="3067:714">
            <h2 className="allied-business-lightbox__heading-text" data-node-id="3067:611">
              {lightBoxData.heading}
            </h2>
            <div className="allied-business-lightbox__heading-logo">
              <Image
                key={lightBoxData.heading || 'diagnostics'}
                src={getLogoForHeading(lightBoxData.heading)}
                alt=""
                width={120}
                height={56}
                className="allied-business-lightbox__heading-logo-img"
                unoptimized
              />
            </div>
          </div>

          {/* Content Box */}
          <div className="allied-business-lightbox__content-box" data-node-id="3067:719">
            <div className="allied-business-lightbox__text-wrapper" data-node-id="3067:718">
              <div className="allied-business-lightbox__text" data-node-id="3067:602">
                {lightBoxData.content.map((paragraph, index) => (
                  <p key={index} className="allied-business-lightbox__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Visit Website Link */}
              <div className="allied-business-lightbox__link-wrapper" data-node-id="3067:716">
                <span className="allied-business-lightbox__link-label" data-node-id="3067:604">
                  Visit Website:
                </span>
                <Link 
                  href={lightBoxData.websiteUrl} 
                  className="allied-business-lightbox__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="3067:606"
                >
                  {lightBoxData.websiteText}
                </Link>
                <svg 
                  className="allied-business-lightbox__link-icon" 
                  width="13" 
                  height="13" 
                  viewBox="0 0 13 13" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  data-node-id="3067:607"
                >
                  <path d="M11.5 1.5L1.5 11.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="#08a03f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section (Right Side) */}
        {lightBoxData.image?.url && lightBoxData.image.url.trim() !== '' && (
          <div className="allied-business-lightbox__image-wrapper" data-node-id="3067:592">
            <div className="allied-business-lightbox__image-mask">
              <Image
                src={lightBoxData.image.url}
                alt={lightBoxData.image.alt || "Lupin Diagnostics"}
                fill
                className="allied-business-lightbox__image"
                quality={100}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

