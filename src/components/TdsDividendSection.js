'use client';

import Image from 'next/image';
import BigCard from '@/components/global/BigCard';
import '@/scss/components/TdsDividendSection.scss';

/**
 * TdsDividendSection - Section for TDS on Dividend Payout
 * 
 * @param {Object} data - Data from Strapi API
 * @param {string} error - Error message if API failed
 */
export default function TdsDividendSection({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="tds-dividend-section">
        <div className="tds-dividend-section__container">
          <div className="tds-dividend-section__content">
            <div className="tds-dividend-section__placeholder">
              <p>Unable to load TDS dividend information at this time. Please try again later.</p>
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
  if (!data) {
    return (
      <section className="tds-dividend-section">
        <div className="tds-dividend-section__container">
          <div className="tds-dividend-section__content">
            <div className="tds-dividend-section__placeholder">
              <p>No TDS dividend information available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Extract data with fallbacks
  const heading = data.heading || "TDS on Dividend Payout";
  const subHeading = data.subHeading || "Communication in Respect of Deduction of Tax at Source on Dividend Payout";
  const cardText = data.description || data.pdfCard?.title || subHeading;
  const pdfUrl = data.pdfCard?.pdfUrl || "#";
  const isActive = data.pdfCard?.isActive !== false;
  const downloadButtonActive = "/assets/policies/download-button-active.svg";
  const downloadButtonInactive = "/assets/policies/download-button-inactive.svg";

  // Split heading into two lines if it contains "TDS on" and "Dividend Payout"
  const headingParts = heading.split(/(?=Dividend)/i);
  const titleLine1 = headingParts[0]?.trim() || "TDS on";
  const titleLine2 = headingParts[1]?.trim() || "Dividend Payout";

  // Split subtitle if it's long
  const subtitleParts = subHeading.split(/(?=Tax at Source)/i);
  const subtitleLine1 = subtitleParts[0]?.trim() || "Communication in Respect of Deduction of";
  const subtitleLine2 = subtitleParts[1]?.trim() || "Tax at Source on Dividend Payout";
  return (
    <section className="tds-dividend-section">
      {/* Decorative SVG */}
    
      <div className="tds-dividend-section__container">
        <div className="tds-dividend-section__content">
        <div className="tds-dividend-section__decorative">
        <Image
          src="/assets/dividend/elements.svg"
          alt=""
          width={1169}
          height={394}
          className="tds-dividend-section__decorative-img"
          quality={100}
        />
      </div>
          {/* Left side - Title and Subtitle */}
          <div className="tds-dividend-section__left">
            <h2 className="tds-dividend-section__title">
              <span>{titleLine1} </span>
              {titleLine2 && <span>{titleLine2}</span>}
            </h2>
            {/* <p className="tds-dividend-section__subtitle">
              <span>{subtitleLine1} </span>
              {subtitleLine2 && <span>{subtitleLine2}</span>}
            </p> */}
          </div>

          {/* Right side - Card and Download */}
          <div className="tds-dividend-section__right">
            <BigCard
              centerLink={pdfUrl}
              pdfUrl={pdfUrl}
              isActive={isActive}
              downloadButtonActive={downloadButtonActive}
              downloadButtonInactive={downloadButtonInactive}
              centerText={cardText}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

