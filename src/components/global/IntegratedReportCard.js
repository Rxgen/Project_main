'use client';

import Link from 'next/link';
import Image from 'next/image';
import '@/scss/components/global/IntegratedReportCard.scss';

/**
 * IntegratedReportCard - Standalone component for Integrated Report/Annual Report card
 * Based on middleCard from ReportsAndFilings component
 * 
 * @param {Array|string} title - Card title (can be array for multiple lines or string)
 * @param {Object} image - Image object with { url, alt }
 * @param {Array} buttons - Array of button objects with { label, href, variant: 'outline' | 'filled' }
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <IntegratedReportCard 
 *   title={["Integrated", "Report 2025"]}
 *   image={{ url: "/assets/reports-filings/circle.png", alt: "Integrated Report 2025" }}
 *   buttons={[
 *     { label: "Download Now", href: "#", variant: "outline" },
 *     { label: "View all", href: "#", variant: "filled" }
 *   ]}
 * />
 */
export default function IntegratedReportCard({ 
  title,
  image,
  buttons = [],
  className = '',
  year = null // Year/tab value for static image mapping (e.g., "2025", "2024", "2023")
}) {
  // Don't render if no data provided
  if (!title && !image && (!buttons || buttons.length === 0)) {
    return null;
  }

  // Map year to static image file
  // Available images: 2025.webp, 2024.webp, 2023.webp, etc.
  const getStaticImageByYear = (yearValue) => {
    if (!yearValue) {
      return {
        url: "/assets/reports-filings/2025.webp",
        alt: "Integrated Report"
      };
    }
    
    // Extract year from string (e.g., "2025", "FY 2024-25" -> "2024", "2023")
    const yearMatch = String(yearValue).match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : String(yearValue);
    
    return {
      url: `/assets/reports-filings/${year}.webp`,
      alt: `Integrated Report ${year}`
    };
  };

  // Map year to static PDF file
  // Available PDFs: 25.pdf (2025), 24.pdf (2024), 23.pdf (2023), 22.pdf (2022), 21.pdf (2021)
  const getStaticPdfByYear = (yearValue) => {
    if (!yearValue) {
      return "/assets/reports-filings/25.pdf"; // Default to latest
    }
    
    // Extract year from string (e.g., "2025", "FY 2024-25" -> "2024", "2023")
    const yearMatch = String(yearValue).match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : String(yearValue);
    
    // Get last 2 digits of year for PDF file name
    // 2025 -> 25, 2024 -> 24, 2023 -> 23, 2022 -> 22, 2021 -> 21
    const pdfNumber = year.slice(-2);
    
    return `/assets/reports-filings/${pdfNumber}.pdf`;
  };

  // Use static image based on year/tab value
  const displayImage = getStaticImageByYear(year);
  
  // Get PDF URL based on year/tab value
  const pdfUrl = getStaticPdfByYear(year);

  // TODO: Uncomment when ready to use dynamic images from Strapi
  // Use provided image from Strapi if valid, otherwise use static image by year
  // const displayImage = (image && image.url && typeof image.url === 'string' && image.url.trim() !== '') 
  //   ? image 
  //   : getStaticImageByYear(year);

  return (
    <div className={`integrated-report-card ${className}`}>
      <div className="integrated-report-card__image-wrapper">
        <Image
          src={displayImage.url}
          alt={displayImage.alt || "Integrated Report"}
          width={600}
          height={600}
          className="integrated-report-card__image"
          quality={100}
        />
      </div>
      <div className="integrated-report-card__content">
        {title && (
          <h3 className="integrated-report-card__title">
            {Array.isArray(title) ? (
              // If title is an array, render each line
              title.map((line, index) => (
                <span key={index} className="integrated-report-card__title-line">
                  {line}
                </span>
              ))
            ) : typeof title === 'string' ? (
              // If title is a string, split by newline
              title.split('\n').map((line, index) => (
                <span key={index} className="integrated-report-card__title-line">
                  {line.trim()}
                </span>
              ))
            ) : null}
          </h3>
        )}
        {/* Static PDF buttons from public/assets/reports-filings folder */}
        <div className="integrated-report-card__buttons">
          {/* Download Now button - links to PDF based on selected year/tab */}
          {/* 2025 -> 25.pdf, 2024 -> 24.pdf, 2023 -> 23.pdf, 2022 -> 22.pdf, 2021 -> 21.pdf */}
          <Link
            href={pdfUrl}
            className="integrated-report-card__button integrated-report-card__button--outline-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Now
          </Link>
          
          {/* View all button - links to reports-filings page */}
          <Link
            href="/investors/reports-filings"
            className="integrated-report-card__button integrated-report-card__button--filled-white"
          >
            View all
            <svg
              className="integrated-report-card__button-arrow"
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 10L10 1M10 1H1M10 1V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Dynamic buttons code - commented out for now, using static PDFs instead */}
        {/* {buttons && buttons.length > 0 && (
          <div className="integrated-report-card__buttons">
            {buttons.map((button, index) => {
              // Check if button link is a PDF
              const isPdfLink = (button.href || '').toLowerCase().includes('.pdf') || 
                               button.type === 'pdf';
              
              return (
                <Link
                  key={index}
                  href={button.href || "#"}
                  className={`integrated-report-card__button ${
                    button.variant === 'filled' 
                      ? 'integrated-report-card__button--filled-white' 
                      : 'integrated-report-card__button--outline-white'
                  }`}
                  target={isPdfLink ? "_blank" : undefined}
                  rel={isPdfLink ? "noopener noreferrer" : undefined}
                >
                {button.label}
                {button.variant === 'filled' && (
                  <svg
                    className="integrated-report-card__button-arrow"
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 10L10 1M10 1H1M10 1V10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                </Link>
              );
            })}
          </div>
        )} */}
      </div>
    </div>
  );
}

