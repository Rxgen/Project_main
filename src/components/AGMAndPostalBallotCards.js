'use client';

import BigCard from '@/components/global/BigCard';
import '@/scss/components/AGMAndPostalBallotCards.scss';

/**
 * AGMAndPostalBallotCards - Component for displaying PDF download cards using BigCard
 * 
 * @param {Array} cards - Array of card data objects
 * @param {string} className - Additional CSS classes (optional)
 */
export default function AGMAndPostalBallotCards({ 
  cards = [],
  className = '' 
}) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className={`agm-postal-ballot-cards ${className}`}>
      {cards.map((card, index) => (
        <BigCard
          key={card.id || index}
          centerLink={card.centerLink || card.pdfUrl || '#'}
          pdfUrl={card.pdfUrl || card.centerLink || '#'}
          isActive={card.isActive || false}
          centerText={card.title || card.centerText || ''}
          className="agm-postal-ballot-cards__big-card"
        />
      ))}
    </div>
  );
}

