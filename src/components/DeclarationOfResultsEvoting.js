'use client';

import Image from 'next/image';
import Link from 'next/link';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '../scss/components/Policies.scss';

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

export default function DeclarationOfResultsEvoting({ data }) {
  // Default data (will be replaced by Strapi)
  const declarationData = data || {
    title: "Declaration of Results of E-voting",
    cards: [
      {
        id: 1,
        title: "E-voting Result 1",
        pdfUrl: "#",
        isActive: false
      },
      {
        id: 2,
        title: "E-voting Result 2",
        pdfUrl: "#",
        isActive: false
      },
      {
        id: 3,
        title: "E-voting Result 3",
        pdfUrl: "#",
        isActive: false
      }
    ],
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      }
    }
  };

  return (
    <section className="policies policies--light-bg">
      {/* Container */}
      <div className="policies__container">
        {/* Title */}
        <h2 className="policies__section-title">
          {declarationData.title || "Declaration of Results of E-voting"}
        </h2>

        {/* Content */}
        <div className="policies__content">
          {/* Declaration Cards Grid */}
          <div className="policies__grid">
            {declarationData.cards && declarationData.cards.map((card) => (
              <div
                key={card.id}
                className={`policy-card`}
              >
                <div className="policy-card__content">
                  <h3 className="policy-card__title">
                    <Link
                      href={normalizeUploadUrl(card.pdfUrl) || '#'}
                      className="policy-card__title-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.title}
                    </Link>
                  </h3>
                  <div className="policy-card__download">
                    <a
                      href={normalizeUploadUrl(card.pdfUrl) || "#"}
                      className="policy-card__download-link"
                      target='_blank'
                      
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (card.pdfUrl && card.pdfUrl !== '#') {
                    //     handleDownload(card.pdfUrl, `${card.title || 'declaration'}.pdf`);
                    //   }
                    // }}
                    >
                      Download
                    </a>
                    <a
                      href={normalizeUploadUrl(card.pdfUrl) || '#'}
                      className="policy-card__download-button"
                      target='_blank'
                      download
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (card.pdfUrl && card.pdfUrl !== '#') {
                    //     handleDownload(card.pdfUrl, `${card.title || 'declaration'}.pdf`);
                    //   }
                    // }}
                    >
                      <Image
                        src={card.isActive ? declarationData.images.downloadButton.active : declarationData.images.downloadButton.inactive}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

