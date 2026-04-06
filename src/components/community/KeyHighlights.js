'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/community/KeyHighlights.scss';

export default function KeyHighlights({ highlights = [] }) {
  // Don't render if no highlights
  if (!highlights || highlights.length === 0) {
    return null;
  }

  const highlightsData = highlights;

  return (
    <section className="key-highlights">
      <div className="key-highlights__container">
        <h2 className="key-highlights__title">Key Highlights</h2>
        <div className="key-highlights__grid">
          {highlightsData.map((highlight, index) => (
            <div key={highlight?.id || index} className="key-highlights__item">
              {highlight?.icon && (
                <div className="key-highlights__icon-wrapper">
                  <Image
                    src={highlight.icon}
                    alt="Highlight icon"
                    width={100}
                    height={100}
                    className="key-highlights__icon"
                  />
                </div>
              )}
              <div className="key-highlights__content">
                {highlight?.number && (
                  <div className="key-highlights__number">{highlight.number}</div>
                )}
                {highlight?.description && (
                  <p className="key-highlights__description">{highlight.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

