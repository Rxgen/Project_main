'use client';

import Image from 'next/image';
import Link from 'next/link';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '../scss/components/Policies.scss';
import '../scss/components/EmployeeStockOptionSchemes.scss';

// Helper function to download file
const handleDownload = async (url, filename) => {
  if (!url || url === '#') return;

  try {
    // Use the API proxy route for downloads
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename || url.split('/').pop() || 'download.pdf')}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || url.split('/').pop() || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to opening in new tab if download fails
    window.open(url, '_blank');
  }
};

export default function EmployeeStockOptionSchemes({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="policies employee-stock-option-schemes">
        <div className="policies__container">
          <div className="policies__content">
            <div className="policies__placeholder">
              <p>Unable to load employee stock option schemes at this time. Please try again later.</p>
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
  if (!data || !data.schemes || data.schemes.length === 0) {
    return (
      <section className="policies employee-stock-option-schemes">
        <div className="policies__container">
          <div className="policies__content">
            <div className="policies__placeholder">
              <p>No employee stock option schemes available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Helper function to extract year and remaining text from title
  const parseTitle = (title) => {
    if (!title || typeof title !== 'string') {
      return { year: '', text: '' };
    }

    // Match 4-digit year at the beginning of the string
    const yearMatch = title.match(/^(\d{4})\s*(.*)$/);
    if (yearMatch) {
      return {
        year: yearMatch[1], // The year (e.g., "2024", "2014")
        text: yearMatch[2].trim() // The remaining text after the year
      };
    }

    // If no year found at the beginning, return the whole title as text
    return {
      year: '',
      text: title
    };
  };

  const schemesData = {
    schemes: data.schemes,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorativeGroup: "/assets/policies/group.svg"
    }
  };

  return (
    <section className="policies employee-stock-option-schemes">
      {/* Container */}
      <div className="policies__container">
        {/* Content */}
        <div className="policies__content">
          {/* Scheme Cards Grid */}
          <div className="policies__grid">
            {schemesData.schemes.map((scheme) => {
              const { year, text } = parseTitle(scheme.title);

              return (
                <div
                  key={scheme.id}
                  className={`policy-card`}
                >
                  <div className="policy-card__content">
                    {year && (
                      <div className="policy-card__title">
                        <Link
                          href={normalizeUploadUrl(scheme.pdfUrl) || '#'}
                          className="policy-card__title-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {year}
                        </Link>
                      </div>
                    )}
                    {text && <span className="Stocksubheading">{text}</span>}
                    <div className="policy-card__download">
                      <a
                        href={scheme.pdfUrl || '#'}
                        className="policy-card__download-link"
                        target='_blank'
                        
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   if (scheme.pdfUrl && scheme.pdfUrl !== '#') {
                      //     handleDownload(scheme.pdfUrl, `${scheme.title || 'employee-stock-option'}.pdf`);
                      //   }
                      // }}
                      >
                        Download
                      </a>
                      <a
                        href={scheme.pdfUrl || '#'}
                        className="policy-card__download-button"
                        target='_blank'
                        download
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   if (scheme.pdfUrl && scheme.pdfUrl !== '#') {
                      //     handleDownload(scheme.pdfUrl, `${scheme.title || 'employee-stock-option'}.pdf`);
                      //   }
                      // }}
                      >
                        <Image
                          src={scheme.isActive ? schemesData.images.downloadButton.active : schemesData.images.downloadButton.inactive}
                          alt="Download"
                          width={104}
                          height={104}
                          className="policy-card__download-icon"
                          quality={100}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative Group Image */}
          <div className="policies__decorative">
            <Image
              src={schemesData.images.decorativeGroup}
              alt=""
              width={319}
              height={313}
              className="policies__decorative-img"
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

