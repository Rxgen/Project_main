'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/OurStoryAlternatingSection.scss';

export default function OurStoryAlternatingSection({ 
  image, 
  text, 
  imageAlt, 
  isEven = false,
  isLast = false,
  quoteText,
  quoteAuthor
}) {
  return (
    <section className={`our-story-alternating ${isEven ? 'our-story-alternating--even' : 'our-story-alternating--odd'} ${isLast ? 'our-story-alternating--last' : ''}`}>
      <div className="our-story-alternating__container">
        {/* Image - Left for odd, Right for even */}
        <div className="our-story-alternating__image-wrapper">
          <div className="our-story-alternating__image-container">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="our-story-alternating__image"
              quality={100}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Text Panel - Right for odd, Left for even */}
        <div className="our-story-alternating__content-wrapper">
          <div className="our-story-alternating__content">
            {isLast && quoteText && (
              <>
                <div className="our-story-alternating__quote-top">
                  <Image
                    src="/assets/images/our-story/topquote.svg"
                    alt=""
                    width={87}
                    height={68}
                    quality={100}
                  />
                </div>
                <div className="our-story-alternating__quote-text">
                  <p className="our-story-alternating__quote-content">{quoteText}</p>
                  {quoteAuthor && (
                    <p className="our-story-alternating__quote-author">— {quoteAuthor}</p>
                  )}
                </div>
                <div className="our-story-alternating__quote-bottom">
                  <Image
                    src="/assets/images/our-story/bottomquote.svg"
                    alt=""
                    width={87}
                    height={68}
                    quality={100}
                  />
                </div>
              </>
            )}
            <div className="our-story-alternating__text">
              {typeof text === 'string' ? <p>{text}</p> : <p>{text}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

