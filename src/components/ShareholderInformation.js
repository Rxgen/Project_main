'use client';

import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/ShareholderInformation.scss';

export default function ShareholderInformation({ data }) {
  // Default data (will be replaced by Strapi)
  const shareholderData = data || {
    title: "Shareholder Information",
    centerImage: {
      url: "/assets/shareholder-information/center-image.png",
      alt: "Shareholder Information"
    },
    leftColumn: [
      {
        text: "Annual General Meeting and Postal Ballot",
        href: "https://www.lupin.com/annual-general-meeting-and-postal-ballot/"
      },
      {
        text: "Notices",
        href: "https://www.lupin.com/investors/notices/"
      },
      {
        text: "Share Information",
        href: "https://www.lupin.com/investors/share-price/"
      },
      {
        text: "Shareholding Pattern",
        href: "https://www.lupin.com/investors/shareholding-pattern/"
      },
      {
        text: "Dividend",
        href: "https://www.lupin.com/investors/dividend/"
      },
      {
        text: "Unclaimed Dividend and Shares",
        href: "https://www.lupin.com/investors/unclaimed-dividend/"
      },
      {
        text: "IEPF – Saksham Niveshak",
        href: "https://www.lupin.com/investors/iepf-saksham-niveshak/"
      }
    ],
    rightColumn: [
      {
        text: "Other statutory information",
        href: "https://www.lupin.com/investors/other-statutory-information/"
      },
      {
        text: "Transfer of Physical Shares (Re-lodgement)",
        href: "https://www.lupin.com/investors/transfer-of-physical-shares-re-lodgement/"
      },
      {
        text: "Tips for shareholders",
        href: "https://www.lupin.com/investors/tips-for-shareholders/"
      },
      {
        text: "Subsidiaries",
        href: "https://www.lupin.com/investors/subsidiaries/"
      },
      {
        text: "Earnings",
        href: "https://www.lupin.com/investors/reports-filings/"
      },
      {
        text: "ESG Ratings",
        href: "https://www.lupin.com/wp-content/uploads/2025/12/lupin-esg-ratings-2025-december.pdf",
        download: true
      },
      {
        text: "Disclosure under Regulation 46 of SEBI Regulations, 2015",
        href: "https://www.lupin.com/investors/disclosure-under-regulation-46-of-sebi-regulations-2015/"
      }
    ]
  };

  // Helper function to render a list of links
  const renderLinks = (links, columnClass) => {
    if (!links || !Array.isArray(links)) return null;
    
    return (
      <div className={`shareholder-information__column ${columnClass}`}>
        {links.map((link, index) => {
          // Support both string and object format
          const linkText = typeof link === 'string' ? link : link.text || link.label || '';
          const linkHref = typeof link === 'object' ? (link.href || link.url || '#') : '#';
          const isDownload = typeof link === 'object' && link.download;
          
          // For PDF download links, use anchor tag instead of Next.js Link
          if (isDownload) {
            return (
              <a
                key={index}
                href={linkHref}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="shareholder-information__link"
              >
                <span className="shareholder-information__link-text">{linkText}</span>
                <svg
                  className="shareholder-information__arrow"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 12L12 1M12 1H1M12 1V12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            );
          }
          
          return (
            <Link
              key={index}
              href={linkHref}
              className="shareholder-information__link"
            >
              <span className="shareholder-information__link-text">{linkText}</span>
              <svg
                className="shareholder-information__arrow"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12L12 1M12 1H1M12 1V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <section id="shareholding-information" className="shareholder-information" data-node-id="2216:875">
      <div className="shareholder-information__container">
        {/* Title */}
        {shareholderData.title && (
          <h2 className="shareholder-information__title">
            {shareholderData.title}
          </h2>
        )}

        {/* Content Grid */}
        <div className="shareholder-information__content">
          {/* Left Column */}
          {renderLinks(shareholderData.leftColumn, 'shareholder-information__column--left')}

          {/* Center Image */}
          {shareholderData.centerImage && (
            <div className="shareholder-information__image-wrapper">
              <Image
                src={shareholderData.centerImage.url}
                alt={shareholderData.centerImage.alt || ""}
                fill
                className="shareholder-information__image"
                quality={100}
              />
            </div>
          )}

          {/* Right Column */}
          {renderLinks(shareholderData.rightColumn, 'shareholder-information__column--right')}
        </div>
      </div>
    </section>
  );
}

