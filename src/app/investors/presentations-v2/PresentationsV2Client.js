"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { normalizeUploadUrl } from "@/lib/strapi-utils";
import "@/scss/pages/news-and-events-v2.scss";
import "@/scss/pages/presentations-v2.scss";
import "@/scss/pages/corporate-governance/code-of-conduct.scss";
import "@/scss/pages/corporate-governance/policies.scss";

/**
 * Same source as Presentations.js `staticVideo` — YouTube + thumbnail for the
 * JP Morgan row when Strapi returns a matching title (no strapi-reports changes).
 */
const PRESENTATION_VIDEO_LEGACY = {
  title: "Vinita Gupta at the JP Morgan Healthcare Conference Jan 12 2021",
  youtubeUrl: "https://www.youtube.com/watch?v=hvCl7ut5vNI",
  thumbnail: "/assets/images/videothumb/vinita_conference.png",
};

const FALLBACK_BANNER = {
  title: { line1: "News and", line2: "Events" },
  subHeading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/presentations-v2-banner.png",
      alt: "Presentations - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/share-price-banner.png",
      alt: "Presentations - Lupin",
    },
  },
};

function isVideoPresentationTitle(title) {
  const a = (title || "").trim().toLowerCase();
  const b = PRESENTATION_VIDEO_LEGACY.title.trim().toLowerCase();
  return a === b;
}

/** Same embed + autoplay pattern as MediaCoverage.js video popup */
function getPresentationYouTubeEmbedUrl(watchUrl) {
  if (!watchUrl || typeof watchUrl !== "string") return "";
  const shorts = watchUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shorts) {
    return `https://www.youtube.com/embed/${shorts[1]}?autoplay=1`;
  }
  const regular = watchUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (regular) {
    return `https://www.youtube.com/embed/${regular[1]}?autoplay=1`;
  }
  return "";
}

const LEGACY_VIDEO_CARD_ID = "presentation-video-legacy";

/**
 * Same ordering as Presentations.js: up to 3 PDF cards from CMS, then the JP Morgan
 * video card, then the rest. Strapi often omits the 2021 row — we always inject
 * the video slot and remove any duplicate row with the same title.
 */
function buildPresentationsListWithVideoSlot(presentations) {
  const raw = Array.isArray(presentations) ? presentations : [];
  if (raw.length === 0) {
    return [];
  }
  const withoutDuplicateVideo = raw.filter((p) => !isVideoPresentationTitle(p.title));
  const synthetic = {
    id: LEGACY_VIDEO_CARD_ID,
    title: PRESENTATION_VIDEO_LEGACY.title,
    pdfUrl: "#",
    isActive: true,
  };
  const first = withoutDuplicateVideo.slice(0, 3);
  const rest = withoutDuplicateVideo.slice(3);
  return [...first, synthetic, ...rest];
}

