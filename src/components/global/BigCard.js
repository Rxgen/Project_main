'use client';

import Link from 'next/link';
import Image from 'next/image';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '@/scss/components/global/BigCard.scss';

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

/**
 * BigCard - Reusable big card component for financial documents
 * Follows the Notice card structure
 * 
 * @param {string} centerLink - Link to center version
 * @param {string} marathiLink - Link to Marathi version
 * @param {string} pdfUrl - URL to the PDF file
 * @param {boolean} isActive - Whether the card is active (affects styling)
 * @param {string} downloadButtonActive - Path to active download button image
 * @param {string} downloadButtonInactive - Path to inactive download button image
 * @param {string} centerText - Text for center link (default: "Q1 FY 2026 - center")

 * @param {string} className - Additional CSS classes
 */
export default function BigCard({
  centerLink = "#",

  pdfUrl = "#",
  isActive = false,
  downloadButtonActive = "/assets/policies/download-button-active.svg",
  downloadButtonInactive = "/assets/policies/download-button-inactive.svg",
  centerText = "Q1 FY 2026 - center",

  className = ''
}) {
  // Normalize PDF URLs
  const normalizedPdfUrl = normalizeUploadUrl(pdfUrl);
  const normalizedCenterLink = normalizeUploadUrl(centerLink);
  
  return (
    <div className={`big-card ${isActive ? 'big-card--active' : ''} ${className}`}>
      <div className="big-card__content">
        <div className="big-card__links">
          <Link href={normalizedCenterLink || normalizedPdfUrl} className="big-card__link" target="_blank" rel="noopener noreferrer">
            {centerText}
          </Link>

        </div>
        <div className="big-card__download">
          <a
            href={normalizedPdfUrl || normalizedCenterLink || "#"}
            className="big-card__download-link"
            target="_blank"
            /* onClick={(e) => {
              e.preventDefault();
              const url = pdfUrl || centerLink;
              if (url && url !== '#') {
                handleDownload(url, `${centerText || 'document'}.pdf`);
              }
            }} */
            
          >
            Download
          </a>
          <a
            href={normalizedPdfUrl || normalizedCenterLink || '#'}
            className="big-card__download-button"
            target="_blank"
            /* onClick={(e) => {
              e.preventDefault();
              const url = pdfUrl || centerLink;
              if (url && url !== '#') {
                handleDownload(url, `${centerText || 'document'}.pdf`);
              }
            }} */
            download
          >
            <Image
              src={isActive ? downloadButtonActive : downloadButtonInactive}
              alt="Download"
              width={104}
              height={104}
              className="big-card__download-icon"
              quality={100}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

