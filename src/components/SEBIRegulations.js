'use client';

import Link from 'next/link';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '../scss/components/SEBIRegulations.scss';

// Reserved section ID: when CMS link url (or sectionId) matches this, redirect to shareholding information section on investors page
const SHAREHOLDING_INFORMATION_SECTION_ID = 'shareholding-information';
const SHAREHOLDING_INFORMATION_HREF = '/investors#shareholding-information';

function isShareholdingInformationLink(url, doc) {
  if (!url || url === '#') return false;
  const normalized = String(url).trim().toLowerCase();
  if (normalized === SHAREHOLDING_INFORMATION_SECTION_ID) return true;
  if (normalized === `#${SHAREHOLDING_INFORMATION_SECTION_ID}`) return true;
  if (normalized === `/investors#${SHAREHOLDING_INFORMATION_SECTION_ID}`) return true;
  if (doc?.sectionId?.toLowerCase?.() === SHAREHOLDING_INFORMATION_SECTION_ID) return true;
  return false;
}

export default function SEBIRegulations({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="sebi-regulations">
        <div className="sebi-regulations__container">
          <div className="sebi-regulations__placeholder">
            <p>Unable to load regulation disclosures at this time. Please try again later.</p>
            {process.env.NODE_ENV === 'development' && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Error: {error}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!data || !data.items || data.items.length === 0) {
    return (
      <section className="sebi-regulations">
        <div className="sebi-regulations__container">
          <div className="sebi-regulations__placeholder">
            <p>No regulation disclosures available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get title and description from DisclosureIntroSection (dynamic from CMS)
  // Fallback to default values if not available
  const title = data?.introSection?.sectionTitle || "Disclosure under Regulation 46 of SEBI Regulations, 2015";
  const description = data?.introSection?.description || null;

  const regulationsData = {
    title: title,
    description: description,
    items: data.items || []
  };

  return (
    <section className="sebi-regulations">
      <div className="sebi-regulations__container">
        {/* Header */}
        <div className="sebi-regulations__header">
          <h1 className="sebi-regulations__title">{regulationsData.title}</h1>
          {regulationsData.description && (
            <div 
              className="sebi-regulations__description"
              dangerouslySetInnerHTML={{ __html: regulationsData.description }}
            />
          )}
        </div>

        {/* Table */}
        <div className="sebi-regulations__table-wrapper">
          {/* Table Header */}
          <div className="sebi-regulations__table-header">
            <div className="sebi-regulations__header-number">No.</div>
            <div className="sebi-regulations__header-particulars">Particulars</div>
            <div className="sebi-regulations__header-url">URL</div>
          </div>

          {/* Table Body */}
          <div className="sebi-regulations__table-body">
            {regulationsData.items.map((item) => (
              <div key={item.id} className="sebi-regulations__row">
                <div className="sebi-regulations__cell sebi-regulations__cell--number">
                  {item.number}
                </div>
                <div className="sebi-regulations__cell sebi-regulations__cell--particulars">
                  {typeof item.particulars === 'string' && item.particulars.includes('\n') ? (
                    <div dangerouslySetInnerHTML={{ __html: item.particulars.replace(/\n/g, '<br />') }} />
                  ) : (
                    item.particulars
                  )}
                </div>
                <div className="sebi-regulations__cell sebi-regulations__cell--url">
                  {item.documents && item.documents.length > 0 ? (
                    <div className="sebi-regulations__links">
                      {item.documents.map((doc, docIndex) => {
                        const isShareholding = isShareholdingInformationLink(doc.url, doc);
                        const normalizedUrl = normalizeUploadUrl(doc.url);
                        const href = isShareholding ? SHAREHOLDING_INFORMATION_HREF : normalizedUrl;
                        const isDisabled = !isShareholding && (normalizedUrl === '#' || !normalizedUrl);
                        return (
                        <Link 
                          key={doc.id || docIndex} 
                          href={href} 
                          target={!isShareholding && href !== '#' ? "_blank" : undefined}
                          rel={!isShareholding && href !== '#' ? "noopener noreferrer" : undefined}
                          className={`sebi-regulations__link ${isDisabled ? 'sebi-regulations__link--disabled' : ''}`}
                        >
                          <span>{doc.label}</span>
                          {!isDisabled && (
                            <svg
                              className="sebi-regulations__arrow"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 11L11 1M11 1H1M11 1V11"
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
                  ) : (
                    <span className="sebi-regulations__na">NA</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


