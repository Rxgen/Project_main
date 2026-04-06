'use client';

import Image from 'next/image';
import '@/scss/components/sustainability/SustainabilityHighlights.scss';

const HIGHLIGHTS_DATA = [
  { label: 'Carbon emissions reduction target approved by SBTi' },
  { label: '39% share of renewable energy in our operations in FY25', icon: '/assets/sustainability/fy25.svg' },
  { label: '4 years of water positivity in a row', icon: '/assets/sustainability/water.svg' },
  { label: '6 Manufacturing plants with zero-liquid discharge', icon: '/assets/sustainability/plants.svg' },
  { label: 'Global No 1. in ESG rating in the pharma sector', icon: '/assets/sustainability/global.svg' },
];

const ICON_SRC = '/assets/sustainability/highlights-icon1.svg';
const BG_IMAGE = '/assets/sustainability/highlights-bg.png';

export default function SustainabilityHighlights() {
  return (
    <section id="key-highlights" className="sustainability-highlights">
      <div className="sustainability-highlights__background">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          className="sustainability-highlights__bg-image"
          quality={100}
        />
      </div>
      <div className="sustainability-highlights__container">
        <div className="sustainability-highlights__border">
          <Image
            src="/assets/sustainability/border.svg"
            alt=""
            fill
            className="sustainability-highlights__border-image"
            quality={100}
          />
        </div>
        <div className="sustainability-highlights__grid">
          {HIGHLIGHTS_DATA.slice(0, 3).map((item, index) => (
            <div key={index} className="sustainability-highlights__item">
              <div className="sustainability-highlights__icon">
                <Image
                  src={item.icon || ICON_SRC}
                  alt=""
                  width={282}
                  height={282}
                  quality={100}
                />
              </div>
              <div className="sustainability-highlights__label">
                {item.label}
              </div>
            </div>
          ))}
          <div className="sustainability-highlights__row-bottom">
            {HIGHLIGHTS_DATA.slice(3, 5).map((item, index) => (
              <div key={index + 3} className="sustainability-highlights__item">
                <div className="sustainability-highlights__icon">
                  <Image
                    src={item.icon || ICON_SRC}
                    alt=""
                    width={282}
                    height={282}
                    quality={100}
                  />
                </div>
                <div className="sustainability-highlights__label">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
