'use client';

import { useState, useEffect } from 'react';
import NavigationLinks from './NavigationLinks';
import '../scss/components/InvestorFAQs.scss';

export default function InvestorFAQs({ faqs = [], error = null }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(5); // Show first 5 FAQs initially

  // Expand first FAQ by default when FAQs are loaded
  useEffect(() => {
    if (faqs.length > 0 && expandedItems.size === 0) {
      setExpandedItems(new Set([faqs[0].id]));
    }
  }, [faqs, expandedItems.size]);

  // Load more FAQs (show 4 more)
  const loadMoreFAQs = () => {
    setVisibleCount(prev => Math.min(prev + 4, faqs.length));
  };

  const toggleFAQ = (id) => {
    setExpandedItems(prev => {
      // If clicking the same item that's already expanded, close it
      if (prev.has(id)) {
        return new Set();
      }
      // Otherwise, expand only this item (close all others)
      return new Set([id]);
    });
  };

  // Show error state if API failed
  if (error) {
    return (
      <section className="investor-faqs">
        <div className="investor-faqs__bg"></div>
        <div className="investor-faqs__container">
          <NavigationLinks />
          <div className="investor-faqs__list">
            <div className="investor-faqs__placeholder">
              <p>Unable to load FAQs at this time. Please try again later.</p>
              {process.env.NODE_ENV === 'development' && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!faqs || faqs.length === 0) {
    return (
      <section className="investor-faqs">
        <div className="investor-faqs__bg"></div>
        <div className="investor-faqs__container">
          <NavigationLinks />
          <div className="investor-faqs__list">
            <div className="investor-faqs__placeholder">
              <p>No FAQs available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="investor-faqs">
      {/* Background */}
      <div className="investor-faqs__bg"></div>

      {/* Container */}
      <div className="investor-faqs__container">
        {/* Navigation Links */}
        <NavigationLinks />

        {/* FAQ Items */}
        <div className="investor-faqs__list">
          {faqs.slice(0, visibleCount).map((faq) => {
            const isExpanded = expandedItems.has(faq.id);
            return (
              <div key={faq.id} className={`investor-faqs__item ${isExpanded ? 'investor-faqs__item--expanded' : ''}`}>
                <button
                  className="investor-faqs__item-header"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isExpanded}
                >
                  <h2 className="investor-faqs__item-question">{faq.question}</h2>
                  <span className="investor-faqs__item-icon">{isExpanded ? '−' : '+'}</span>
                </button>
                {isExpanded && (
                  <div className="investor-faqs__item-answer">
                    <div 
                      style={{ whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                )}
                {!isExpanded && <div className="investor-faqs__item-divider"></div>}
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        {visibleCount < faqs.length && (
          <div className="investor-faqs__view-all">
            <button
              onClick={loadMoreFAQs}
              className="investor-faqs__view-all-link"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

