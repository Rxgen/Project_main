'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/IndiaTherapySection.scss';

export default function IndiaTherapySection({ data }) {
  // Default tabs data - fallback if no data from API
  const defaultTabs = [
    { id: 'anti-tb', label: 'Anti-Tuberculosis (TB)' },
    { id: 'respiratory', label: 'Respiratory' },
    { id: 'anti-diabetes', label: 'Anti-Diabetes' },
    { id: 'cardiology', label: 'Cardiology' },
    { id: 'womens-health-1', label: "Women's Health" },
    { id: 'gastrointestinal', label: 'Gastrointestinal' },
    { id: 'oncology', label: 'Oncology' },
    { id: 'pain-management', label: 'Pain Management' },
    { id: 'anti-infectives', label: 'Anti-Infectives' },
    { id: 'vitamins', label: 'Vitamins/Minerals/Nutrients' },
    { id: 'ophthalmology', label: 'Ophthalmology' },
    { id: 'urology', label: 'Urology' },
    { id: 'womens-health-2', label: "Women's Health" },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'bone-muscle', label: 'Bone and Muscle Health' }
  ];

  // Get content data from props or use default
  const contentData = data?.content || {};

  // Generate tabs from content data or use defaults
  let tabs = defaultTabs;
  if (contentData && Object.keys(contentData).length > 0) {
    tabs = Object.keys(contentData).map(key => ({
      id: key,
      label: contentData[key].heading || contentData[key].title || key
    }));
  }

  // Set default active tab to first available tab or 'respiratory'
  const defaultActiveTab = tabs.length > 0 ? tabs[0].id : 'respiratory';
  const [activeTabId, setActiveTabId] = useState(defaultActiveTab);

  const activeContent = contentData[activeTabId] || null;

  return (
    <section className="india-therapy-section" data-node-id="3071:3897">
      <div className="india-therapy-section__container">
        <div className="india-therapy-section__tabs-container">
          <div className="india-therapy-section__tabs-row">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`india-therapy-section__tab ${activeTabId === tab.id ? 'india-therapy-section__tab--active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {activeContent && (
          <div className="india-therapy-section__content">
            <div className="india-therapy-section__text-content">
              <div className="india-therapy-section__heading-wrapper">
                <div className="india-therapy-section__icon">
                  <Image
                    src="/assets/images/india/whitepointer.svg"
                    alt=""
                    width={31}
                    height={31}
                    className="india-therapy-section__icon-image"
                  />
                </div>
                <h2 className="india-therapy-section__heading">
                  {activeContent.heading}
                </h2>
              </div>
              <div className="india-therapy-section__description">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children }) => (
                      <p className="india-therapy-section__description-paragraph">{children}</p>
                    ),
                  }}
                >
                  {activeContent.description || ''}
                </ReactMarkdown>
              </div>
            </div>
            {activeContent.image?.url && activeContent.image.url.trim() !== '' && (
              <div className="india-therapy-section__image-wrapper">
                <div className="india-therapy-section__image-container">
                  <Image
                    src={activeContent.image.url}
                    alt={activeContent.image.alt || activeContent.heading || 'Therapy image'}
                    width={786}
                    height={591}
                    className="india-therapy-section__image"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
