'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoModal from '@/components/VideoModal';
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

export default function Presentations({ data, error = null }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Static video data with YouTube URL
  const staticVideo = {
    id: 'presentation-video',
    title: 'Vinita Gupta at the JP Morgan Healthcare Conference Jan 12 2021',
    youtubeUrl: 'https://www.youtube.com/watch?v=hvCl7ut5vNI', // YouTube URL
    thumbnail: '/assets/images/videothumb/vinita_conference.png'
  };

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  // Show error state if API failed
  if (error) {
    return (
      <section className="policies">
        <div className="policies__container">
          <div className="policies__placeholder">
            <p>Unable to load presentations at this time. Please try again later.</p>
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
  if (!data || !data.presentations || data.presentations.length === 0) {
    return (
      <section className="policies">
        <div className="policies__container">
          <div className="policies__placeholder">
            <p>No presentations available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  const presentationsData = {
    title: data.title || "Presentations",
    presentations: data.presentations,
    images: data.images || {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorativeGroup: "/assets/policies/group.svg"
    }
  };

  return (
    <section className="policies">
      {/* Container */}
      <div className="policies__container">
        {/* Title */}
        {presentationsData.title && (
          <h2 className="policies__section-title">
            {presentationsData.title}
          </h2>
        )}

        {/* Content */}
        <div className="policies__content">
          {/* Presentation Cards Grid */}
          <div className="policies__grid">
            {/* PDF Presentation Cards - First 3 */}
            {presentationsData.presentations.slice(0, 3).map((presentation) => (
              <div key={presentation.id} className="policy-card">
                <div className="policy-card__content">
                  <h3 className="policy-card__title">
                    <Link
                      href={normalizeUploadUrl(presentation.pdfUrl) || '#'}
                      className="policy-card__title-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {presentation.title}
                    </Link>
                  </h3>
                  <div className="policy-card__download">
                    <a
                      href={normalizeUploadUrl(presentation.pdfUrl) || '#'}
                      className="policy-card__download-link"
                      target='_blank'
                      
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (presentation.pdfUrl && presentation.pdfUrl !== '#') {
                    //     handleDownload(presentation.pdfUrl, `${presentation.title || 'presentation'}.pdf`);
                    //   }
                    // }}
                    >
                      Download
                    </a>
                    <a
                      href={normalizeUploadUrl(presentation.pdfUrl) || '#'}
                      className="policy-card__download-button"
                      target='_blank'
                      download
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (presentation.pdfUrl && presentation.pdfUrl !== '#') {
                    //     handleDownload(presentation.pdfUrl, `${presentation.title || 'presentation'}.pdf`);
                    //   }
                    // }}
                    >
                      <Image
                        src={presentation.isActive ? presentationsData.images.downloadButton.active : presentationsData.images.downloadButton.inactive}
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

            {/* Video card - 4th position */}
            <div className="policy-card" style={{ cursor: 'pointer' }} onClick={handleVideoClick}>
              <div className="policy-card__content" style={{ padding: 0 }}>
                {staticVideo.thumbnail && (
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <Image
                      src={staticVideo.thumbnail}
                      alt={staticVideo.title || 'Presentation video'}
                      fill
                      style={{ objectFit: 'cover' }}
                      quality={100}
                    />
                    {/* Play button overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none'
                    }}>
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="40" cy="40" r="40" fill="#08a03f" />
                        <path
                          d="M32 26L54 40L32 54V26Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div style={{ padding: '20px' }}>
                  <h3 className="policy-card__title">
                    <span className="policy-card__title-link" style={{ cursor: 'pointer' }}>
                      {staticVideo.title}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            {/* PDF Presentation Cards - Rest after video */}
            {presentationsData.presentations.slice(3).map((presentation) => (
              <div key={presentation.id} className="policy-card">
                <div className="policy-card__content">
                  <h3 className="policy-card__title">
                    <Link
                      href={normalizeUploadUrl(presentation.pdfUrl) || '#'}
                      className="policy-card__title-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {presentation.title}
                    </Link>
                  </h3>
                  <div className="policy-card__download">
                    <a
                      href={normalizeUploadUrl(presentation.pdfUrl) || '#'}
                      className="policy-card__download-link"
                      target='_blank'
                      
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (presentation.pdfUrl && presentation.pdfUrl !== '#') {
                    //     handleDownload(presentation.pdfUrl, `${presentation.title || 'presentation'}.pdf`);
                    //   }
                    // }}
                    >
                      Download
                    </a>
                    <a
                      href={normalizeUploadUrl(presentation.pdfUrl) || '#'}
                      className="policy-card__download-button"
                      target='_blank'
                      download
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   if (presentation.pdfUrl && presentation.pdfUrl !== '#') {
                    //     handleDownload(presentation.pdfUrl, `${presentation.title || 'presentation'}.pdf`);
                    //   }
                    // }}
                    >
                      <Image
                        src={presentation.isActive ? presentationsData.images.downloadButton.active : presentationsData.images.downloadButton.inactive}
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

          {/* Decorative Group Image */}
          {/* <div className="policies__decorative">
            <Image
              src={presentationsData.images.decorativeGroup}
              alt=""
              width={319}
              height={313}
              className="policies__decorative-img"
              quality={100}
            />
          </div> */}
        </div>
      </div>

      {/* YouTube Video Modal */}
      {staticVideo.youtubeUrl && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={staticVideo.youtubeUrl}
        />
      )}
    </section>
  );
}

