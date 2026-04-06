'use client';

import Image from 'next/image';
import Link from 'next/link';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '../scss/components/Notice.scss';

// Helper function to download file (same pattern as ExtraSmallCard)
const handleDownload = async (url, filename) => {
  if (!url || url === '#') return;

  try {
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename || url.split('/').pop() || 'download.pdf')}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || url.split('/').pop() || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    window.open(url, '_blank');
  }
};

export default function Notice({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="notice">
        <h2 className="notice__heading">Newspaper Publication of Financial Results</h2>
        <div className="notice__container">
          <div className="notice__content">
            <div className="notice__placeholder">
              <p>Unable to load notices at this time. Please try again later.</p>
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
  if (!data || !data.notices || data.notices.length === 0) {
    return (
      <section className="notice">
        <h2 className="notice__heading">Newspaper Publication of Financial Results</h2>
        <div className="notice__container">
          <div className="notice__content">
            <div className="notice__placeholder">
              <p>No notices available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const noticeData = {
    notices: data.notices,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorativeGroup: "/assets/policies/group.svg"
    }
  };

  return (
    <section className="notice">
      {/* Headline */}
      <h2 className="notice__heading">Newspaper Publication of Financial Results</h2>
      {/* Container */}
      <div className="notice__container">
        {/* Content */}
        <div className="notice__content">
          {/* Notice Cards Grid */}
          <div className="notice__grid">
            {noticeData.notices.map((notice) => (
              <div
                key={notice.id}
                className={`notice-card`}
              >
                <div className="notice-card__content">
                  <div className="notice-card__links">
                    {notice.documents && notice.documents.length > 0 ? (
                      notice.documents.map((doc, docIndex) => {
                        const normalizedUrl = normalizeUploadUrl(doc.url);
                        return (
                          <Link
                            key={doc.id || docIndex}
                            href={normalizedUrl || "#"}
                            className="notice-card__link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {notice.financialLabel && doc.languageLabel
                              ? `${notice.financialLabel} - ${doc.languageLabel}`
                              : doc.languageLabel || (notice.financialLabel || 'Document')}
                          </Link>
                        );
                      })
                    ) : (
                      // Fallback if no documents (shouldn't happen if data is correct)
                      <Link 
                        href={normalizeUploadUrl(notice.pdfUrl) || "#"} 
                        className="notice-card__link" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {notice.financialLabel || 'Document'}
                      </Link>
                    )}
                  </div>
                  <div className="notice-card__download">
                    <a
                      href={normalizeUploadUrl(notice.pdfUrl) || '#'}
                      className="notice-card__download-link"
                      target='_blank'
                      download
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (notice.pdfUrl && notice.pdfUrl !== '#') {
                    //     handleDownload(notice.pdfUrl, `${notice.financialLabel || 'notice'}.pdf`);
                    //   }
                    // }}
                    >
                      Download
                    </a>
                    <a
                      href={normalizeUploadUrl(notice.pdfUrl) || '#'}
                      className="notice-card__download-button"
                      target='_blank'
                      download
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (notice.pdfUrl && notice.pdfUrl !== '#') {
                    //     handleDownload(notice.pdfUrl, `${notice.financialLabel || 'notice'}.pdf`);
                    //   }
                    // }}
                    >
                      <Image
                        src={notice.isActive ? noticeData.images.downloadButton.active : noticeData.images.downloadButton.inactive}
                        alt="Download"
                        width={104}
                        height={104}
                        className="notice-card__download-icon"
                        quality={100}
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Group Image */}
          <div className="notice__decorative">
            <Image
              src={noticeData.images.decorativeGroup}
              alt=""
              width={319}
              height={313}
              className="notice__decorative-img"
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

