'use client';

import Image from 'next/image';
import '../scss/components/ScienceCapabilities.scss';

export default function ScienceCapabilities({ data }) {
  const defaultData = {
    capabilities: [
      {
        title: "Core",
        description: "business capabilities provide a secure, reliable backbone for the enterprise.",
        icon: "/assets/images/our-sci/icon22.svg"
      },
      {
        title: "Common",
        description: "business capabilities are designed for reuse and consistency across the organization.",
        icon: "/assets/images/our-sci/icon22.svg"
      },
      {
        title: "Distinct",
        description: "business capabilities enable our businesses (manufacturing, quality, R&D, supply chain, and commercial), to innovate and differentiate with agility, while staying aligned to enterprise standards.",
        icon: "/assets/images/our-sci/icon22.svg"
      }
    ]
  };

  const capabilitiesData = data || defaultData;
  const capabilities = capabilitiesData?.capabilities || capabilitiesData?.items || defaultData.capabilities;

  return (
    <section className="science-capabilities" data-node-id="2952:3382">
      <div className="science-capabilities__container">
        {capabilities.map((capability, index) => {
          const isMiddle = index === 1;
          const isLast = index === capabilities.length - 1;
          return (
            <div key={index} className={`science-capabilities__box ${isMiddle ? 'science-capabilities__box--middle' : ''} ${isLast ? 'science-capabilities__box--last' : ''}`}>
              {isMiddle ? (
                <>
                  <div className="science-capabilities__icon">
                    <Image
                      src={capability.icon || capability.iconUrl || capability.image || "/assets/images/our-sci/icon22.svg"}
                      alt=""
                      width={114}
                      height={114}
                      quality={100}
                    />
                  </div>
                  <h3 className="science-capabilities__title">
                    {capability.title || capability.name || capability.heading || ''}
                  </h3>
                  <p className="science-capabilities__description">
                    {capability.description || capability.text || capability.content || ''}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="science-capabilities__title">
                    {capability.title || capability.name || capability.heading || ''}
                  </h3>
                  <p className="science-capabilities__description">
                    {capability.description || capability.text || capability.content || ''}
                  </p>
                  <div className="science-capabilities__icon">
                    <Image
                      src={capability.icon || capability.iconUrl || capability.image || "/assets/images/our-sci/icon22.svg"}
                      alt=""
                      width={114}
                      height={114}
                      quality={100}
                    />
                  </div>
                </>
              )}
              <div className="science-capabilities__line">
                <div className="science-capabilities__line-pointer">
                  <Image
                    src="/assets/images/our-sci/smallpointer.svg"
                    alt=""
                    width={25}
                    height={25}
                    quality={100}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

