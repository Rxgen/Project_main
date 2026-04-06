'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../scss/components/NewsInsights.scss';

export default function NewsInsights({ data }) {
  // Don't render if no data
  if (!data) {
    return null;
  }

  const newsData = data;
  
  // Don't render if no items
  if (!newsData.items || newsData.items.length === 0) {
    return null;
  }

  const [isMobile, setIsMobile] = useState(false);
  const [shouldUseSlider, setShouldUseSlider] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Activate slider when: desktop (items > 2) or mobile (items > 1)
      const itemCount = newsData.items?.length || 0;
      const shouldActivate = mobile ? itemCount > 1 : itemCount > 2;
      setShouldUseSlider(shouldActivate);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [newsData.items?.length]);

  const renderNewsItem = (item) => {
    // Only render if item has required data
    if (!item.id || !item.date) {
      return null;
    }

    return (
      <div key={item.id} className="news-insights__item" data-node-id={`22:${3381 + (item.id - 1) * 14}`}>
        {/* Circular Image Container - Only render if image exists */}
        {item.image && item.image.url && (
          <div className="news-insights__circle" data-node-id={`22:${3382 + (item.id - 1) * 14}`}>
            {/* Inner Circle Image */}
            <div 
              className="news-insights__circle-inner"
              data-node-id={`22:${3384 + (item.id - 1) * 14}`}
            >
              <Image
                src={item.image.url}
                alt={item.image.alt || ''}
                width={item.image.width || 627}
                height={item.image.height || 627}
                className="news-insights__circle-img"
                quality={100}
                unoptimized={process.env.NODE_ENV === 'development' && item.image.url?.includes('localhost')}
              />
            </div>

            {/* Hover Overlay */}
            <div className="news-insights__circle-overlay"></div>

            {/* Know More Button (appears on hover) */}
            {item.href && (
              <Link href={item.href} className="news-insights__button" data-node-id="22:3386">
                <div className="news-insights__button-inner" data-node-id="22:3387">
                  <div className="news-insights__button-content" data-node-id="22:3388">
                    <span className="news-insights__" data-node-id="22:3389"></span>
                    <span className="news-insights__button-text" data-node-id="22:3390">
                      Know More
                    </span>
                  </div>
                  {/* <span className="news-insights__button-underline" data-node-id="22:3391"></span> */}
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Text Content */}
        <div className="news-insights__text" data-node-id={`22:${3392 + (item.id - 1) * 8}`}>
          <p className="news-insights__date" data-node-id={`22:${3393 + (item.id - 1) * 8}`}>
            {item.date}
          </p>
          {item.headline && (
            <p className="news-insights__headline" data-node-id={`22:${3394 + (item.id - 1) * 8}`}>
              {item.headline}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="news-insights" data-node-id="22:3369">
      <div className="news-insights__container" data-node-id="22:3378">
        {/* Title */}
        <h2 className="news-insights__title" data-node-id="22:3379">
          {newsData.title}
        </h2>

        {/* News Items */}
        {shouldUseSlider ? (
          <div className="news-insights__items news-insights__items--slider" data-node-id="22:3380">
            <button type="button" className="news-insights__nav-prev" aria-label="Previous" />
            <button type="button" className="news-insights__nav-next" aria-label="Next" />
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={isMobile ? 20 : 50}
              slidesPerView={isMobile ? 1 : 2}
              navigation={{
                prevEl: '.news-insights__nav-prev',
                nextEl: '.news-insights__nav-next',
              }}
              pagination={{ clickable: true }}
              className="news-insights__swiper"
            >
              {newsData.items.map((item) => (
                <SwiperSlide key={item.id} className="news-insights__slide">
                  {renderNewsItem(item)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="news-insights__items" data-node-id="22:3380">
            {newsData.items.map((item) => renderNewsItem(item))}
          </div>
        )}
      </div>
    </section>
  );
}

