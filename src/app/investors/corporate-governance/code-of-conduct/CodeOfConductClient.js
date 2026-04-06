"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import React, { useState } from "react";
import { normalizeUploadUrl } from "@/lib/strapi-utils";
import "@/scss/pages/corporate-governance/code-of-conduct.scss";

const NAV_LINKS = [
  {
    id: "our-leadership",
    label: "Our Leadership",
    href: "/investors/corporate-governance/our-leadership",
  },
  {
    id: "committees-of-the-board",
    label: "Committees of the Board",
    href: "/investors/corporate-governance/committees-of-board",
  },
  {
    id: "code-of-conduct",
    label: "Code of Conduct",
    href: "/investors/corporate-governance/code-of-conduct",
  },
  {
    id: "policies",
    label: "Policies",
    href: "/investors/corporate-governance/policies",
  },
  {
    id: "moa-and-aoa",
    label: "MOA and AOA",
    href: "/investors/corporate-governance/moa-and-aoa",
  },
];

const FALLBACK_BANNER = {
  title: { line1: "Corporate", line2: "Governance" },
  subHeading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/investors-annual-report-banner.png",
      alt: "Code of Conduct - Lupin",
    },
    bannerMobile: { url: "", alt: "Code of Conduct - Lupin" },
  },
};

export default function CodeOfConductClient({ bannerData, cards, error }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const effectiveBanner = FALLBACK_BANNER;
  const list = Array.isArray(cards) ? cards : [];

  return (
    <div className="corporate-governance">
      <InnerBanner data={effectiveBanner} />

      <section className="corporate-governance__content">
        <NavigationLinks links={NAV_LINKS} />

        <div className="corporate-governance__main">
          <h1 className="corporate-governance__header">Code of Conduct</h1>

          {error && (
            <div className="code-of-conduct__section" role="alert">
              <p
                className="corporate-governance__header"
                style={{ fontSize: "1rem", fontWeight: 400 }}
              >
                Unable to load code of conduct documents at this time. Please try
                again later.
              </p>
              {process.env.NODE_ENV === "development" && (
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                  {error}
                </p>
              )}
            </div>
          )}

          {!error && list.length === 0 && (
            <div className="code-of-conduct__section">
              <p
                className="corporate-governance__header"
                style={{ fontSize: "1rem", fontWeight: 400 }}
              >
                No code of conduct documents available at this time.
              </p>
            </div>
          )}

          {!error && list.length > 0 && (
            <div className="code-of-conduct__section">
              <div
                className="code-of-conduct__grid"
                onMouseLeave={() => setActiveIndex(0)}
              >
                {list.map((doc, index) => {
                  const mainHref = normalizeUploadUrl(doc.downloadHref) || "#";
                  const mainIsValid = mainHref !== "#";

                  return (
                    <div
                      key={doc.id ?? index}
                      className={`code-of-conduct__card${index === activeIndex ? " code-of-conduct__card--active" : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className="code-of-conduct__card-inner">
                        <h2 className="code-of-conduct__card-title">
                          {mainIsValid ? (
                            <a
                              href={mainHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="code-of-conduct__card-title-link"
                            >
                              {doc.title}
                            </a>
                          ) : (
                            doc.title
                          )}
                        </h2>
                        {doc.languages && doc.languages.length > 0 && (
                          <div className="code-of-conduct__card-lang-wrap">
                            <p className="code-of-conduct__card-lang">
                              {doc.languages.map((lang, i) => {
                                const langHref =
                                  normalizeUploadUrl(lang.href) || "#";
                                const langOk = langHref !== "#";
                                return (
                                  <React.Fragment key={`${lang.label}-${i}`}>
                                    {i > 0 && (
                                      <span className="code-of-conduct__card-lang-sep" aria-hidden>
                                        |
                                      </span>
                                    )}
                                    {langOk ? (
                                      <a
                                        href={langHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="code-of-conduct__card-lang-link"
                                      >
                                        {lang.label}
                                      </a>
                                    ) : (
                                      <span className="code-of-conduct__card-lang-text">
                                        {lang.label}
                                      </span>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                      {mainIsValid ? (
                        <a
                          href={mainHref}
                          className="code-of-conduct__download-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Download ${doc.title}`}
                        >
                          <img
                            src="/assets/images/investors/shapes/download-button.png"
                            alt=""
                            aria-hidden
                          />
                        </a>
                      ) : (
                        <span className="code-of-conduct__download-btn code-of-conduct__download-btn--disabled">
                          <img
                            src="/assets/images/investors/shapes/download-button.png"
                            alt=""
                            aria-hidden
                          />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <img
            src="/assets/images/investors/shapes/light-petal.png"
            alt=""
            className="code-of-conduct__petal"
            aria-hidden
          />
        </div>
      </section>
    </div>
  );
}
