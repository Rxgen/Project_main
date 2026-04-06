'use client';

import '../scss/components/IndiaTherapies.scss';

export default function IndiaTherapies({ data }) {
  const defaultData = {
    heading: "Therapies",
    description: "Lupin's India business focuses on key therapy areas, aiming to deliver affordable care with quality, trusted outcomes for people."
  };

  const therapiesData = data || defaultData;
  const heading = therapiesData?.heading || therapiesData?.title || defaultData.heading;
  const description = therapiesData?.description || therapiesData?.text || therapiesData?.content || defaultData.description;

  return (
    <section className="india-therapies" data-node-id="3071:3867">
      <div className="india-therapies__container">
        <div className="india-therapies__content">
          <h2 className="india-therapies__heading">
            {heading}
          </h2>
          <p className="india-therapies__description">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

