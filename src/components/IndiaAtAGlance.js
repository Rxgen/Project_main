'use client';

import Image from 'next/image';
import '../scss/components/IndiaAtAGlance.scss';

export default function IndiaAtAGlance({ data }) {
  const defaultData = {
    heading: "India at a Glance",
    items: [
      "8th largest company in the Indian Pharmaceutical Market (IPM)",
      "5 Lupin brands ranked in Top 300 IPM brands",
      "#1 in anti-TB, #2 in respiratory segment, #3 in both anti-diabetes and cardiology",
      "5 flagship brands - Gluconorm-G, Budamate, Huminsulin, Ivabrad, and Rablet ranked in the top 300 IPM",
      "19 brands featured in Top 500 IPM",
      "Supported by 250,000 HCPs across India"
    ]
  };

  const glanceData = data || defaultData;
  const heading = glanceData?.heading || glanceData?.title || defaultData.heading;
  const items = glanceData?.items || glanceData?.list || glanceData?.points || defaultData.items;

  return (
    <section className="india-at-a-glance" data-node-id="3067:3093">
      <div className="india-at-a-glance__background">
        <div className="india-at-a-glance__bg-color"></div>
        <div className="india-at-a-glance__petals">
          <Image
            src="/assets/images/india/petals.svg"
            alt="Decorative petals"
            width={793}
            height={381}
            className="india-at-a-glance__petals-image"
          />
        </div>
      </div>
      <div className="india-at-a-glance__container">
        <div className="india-at-a-glance__content">
          <h2 className="india-at-a-glance__heading">
            {heading}
          </h2>
          <div className="india-at-a-glance__list">
            {items.map((item, index) => (
              <div key={index} className="india-at-a-glance__item">
                <div className="india-at-a-glance__icon">
                  <Image
                    src="/assets/images/india/smallpointer.svg"
                    alt=""
                    width={19}
                    height={19}
                    className="india-at-a-glance__icon-image"
                  />
                </div>
                <p className="india-at-a-glance__text">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

