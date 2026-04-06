'use client';

import { useState } from 'react';
import Tabs from '@/components/global/Tabs';
import QuarterlyResultsList from '@/components/QuarterlyResultsList';
import SmallCard from '@/components/global/SmallCard';
import '@/scss/components/QuarterlyResultsList.scss';

/**
 * QuarterlyResultsWithTabs - Wrapper component that combines Tabs and QuarterlyResultsList
 * Shows quarterly results list for the active tab with different data for each tab
 * 
 * @param {Array} tabs - Array of tab labels
 * @param {Object} tabsData - Object mapping tab values to their quarterly data
 * @param {Array} quarterlyItems - Array of quarterly result items (legacy - for first tab only)
 * @param {Array} cards - Array of card items (legacy - for first tab only)
 * @param {Array} quarterlyItemsAfterCards - Array of quarterly result items (legacy - for first tab only)
 * @param {Array} cardsAfterQ2 - Array of card items (legacy - for first tab only)
 * @param {string} className - Additional CSS classes (optional)
 */
export default function QuarterlyResultsWithTabs({ 
  tabs = [],
  tabsData = {},
  quarterlyItems = [],
  cards = [],
  quarterlyItemsAfterCards = [],
  cardsAfterQ2 = [],
  className = '' 
}) {
  // Initialize with first tab value
  const [activeTabValue, setActiveTabValue] = useState(tabs[0] || null);

  const handleTabChange = (tab) => {
    setActiveTabValue(tab.value);
  };

  // Get data for the active tab - USE ONLY API DATA, NO FALLBACK
  const activeTabData = tabsData[activeTabValue];
  
  // Use tabsData if available - NO FALLBACK TO LEGACY PROPS
  // If no activeTabData, use empty arrays to ensure no static data is shown
  const displayData = activeTabData || {
    quarterlyItems: [],
    cards: [],
    quarterlyItemsAfterCards: [],
    cardsAfterQ2: []
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('QuarterlyResultsWithTabs - Display data:', {
      activeTabValue,
      hasActiveTabData: !!activeTabData,
      quarterlyItemsCount: displayData.quarterlyItems?.length || 0,
      cardsCount: displayData.cards?.length || 0,
      quarterlyItemsAfterCardsCount: displayData.quarterlyItemsAfterCards?.length || 0,
      cardsAfterQ2Count: displayData.cardsAfterQ2?.length || 0,
      quarterlyItems: displayData.quarterlyItems,
      quarterlyItemsAfterCards: displayData.quarterlyItemsAfterCards
    });
  }

  // Show quarterly results list for the active tab
  const shouldShowQuarterlyResults = activeTabValue && tabs.includes(activeTabValue);

  return (
    <div className={className}>
      <section className="reports-filings-tabs">
        <div className="reports-filings-tabs__container">
          <Tabs 
            title="Quarterly Results"
            tabs={tabs}
            onChange={handleTabChange}
          />
        </div>
      </section>
      
      {shouldShowQuarterlyResults && (
        <>
          {/* Use new quarters structure if available, otherwise fall back to legacy */}
          {displayData.quarters && displayData.quarters.length > 0 ? (
            // New structure: Loop through each quarter separately
            displayData.quarters.map((quarter, quarterIndex) => (
              <div key={quarterIndex}>
                {/* Quarterly Results List for this quarter */}
                {quarter.items && quarter.items.length > 0 && (
                  <QuarterlyResultsList items={quarter.items} />
                )}
                
                {/* Small Cards Section for this quarter */}
                {quarter.cards && quarter.cards.length > 0 && (
                  <section className="quarterly-results-cards">
                    <div className="quarterly-results-cards__container">
                      <div className="quarterly-results-cards__grid">
                        {quarter.cards.map((card, index) => {
                          if (process.env.NODE_ENV === 'development') {
                            console.log(`QuarterlyResultsWithTabs - Rendering Q${quarterIndex + 1} card:`, {
                              quarterIndex,
                              index,
                              id: card.id,
                              title: card.title,
                              pdfUrl: card.pdfUrl,
                              isActive: card.isActive
                            });
                          }
                          return (
                            <SmallCard
                              key={card.id || `${quarterIndex}-${index}`}
                              title={card.title}
                              pdfUrl={card.pdfUrl || '#'}
                              isActive={card.isActive || false}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}
              </div>
            ))
          ) : (
            // Legacy structure: Q1 separate, Q2-Q4 grouped
            <>
              {/* First Quarterly Results List (Q1) */}
              {displayData.quarterlyItems && displayData.quarterlyItems.length > 0 && (
                <QuarterlyResultsList items={displayData.quarterlyItems} />
              )}
              
              {/* Small Cards Section for Q1 */}
              {displayData.cards && displayData.cards.length > 0 && (
                <section className="quarterly-results-cards">
                  <div className="quarterly-results-cards__container">
                    <div className="quarterly-results-cards__grid">
                      {displayData.cards.map((card, index) => (
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
              )}

              {/* Second Quarterly Results List (Q2-Q4) - After Cards */}
              {displayData.quarterlyItemsAfterCards && displayData.quarterlyItemsAfterCards.length > 0 && (
                <QuarterlyResultsList items={displayData.quarterlyItemsAfterCards} />
              )}

              {/* Small Cards Section for Q2-Q4 */}
              {displayData.cardsAfterQ2 && displayData.cardsAfterQ2.length > 0 && (
                <section className="quarterly-results-cards">
                  <div className="quarterly-results-cards__container">
                    <div className="quarterly-results-cards__grid">
                      {displayData.cardsAfterQ2.map((card, index) => (
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

