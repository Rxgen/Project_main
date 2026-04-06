'use client';

import { useEffect } from 'react';
import '@/scss/components/VideoModal.scss';

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    if (!url) return null;
    
    // Handle YouTube Shorts format: https://youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return shortsMatch[1];
    
    // Handle regular YouTube format
    const regularMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (regularMatch) return regularMatch[1];
    
    return null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY || window.pageYOffset;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.setAttribute('data-modal-scroll-y', scrollY.toString());
    } else {
      const scrollY = document.body.getAttribute('data-modal-scroll-y');
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.removeAttribute('data-modal-scroll-y');
      if (scrollY) window.scrollTo(0, parseInt(scrollY, 10));
    }

    return () => {
      const scrollY = document.body.getAttribute('data-modal-scroll-y');
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.removeAttribute('data-modal-scroll-y');
      if (scrollY) window.scrollTo(0, parseInt(scrollY, 10));
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Conditional returns after all hooks
  if (!isOpen) return null;
  if (!embedUrl) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="video-modal" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="video-modal__content">
        <button 
          className="video-modal__close" 
          onClick={onClose}
          aria-label="Close video"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="video-modal__iframe-wrapper">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="video-modal__iframe"
          />
        </div>
      </div>
    </div>
  );
}

