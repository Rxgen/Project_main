"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import Link from "next/link";
import React, { useState } from "react";
import { normalizeUploadUrl } from "@/lib/strapi-utils";
import "@/scss/pages/corporate-governance/policies.scss";
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
      alt: "Policies - Lupin",
    },
    bannerMobile: { url: "", alt: "Policies - Lupin" },
  },
};

export default function PoliciesClient({ bannerData, policies, error }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const effectiveBanner = FALLBACK_BANNER;
  const list = Array.isArray(policies) ? policies : [];

  return (
    <div className="corporate-governance">
      <InnerBanner data={effectiveBanner} />

      <section className="corporate-governance__content">
        <NavigationLinks links={NAV_LINKS} />

        <div className="corporate-governance__main">
          <h1 className="corporate-governance__header">Policies</h1>

          {error && (
            <div className="policies__section" role="alert">
              <p className="corporate-governance__header" style={{ fontSize: "1rem", fontWeight: 400 }}>
                Unable to load policies at this time. Please try again later.
              </p>
              {process.env.NODE_ENV === "development" && (
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>{error}</p>
              )}
            </div>
          )}

          {!error && list.length === 0 && (
            <div className="policies__section">
              <p className="corporate-governance__header" style={{ fontSize: "1rem", fontWeight: 400 }}>
                No policies available at this time.
              </p>
            </div>
          )}

          {!error && list.length > 0 && (
            <div className="policies__section">
              <div
                className="policies__grid"
                onMouseLeave={() => setActiveIndex(0)}
              >
                {list.map((doc, index) => {
                  const href = normalizeUploadUrl(doc.pdfUrl) || "#";
                  return (
                    <Link
                      key={doc.id ?? index}
                      href={href}
                      className={`policies__card${index === activeIndex ? " policies__card--active" : ""}`}
                      aria-label={`Download ${doc.title}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      target={href !== "#" ? "_blank" : undefined}
                      rel={href !== "#" ? "noopener noreferrer" : undefined}
                    >
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
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <img
            src="/assets/images/investors/shapes/light-petal.png"
            alt=""
            className="policies__petal"
            aria-hidden
          />
        </div>
      </section>
    </div>
  );
}
