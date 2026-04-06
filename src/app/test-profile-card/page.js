'use client';

import { useState } from 'react';
import InnerBanner from '@/components/InnerBanner';
import ProfileCard from '@/components/global/ProfileCard';
import PdfDownload from '@/components/global/PdfDownload';
import MediaContact from '@/components/global/MediaContact';
import WhatsNew from '@/components/WhatsNew';
import Image from 'next/image';
import '@/scss/pages/test-profile-card.scss';

export default function TestProfileCardPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  // Banner data
  const bannerData = {
    title: {
      line1: "Profile Card",
      line2: "Test Page"
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Test page banner"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  const handleVideoClick = (profile) => {
    setSelectedVideo({
      title: profile.name,
      videoUrl: profile.videoLink
    });
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

  // Dummy profile data
  const profiles = [
    {
      id: 1,
      name: "Vinita Gupta",
      title: "Chief Executive Officer",
      link: "/about/vinita-gupta"
    },
    {
      id: 2,
      name: "John Doe",
      title: "Chief Financial Officer",
      link: "/about/john-doe"
    },
    {
      id: 3,
      name: "Jane Smith",
      title: "Chief Technology Officer",
      link: "/about/jane-smith"
    },
    {
      id: 4,
      name: "November 4, 2025",
      title: "Lupin banks on complex generics, speciality products to sustain growth in FY26–27",
      image: "/assets/media-kit-card/demo2.png",
      imagePosition: "bottom-right",
      showArrow: false,
      link: "/news/lupin-banks-on-complex-generics"
    },
    {
      id: 5,
      name: "November 4, 2025",
      title: "Lupin banks on complex generics, speciality products to sustain growth in FY26–27",
      image: "/assets/media-kit-card/demo2.png",
      imagePosition: "bottom-right",
      showArrow: false,
      link: "/news/lupin-banks-on-complex-generics"
    },
    {
      id: 6,
      name: "November 4, 2025",
      title: "Lupin banks on complex generics, speciality products to sustain growth in FY26–27",
      image: "/assets/media-kit-card/demo2.png",
      imagePosition: "bottom-right",
      showArrow: false,
      link: "/news/lupin-banks-on-complex-generics"
    },
    {
      id: 7,
      name: "Annual General Meeting 2024",
      title: "42nd Annual General Meeting – Aug 2, 2024",
      image: "/assets/media-kit-card/demo5.png",
      videoLink: "https://www.lupin.com/video/lupin-agm-2024.mp4"
    },
    {
      id: 8,
      name: "Corporate Strategy Update",
      title: "Lupin's Vision for Global Expansion",
      image: "/assets/media-kit-card/demo5.png",
      videoLink: "https://www.lupin.com/video/corporate-strategy-2024.mp4"
    },
    {
      id: 9,
      name: "Research & Development",
      title: "Innovation in Pharmaceutical Sciences",
      image: "/assets/media-kit-card/demo5.png",
      videoLink: "https://www.lupin.com/video/rd-innovation-2024.mp4"
    }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      
      <section className="test-profile-card">
        <div className="test-profile-card__container">
          <div className="test-profile-card__header">
            <h2 className="test-profile-card__title">Profile Cards Demo</h2>
            <p className="test-profile-card__description">
              This page demonstrates the reusable ProfileCard component that can be used in media coverage and other pages.
            </p>
          </div>

          <div className="profile-card-grid">
            {profiles.map((profile) => (
              <div key={profile.id} className="profile-card-wrapper">
                <ProfileCard
                  name={profile.name}
                  title={profile.title}
                  date={profile.date}
                  link={profile.videoLink ? undefined : profile.link}
                  image={profile.image}
                  imagePosition={profile.imagePosition}
                  showArrow={profile.videoLink ? false : profile.showArrow}
                  className={profile.videoLink ? 'profile-card--has-video' : ''}
                />
                {profile.videoLink && (
                  <button
                    className="profile-card__play-button"
                    onClick={() => handleVideoClick(profile)}
                    aria-label={`Play video: ${profile.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="66"
                      height="66"
                      viewBox="0 0 66 66"
                      fill="none"
                    >
                      <path d="M25.5684 16.3633L48.4093 29.9996L25.5684 43.636V16.3633Z" fill="#0A963C"/>
                      <g filter={`url(#filter0_d_play_${profile.id})`}>
                        <path d="M32.9942 59.9986C19.6429 60.1272 7.37744 51.2621 3.75566 37.7681C-0.530471 21.7666 8.96331 5.31516 24.9577 1.02906C40.9593 -3.25704 57.4109 6.23666 61.697 22.2381C65.9831 38.2395 56.4965 54.6839 40.4949 58.97C37.9947 59.6414 35.473 59.97 32.9942 59.9986ZM25.5863 43.5686L48.4457 29.9959L25.5863 16.4233V43.5686Z" fill="white"/>
                      </g>
                      <defs>
                        <filter id={`filter0_d_play_${profile.id}`} x="-0.000710249" y="0" width="65.4545" height="65.4545" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="2.72727"/>
                          <feGaussianBlur stdDeviation="1.36364"/>
                          <feComposite in2="hardAlpha" operator="out"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.23 0"/>
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2497_283"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2497_283" result="shape"/>
                        </filter>
                      </defs>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Download Component Demo */}
      <section className="test-profile-card test-profile-card--pdf-download">
        <div className="test-profile-card__container">
          <div className="test-profile-card__header">
            <h2 className="test-profile-card__title">PDF Download Component Demo</h2>
            <p className="test-profile-card__description">
              This section demonstrates the reusable PdfDownload component for corporate presentations and documents.
            </p>
          </div>

          <div className="pdf-download-demo">
            <PdfDownload
              title="Lupin Corporate Presentation"
              pdfUrl="/documents/corporate-presentation.pdf"
              image="/assets/media-kit-card/demo4.png"
              imageAlt="Lupin Corporate Presentation"
            />
          </div>
        </div>
      </section>

      {/* What's New Slider with Profile Cards */}
      <WhatsNew 
        data={{
          title: "What's New",
          items: [
            {
              id: 1,
              name: "November 4, 2025",
              title: "Lupin banks on complex generics, speciality products to sustain growth in FY26–27",
              image: "/assets/media-kit-card/demo2.png",
              imagePosition: "bottom-right",
              showArrow: false,
              link: "/news/lupin-banks-on-complex-generics"
            },
            {
              id: 2,
              name: "November 4, 2025",
              title: "Lupin banks on complex generics, speciality products to sustain growth in FY26–27",
              image: "/assets/media-kit-card/demo2.png",
              imagePosition: "bottom-right",
              showArrow: false,
              link: "/news/lupin-banks-on-complex-generics"
            },
            {
              id: 3,
              name: "November 4, 2025",
              title: "Lupin banks on complex generics, speciality products to sustain growth in FY26–27",
              image: "/assets/media-kit-card/demo2.png",
              imagePosition: "bottom-right",
              showArrow: false,
              link: "/news/lupin-banks-on-complex-generics"
            },
            {
              id: 4,
              name: "Vinita Gupta",
              title: "Chief Executive Officer",
              link: "/about/vinita-gupta"
            },
            {
              id: 5,
              name: "John Doe",
              title: "Chief Financial Officer",
              link: "/about/john-doe"
            }
          ]
        }}
        useProfileCard={true}
      />

      {/* Media Contact Section */}
      <MediaContact 
        contact={{
          name: "Rajalakshmi Azariah",
          title: "Vice President and Global Head – Corporate Communications",
          email: "rajalakshmiazariah@lupin.com"
        }}
        mediaKitLink="/media-kit"
      />

      {/* Video Popup Modal */}
      {isPopupOpen && selectedVideo && (
        <div
          className="test-profile-card__popup-overlay"
          onClick={handleOverlayClick}
        >
          <div className="test-profile-card__popup">
            {/* Close Button */}
            <button
              className="test-profile-card__close-button"
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
            <div className="test-profile-card__video-wrapper">
              <video
                className="test-profile-card__video"
                controls
                autoPlay
                src={selectedVideo.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Title */}
            {selectedVideo.title && (
              <h3 className="test-profile-card__popup-title">
                {selectedVideo.title}
              </h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

