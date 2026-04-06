'use client';

import { useState } from 'react';
import '../scss/components/MeetingVideo.scss';

export default function MeetingVideo({ data, error = null }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Thumbnail paths (public/assets/images/videothumb)
  const meetingThumbnails = {
    2021: '/assets/images/videothumb/2021.png',
    2022: '/assets/images/videothumb/2022.png',
    2023: '/assets/images/videothumb/2023.png',
    2024: '/assets/images/videothumb/2024.png'
  };

  // Default fallback videos (with thumbnails from public/assets/meeting-video)
  const defaultVideos = [
    {
      id: 1,
      title: '42nd Annual General Meeting – Aug 2, 2024',
      videoUrl: 'https://cmsuatlupin.blob.core.windows.net/public/uploads/nsdl-lupin-limited.mp4',
      thumbnail: meetingThumbnails[2024],
      transcriptLink: { href: '/agm-transcript.pdf', text: '42nd Annual General Meeting Transcript' },
      transcriptLinkText: '42nd Annual General Meeting Transcript'
    },
    {
      id: 2,
      title: '41st Annual General Meeting – August 3, 2023',
      videoUrl: 'https://cmsuatlupin.blob.core.windows.net/public/uploads/lupin-agm-2023.mp4',
      thumbnail: meetingThumbnails[2023],
      transcriptLink: null
    },
    {
      id: 3,
      title: '40th Annual General Meeting — August 3, 2022',
      videoUrl: 'https://cmsuatlupin.blob.core.windows.net/public/uploads/lupin-agm-2022.mp4',
      thumbnail: meetingThumbnails[2022],
      transcriptLink: null
    },
    {
      id: 4,
      title: '39th Annual General Meeting — August 11, 2021',
      videoUrl: 'https://cmsuatlupin.blob.core.windows.net/public/uploads/Lupin_Agm_11_Aug_2021.mp4',
      thumbnail: meetingThumbnails[2021],
      transcriptLink: null
    }
  ];

  // Show fallback data when no valid CMS data (no data, no videos array, or empty videos)
  const hasValidVideos = data?.videos && Array.isArray(data.videos) && data.videos.length > 0;
  const videoData = hasValidVideos
    ? data
    : { title: 'Annual General Meeting', videos: defaultVideos };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedVideo(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  return (
    <>
      <section className="meeting-video" id="agm">
        <div className="meeting-video__container">
          {/* Title */}
          {videoData.title && (
            <h2 className="meeting-video__title">
              {videoData.title}
            </h2>
          )}

          {/* Video Cards Grid */}
          <div className="meeting-video__grid">
            {videoData.videos.map((video) => (
              <div
                key={video.id}
                className="meeting-video__card"
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="meeting-video__thumbnail-wrapper">
                  {video.thumbnail && typeof video.thumbnail === 'string' && video.thumbnail.trim() !== '' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnail}
                      alt={video.title || 'Meeting video'}
                      className="meeting-video__thumbnail"
                    />
                  ) : (
                    <div className="meeting-video__thumbnail-placeholder">
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
                  )}

                  {/* Play Button Overlay */}
                  <div className="meeting-video__play-button">
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

                {/* Video Title and Transcript Link */}
                <div className="meeting-video__card-content">
                  {video.title && (
                    <h3 className="meeting-video__card-title">
                      {video.title}
                    </h3>
                  )}
                  {video.transcriptLink && (
                    <a
                      href={video.transcriptLink.href}
                      className="meeting-video__transcript-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {video.transcriptLinkText}
                      <svg
                        className="meeting-video__transcript-arrow"
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
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Popup Modal */}
      {isPopupOpen && selectedVideo && (
        <div
          className="meeting-video__popup-overlay"
          onClick={handleOverlayClick}
        >
          <div className="meeting-video__popup">
            {/* Close Button */}
            <button
              className="meeting-video__close-button"
              onClick={handleClosePopup}
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
            <div className="meeting-video__video-wrapper">
              <video
                className="meeting-video__video"
                controls
                autoPlay
                src={selectedVideo.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Title */}
            {selectedVideo.title && (
              <h3 className="meeting-video__popup-title">
                {selectedVideo.title}
              </h3>
            )}
          </div>
        </div>
      )}
    </>
  );
}
