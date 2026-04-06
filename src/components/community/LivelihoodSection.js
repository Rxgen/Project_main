'use client';

import React from 'react';
import '@/scss/pages/community.scss';

export default function LivelihoodSection({ livelihoodData = null }) {
  // Don't render if no data
  if (!livelihoodData) {
    return null;
  }

  const data = livelihoodData;

  return (
    <section className="community-livelihood">
      <div className="community-livelihood__bg">
        <picture>
          {data?.mobileImage && (
            <source media="(max-width: 768px)" srcSet={data.mobileImage} />
          )}
          {data?.backgroundImage && (
            <img
              src={data.backgroundImage}
              alt="Livelihood"
              className="community-livelihood__bg-image"
            />
          )}
        </picture>
      </div>
      <div className="community-livelihood__container">
        <div className="community-livelihood__content">
          {data?.heading && (
            <h2 className="community-livelihood__heading">
              {data.heading}
            </h2>
          )}
          <div className="community-livelihood__text">
            {data?.subheading && (
              <h3 className="community-livelihood__subheading">
                {data.subheading}
              </h3>
            )}
            {data?.paragraphs && data.paragraphs.length > 0 && (
              <div className="community-livelihood__paragraphs">
                {data.paragraphs.map((paragraph, index) => (
                  <p key={index} className="community-livelihood__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

