'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileCard from '@/components/global/ProfileCard';
import '@/scss/components/MediaCoverage.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

/**
 * MediaCoverage - Media coverage section component
 * 
 * @param {Object} data - Media coverage data
 * @param {string} data.title - Section title (optional)
 * @param {Array} data.items - Array of media coverage items
 * @param {string} className - Additional CSS classes (optional)
 * @param {string} exploreLink - Link for the explore button (optional)
 * 
 * @example
 * <MediaCoverage 
 *   data={{
 *     title: "Media Coverage",
 *     items: [
 *       {
 *         id: 1,
 *         name: "November 4, 2025",
 *         title: "Lupin banks on complex generics",
 *         image: "/assets/media-kit-card/demo2.png",
 *         imagePosition: "bottom-right",
 *         link: "/news/article"
 *       }
 *     ]
 *   }}
 *   exploreLink="/media/media-coverage"
 * />
 */
export default function MediaCoverage({ data, className = '', id, exploreLink }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const mediaCoverageData = {
    title: data?.title || "Media Coverage",
    items: data?.items || [],
    profileCards: data?.profileCards || []
  };

  // Whitelist of allowed YouTube domains (security: prevents URL injection attacks)
  const ALLOWED_YOUTUBE_HOSTS = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'www.youtu.be'
  ];

  // Helper function to check if URL is external (starts with http/https)
  const isExternalLink = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  // Helper function to check if URL is YouTube (secure hostname validation)
  const isYouTubeUrl = (url) => {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      // Parse the URL to extract hostname
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Remove 'www.' prefix for consistent comparison
      const hostnameWithoutWww = hostname.replace(/^www\./, '');

      // Check if hostname exactly matches or is a valid subdomain of allowed hosts
      return ALLOWED_YOUTUBE_HOSTS.some(allowedHost => {
        const allowedHostLower = allowedHost.toLowerCase().replace(/^www\./, '');
        
        // Exact match
        if (hostnameWithoutWww === allowedHostLower) {
          return true;
        }
        
        // Subdomain match (e.g., m.youtube.com is a subdomain of youtube.com)
        // Only allow if it ends with .youtube.com or .youtu.be
        if (hostnameWithoutWww.endsWith('.' + allowedHostLower)) {
          // Additional check: ensure it's a valid subdomain (not something like evil-youtube.com)
          const parts = hostnameWithoutWww.split('.');
          const domainParts = allowedHostLower.split('.');
          // Check if the last N parts match the allowed domain
          if (parts.length > domainParts.length) {
            const lastParts = parts.slice(-domainParts.length).join('.');
            return lastParts === allowedHostLower;
          }
        }
        
        return false;
      });
    } catch (error) {
      // If URL parsing fails, reject for security
      console.warn('Invalid URL format:', url, error);
      return false;
    }
  };

  // Helper function to convert YouTube URL to embed URL (secure)
  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') {
      return '';
    }

    // First verify it's a valid YouTube URL using secure validation
    if (!isYouTubeUrl(url)) {
      console.warn('Invalid YouTube URL rejected:', url);
      return '';
    }

    try {
      const urlObj = new URL(url);
      let videoId = '';

      // Extract video ID based on URL structure
      if (urlObj.pathname === '/watch' && urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1]?.split('?')[0]?.split('/')[0];
      } else if (urlObj.hostname.includes('youtu.be') && urlObj.pathname) {
        videoId = urlObj.pathname.substring(1).split('?')[0]?.split('/')[0];
      } else if (urlObj.pathname.startsWith('/v/')) {
        videoId = urlObj.pathname.split('/v/')[1]?.split('?')[0]?.split('/')[0];
      }

      // Validate video ID format (YouTube video IDs are 11 characters alphanumeric)
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      console.warn('Could not extract valid video ID from URL:', url);
      return '';
    } catch (error) {
      console.warn('Error parsing YouTube URL:', url, error);
      return '';
    }
  };

  // Handle video click
  const handleVideoClick = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  // Handle external link click
  const handleLinkClick = (e, link) => {
    e.preventDefault();
    if (link && isExternalLink(link)) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // Close video modal
  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideoUrl(null);
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseVideoModal();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVideoModalOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        handleCloseVideoModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  return (
    <section id={id} className={`media-coverage ${className}`}>
      {/* Background Petals */}
      <div className="media-coverage__bg-petals">
        <Image
          src="/assets/media/bg-petals.svg"
          alt=""
          width={957}
          height={2520}
          className="media-coverage__bg-petals-img"
          quality={100}
          unoptimized
        />
      </div>

      <div className="media-coverage__container">
        {mediaCoverageData.title && (
          <h2 className="media-coverage__title"
            dangerouslySetInnerHTML={{ __html: mediaCoverageData.title }}
          >
          </h2>
        )}

        <div className="media-coverage__content">
          {mediaCoverageData.items && mediaCoverageData.items.length > 0 && (
            <div className="media-coverage__list">
              {mediaCoverageData.items.map((item, index) => {
                const hasVideo = !!item.videoLink;
                const hasExternalLink = !!item.externalLink;
                const isClickable = hasVideo || hasExternalLink;

                const listItemContent = (
                  <>
                    <span className="media-coverage__list-text">
                      <span className="media-coverage__list-date">{item.date}</span> 

                                       <ReactMarkdown
                                        remarkPlugins={[remarkBreaks]}
                                        rehypePlugins={[rehypeRaw]}
                                        >
                                        {item.text}
                                      </ReactMarkdown>
                    </span>
                    {index < mediaCoverageData.items.length - 1 && (
                      <div className="media-coverage__list-divider"></div>
                    )}
                  </>
                );

                if (hasVideo) {
                  return (
                    <div
                      key={item.id || index}
                      className="media-coverage__list-item media-coverage__list-item--link media-coverage__list-item--video"
                      onClick={() => handleVideoClick(item.videoLink)}
                      style={{ cursor: 'pointer' }}
                    >
                      {listItemContent}
                    </div>
                  );
                }

                if (hasExternalLink) {
                  return (
                    <div
                      key={item.id || index}
                      className="media-coverage__list-item media-coverage__list-item--link"
                      onClick={(e) => handleLinkClick(e, item.externalLink)}
                      style={{ cursor: 'pointer' }}
                    >
                      {listItemContent}
                    </div>
                  );
                }

                return (
                  <div key={item.id || index} className="media-coverage__list-item">
                    {listItemContent}
                  </div>
                );
              })}
            </div>
          )}

          <div className="media-coverage__right">
            {mediaCoverageData.profileCards && mediaCoverageData.profileCards.length > 0 ? (
              mediaCoverageData.profileCards.map((card, index) => {
                const hasVideo = !!card.videoLink;
                const hasExternalLink = !!card.externalLink;
                const isClickable = hasVideo || hasExternalLink;

                return (
                  <div
                    key={card.id || index}
                    className={isClickable ? 'media-coverage__profile-card-wrapper media-coverage__profile-card-wrapper--clickable' : 'media-coverage__profile-card-wrapper'}
                    onClick={hasVideo ? () => handleVideoClick(card.videoLink) : hasExternalLink ? (e) => handleLinkClick(e, card.externalLink) : undefined}
                    style={isClickable ? { cursor: 'pointer' } : {}}
                  >
                    <ProfileCard
                      name={card.name}
                      title={card.title}
                      image={card.image}
                      link={hasVideo || hasExternalLink ? undefined : card.link}
                      showArrow={false}
                    />
                  </div>
                );
              })
            ) : null}
          </div>
        </div>

        {/* Explore Button */}
        {exploreLink && (
          <div className="media-coverage__explore-wrapper">
            <Link href={exploreLink} className="media-coverage__explore-button">
              <span className="media-coverage__explore-text">Explore</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="media-coverage__explore-icon"
              >
                <path
                  d="M1 17L17 1M17 1H1M17 1V17"
                  stroke="#168E47"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && selectedVideoUrl && (
        <div
          className="media-coverage__popup-overlay"
          onClick={handleOverlayClick}
        >
          <div className="media-coverage__popup">
            {/* Close Button */}
            <button
              className="media-coverage__close-button"
              onClick={handleCloseVideoModal}
              aria-label="Close video"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Video Player */}
            <div className="media-coverage__video-wrapper">
              {isYouTubeUrl(selectedVideoUrl) ? (
                <iframe
                  className="media-coverage__video media-coverage__video--youtube"
                  src={`${getYouTubeEmbedUrl(selectedVideoUrl)}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video"
                />
              ) : (
                <video
                  className="media-coverage__video"
                  controls
                  autoPlay
                  src={selectedVideoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

