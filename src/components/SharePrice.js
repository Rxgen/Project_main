'use client';

import NavigationLinks from './NavigationLinks';
import '../scss/components/SharePrice.scss';

const DEFAULT_IFRAME_URL = "https://content.dionglobal.in/lupinworldnew/SharePriceMovement.aspx";
const DEFAULT_IFRAME_TITLE = "Share Price";

// Tabs for share price page (excludes Subsidiaries)
const SHARE_PRICE_LINKS = [
  { id: 'share-price', label: 'Share Price', href: '/investors/share-price' },
  { id: 'analyst-coverage', label: 'Analyst Coverage', href: '/investors/analyst-coverage' },
  { id: 'shareholding-pattern', label: 'Shareholding Pattern', href: '/investors/shareholding-pattern' },
  { id: 'dividend', label: 'Dividend', href: '/investors/dividend' },
  { id: 'unclaimed-dividend', label: 'Unclaimed Dividend and Shares', href: '/investors/unclaimed-dividend' },
  { id: 'memorandum', label: 'Memorandum and Articles of Association', href: '/assets/share-price/Lupin-Revised-MOA-AOA-Lupin-Limited.pdf', target: '_blank' },
  { id: 'investor-faqs', label: 'Investor FAQs', href: '/investors/investor-faqs' },
  { id: 'business-responsibility', label: 'Business Responsibility', href: '/assets/share-price/business-responsiblity-report.pdf', target: '_blank' }
];

export default function SharePrice({ data, error = null }) {
  // Show error state if API failed (but still show iframe if available)
  const base = data || {};
  const sharePriceData = {
    ...base,
    iframeUrl: base.iframeUrl?.trim() || DEFAULT_IFRAME_URL,
    iframeTitle: base.iframeTitle?.trim() || DEFAULT_IFRAME_TITLE,
    shareCapital: base.shareCapital ?? null,
    listingOfSecurities: base.listingOfSecurities ?? null
  };

  return (
    <section className="share-price">
      {/* Container */}
      <div className="share-price__container">
        {/* Navigation Links - excludes Subsidiaries on share price page */}
        <NavigationLinks links={SHARE_PRICE_LINKS} />
      </div>

      {/* Info Boxes Section - Full Width */}
      {(sharePriceData.shareCapital || sharePriceData.listingOfSecurities) && (
        <div className="share-price__info-boxes-wrapper">
          <div className="share-price__info-boxes">
            {/* Share Capital Box */}
            {sharePriceData.shareCapital && (
              <div className="share-price__info-box">
                <h2 className="share-price__info-title">{sharePriceData.shareCapital.title}</h2>
                <div className="share-price__info-card">
                  <div 
                    className="share-price__info-text"
                    dangerouslySetInnerHTML={{ __html: sharePriceData.shareCapital.content }}
                  />
                </div>
              </div>
            )}

            {/* Listing of Securities Box */}
            {sharePriceData.listingOfSecurities && (
              <div className="share-price__info-box">
                <h2 className="share-price__info-title">{sharePriceData.listingOfSecurities.title}</h2>
                <div className="share-price__info-card">
                  <div 
                    className="share-price__info-text"
                    dangerouslySetInnerHTML={{ __html: sharePriceData.listingOfSecurities.content }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Container */}
      <div className="share-price__container">
        {/* Iframe Section */}
        <h2 className="share-price__iframe-heading">Share Price</h2>
        <div className="share-price__iframe-wrapper">
          {sharePriceData.iframeUrl ? (
            <iframe
              src={sharePriceData.iframeUrl}
              title={sharePriceData.iframeTitle}
              className="share-price__iframe"
              allowFullScreen
            />
          ) : (
            <div className="share-price__placeholder">
              <p>Share price iframe content will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

