'use client';

import { useState } from 'react';
import ExchangeFilingsLinks from '@/components/ExchangeFilingsLinks';
import '@/scss/components/ExchangeFilings.scss';

/**
 * ExchangeFilings - Component for Exchange Filings (Board meeting) section with tabs
 * 
 * @param {string} title - Section title (optional)
 * @param {Array} tabs - Array of tab labels
 * @param {Object} tabsData - Object mapping tab values to their content data
 * @param {string} className - Additional CSS classes (optional)
 */
export default function ExchangeFilings({ 
  title = "Exchange Filings (Board Meeting)",
  tabs = [],
  tabsData = {},
  className = '',
  id: sectionId
}) {
  // Normalize tabs to always have id, label, and value
  const normalizedTabs = tabs.map((tab, index) => {
    if (typeof tab === 'string') {
      return {
        id: index + 1,
        label: tab,
        value: tab
      };
    }
    return {
      id: tab.id || index + 1,
      label: tab.label || tab.value || String(tab.id),
      value: tab.value || tab.label || String(tab.id)
    };
  });

  // Initialize with first tab if available
  const getInitialActiveTab = () => {
    return normalizedTabs[0]?.id || null;
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [slideDirection, setSlideDirection] = useState('right'); // 'left' or 'right'
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabClick = (tab) => {
    if (tab.id === activeTab || isAnimating) return;
    
    // Determine slide direction based on tab index
    const currentTabIndex = normalizedTabs.findIndex(t => t.id === activeTab);
    const newTabIndex = normalizedTabs.findIndex(t => t.id === tab.id);
    
    if (currentTabIndex !== -1 && newTabIndex !== -1) {
      // If moving to a higher index (e.g., 2025 -> 2024), slide from right
      // If moving to a lower index (e.g., 2024 -> 2025), slide from left
      setSlideDirection(newTabIndex > currentTabIndex ? 'right' : 'left');
    }
    
    setIsAnimating(true);
    setActiveTab(tab.id);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match CSS animation duration
  };

  if (normalizedTabs.length === 0) {
    return null;
  }

  // Get the active tab value
  const activeTabValue = normalizedTabs.find(tab => tab.id === activeTab)?.value || null;

  // Get the data for the active tab
  const activeTabData = tabsData[activeTabValue] || null;

  return (
    <section id={sectionId || undefined} className={`exchange-filings ${className}`}>
      <div className="exchange-filings__container">
        {title && (
          <h2 className="exchange-filings__title">{title}</h2>
        )}
        <div className="exchange-filings__tabs">
          {normalizedTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`exchange-filings__tab ${
                activeTab === tab.id ? 'exchange-filings__tab--active' : ''
              }`}
              onClick={() => handleTabClick(tab)}
              aria-label={`Select ${tab.label} tab`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className="exchange-filings__tab-text">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Show content area for the active tab */}
        <div 
          key={activeTabValue}
          className={`exchange-filings__content exchange-filings__content--slide-${slideDirection}`}
        >
          {/* Render content based on tabsData */}
          {activeTabData?.cards && (
            <ExchangeFilingsLinks cards={activeTabData.cards} />
          )}
          {activeTabData?.content && !activeTabData?.cards && activeTabData.content}
        </div>
      </div>
    </section>
  );
}

