'use client';

import Image from 'next/image';
import { getStrapiMedia } from '../lib/strapi';
import '../scss/components/ScienceHighlights.scss';

export default function ScienceHighlights({ data }) {
  if (!data) {
    return null;
  }

  // Handle both mapped data structure and raw Strapi data
  let items = [];
  let backgroundImage = '/assets/images/Background.png';
  let backgroundImageMobile = backgroundImage;

  // If data has items (mapped structure), use it
  if (data.items && Array.isArray(data.items)) {
    items = data.items;
    backgroundImage = data.backgroundImage?.desktop || data.backgroundImage || backgroundImage;
    backgroundImageMobile = data.backgroundImage?.mobile || backgroundImage;
  } 
  // If data is NumbersCardSection array (raw Strapi structure)
  else if (Array.isArray(data)) {
    items = data.map((card) => {
      const svgImage = card?.SvgImage;
      const svgUrl = svgImage ? getStrapiMedia(svgImage) : '/assets/images/our-sci/icon1.svg';
      
      return {
        value: card?.Value || '',
        suffix: card?.Suffix || null,
        label: card?.Description || '',
        icon: svgUrl
      };
    });
  }
  // If data has NumbersCardSection property
  else if (data.NumbersCardSection && Array.isArray(data.NumbersCardSection)) {
    items = data.NumbersCardSection.map((card) => {
      const svgImage = card?.SvgImage;
      const svgUrl = svgImage ? getStrapiMedia(svgImage) : '/assets/images/our-sci/icon1.svg';
      
      return {
        value: card?.Value || '',
        suffix: card?.Suffix || null,
        label: card?.Description || '',
        icon: svgUrl
      };
    });
    
    const backgroundImageData = data?.BackGroundImage;
    if (backgroundImageData) {
      const desktopImage = backgroundImageData?.DesktopImage;
      const mobileImage = backgroundImageData?.MobileImage;
      backgroundImage = desktopImage ? getStrapiMedia(desktopImage) : backgroundImage;
      backgroundImageMobile = mobileImage ? getStrapiMedia(mobileImage) : backgroundImage;
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="science-highlights" data-node-id="3089:473">
      <div className="science-highlights__background">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="science-highlights__bg-image"
          quality={100}
        />
      </div>
      <div className="science-highlights__container">
        <div className="science-highlights__border">
          <Image
            src="/assets/images/our-sci/Rectangle 223.svg"
            alt=""
            fill
            className="science-highlights__border-image"
            quality={100}
          />
        </div>
        <div className="science-highlights__grid">
          {items.map((item, index) => {
            const value = item.value || item.Value || '';
            const suffix = item.suffix !== undefined ? item.suffix : (item.Suffix || null);
            const displayValue = suffix ? `${value}${suffix}` : value;
            
            return (
              <div key={index} className="science-highlights__item">
                <div className="science-highlights__icon">
                  <Image
                    src={item.icon || item.SvgImage?.url || '/assets/images/our-sci/icon1.svg'}
                    alt=""
                    width={225}
                    height={225}
                    quality={100}
                  />
                </div>
                <div className="science-highlights__value">
                  {(() => {
                    if (typeof displayValue === 'string' && displayValue.includes('INR')) {
                      const parts = displayValue.split(/(INR\s+)/);
                      return parts.map((part, idx) => 
                        part.startsWith('INR') ? (
                          <span key={idx} className="science-highlights__value-currency">{part}</span>
                        ) : (
                          <span key={idx}>{part}</span>
                        )
                      );
                    }
                    return displayValue;
                  })()}
                </div>
                <div className="science-highlights__label">
                  {item.label || item.Description || item.description || item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

