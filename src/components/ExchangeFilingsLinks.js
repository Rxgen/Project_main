'use client';

import Link from 'next/link';
import '@/scss/components/ExchangeFilingsLinks.scss';

/**
 * ExchangeFilingsLinks - Component for displaying exchange filing links in cards
 * Groups links into sets of 5, with each set in its own container
 * 
 * @param {Array} cards - Array of card data, each containing an array of links
 * @param {string} className - Additional CSS classes (optional)
 */
export default function ExchangeFilingsLinks({ 
  cards = [],
  className = '' 
}) {
  if (!cards || cards.length === 0) {
    return null;
  }

  // Flatten all links from all cards into a single array
  const allLinks = cards.reduce((acc, card) => {
    if (card.links && Array.isArray(card.links)) {
      return [...acc, ...card.links];
    }
    return acc;
  }, []);

  if (allLinks.length === 0) {
    return null;
  }

  // Group links into chunks of 5
  const linksPerContainer = 5;
  const linkChunks = [];
  for (let i = 0; i < allLinks.length; i += linksPerContainer) {
    linkChunks.push(allLinks.slice(i, i + linksPerContainer));
  }

  return (
    <div className={`exchange-filings-links ${className}`}>
      {linkChunks.map((linkChunk, chunkIndex) => (
        <div key={chunkIndex} className="exchange-filings-links__card">
          <div className="exchange-filings-links__links-container">
            {linkChunk.map((link, linkIndex) => {
              // First link in the first chunk gets special styling
              const isFirstLink = chunkIndex === 0 && linkIndex === 0;
              const linkText = typeof link === 'string' ? link : (link.text || link.label || '');
              const linkHref = typeof link === 'object' ? (link.href || link.url || '#') : '#';
              
              // Check if link is a PDF (ends with .pdf or contains pdf)
              const isPdfLink = linkHref.toLowerCase().includes('.pdf') || 
                                (typeof link === 'object' && link.type === 'pdf');
              
              return (
                <Link
                  key={linkIndex}
                  href={linkHref}
                  className={`exchange-filings-links__link ${
                    isFirstLink ? 'exchange-filings-links__link--first' : ''
                  }`}
                  target={isPdfLink ? "_blank" : undefined}
                  rel={isPdfLink ? "noopener noreferrer" : undefined}
                >
                  <span className="exchange-filings-links__link-text">{linkText}</span>
                  <svg
                    className={`exchange-filings-links__arrow ${
                      isFirstLink ? 'exchange-filings-links__arrow--large' : ''
                    }`}
                    width={isFirstLink ? "14" : "13"}
                    height={isFirstLink ? "14" : "13"}
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12L12 1M12 1H1M12 1V12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}






