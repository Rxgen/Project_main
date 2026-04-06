'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../scss/components/Hero.scss';

export default function Hero({ data }) {
  if (!data) {
    throw new Error('Hero component requires data prop from Strapi API');
  }

  const heroData = data;

  // Slide 1 from Strapi – only include if we have valid image and heading
  const hasStrapiSlide =
    heroData?.image?.url &&
    Array.isArray(heroData?.heading) &&
    heroData.heading.length > 0;

  const strapiSlide = hasStrapiSlide
    ? {
      id: 1,
      image: {
        url: heroData.image.url,
        alt: heroData.image?.alt ?? '',
        width: heroData.image?.width ?? 1920,
        height: heroData.image?.height ?? 1080,
      },
      heading: heroData.heading,
      subheading: Array.isArray(heroData.subheading) ? heroData.subheading : [],
      cta: heroData.cta && typeof heroData.cta === 'object' ? heroData.cta : { href: '#', text: 'Know More' },
      hasContent: true,
    }
    : null;

  // Prepare slides data (Strapi slide + static slides; skip slide 1 if Strapi data missing)
  const slides = [
    ...(strapiSlide ? [strapiSlide] : []),
    {
      id: 2,
      image: {
        url: '/assets/images/our-story/banner.png',
        alt: 'Made in India - The Story of Desh Bandhu Gupta, Lupin and Indian Pharma',
        width: 1920,
        height: 1080,
      },
      imageMobile: {
        url: '/assets/images/our-story/banner-mobile.png',
        alt: 'Made in India - The Story of Desh Bandhu Gupta, Lupin and Indian Pharma',
        width: 800,
        height: 1200,
      },
      quote: '"Some journeys are measured in kilometers. Others are measured in lives changed."',
      heading: [
        'This is the story of one man and his unique journey',
        'This is the Lupin Story',
      ],
      cta: { href: '/about-us/our-story', text: 'Know More' },
      hasContent: true,
      slideVariant: 'story',
    },
    {
      id: 3,
      image: {
        url: '/assets/images/ir/ir-banner.png',
        alt: 'People. Performance. Possibilities. Driven by Purpose. - Investor Relations',
        width: 1920,
        height: 1080,
      },
      imageMobile: {
        url: '/assets/images/ir/ir-mbl.png',
        alt: 'People. Performance. Possibilities. Driven by Purpose. - Investor Relations',
        width: 800,
        height: 1200,
      },
      heading: ['Integrated Report 2024–2025'],
      cta: { href: '/investors/reports-filings#integrated-report-annual-report', text: 'Know More' },
      hasContent: true,
      slideVariant: 'story',
    },
    {
      id: 4,
      image: {
        url: '/assets/images/sustainability/banner.png',
        alt: 'Sustainability - World No. 1 in pharmaceutical industry',
        width: 1920,
        height: 1080,
      },
      imageMobile: {
        url: '/assets/images/sustainability/banner-mobile.png',
        alt: 'Sustainability - World No. 1 in pharmaceutical industry',
        width: 800,
        height: 1200,
      },
      heading: ['With S&P Global ESG Score of 91, we are', 'World No. 1'],
      subheading: [
        'in sustainability in the pharmaceutical industry',
        // 'Score as on February 7, 2026',
      ],
      cta: { href: '/sustainability', text: 'Know More' },
      hasContent: true,
      slideVariant: 'sustainability',
    },

  ];

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="hero">
      {/* Background with Gradients - Shared across all slides */}
      <div className="hero__bg">
        {/* Base green background */}
        <div className="hero__bg-base"></div>

        {/* Gradient texture with color dodge blend */}
        <div className="hero__bg-texture">
          <Image
            src="/assets/gradient-texture.png"
            alt=""
            width={1914}
            height={1860}
            quality={100}
          />
        </div>

        {/* Diagonal gradient overlay */}
        <div className="hero__bg-gradient-diagonal"></div>

        {/* Top gradient overlay with multiply blend */}
        <div className="hero__bg-gradient-top"></div>

        {/* Petals decoration */}
        <div className="hero__bg-petals">
          <Image
            src="/assets/petals-decoration.svg"
            alt=""
            width={709}
            height={726}
            quality={100}
          />
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        speed={1000}
        className="hero__swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className={`hero__slide ${slide.hasContent ? 'hero__slide--with-content' : 'hero__slide--full-image'}${slide.slideVariant ? ` hero__slide--${slide.slideVariant}` : ''}`}
          >
            {/* Hero Image */}
            {slide.hasContent ? (
              <div className="hero__image-wrapper">
                {slide.imageMobile ? (
                  <>
                    <span className="hero__image-slot hero__image-slot--desktop">
                      <Image
                        src={slide.image.url}
                        alt={slide.image.alt}
                        width={slide.image.width}
                        height={slide.image.height}
                        className="hero__image"
                        priority={slide.id === 1}
                        quality={100}
                        unoptimized={true}
                      />
                    </span>
                    <span className="hero__image-slot hero__image-slot--mobile">
                      <Image
                        src={slide.imageMobile.url}
                        alt={slide.imageMobile.alt}
                        width={slide.imageMobile.width}
                        height={slide.imageMobile.height}
                        className="hero__image"
                        quality={100}
                        unoptimized={true}
                      />
                    </span>
                  </>
                ) : (
                  <Image
                    src={slide.image.url}
                    alt={slide.image.alt}
                    width={slide.image.width}
                    height={slide.image.height}
                    className="hero__image"
                    priority={slide.id === 1}
                    quality={100}
                    unoptimized={true}
                  />
                )}
              </div>
            ) : (
              <Link href={slide.link || '#'} className="hero__image-wrapper hero__image-wrapper--link">
                {/* Desktop image */}
                <span className="hero__image-slot hero__image-slot--desktop">
                  <Image
                    src={slide.image.url}
                    alt={slide.image.alt}
                    width={slide.image.width}
                    height={slide.image.height}
                    className="hero__image hero__image--fullscreen"
                    quality={100}
                    unoptimized={true}
                  />
                </span>
                {/* Mobile image (when provided) */}
                {slide.imageMobile && (
                  <span className="hero__image-slot hero__image-slot--mobile">
                    <Image
                      src={slide.imageMobile.url}
                      alt={slide.imageMobile.alt}
                      width={slide.imageMobile.width}
                      height={slide.imageMobile.height}
                      className="hero__image hero__image--fullscreen"
                      quality={100}
                      unoptimized={true}
                    />
                  </span>
                )}
              </Link>
            )}

            {/* Content - Only for first slide */}
            {slide.hasContent && (
              <div className="hero__content">
                {/* Heading and CTA */}
                <div className="hero__main">
                  <div className="hero__text">
                    {slide.quote && (
                      <blockquote className="hero__quote">{slide.quote}</blockquote>
                    )}
                    <div className="hero__heading">
                      {(slide.heading || []).map((line, index) => (
                        <span key={index} className="hero__heading-line">
                          {line}
                          {index < (slide.heading || []).length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    {(slide.subheading || []).length > 0 && (
                      <p className="hero__subheading">
                        {(slide.subheading || []).map((line, index) => (
                          <span key={index} className="hero__subheading-line">{line}</span>
                        ))}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={slide.cta?.href ?? '#'} className="hero__cta">
                    <span className="hero__cta-text">{slide.cta?.text ?? 'Know More'}</span>
                  </Link>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

