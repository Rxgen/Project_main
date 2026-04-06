'use client';

import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/ReportsAndFilings.scss';

export default function ReportsAndFilings({ data }) {
  // Default data (will be replaced by Strapi)
  const reportsData = data || {
    title: "Reports and Filings",
    leftCard: {
      badge: "Q2 FY26",
      items: [
        "Gross Profit : INR 50,066 Mn",
        "Gross profit margin : 73.3%",
        "Investment in R&D : INR 5,091 Mn"
      ],
      buttons: [
        {
          label: "Download Now",
          href: "#"
        },
        {
          label: "View all",
          href: "#"
        }
      ]
    },
    middleCard: {
      title: ["Integrated", "Report 2025"],
      image: {
        url: "/assets/reports-filings/circle.png",
        alt: "Integrated Report 2025"
      },
      buttons: [
        {
          label: "Download Now",
          href: "https://www.lupin.com/wp-content/uploads/2025/07/integrated-report-consolidated.pdf",
          variant: "outline",
          download: true
        },
        {
          label: "View all",
          href: "#",
          variant: "filled"
        }
      ]
    },
    rightCard: {
      badge: "Exchange filings (BSE/NSE)",
      links: [
        {
          text: "Disclosure Dated 20th june 2025",
          href: "https://www.lupin.com/wp-content/uploads/2025/06/disclosure-dated-20th-june-2025.pdf",
          download: true
        },
        {
          text: "BSE / NSE Letter Schedule of Analyst Investors Meet",
          href: "https://www.lupin.com/wp-content/uploads/2025/06/bse-nse-letter-schedule-of-analyst-investors-meet-19-06-2025.pdf",
          download: true
        },
        {
          text: "Change in Directors",
          href: "https://www.lupin.com/wp-content/uploads/2025/05/bse-nse-letter-change-in-director.pdf",
          download: true
        },
        {
          text: "SE Intimation Updates API R&D and OTC Business",
          href: "https://www.lupin.com/wp-content/uploads/2025/04/se-intimation-updates-api-rd-and-otc-business.pdf",
          download: true
        },
        {
          text: "BSE/NSE Letter Acquisition of Renascience Pharma Limited",
          href: "https://www.lupin.com/wp-content/uploads/2025/04/bse-nse-letter-acquisition-of-renascience-pharma-limited.pdf",
          download: true
        }
      ],
      button: {
        label: "View all",
        href: "#"
      }
    }
  };

  return (
    <section className="reports-filings" data-node-id="2333:1456">
      <div className="reports-filings__container">
        {/* Title */}
        {reportsData.title && (
          <h2 className="reports-filings__title">
            {reportsData.title}
          </h2>
        )}

        {/* Cards Grid */}
        <div className="reports-filings__cards">
          {/* Left Card - Q2 FY26 */}
          <div className="reports-filings__card reports-filings__card--left">
            <div className="reports-filings__badge reports-filings__badge--left">
              {reportsData.leftCard.badge}
            </div>
            <div className="reports-filings__card-content">
              <div className="reports-filings__card-items">
                {reportsData.leftCard.items && reportsData.leftCard.items.map((item, index) => (
                  <p key={index} className="reports-filings__card-item">
                    {item}
                  </p>
                ))}
              </div>
              <div className="reports-filings__card-buttons">
                {reportsData.leftCard.buttons && reportsData.leftCard.buttons.map((button, index) => (
                  <Link
                    key={index}
                    href={button.href || "#"}
                    className="reports-filings__button reports-filings__button--outline"
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Card - Integrated Report */}
          <div className="reports-filings__card reports-filings__card--middle">
            {reportsData.middleCard.image && (
              <div className="reports-filings__card-image-wrapper">
                <Image
                  src={reportsData.middleCard.image.url}
                  alt={reportsData.middleCard.image.alt || ""}
                  width={600}
                  height={600}
                  className="reports-filings__card-image"
                  quality={100}
                />
              </div>
            )}
            <div className="reports-filings__card-content reports-filings__card-content--middle">
              {reportsData.middleCard.title && (
                <h3 className="reports-filings__card-title">
                  {Array.isArray(reportsData.middleCard.title) ? (
                    // If title is an array, render each line
                    reportsData.middleCard.title.map((line, index) => (
                      <span key={index} className="reports-filings__card-title-line">
                        {line}
                      </span>
                    ))
                  ) : typeof reportsData.middleCard.title === 'string' ? (
                    // If title is a string, split by newline or split "Integrated Report 2025" into two lines
                    reportsData.middleCard.title.split('\n').map((line, index) => (
                      <span key={index} className="reports-filings__card-title-line">
                        {line.trim()}
                      </span>
                    ))
                  ) : null}
                </h3>
              )}
              <div className="reports-filings__card-buttons reports-filings__card-buttons--middle">
                {reportsData.middleCard.buttons && reportsData.middleCard.buttons.map((button, index) => {
                  // For download buttons (PDFs), use anchor tag instead of Next.js Link
                  if (button.download) {
                    return (
                      <a
                        key={index}
                        href={button.href || "#"}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`reports-filings__button ${
                          button.variant === 'filled' 
                            ? 'reports-filings__button--filled-white' 
                            : 'reports-filings__button--outline-white'
                        }`}
                      >
                        {button.label}
                        {button.variant === 'filled' && (
                          <svg
                            className="reports-filings__button-arrow"
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
                      </a>
                    );
                  }
                  
                  // Regular Link for non-download buttons
                  return (
                    <Link
                      key={index}
                      href={button.href || "#"}
                      className={`reports-filings__button ${
                        button.variant === 'filled' 
                          ? 'reports-filings__button--filled-white' 
                          : 'reports-filings__button--outline-white'
                      }`}
                    >
                      {button.label}
                      {button.variant === 'filled' && (
                        <svg
                          className="reports-filings__button-arrow"
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
            </div>
          </div>

          {/* Right Card - Exchange Filings */}
          <div className="reports-filings__card reports-filings__card--right">
            <div className="reports-filings__badge reports-filings__badge--right">
              {reportsData.rightCard.badge && reportsData.rightCard.badge.split(' ').map((word, index, array) => (
                <span key={index}>
                  {word}
                  {index < array.length - 1 && ' '}
                </span>
              ))}
            </div>
            <div className="reports-filings__card-content reports-filings__card-content--right">
              <div className="reports-filings__card-links">
                {reportsData.rightCard.links && reportsData.rightCard.links.map((link, index) => {
                  // For PDF download links, use anchor tag instead of Next.js Link
                  if (link.download) {
                    return (
                      <a
                        key={index}
                        href={link.href || "#"}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reports-filings__card-link"
                      >
                        <span className="reports-filings__card-link-text">
                          {link.text}
                          <svg
                            className="reports-filings__card-link-arrow"
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
                        </span>
                      </a>
                    );
                  }
                  
                  // Regular Link for non-download links
                  return (
                    <Link
                      key={index}
                      href={link.href || "#"}
                      className="reports-filings__card-link"
                    >
                      <span className="reports-filings__card-link-text">
                        {link.text}
                        <svg
                          className="reports-filings__card-link-arrow"
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
                      </span>
                    </Link>
                  );
                })}
              </div>
              {reportsData.rightCard.button && (
                <Link
                  href={reportsData.rightCard.button.href || "#"}
                  className="reports-filings__button reports-filings__button--outline reports-filings__button"
                >
                  {reportsData.rightCard.button.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

