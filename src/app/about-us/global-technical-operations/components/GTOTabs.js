'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

/**
 * GTOTabs - Tabs component for Global Technical Operations
 * 
 * @param {Array} tabs - Array of tab objects from Strapi with structure:
 *   { id, label, dataNodeId, sections: [{ heading, paragraphs, image, link }] }
 * @param {string} defaultActiveTab - Default active tab ID (optional)
 */
export default function GTOTabs({ tabs: propTabs = null, defaultActiveTab = null }) {
  // Default tabs (fallback if no Strapi data)
  const defaultTabs = [
    {
      id: 'manufacturing',
      label: 'Manufacturing',
      dataNodeId: '2852:339',
      sections: []
    },
    {
      id: 'procurement',
      label: 'Procurement',
      dataNodeId: '2852:342',
      sections: []
    },
    {
      id: 'supply-chain',
      label: 'Supply Chain',
      dataNodeId: '2852:345',
      sections: []
    }
  ];

  // Use Strapi data if available, otherwise use defaults
  const tabs = propTabs && propTabs.length > 0 ? propTabs : defaultTabs;

  // Determine initial active tab
  const getInitialActiveTab = () => {
    if (defaultActiveTab) {
      return defaultActiveTab;
    }
    return tabs[0]?.id || 'manufacturing';
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());

  return (
    <div className="global-technical-operations-tabs-wrapper">
      <div className="global-technical-operations-tabs" data-node-id="2852:338">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <h3
              key={tab.id}
              className={`global-technical-operations-tabs__tab global-technical-operations-tabs__tab--${index + 1} ${isActive ? 'global-technical-operations-tabs__tab--active' : ''}`}
              data-node-id={tab.dataNodeId}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="global-technical-operations-tabs__tab-bg"></div>
              <p className="global-technical-operations-tabs__tab-text">
                {tab.label}
              </p>
            </h3>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="global-technical-operations-tabs__content">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          if (!isActive) return null;

          // Use the same content class for all tabs to maintain consistent spacing
          // This ensures Procurement and Supply Chain have the same padding, gap, and background as Manufacturing
          const contentClass = 'global-technical-operations-tabs__content-manufacturing';

          // If no sections from Strapi, show placeholder or default content
          if (!tab.sections || tab.sections.length === 0) {
            // For other tabs (Procurement, Supply Chain), show empty state with same structure
            // This ensures consistent layout even when no data is available
            return (
              <div key={tab.id} className={contentClass}>
                <div className="global-technical-operations-tabs__content-placeholder">
                  <p>Content for {tab.label} will be added here</p>
                </div>
              </div>
            );
          }

          // Render sections from Strapi
          return (
            <div key={tab.id} className={contentClass}>
              {tab.sections.map((section, sectionIndex) => {
                // Debug: Log section data in development
                if (process.env.NODE_ENV === 'development') {
                  console.log('Section data:', {
                    heading: section.heading,
                    hasDescription: !!(section.Description || section.description),
                    Description: section.Description,
                    description: section.description,
                    allKeys: Object.keys(section)
                  });
                }

                // Determine section class - use manufacturing classes for all tabs to maintain consistent structure
                const sectionClass = `global-technical-operations-tabs__manufacturing-section-${sectionIndex + 1}`;
                // Use imageFirst from Strapi if available, otherwise alternate based on index
                const isImageFirst = section.imageFirst !== undefined
                  ? section.imageFirst
                  : sectionIndex % 2 === 1;

                return (
                  <div key={sectionIndex} className={sectionClass}>
                    {isImageFirst && section.image && (
                      <div className="global-technical-operations-tabs__manufacturing-image-wrapper">
                        <img
                          src={section.image.url}
                          alt={section.image.alt || ''}
                          className="global-technical-operations-tabs__manufacturing-image"
                        />
                      </div>
                    )}

                    <div className="global-technical-operations-tabs__manufacturing-footprint">
                      <div className="global-technical-operations-tabs__manufacturing-heading-text">
                        {section.heading && (
                          <h4 className="global-technical-operations-tabs__manufacturing-heading">
                            {section.heading}
                          </h4>
                        )}
                        {(section.Description || section.description) && (
                          <div className="global-technical-operations-tabs__manufacturing-text">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {section.Description || section.description}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {section.link && section.link.text && (
                        <div className="global-technical-operations-tabs__manufacturing-link">
                          <a
                            href={section.link.href || '#'}
                            className="global-technical-operations-tabs__manufacturing-link-text"
                          >
                            {section.link.text}
                          </a>
                          <img
                            src="/assets/images/gto-arrow.svg"
                            alt=""
                            className="global-technical-operations-tabs__manufacturing-link-icon"
                            width="21"
                            height="21"
                          />
                        </div>
                      )}
                    </div>

                    {!isImageFirst && section.image && (
                      <div className="global-technical-operations-tabs__manufacturing-image-wrapper">
                        <img
                          src={section.image.url}
                          alt={section.image.alt || ''}
                          className="global-technical-operations-tabs__manufacturing-image"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
