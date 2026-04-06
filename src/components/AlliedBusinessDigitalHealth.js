import Image from 'next/image';
import Link from 'next/link';
import { getLogoForHeading } from '@/lib/allied-business-logos';
import '../scss/components/AlliedBusinessDigitalHealth.scss';

export default function AlliedBusinessDigitalHealth({ data }) {
  // Default data from Figma design
  const digitalHealthData = data || {
    heading: "Lupin Digital Health",
    content: [
      "Lupin Digital Health is redefining chronic disease management through clinically validated digital therapies, with a strong focus on cardiovascular care. Its flagship platform, LYFE, supports patients with heart diseases through remote monitoring, behavioral support, and digital care coaches, reaching 380+ districts across India.",
      "The platform integrates seamlessly into patient journeys through partnerships with insurers, hospitals, and surgical care providers. Expanding beyond treatment, Lupin Digital Health has also launched a prevention-focused platform for individuals at risk of cardiometabolic diseases such as hypertension, type 2 diabetes, dyslipidemia, and obesity.",
      "Backed by global collaborations, including with the American College of Cardiology, and multiple peer-reviewed publications, the platform combines scientific rigor with user-centric design. With key regulatory approvals and global quality certifications, the business represents a scalable, human-first approach to digital care."
    ],
    websiteUrl: "https://content.ldhlyfe.in/",
    websiteText: "Lupin Digital Health",
    image: {
      url: "/assets/images/AlliedBusiness/health.png",
      alt: "Lupin Digital Health - Healthcare Technology"
    }
  };

  return (
    <section className="allied-business-digital-health" data-node-id="3067:730">
      <div className="allied-business-digital-health__container">
        {/* Image Section */}
        {digitalHealthData.image?.url && digitalHealthData.image.url.trim() !== '' && (
          <div className="allied-business-digital-health__image-wrapper" data-node-id="3067:729">
            <div className="allied-business-digital-health__image-mask">
              <Image
                src={digitalHealthData.image.url}
                alt={digitalHealthData.image.alt || "Lupin Digital Health"}
                fill
                className="allied-business-digital-health__image"
                quality={100}
              />
            </div>
          </div>
        )}

        {/* Text Section */}
        <div className="allied-business-digital-health__content" data-node-id="3067:728">
          {/* Heading */}
          <div className="allied-business-digital-health__heading" data-node-id="3067:723">
            <h2 className="allied-business-digital-health__heading-text" data-node-id="3067:575">
              {digitalHealthData.heading}
            </h2>
            <div className="allied-business-digital-health__heading-logo">
              <Image
                key={digitalHealthData.heading || 'digital-health'}
                src={getLogoForHeading(digitalHealthData.heading)}
                alt=""
                width={120}
                height={56}
                className="allied-business-digital-health__heading-logo-img"
                unoptimized
              />
            </div>
          </div>

          {/* Content Box */}
          <div className="allied-business-digital-health__content-box" data-node-id="3067:727">
            <div className="allied-business-digital-health__text-wrapper" data-node-id="3067:726">
              <div className="allied-business-digital-health__text" data-node-id="3067:566">
                {digitalHealthData.content.map((paragraph, index) => (
                  <p key={index} className="allied-business-digital-health__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Visit Website Link */}
              <div className="allied-business-digital-health__link-wrapper" data-node-id="3067:725">
                <span className="allied-business-digital-health__link-label" data-node-id="3067:568">
                  Visit Website:
                </span>
                <Link 
                  href={digitalHealthData.websiteUrl} 
                  className="allied-business-digital-health__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="3067:570"
                >
                  {digitalHealthData.websiteText}
                </Link>
                <svg 
                  className="allied-business-digital-health__link-icon" 
                  width="13" 
                  height="13" 
                  viewBox="0 0 13 13" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  data-node-id="3067:571"
                >
                  <path d="M11.5 1.5L1.5 11.5M11.5 1.5H4.5M11.5 1.5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