export default function PresentationsV2Client({
  bannerData,
  presentations = [],
  presentationsTitle = "Presentations",
  error = null,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const effectiveBanner = FALLBACK_BANNER;
  const list = useMemo(
    () => buildPresentationsListWithVideoSlot(presentations),
    [presentations]
  );

  const presentationEmbedUrl = useMemo(
    () => getPresentationYouTubeEmbedUrl(PRESENTATION_VIDEO_LEGACY.youtubeUrl),
    []
  );

  useEffect(() => {
    if (!isVideoModalOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVideoModalOpen]);

  useEffect(() => {
    if (!isVideoModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsVideoModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVideoModalOpen]);

  const closeVideoPopup = () => setIsVideoModalOpen(false);

  const onVideoOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeVideoPopup();
  };

  return (
    <div className="news-events__container">
      <InnerBanner data={effectiveBanner} />
      <div className="news-events__content">
        <div
          className="news-events__petals news-events__petals--left"
          aria-hidden
        >
          <Image
            src="/assets/images/investors/shapes/light-petal-inverted.png"
            alt=""
            width={484}
            height={232}
            className="news-events__petals-img"
            quality={100}
            unoptimized
          />
        </div>
        <div
          className="news-events__petals news-events__petals--right"
          aria-hidden
        >
          <Image
            src="/assets/images/investors/shapes/light-petal-inverted.png"
            alt=""
            width={484}
            height={232}
            className="news-events__petals-img"
            quality={100}
            unoptimized
          />
        </div>
        <div className="news-events__tabs">
          <NavigationLinks
            links={[
              {
                id: "press-releases",
                label: "Press Releases",
                href: "/investors/press-releases-v2",
              },
              {
                id: "presentations",
                label: "Presentations",
                href: "/investors/presentations-v2",
              },
            ]}
          />
        </div>
      </div>

      <div className="presentation__container">
        <div className="presentation__header">
          <h1>{presentationsTitle}</h1>
          {/* <button type="button" className="presentation__button">
            <span className="presentation__button-label">Explore</span>
            <Image
              src="/assets/images/investors/shapes/nav-arrow.png"
              alt=""
              width={20}
              height={20}
              className="presentation__button-arrow"
            />
          </button> */}
        </div>
      </div>

      <div className="corporate-governance__main">
        <div className="policies__section">
          {error && (
            <div className="policies__grid" role="alert">
              <p style={{ gridColumn: "1 / -1", color: "#126430" }}>
                Unable to load presentations at this time. Please try again
                later.
              </p>
              {process.env.NODE_ENV === "development" && (
                <p
                  style={{
                    gridColumn: "1 / -1",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          )}

          {!error && list.length === 0 && (
            <div className="policies__grid">
              <p style={{ gridColumn: "1 / -1", color: "#126430" }}>
                No presentations available at this time.
              </p>
            </div>
          )}

          {!error && list.length > 0 && (
            <div
              className="policies__grid"
              onMouseLeave={() => setActiveIndex(0)}
            >
              {list.map((doc, index) => {
                const cardClass = `policies__card${index === activeIndex ? " policies__card--active" : ""}`;
                const hasVideo = isVideoPresentationTitle(doc.title);
                const downloadHref =
                  normalizeUploadUrl(doc.pdfUrl) || doc.pdfUrl || "#";
                const hrefOk = downloadHref && downloadHref !== "#";

                if (hasVideo) {
                  return (
                    <button
                      key={doc.id ?? index}
                      type="button"
                      className={`${cardClass} policies__card--video-trigger`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setIsVideoModalOpen(true)}
                      aria-label={`Play video: ${doc.title}`}
                    >
                      <div className="policies__card-inner">
                        <h2 className="policies__card-title">{doc.title}</h2>
                      </div>
                      <span
                        className="presentation__video-thumb"
                        aria-hidden
                      >
                        <span className="presentation__video-thumb-ring">
                          <Image
                            src={PRESENTATION_VIDEO_LEGACY.thumbnail}
                            alt=""
                            fill
                            className="presentation__video-thumb-img"
                            sizes="(max-width: 425px) 66px, (max-width: 768px) 68px, 120px"
                            quality={100}
                            unoptimized
                          />
                          <span className="presentation__video-play">
                            <Image
                              src="/assets/images/investors/shapes/playbutton.svg"
                              alt=""
                              width={36}
                              height={36}
                              unoptimized
                            />
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                }

                const cardInner = (
                  <>
                    <div className="policies__card-inner">
                      <h2 className="policies__card-title">{doc.title}</h2>
                    </div>
                    <span className="policies__download-btn">
                      <img
                        src="/assets/images/investors/shapes/download-button.png"
                        alt=""
                        aria-hidden
                      />
                    </span>
                  </>
                );

                return (
                  <Link
                    key={doc.id ?? index}
                    href={hrefOk ? downloadHref : "#"}
                    className={cardClass}
                    aria-label={`Download ${doc.title}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    target={hrefOk ? "_blank" : undefined}
                    rel={hrefOk ? "noopener noreferrer" : undefined}
                    onClick={!hrefOk ? (e) => e.preventDefault() : undefined}
                  >
                    {cardInner}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <img
          src="/assets/images/investors/shapes/light-petal.png"
          alt=""
          className="policies__petal"
          aria-hidden
        />
      </div>

      {isVideoModalOpen && presentationEmbedUrl ? (
        <div
          className="presentation-video-popup__overlay"
          onClick={onVideoOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Presentation video"
        >
          <div className="presentation-video-popup">
            <button
              type="button"
              className="presentation-video-popup__close"
              onClick={closeVideoPopup}
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
            <div className="presentation-video-popup__video-wrap">
              <iframe
                className="presentation-video-popup__iframe"
                src={presentationEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={PRESENTATION_VIDEO_LEGACY.title}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
