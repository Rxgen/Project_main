'use client';

import Image from 'next/image';
import '../../scss/components/biosimilars/BiosimilarsCapabilities.scss';

export default function BiosimilarsCapabilities({ data }) {
  const defaultData = {
    capabilities: [
      {
        title: "Extensive Research and Development",
        description: "Cell line development, upstream and downstream process development, analytical characterization, formulation and device development, regulatory science",
        icon: "/assets/images/biosimilars/icon1.svg"
      },
      {
        title: "Clinical and Regulatory Expertise",
        description: "Across pre-clinical, clinical, and regulatory pathways aligned with leading global agencies",
        icon: "/assets/images/biosimilars/icon1.svg"
      },
      {
        title: "State-of-the-art Manufacturing",
        description: "cGMP-compliant microbial and mammalian manufacturing facilities for clinical and commercial supply",
        icon: "/assets/images/biosimilars/icon1.svg"
      },
      {
        title: "Quality and Compliance",
        description: "Robust systems and processes aligned with stringent international standards",
        icon: "/assets/images/biosimilars/icon1.svg"
      }
    ]
  };

  const capabilitiesData = data || defaultData;
  const capabilities = capabilitiesData?.capabilities || capabilitiesData?.items || defaultData.capabilities;

  return (
    <section className="biosimilars-capabilities" data-node-id="2875:370">
      <div className="biosimilars-capabilities__container">
        {capabilities.map((capability, index) => {
          const isMiddle = index === 1; // Second box
          const isLast = index === capabilities.length - 1;
          const hasIconOnTop = isMiddle || isLast; // Second and last items have icon on top
          
          return (
            <div key={index} className={`biosimilars-capabilities__box ${hasIconOnTop ? 'biosimilars-capabilities__box--middle' : ''} ${isLast ? 'biosimilars-capabilities__box--last' : ''}`}>
              {hasIconOnTop ? (
                <>
                  <div className="biosimilars-capabilities__icon">
                    <Image
                      src={capability.icon || capability.iconUrl || capability.image || "/assets/images/biosimilars/icon1.svg"}
                      alt=""
                      width={114}
                      height={114}
                      quality={100}
                    />
                  </div>
                  <h3 className="biosimilars-capabilities__title">
                    {capability.title || capability.name || capability.heading || ''}
                  </h3>
                  <p className="biosimilars-capabilities__description">
                    {capability.description || capability.text || capability.content || ''}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="biosimilars-capabilities__title">
                    {capability.title || capability.name || capability.heading || ''}
                  </h3>
                  <p className="biosimilars-capabilities__description">
                    {capability.description || capability.text || capability.content || ''}
                  </p>
                  <div className="biosimilars-capabilities__icon">
                    <Image
                      src={capability.icon || capability.iconUrl || capability.image || "/assets/images/biosimilars/icon1.svg"}
                      alt=""
                      width={114}
                      height={114}
                      quality={100}
                    />
                  </div>
                </>
              )}
              <div className="biosimilars-capabilities__line">
                <div className="biosimilars-capabilities__line-pointer">
                  <Image
                    src="/assets/images/biosimilars/bigpointer.svg"
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

