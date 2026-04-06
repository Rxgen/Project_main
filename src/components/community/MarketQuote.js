'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/community/MarketQuote.scss';

export default function MarketQuote({ quoteData = null }) {
  // Don't render if no quote data
  if (!quoteData) {
    return null;
  }

  const quote = quoteData;

  return (
    <section className="market-quote">
      <div className="market-quote__container">
        <div className="market-quote__content">
          <div className="market-quote__image-wrapper">
            {quote?.image && (
              <div className="market-quote__image-circle">
                <Image
                  src={quote.image.url}
                  alt={quote.image.alt || quote?.author || 'Quote Image'}
                  width={332}
                  height={330}
                  className="market-quote__image"
                  quality={100}
                />
              </div>
            )}
            <div className="market-quote__author-info">
              {quote?.author && (
                <p className="market-quote__author-name">{quote.author}</p>
              )}
              {quote?.designation && (
                <p className="market-quote__author-designation">{quote.designation}</p>
              )}
            </div>
          </div>
          <div className="market-quote__text-wrapper">
            <div className="market-quote__quote-mark market-quote__quote-mark--open">
              <Image
                src="/assets/community/top-quote.svg"
                alt=""
                width={135}
                height={100}
                className="market-quote__quote-mark-image"
              />
            </div>
            <div className="market-quote__text-container">
              {quote?.quote && (
                <blockquote className="market-quote__text">
                  {quote.quote}
                </blockquote>
              )}
              <div className="market-quote__quote-mark market-quote__quote-mark--close">
                <Image
                  src="/assets/community/bottom-quote.svg"
                  alt=""
                  width={135}
                  height={100}
                  className="market-quote__quote-mark-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

