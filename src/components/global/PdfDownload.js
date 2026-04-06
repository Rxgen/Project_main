'use client';

import Image from 'next/image';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '@/scss/components/global/PdfDownload.scss';

/**
 * PdfDownload - Reusable PDF download component
 * 
 * @param {string} title - PDF title text (required)
 * @param {string} pdfUrl - URL to the PDF file (required)
 * @param {string} image - Background image path (optional)
 * @param {string} imageAlt - Alt text for background image (optional)
 * @param {string} className - Additional CSS classes (optional)
 * @param {function} onDownload - Optional callback function when download is clicked
 * 
 * @example
 * // Basic usage
 * <PdfDownload 
 *   title="Lupin Corporate Presentation" 
 *   pdfUrl="/documents/corporate-presentation.pdf"
 *   image="/assets/pdf-download/lab-background.jpg"
 * />
 */
export default function PdfDownload({ 
  title,
  pdfUrl,
  image,
  imageAlt,
  className = '',
  onDownload
}) {
  // Normalize PDF URL
  const normalizedPdfUrl = normalizeUploadUrl(pdfUrl);
  
  const handleDownload = (e) => {
    if (onDownload) {
      onDownload(e);
    }
    
    // If pdfUrl is provided, trigger download
    if (normalizedPdfUrl) {
      const link = document.createElement('a');
      link.href = normalizedPdfUrl;
      link.download = normalizedPdfUrl.split('/').pop() || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`pdf-download ${className}`}>
      {/* Background Image */}
      {image && (
        <div className="pdf-download__image">
          <Image
            src={image}
            alt={imageAlt || title || 'PDF Download'}
            width={832}
            height={492}
            className="pdf-download__image-img"
            quality={100}
            priority
          />
        </div>
      )}
      
      {/* Content Overlay */}
      <div className="pdf-download__content">
        <h3 className="pdf-download__title">{title}</h3>
        
        <button 
          className="pdf-download__button"
          onClick={handleDownload}
          aria-label={`Download ${title || 'PDF'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="81" 
            height="81" 
            viewBox="0 0 81 81" 
            fill="none"
            className="pdf-download__button-icon"
          >
            <rect x="2.49886" y="2.50082" width="75.9752" height="75.9752" rx="37.9876" fill="#126430"/>
            <rect x="2.49886" y="2.50082" width="75.9752" height="75.9752" rx="37.9876" stroke="white" strokeWidth="4.99837"/>
            <path d="M51.2857 42.6362L44.4946 42.5843V31.3867H35.1632V42.4288L28.3721 42.3251L39.9844 53.9375L51.2857 42.6362Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

