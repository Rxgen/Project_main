'use client';

import { useState } from 'react';
import InnerBanner from '@/components/InnerBanner';
import Image from 'next/image';
import VideoModal from '@/components/VideoModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function OurValuesContent({ data, error }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  if (error) {
    return (
      <div style={{ position: 'relative' }}>
        <section className="our-values-content">
          <div className="our-values-content__container">
            <div className="our-values-content__placeholder">
              <p>Unable to load our values content at this time. Please try again later.</p>
              {process.env.NODE_ENV === 'development' && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ position: 'relative' }}>
        <section className="our-values-content">
          <div className="our-values-content__container">
            <div className="our-values-content__placeholder">
              <p>No our values content available at this time.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const bannerData = data?.banner;
  const introSection = data?.introSection;
  const valuesOverview = data?.valuesOverview || [];
  const videoSection = data?.videoSection;

  // Get video URL from videoSection
  const videoUrl = videoSection?.youtubeLink || '';

  // Determine which poster image to use (desktop or mobile)
  const getPosterImage = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      return isMobile 
        ? (videoSection?.mobilePosterImage || videoSection?.desktopPosterImage)
        : (videoSection?.desktopPosterImage || videoSection?.mobilePosterImage);
    }
    return videoSection?.desktopPosterImage || videoSection?.mobilePosterImage;
  };

  const posterImage = getPosterImage();

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      
      {/* Intro Section */}
      {introSection && (
        <section className="our-values-content">
          <div className="our-values-content__logo">
            <Image
              src="/assets/our-values/logo.png"
              alt="Spirit of Lupin"
              width={500}
              height={200}
              quality={100}
              className="our-values-content__logo-img"
            />
          </div>
          <div className="our-values-content__container">
            <div className="our-values-content__frame">
              {introSection.heading && (
                <h2 className="our-values-content__heading">
                  {introSection.heading}
                </h2>
              )}
              {introSection.detailDescription && (
                <div className="our-values-content__description">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {introSection.detailDescription}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {/* Static Decoration Section */}
            <div className="our-values-content__decoration">
              <Image
                src="/assets/our-values/decoration.svg"
                alt="Decorative element"
                width={1228}
                height={576}
                quality={100}
                className="our-values-content__decoration-img"
              />
            </div>
          </div>
        </section>
      )}

      {/* Values Overview Section */}
      {valuesOverview.length > 0 && (
        <section className="our-values-listing">
          <div className="our-values-listing__container">
            <div className="our-values-listing__grid">
              {valuesOverview.map((value) => (
                <div key={value.id} className="our-values-listing__card">
                  {value.image && (
                    <div className="our-values-listing__card-image-wrapper">
                      <Image
                        src={value.image.url}
                        alt={value.image.alt || value.heading}
                        width={758}
                        height={553}
                        quality={100}
                        className="our-values-listing__card-image"
                      />
                    </div>
                  )}
                  <div className="our-values-listing__card-content">
                    {value.heading && (
                      <h3 className="our-values-listing__card-title">
                        {value.heading}
                      </h3>
                    )}
                    {value.description && (
                      <div className="our-values-listing__card-description">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {value.description}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {videoSection && videoSection.sectionTitle && (
        <section className="our-values-video">
          <div className="our-values-video__container">
            <h2 className="our-values-video__heading">
              {videoSection.sectionTitle}
            </h2>
            {posterImage && videoUrl && (
              <div className="our-values-video__wrapper" onClick={() => setIsVideoModalOpen(true)}>
                <Image
                  src={posterImage.url}
                  alt={posterImage.alt || 'Video poster'}
                  fill
                  className="our-values-video__poster-image"
                  quality={100}
                />
                <div className="our-values-video__play-button-wrapper">
                  <button className="our-values-video__play-button" aria-label="Play video">
                    <svg width="152" height="152" viewBox="0 0 152 152" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="76" cy="76" r="76" fill="white"/>
                      <path d="M64 48L64 104L104 76L64 48Z" fill="#08A03F"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {videoUrl && (
        <VideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
          videoUrl={videoUrl}
        />
      )}
    </div>
  );
}

