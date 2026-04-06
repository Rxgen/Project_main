'use client';

import { useState, useEffect } from 'react';
import AGMAndPostalBallotCards from '@/components/AGMAndPostalBallotCards';
import '@/scss/components/AGMAndPostalBallot.scss';

/**
 * AGMAndPostalBallot - Component for AGM and Postal Ballot sections with tabs
 * 
 * @param {string} title - Section title (e.g., "AGM" or "Postal Ballot")
 * @param {Array} tabs - Array of tab labels (e.g., ['FY 2025-26', 'FY 2024-25'])
 * @param {Object} tabsData - Object mapping tab values to their content data
 * @param {string} noticeText - Optional notice text (for Postal Ballot section)
 * @param {string} className - Additional CSS classes (optional)
 * @param {function} onActiveTabChange - Optional callback(activeTabValue) when tab changes
 */
export default function AGMAndPostalBallot({ 
  title = "AGM",
  tabs = [],
  tabsData = {},
  noticeText = null,
  className = '',
  onActiveTabChange = null
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
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);

  // Get the active tab value (or use empty string if no tabs)
  const activeTabValue = normalizedTabs.length > 0 
    ? (normalizedTabs.find(tab => tab.id === activeTab)?.value || null)
    : '';

  // Notify parent when active tab value changes
  useEffect(() => {
    if (typeof onActiveTabChange === 'function') {
      onActiveTabChange(activeTabValue);
    }
  }, [activeTabValue, onActiveTabChange]);

  const handleTabClick = (tab) => {
    if (tab.id === activeTab || isAnimating) return;
    
    // Determine slide direction based on tab index
    const currentTabIndex = normalizedTabs.findIndex(t => t.id === activeTab);
    const newTabIndex = normalizedTabs.findIndex(t => t.id === tab.id);
    
    if (currentTabIndex !== -1 && newTabIndex !== -1) {
      setSlideDirection(newTabIndex > currentTabIndex ? 'right' : 'left');
    }
    
    setIsAnimating(true);
    setActiveTab(tab.id);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Get the data for the active tab (or use empty string key if no tabs)
  const activeTabData = tabsData[activeTabValue] || null;

  return (
    <section className={`agm-postal-ballot ${className}`}>
      <div className="agm-postal-ballot__container">
        {title && (
          <h2 className="agm-postal-ballot__title">{title}</h2>
        )}
        
        {normalizedTabs.length > 0 && (
          <div className="agm-postal-ballot__tabs">
            {normalizedTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`agm-postal-ballot__tab ${
                  activeTab === tab.id ? 'agm-postal-ballot__tab--active' : ''
                }`}
                onClick={() => handleTabClick(tab)}
                aria-label={`Select ${tab.label} tab`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <span className="agm-postal-ballot__tab-text">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {noticeText && (
          <p className="agm-postal-ballot__notice">{noticeText}</p>
        )}

        {/* Show content area for the active tab */}
        <div 
          key={activeTabValue}
          className={`agm-postal-ballot__content ${normalizedTabs.length > 0 ? `agm-postal-ballot__content--slide-${slideDirection}` : ''}`}
        >
          {/* Render PDF cards based on tabsData */}
          {activeTabData?.cards && (
            <AGMAndPostalBallotCards cards={activeTabData.cards} />
          )}
        </div>
      </div>
    </section>
  );
}

