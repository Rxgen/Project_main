'use client';

import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/CorporateGovernance.scss';

export default function CorporateGovernance({ data }) {
  // Default data (will be replaced by Strapi)
  const governanceData = data || {
    title: "Corporate Governance",
    backgroundImage: {
      url: "/assets/corporate-governance/background.jpg",
      alt: "Corporate Governance"
    },
    buttons: [
      {
        id: 1,
        label: "Committees of the Board",
        href: "/investors/committees-of-the-board",
        isActive: false
      },
      {
        id: 2,
        label: "Code of Conduct",
        href: "/investors/code-of-conduct",
        isActive: false
      },
      {
        id: 3,
        label: "Policies",
        href: "/investors/policies",
        isActive: false
      }
    ]
  };

  return (
    <section className="corporate-governance" data-node-id="2216:856">
      <div className="corporate-governance__background">
        {governanceData.backgroundImage && (
          <Image
            src={governanceData.backgroundImage.url}
            alt={governanceData.backgroundImage.alt || ""}
            fill
            className="corporate-governance__background-img"
            quality={100}
            priority
          />
        )}
      </div>
      
      <div className="corporate-governance__container">
        <div className="corporate-governance__content">
          {governanceData.title && (
            <h2 className="corporate-governance__title">
              {governanceData.title.split(' ').map((word, index, array) => (
                <span key={index} className="corporate-governance__title-word">
                  {word}
                  {index < array.length - 1 && ' '}
                </span>
              ))}
            </h2>
          )}
          
          {governanceData.buttons && governanceData.buttons.length > 0 && (
            <div className="corporate-governance__buttons">
              {governanceData.buttons.map((button) => (
                <Link
                  key={button.id}
                  href={button.href}
                  className={`corporate-governance__button ${
                    button.isActive 
                      ? 'corporate-governance__button--active' 
                      : 'corporate-governance__button--inactive'
                  }`}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

