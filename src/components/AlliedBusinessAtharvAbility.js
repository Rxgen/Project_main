import Image from 'next/image';
import Link from 'next/link';
import { getLogoForHeading } from '@/lib/allied-business-logos';
import '../scss/components/AlliedBusinessAtharvAbility.scss';

export default function AlliedBusinessAtharvAbility({ data }) {
  // Default data from Figma design
  const atharvAbilityData = data || {
    heading: "Atharv Ability",
    content: [
      "Atharv Ability reflects Lupin's bold and compassionate dedication to neurological rehabilitation, addressing a critically underserved area of care in India. Established as a state-of-the-art outpatient neuro-rehabilitation center in Mumbai, India, Atharv Ability delivers customized, multidisciplinary therapies for adults and children with complex neurological conditions. The center has demonstrated 30–40% improvement in functional recovery and quality of life across patient cohorts.",
      "Atharv Ability caters to a wide spectrum of conditions like stroke, brain or spine injury, Parkinson's disease, cerebral palsy, MS, and more. Its integrated care model includes neurophysiotherapy, robotic rehabilitation, speech and occupational therapy, cognitive and pediatric neurological rehabilitation, and aqua therapy, among many others.",
      "In FY25, Atharv Ability treated 2,800+ patients and delivered nearly 40,000 therapy sessions, helping many regain mobility and independence. With its architecture built on clinical excellence and technological precision, Atharv Ability is now expanding into Hyderabad, setting new benchmarks for accessible high-quality neurorehabilitation in India."
    ],
    websiteUrl: "#",
    websiteText: "Atharv Ability",
    image: {
      url: "/assets/images/AlliedBusiness/ability.png",
      alt: "Atharv Ability - Neurological Rehabilitation"
    }
  };

  return (
    <section className="allied-business-atharv-ability" data-node-id="3067:1450">
      <div className="allied-business-atharv-ability__container">
        {/* Text Section */}
        <div className="allied-business-atharv-ability__content" data-node-id="3067:1447">
          {/* Heading */}
          <div className="allied-business-atharv-ability__heading" data-node-id="3067:731">
            <h2 className="allied-business-atharv-ability__heading-text" data-node-id="3067:633">
              {atharvAbilityData.heading}
            </h2>
            <div className="allied-business-atharv-ability__heading-logo">
              <Image
                key={atharvAbilityData.heading || 'atharv'}
                src={getLogoForHeading(atharvAbilityData.heading)}
                alt=""
                width={120}
                height={56}
                className="allied-business-atharv-ability__heading-logo-img"
                unoptimized
              />
            </div>
          </div>

          {/* Content Box */}
          <div className="allied-business-atharv-ability__content-box" data-node-id="3067:1445">
            <div className="allied-business-atharv-ability__text-wrapper" data-node-id="3067:1444">
              <div className="allied-business-atharv-ability__text" data-node-id="3067:624">
                {atharvAbilityData.content.map((paragraph, index) => (
                  <p key={index} className="allied-business-atharv-ability__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Visit Website Link */}
              <div className="allied-business-atharv-ability__link-wrapper" data-node-id="3067:1443">
                <span className="allied-business-atharv-ability__link-label" data-node-id="3067:626">
                  Visit Website:
                </span>
                <Link 
                  href={atharvAbilityData.websiteUrl} 
                  className="allied-business-atharv-ability__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="3067:628"
                >
                  {atharvAbilityData.websiteText}
                </Link>
                <svg 
                  className="allied-business-atharv-ability__link-icon" 
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
        {atharvAbilityData.image?.url && atharvAbilityData.image.url.trim() !== '' && (
          <div className="allied-business-atharv-ability__image-wrapper" data-node-id="3067:1448">
            <div className="allied-business-atharv-ability__image-mask">
              <Image
                src={atharvAbilityData.image.url}
                alt={atharvAbilityData.image.alt || "Atharv Ability"}
                fill
                className="allied-business-atharv-ability__image"
                quality={100}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

