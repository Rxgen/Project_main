'use client';

import { useState } from 'react';
import IntegratedReportCard from '@/components/global/IntegratedReportCard';
import ExtraSmallCard from '@/components/global/ExtraSmallCard';
import '@/scss/components/IntegratedReportAnnualReport.scss';

/**
 * IntegratedReportAnnualReport - Component for Integrated Report/Annual Report section with tabs
 * 
 * @param {string} title - Section title (optional)
 * @param {Array} tabs - Array of tab labels
 * @param {Object} tabsData - Object mapping tab values to their content data (cardData and extraSmallCards)
 * @param {string} className - Additional CSS classes (optional)
 */
export default function IntegratedReportAnnualReport({ 
  title = "Integrated Report/Annual Report",
  tabs = [],
  tabsData = {},
  className = '',
  id: sectionId = 'integrated-report-annual-report'
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
  const cardData = activeTabData?.cardData || null;
  const extraSmallCards = activeTabData?.extraSmallCards || [];

  return (
    <section id={sectionId} className={`integrated-report-annual-report ${className}`}>
      <div className="integrated-report-annual-report__container">
        {title && (
          <h2 className="integrated-report-annual-report__title">{title}</h2>
        )}
        <div className="integrated-report-annual-report__tabs">
          {normalizedTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`integrated-report-annual-report__tab ${
                activeTab === tab.id ? 'integrated-report-annual-report__tab--active' : ''
              }`}
              onClick={() => handleTabClick(tab)}
              aria-label={`Select ${tab.label} tab`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className="integrated-report-annual-report__tab-text">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Show content when there is data for the active tab */}
        {activeTabData && cardData && (
          <div 
            key={activeTabValue}
            className={`integrated-report-annual-report__card-wrapper integrated-report-annual-report__card-wrapper--slide-${slideDirection}`}
          >
            {/* Left Side - Integrated Report Card */}
            <div className="integrated-report-annual-report__left">
              <IntegratedReportCard
                title={cardData.title}
                image={cardData.image}
                buttons={cardData.buttons}
                year={activeTabValue} // Pass the year/tab value for static image mapping
              />
            </div>
            
            {/* Right Side - Extra Small Cards */}
            {extraSmallCards.length > 0 && (
              <div className="integrated-report-annual-report__right">
                <div className="integrated-report-annual-report__cards-grid">
                  {extraSmallCards.map((card, index) => (
                    <ExtraSmallCard
                      key={card.id || index}
                      title={card.title}
                      pdfUrl={card.pdfUrl || '#'}
                      isActive={card.isActive || false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

