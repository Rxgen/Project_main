'use client';

import Link from 'next/link';
import Image from 'next/image';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '@/scss/components/global/ExtraSmallCard.scss';

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
 * ExtraSmallCard - Reusable extra small card component for financial documents
 * Smaller version of SmallCard with reduced dimensions
 * 
 * @param {string} title - Card title
 * @param {string} pdfUrl - URL to the PDF file
 * @param {boolean} isActive - Whether the card is active (affects styling)
 * @param {string} downloadButtonActive - Path to active download button image
 * @param {string} downloadButtonInactive - Path to inactive download button image
 * @param {string} className - Additional CSS classes
 */
export default function ExtraSmallCard({
  title,
  pdfUrl = "#",
  isActive = false,
  downloadButtonActive = "/assets/policies/download-button-active.svg",
  downloadButtonInactive = "/assets/policies/download-button-inactive.svg",
  className = ''
}) {
  // Normalize PDF URL
  const normalizedPdfUrl = normalizeUploadUrl(pdfUrl);
  
  return (
    <div className="extra-small-card">
      <div className="extra-small-card__content">
        <div className="extra-small-card__links">
          <Link href={normalizedPdfUrl} className="extra-small-card__link" target="_blank" rel="noopener noreferrer">
            {title}
          </Link>
        </div>
        <div className="extra-small-card__download">
          <a
            href={normalizedPdfUrl || '#'}
            className="extra-small-card__download-link"
            target='_blank'
          // onClick={(e) => {
          //   e.preventDefault();
          //   if (pdfUrl && pdfUrl !== '#') {
          //     handleDownload(pdfUrl, `${title || 'document'}.pdf`);
          //   }
          // }}
          >
            Download
          </a>
          <a
            href={normalizedPdfUrl || '#'}
            className="extra-small-card__download-button"
            target='_blank'
            download
          // onClick={(e) => {
          //   e.preventDefault();
          //   if (pdfUrl && pdfUrl !== '#') {
          //     handleDownload(pdfUrl, `${title || 'document'}.pdf`);
          //   }
          // }}
          >
            <Image
              src={isActive ? downloadButtonActive : downloadButtonInactive}
              alt="Download"
              width={46}
              height={46}
              className="extra-small-card__download-icon"
              quality={100}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

