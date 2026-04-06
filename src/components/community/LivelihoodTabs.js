'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import KeyHighlights from '@/components/community/KeyHighlights';
import MarketQuote from '@/components/community/MarketQuote';
import '@/scss/components/community/LivelihoodTabs.scss';

// Tab content component that renders from Strapi data
const TabContent = ({ contentData }) => {
  if (!contentData || typeof contentData !== 'object') {
    return null;
  }

  const { heading, paragraphs, image, imagePosition } = contentData;
  const isImageLeft = imagePosition === 'Left';

  return (
    <div className="livelihood-tabs__panel-content">
      {isImageLeft && image && (
        <div className="livelihood-tabs__panel-right">
          <div className="livelihood-tabs__panel-image-wrapper">
            <Image
              src={image.url}
              alt={image.alt || 'Tab Image'}
              width={image.width || 600}
              height={image.height || 600}
              className="livelihood-tabs__panel-image"
              quality={100}
            />
          </div>
        </div>
      )}
      <div className="livelihood-tabs__panel-left">
        <div className="livelihood-tabs__panel-text">
          {heading && (
            <h2 className="livelihood-tabs__panel-heading">
              {heading}
            </h2>
          )}
          {paragraphs && paragraphs.length > 0 && (
            <div className="livelihood-tabs__panel-paragraphs">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="livelihood-tabs__panel-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      {!isImageLeft && image && (
        <div className="livelihood-tabs__panel-right">
          <div className="livelihood-tabs__panel-image-wrapper">
            <Image
              src={image.url}
              alt={image.alt || 'Tab Image'}
              width={image.width || 600}
              height={image.height || 600}
              className="livelihood-tabs__panel-image"
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Agriculture tab content component (with Strapi support)
const AgricultureTabContent = ({ contentData }) => {
  if (!contentData || typeof contentData !== 'object') {
    return null;
  }

  const { heading, paragraphs, image, imagePosition, highlights, quote } = contentData;
  const isImageLeft = imagePosition === 'Left';

  return (
    <>
      <div className="livelihood-tabs__panel-content">
        {isImageLeft && image && (
          <div className="livelihood-tabs__panel-right">
            <div className="livelihood-tabs__panel-image-wrapper">
              <Image
                src={image.url}
                alt={image.alt || 'Tab Image'}
                width={image.width || 600}
                height={image.height || 600}
                className="livelihood-tabs__panel-image"
                quality={100}
              />
            </div>
          </div>
        )}
        <div className="livelihood-tabs__panel-left">
          <div className="livelihood-tabs__panel-text">
            {heading && (
              <h2 className="livelihood-tabs__panel-heading">
                {heading}
              </h2>
            )}
            {paragraphs && paragraphs.length > 0 && (
              <div className="livelihood-tabs__panel-paragraphs">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="livelihood-tabs__panel-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        {!isImageLeft && image && (
          <div className="livelihood-tabs__panel-right">
            <div className="livelihood-tabs__panel-image-wrapper">
              <Image
                src={image.url}
                alt={image.alt || 'Tab Image'}
                width={image.width || 600}
                height={image.height || 600}
                className="livelihood-tabs__panel-image"
                quality={100}
              />
            </div>
          </div>
        )}
      </div>
      {highlights && highlights.length > 0 && (
        <KeyHighlights highlights={highlights} />
      )}
      {quote && (
        <MarketQuote quoteData={quote} />
      )}
    </>
  );
};

export default function LivelihoodTabs({ tabs = [] }) {
  // SVG icons for each tab
  const getTabIcon = (tabId) => {
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('getTabIcon called with tabId:', tabId, 'type:', typeof tabId);
    }
    
    // Convert to number if it's a string
    const numericTabId = typeof tabId === 'string' ? parseInt(tabId, 10) : tabId;
    
    switch (numericTabId) {
      case 1:
        return (
          <svg width="209" height="209" viewBox="0 0 209 209" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6.44282" y="6.44379" width="195.379" height="195.379" rx="97.6896" fill="#00AD4D" className="livelihood-tabs__svg-rect"/>
            <rect x="6.44282" y="6.44379" width="195.379" height="195.379" rx="97.6896" stroke="white" strokeWidth="12.8858"/>
            <path d="M130.399 99.4016C130.116 99.4016 129.875 99.2864 129.655 99.1502H130.011C134.872 98.9512 139.513 97.1284 143.179 93.9647C142.142 96.7513 140.173 99.035 137.596 100.533C134.914 99.7264 132.368 99.454 130.399 99.4016ZM86.4214 79.351C87.1338 79.1729 87.8985 78.9529 88.6842 78.6805C90.3394 78.1044 91.9527 77.3292 93.5764 76.3654C94.7602 73.9245 96.5306 72.0075 98.4791 70.1637C98.7829 69.9438 99.0762 69.5561 99.4743 69.5666C97.9972 71.138 97.3162 73.6312 96.6353 75.6845C96.4572 76.1978 96.4153 76.8054 96.3525 77.3816C96.3525 77.413 96.3734 77.4339 96.3734 77.4654C96.3944 78.5653 96.5725 80.3043 97.3163 82.2528C97.7143 83.2794 98.2381 84.2746 98.8771 85.186C98.9505 85.3012 99.0657 85.3327 99.139 85.3431C99.2019 85.3431 99.3276 85.3431 99.4533 85.2384C100.375 84.4003 101.192 83.4575 101.884 82.4414C102.753 81.1528 103.392 79.7596 103.853 78.1777C103.874 78.1149 103.906 78.0625 103.937 77.9996C104.105 76.0197 104.398 74.1236 104.89 72.196C105.299 74.0084 105.98 76.0826 106.744 77.853C107.425 79.0996 108.274 80.3252 109.269 81.509C109.73 82.0537 110.201 82.5461 110.673 83.007C110.82 83.1537 110.977 83.1328 111.081 83.0909C111.186 83.0489 111.322 82.9651 111.343 82.7556C111.448 81.5195 111.542 80.3043 111.605 79.1205C111.815 75.2969 110.201 71.6199 107.352 69.1476C106.954 68.8019 106.472 68.5086 106.053 68.1943C104.922 67.3458 103.727 66.4972 102.428 65.9001C102.261 65.8268 101.831 65.5439 101.653 65.5754C102.753 65.3973 103.916 65.5125 105.037 65.6173C105.205 65.6592 105.414 65.6801 105.613 65.7115C106.388 64.2449 106.975 62.8516 107.3 61.5841C107.593 60.4213 107.3 59.248 106.462 58.368C105.634 57.4881 104.471 57.1004 103.277 57.3309C101.59 57.6452 100.375 59.1537 100.449 60.8298C100.501 61.9717 100.428 63.3021 100.239 64.7687C100.134 65.5544 99.4743 66.1306 98.6781 66.1306C98.6257 66.1306 98.5838 66.1306 98.5314 66.1306C97.9343 66.1306 97.3372 66.1934 96.7506 66.3191C91.9212 67.3039 88.1814 70.918 86.9767 75.7578C86.9033 76.0511 86.7252 76.6797 85.95 78.8482C85.8977 78.9948 85.9186 79.131 86.0234 79.2358C86.0967 79.3196 86.2329 79.4034 86.4319 79.351H86.4214ZM103.979 107.342C105.309 107.217 106.734 107.08 108.18 107.007C109.95 106.913 110.966 107.185 111.71 107.374C112.527 107.583 113.009 107.698 114.685 107.112C114.706 107.091 114.727 107.07 114.758 107.059L119.933 104.147L116.969 109.291C116.916 109.375 116.854 109.437 116.791 109.511C116.55 110.056 116.256 110.6 115.932 111.187C115.387 112.161 114.769 113.261 114.591 114.162C114.193 116.111 114.235 117.881 114.444 119.515L114.654 119.086C116.55 115.346 119.284 112.014 122.542 109.375L123.925 104.933L125.276 109.249L126.208 109.846C129.414 111.91 132.18 114.55 134.421 117.682C134.275 116.55 134.013 115.346 133.583 114.089C133.018 112.465 132.222 110.946 131.163 109.469C131.059 109.375 130.954 109.28 130.86 109.155L127.214 104.032L132.557 106.598C132.609 106.619 132.672 106.619 132.724 106.64C135.804 107.95 140.225 107.646 140.267 107.636C140.476 107.615 140.696 107.646 140.895 107.719L145.4 109.27C140.927 103.718 134.285 102.639 130.336 102.534C129.089 102.502 127.937 101.989 127.088 101.088C126.25 100.187 125.8 99.014 125.852 97.7779C125.947 95.2218 125.789 92.9171 125.381 90.9267C125.203 90.0677 124.627 89.3763 123.809 89.0516C122.971 88.7163 122.071 88.8211 121.316 89.3344C120.415 89.9525 120.028 90.9163 120.227 91.8486C120.667 93.9019 120.667 96.3113 120.593 97.956C120.541 99.1293 120.028 100.208 119.148 101.004C118.226 101.832 116.958 102.241 115.733 102.188C108.976 101.801 104.607 104.975 101.748 107.552C102.491 107.499 103.266 107.426 103.989 107.353L103.979 107.342ZM144.311 112.224L140.152 110.789C139.408 110.82 137.564 110.862 135.49 110.569C135.888 111.375 136.234 112.193 136.538 113.052C137.92 117.064 137.837 120.667 137.533 122.993C137.449 123.643 136.957 124.177 136.318 124.324C135.679 124.47 135.008 124.198 134.652 123.632C134.652 123.622 133.489 121.83 131.981 119.672C129.948 116.781 127.434 114.361 124.501 112.475L124.029 112.172C121.316 114.476 119.053 117.336 117.451 120.5L115.041 125.235C114.769 125.769 114.224 126.094 113.638 126.094C113.543 126.094 113.449 126.094 113.355 126.073C112.674 125.947 112.15 125.403 112.066 124.711C111.993 124.051 111.857 123.349 111.731 122.605C111.301 120.154 110.746 117.106 111.49 113.513C111.689 112.538 112.129 111.574 112.59 110.684C111.982 110.663 111.459 110.558 110.893 110.401C110.254 110.234 109.604 110.066 108.305 110.129C106.912 110.192 105.54 110.328 104.251 110.454C103.225 110.548 102.292 110.632 101.412 110.684C97.0125 114.204 94.6868 118.939 94.6868 124.397C94.6868 137.02 106.933 147.276 121.987 147.276C137.04 147.276 149.287 137.01 149.287 124.397C149.287 119.651 147.59 115.566 144.269 112.224H144.311ZM97.2639 110.275C96.7715 110.035 96.4363 109.563 96.3839 109.018C96.3315 108.474 96.562 107.939 97.002 107.604C97.3477 107.342 97.7667 106.944 98.2696 106.462C99.9457 104.87 102.46 102.502 106.022 100.858C107.258 95.4208 108.242 90.0572 108.861 85.5108C108.735 85.4165 108.599 85.3536 108.494 85.2384C107.96 84.7251 107.425 84.1489 106.881 83.5308C106.472 83.0489 106.084 82.5566 105.718 82.0538C105.362 82.7871 104.953 83.4994 104.492 84.1699C103.665 85.406 102.68 86.5374 101.569 87.5431C100.92 88.1402 100.061 88.4649 99.1914 88.4649C99.0657 88.4649 98.9295 88.4649 98.7933 88.444C97.7877 88.3287 96.8867 87.7945 96.3106 86.9669C95.5249 85.846 94.8754 84.6308 94.383 83.3527C93.9221 82.1585 93.6497 81.0271 93.4716 80.0214C92.225 80.6605 90.9784 81.1947 89.7108 81.6452C88.8309 81.949 87.9928 82.1899 87.1967 82.389C87.1233 82.4099 87.05 82.3995 86.9767 82.4099C82.3673 93.9333 72.6039 108.117 64.4223 115.084C60.8396 118.132 58.6606 122.406 58.3045 127.11C57.9483 131.845 59.4463 136.434 62.5576 140.027C66.2346 144.28 71.5458 146.501 77.1609 146.124C82.7444 145.746 87.6995 142.834 90.7479 138.141C91.7327 136.633 92.665 135.093 93.5764 133.553C92.3193 130.693 91.5965 127.623 91.5965 124.386C91.5965 118.939 93.5659 114.12 97.2848 110.265L97.2639 110.275Z" fill="white"/>
          </svg>
        );
      case 2:
        return (
          <svg width="209" height="209" viewBox="0 0 209 209" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6.44282" y="6.44379" width="195.379" height="195.379" rx="97.6896" fill="#00AD4D" className="livelihood-tabs__svg-rect"/>
            <rect x="6.44282" y="6.44379" width="195.379" height="195.379" rx="97.6896" stroke="white" strokeWidth="12.8858"/>
            <path d="M92.7843 149.359C77.4236 149.243 64.9988 136.818 64.8857 121.457C64.8857 115.017 70.0151 103.133 79.724 87.0884C84.9817 78.3968 90.2944 70.6432 92.992 66.7969C95.6896 70.6462 101.002 78.3968 106.26 87.0884C115.969 103.133 121.101 115.017 121.101 121.457C120.985 136.98 108.31 149.472 92.7843 149.359Z" fill="white"/>
            <path d="M128.4 98.0146C121.124 97.9596 115.238 92.0742 115.185 84.7981C115.185 81.7476 117.614 76.1183 122.213 68.518C124.704 64.401 127.22 60.7282 128.498 58.9062C129.776 60.7296 132.292 64.401 134.783 68.518C139.382 76.1183 141.813 81.7476 141.813 84.7981C141.758 92.1509 135.754 98.0682 128.4 98.0146Z" fill="white"/>
          </svg>
        );
      case 3:
        return (
          <svg width="209" height="209" viewBox="0 0 209 209" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6.44282" y="6.44379" width="195.379" height="195.379" rx="97.6896" fill="#00AD4D" className="livelihood-tabs__svg-rect"/>
            <rect x="6.44282" y="6.44379" width="195.379" height="195.379" rx="97.6896" stroke="white" strokeWidth="12.8858"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M130.649 64.8817C127.112 61.4237 122.35 59.5055 117.405 59.5355H117.39C112.021 59.5467 106.922 61.8845 103.412 65.9457C99.9013 61.8845 94.8023 59.5467 89.4336 59.5355H89.4186C84.4733 59.5055 79.719 61.4275 76.1823 64.8817C72.1249 68.9354 70.1767 73.4125 70.3978 78.1892C70.9785 90.7362 86.65 103.234 95.7127 110.765C98.2978 112.912 100.737 114.938 102.719 116.748C103.112 117.108 103.715 117.108 104.112 116.748C106.094 114.938 108.533 112.912 111.115 110.765C120.177 103.234 135.853 90.7399 136.433 78.1892C136.654 73.4125 134.706 68.9354 130.649 64.8817Z" fill="white"/>
            <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M125.114 146.543L125.047 139.574V139.514C125.047 139.514 125.129 135.944 129.07 131.973C135.484 125.517 140.411 120.786 143.191 116.511C145.607 112.802 146.057 110.322 146.139 106.186C146.165 104.784 146.154 94.4966 146.147 88.8881V88.6371C146.109 87.9253 145.81 87.2472 145.304 86.7376C144.791 86.2244 144.097 85.9247 143.371 85.8984H143.033C141.628 85.9509 140.456 87.0111 140.28 88.4161L138.335 103.994C138.137 105.612 137.369 107.111 136.17 108.216L122.529 120.842L122.469 120.902C122.218 121.119 121.836 121.1 121.604 120.864C121.368 120.617 121.368 120.231 121.604 119.988L121.652 119.939L129.49 112.034C130.902 110.61 130.94 108.329 129.58 106.856L129.535 106.811C128.239 105.41 126.077 105.234 124.571 106.414L115.482 113.532L115.354 113.63C115.291 113.679 106.756 119.965 106.314 129.2C106.299 129.526 106.295 130.905 106.295 131.276C106.277 135.85 106.288 142.568 106.295 146.202" fill="white"/>
            <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M95.4351 145.91C95.4388 142.216 95.4501 135.734 95.4351 131.284C95.4351 130.913 95.4313 129.534 95.4163 129.208C94.9705 119.969 86.436 113.683 86.3761 113.638L86.2487 113.54L77.1597 106.422C75.6537 105.242 73.4919 105.418 72.1957 106.819L72.1507 106.864C70.7907 108.336 70.8319 110.622 72.2406 112.042L80.0783 119.947L80.127 119.995C80.363 120.239 80.363 120.625 80.127 120.872C79.8947 121.112 79.5125 121.127 79.2615 120.91L79.2016 120.85L65.5606 108.224C64.3618 107.115 63.5975 105.62 63.3952 104.002L61.4507 88.4239C61.2747 87.019 60.102 85.955 58.6971 85.9062H58.3599C57.6331 85.9325 56.94 86.2322 56.4267 86.7455C55.9209 87.2512 55.6212 87.9331 55.5875 88.6449V88.8959C55.5763 94.5044 55.565 104.789 55.5913 106.193C55.6737 110.33 56.1233 112.81 58.5397 116.519C61.3234 120.793 66.25 125.525 72.6602 131.98C76.6015 135.948 76.6839 139.522 76.6839 139.522V139.582L76.8235 146.556" fill="white"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Transform Strapi tabs data to component format
  const transformTabsData = (strapiTabs) => {
    if (!strapiTabs || !Array.isArray(strapiTabs)) {
      return null;
    }

    return strapiTabs.map((tab) => {
      // If tab has content object from Strapi, use appropriate component
      let content = null;
      if (tab.content && typeof tab.content === 'object') {
        // For tab id 1 (Agriculture), use AgricultureTabContent with Strapi data
        if (tab.id === 1) {
          content = <AgricultureTabContent contentData={tab.content} />;
        } else {
          // For other tabs, use TabContent and add KeyHighlights and MarketQuote if available
          const { highlights, quote, ...sectionContent } = tab.content;
          content = (
            <>
              <TabContent contentData={sectionContent} />
              {highlights && highlights.length > 0 && (
                <KeyHighlights highlights={highlights} />
              )}
              {quote && (
                <MarketQuote quoteData={quote} />
              )}
            </>
          );
        }
      }

      return {
        id: tab.id,
        title: tab.title,
        content: content
      };
    });
  };

  // Don't render if no tabs data
  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Use Strapi data
  const transformedTabs = transformTabsData(tabs);
  if (!transformedTabs) {
    return null;
  }
  
  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Transformed tabs:', transformedTabs);
    console.log('Tab IDs:', transformedTabs.map(t => ({ id: t.id, title: t.title })));
  }
  
  const tabsData = transformedTabs;
  const [activeTab, setActiveTab] = useState(tabsData[0]?.id || 1);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <section className="livelihood-tabs">
      <div className="livelihood-tabs__container">
        <div className="livelihood-tabs__list">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`livelihood-tabs__item ${
                activeTab === tab.id ? 'livelihood-tabs__item--active' : ''
              }`}
              onClick={() => handleTabClick(tab.id)}
              aria-label={`Select ${tab.title} tab`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <div className="livelihood-tabs__icon">
                <div className="livelihood-tabs__icon-circle">
                  <div className="livelihood-tabs__icon-image">
                    {(() => {
                      // Use index-based icon mapping (1, 2, 3) instead of Strapi ID
                      const iconIndex = tabsData.findIndex(t => t.id === tab.id) + 1;
                      if (process.env.NODE_ENV === 'development') {
                        console.log('Rendering icon for tab:', { tabId: tab.id, iconIndex, title: tab.title });
                      }
                      return getTabIcon(iconIndex);
                    })()}
                  </div>
                </div>
              </div>
              <div className="livelihood-tabs__text">
                <span className="livelihood-tabs__title">
                  {typeof tab.title === 'string' && tab.title.includes('\n') ? (
                    tab.title.split('\n').map((line, index, array) => (
                      <span key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    tab.title
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="livelihood-tabs__content">
          {tabsData.map((tab) => (
            <div
              key={tab.id}
              className={`livelihood-tabs__panel ${
                activeTab === tab.id ? 'livelihood-tabs__panel--active' : ''
              }`}
              role="tabpanel"
              aria-hidden={activeTab !== tab.id}
            >
              {tab.content ? (
                tab.content
              ) : (
                <div className="livelihood-tabs__placeholder">
                  Content for {typeof tab.title === 'string' ? tab.title.split('\n')[0] : tab.title} will be added here.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

