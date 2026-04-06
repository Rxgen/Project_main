'use client';

import { useState } from 'react';
import '@/scss/components/global/Tabs.scss';

/**
 * Tabs - Reusable tabs component for navigation and content filtering
 * Based on Figma design: https://www.figma.com/design/QNIbuokNouJSBEY7GUGsEI/Jash---Final-Home-page-auto-layout--Copy-?node-id=2300-583
 * 
 * @param {string} title - Title displayed above tabs (optional)
 * @param {Array} tabs - Array of tab objects with { id, label, value } or just string labels
 * @param {string|number} defaultActiveTab - ID or value of default active tab (optional, defaults to first tab)
 * @param {function} onChange - Callback function when tab changes (optional)
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * // Basic usage with string labels
 * <Tabs 
 *   title="Quarterly Results"
 *   tabs={['FY 2025-26', 'FY 2024-25', 'FY 2023-24']}
 *   onChange={(tab) => console.log('Selected:', tab)}
 * />
 * 
 * @example
 * // Usage with objects
 * <Tabs 
 *   title="Reports"
 *   tabs={[
 *     { id: 1, label: 'Quarterly', value: 'quarterly' },
 *     { id: 2, label: 'Annual', value: 'annual' }
 *   ]}
 *   defaultActiveTab={2}
 *   onChange={(tab) => handleTabChange(tab)}
 * />
 */
export default function Tabs({ 
  title,
  tabs = [],
  defaultActiveTab = null,
  onChange,
  className = '' 
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

  // Determine initial active tab
  const getInitialActiveTab = () => {
    if (defaultActiveTab !== null) {
      const found = normalizedTabs.find(
        tab => tab.id === defaultActiveTab || 
               tab.value === defaultActiveTab || 
               tab.label === String(defaultActiveTab)
      );
      return found ? found.id : normalizedTabs[0]?.id || null;
    }
    return normalizedTabs[0]?.id || null;
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());

  const handleTabClick = (tab) => {
    if (tab.id !== activeTab) {
      setActiveTab(tab.id);
      if (onChange) {
        onChange(tab);
      }
    }
  };

  if (normalizedTabs.length === 0) {
    return null;
  }

  return (
    <div className={`tabs ${className}`}>
      {title && (
        <h2 className="tabs__title">{title}</h2>
      )}
      <div className="tabs__container">
        {normalizedTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tabs__tab ${
              activeTab === tab.id ? 'tabs__tab--active' : ''
            }`}
            onClick={() => handleTabClick(tab)}
            aria-label={`Select ${tab.label} tab`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="tabs__tab-text">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

