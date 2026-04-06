'use client';

import SmallCard from '@/components/global/SmallCard';
import '@/scss/components/AnnualReturns.scss';

/**
 * AnnualReturns - Component for Annual Returns section
 * 
 * @param {string} title - Section title (optional)
 * @param {Array} cards - Array of card data objects with { id, title, pdfUrl, isActive }
 * @param {string} className - Additional CSS classes (optional)
 */
export default function AnnualReturns({ 
  title = "Annual Returns",
  cards = [],
  className = '' 
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={`annual-returns ${className}`}>
      <div className="annual-returns__container">
        {title && (
          <h2 className="annual-returns__title">{title}</h2>
        )}
        <div className="annual-returns__cards-grid">
          {cards.map((card, index) => (
            <SmallCard
              key={card.id || index}
              title={card.title}
              pdfUrl={card.pdfUrl || '#'}
              isActive={card.isActive || false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}






