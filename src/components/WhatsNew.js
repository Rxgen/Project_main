'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProfileCard from './global/ProfileCard';
import 'swiper/css';
import 'swiper/css/navigation';
import '../scss/components/WhatsNew.scss';

export default function WhatsNew({ data, className, useProfileCard = false, exploreLink }) {
  // Default data (will be replaced by Strapi)
  const whatsNewData = data || {
    title: "What's New",
    items: [
      {
        id: 1,
        date: "September 17, 2025",
        headline: [
          "Lupin Receives Positive",
          "CHMP Opinion for",
          "Biosimilar Ranibizu",
          "mab"
        ],
        category: "Press Releases",
        href: "#"
      },
      {
        id: 2,
        date: "September 17, 2025",
        headline: [
          "Lupin Receives Positive",
          "CHMP Opinion for",
          "Biosimilar Ranibizu",
          "mab"
        ],
        category: "Press Releases",
        href: "#"
      },
      {
        id: 3,
        date: "September 17, 2025",
        headline: [
          "Lupin Receives Positive",
          "CHMP Opinion for",
          "Biosimilar Ranibizu",
          "mab"
        ],
        category: "Press Releases",
        href: "#"
      },

      {
        id: 4,
        date: "September 17, 2025",
        headline: [
          "Lupin Receives Positive",
          "CHMP Opinion for",
          "Biosimilar Ranibizu",
          "mab"
        ],
        category: "Press Releases",
        href: "#"
      }
    ]
  };

  const items = whatsNewData.items || [];
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiper) {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  }, [swiper]);

  const handlePrevious = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  // Helper function to decode &amp; entities (handles potential double-encoding)
  const decodeAmpersand = (text) => {
    if (!text) return text;
    let decoded = text;
    // Keep decoding until no more &amp; entities remain
    while (decoded.includes('&amp;')) {
      decoded = decoded.replace(/&amp;/g, '&');
    }
    return decoded;
  };

  return (
    <section className={`whats-new ${className || ''}`} data-node-id="2216:743">
      <div className="whats-new__container">
        {/* Title */}
        {(whatsNewData.title || whatsNewData.description || exploreLink) && (
          <div className="whats-new__header">
            <div className="whats-new__title-wrapper">
              {whatsNewData.title && (
                <h2 className="whats-new__title"
                  dangerouslySetInnerHTML={{ __html: whatsNewData.title }}
                >
                </h2>
              )}
              {exploreLink && (
                <a href={exploreLink} className="whats-new__explore-button">
                  <span className="whats-new__explore-text">Explore</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="whats-new__explore-icon"
                  >
                    <path
                      d="M1 17L17 1M17 1H1M17 1V17"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </div>
            {whatsNewData.description && (
              <p className="whats-new__description">
                {whatsNewData.description}
              </p>
            )}
          </div>
        )}

        {/* Cards Container */}
        <div className="whats-new__cards-wrapper">
          <Swiper
            modules={[Navigation]}
            spaceBetween={40}
            slidesPerView={3}
            navigation={false}
            loop={true}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40
              }
            }}
            className="whats-new__swiper"
            allowTouchMove={true}
            watchOverflow={false}
          >
            {items.map((item, index) => (
              <SwiperSlide key={item.id || index} className="whats-new__slide">
                {useProfileCard ? (
                  <ProfileCard
                    name={item.name || item.date || item.headline?.[0] || ''}
                    title={item.title || (Array.isArray(item.headline) ? item.headline.join(' ') : item.headline) || ''}
                    date={item.date}
                    link={item.link || item.href}
                    image={item.image}
                    imagePosition={item.imagePosition || 'bottom'}
                    showArrow={item.showArrow !== undefined ? item.showArrow : true}
                    className="profile-card--slider"
                  />
                ) : (
                  <div className="whats-new__card">
                    {/* Date */}
                    <div className="whats-new__date">
                      {item.date}
                    </div>

                    {/* Category Button */}
                    {item.category && (() => {
                      // Split category text (e.g., "Press Releases" -> ["Press", "Releases"])
                      const categoryParts = item.category.split(' ');
                      const firstPart = categoryParts[0] || item.category;
                      const secondPart = categoryParts.slice(1).join(' ') || '';

                      return (
                        <Link href={item.href || "#"} className="whats-new__category-btn">
                          <div className="whats-new__category-line">
                            <span className="whats-new__category-text">{firstPart}</span>
                            <svg
                              className="whats-new__category-arrow"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 11L11 1M11 1H1M11 1V11"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          {secondPart && (
                            <span className="whats-new__category-text">{secondPart}</span>
                          )}
                        </Link>
                      );
                    })()}

                    {/* Headline */}
                    <Link href={item.href || "#"} className="whats-new__headline">
                      <h3>
                        {decodeAmpersand(
                          Array.isArray(item.headline) ? (
                            item.headline.join(' ')
                          ) : (
                            item.headline
                          )
                        )}
                      </h3>
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Card */}
          <div className={`whats-new__nav-card ${useProfileCard ? 'whats-new__nav-card--profile-slider' : ''}`}>
            <button
              className="whats-new__nav-btn"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="whats-new__nav-btn"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

