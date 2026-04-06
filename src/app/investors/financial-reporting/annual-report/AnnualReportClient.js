"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import { normalizeUploadUrl } from "@/lib/strapi-utils";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import "@/scss/pages/investors-quarterly-results.scss";
import "@/scss/pages/investors-annual-report.scss";

const BANNER_DATA = {
  title: { line1: "Financial", line2: "Reporting" },
  subheading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/investors-quarterly-results-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/investors-quarterly-results-mobile-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
  },
};

const DEFAULT_CARD_BG = "/assets/images/investors/annual-report-content-bg.png";

function isEsgMicrositeButtonLabel(label) {
  const t = (label || "").trim().toLowerCase();
  return (
    t === "visit esg microsite" ||
    (t.includes("esg") && t.includes("microsite"))
  );
}

/**
 * Mirrors IntegratedReportAnnualReport + transformAnnualReportsForComponent:
 * main card buttons first, then pdfCard rows; split 6 + remainder like the static layout.
 * ESG microsite is excluded from lists and shown centered on the card image.
 */
function buildColumnsForYear(year, tabsData) {
  const entry = tabsData?.[year];
  if (!entry) {
    return {
      left: [],
      right: [],
      cardData: null,
      esgMicrositeLink: null,
    };
  }
  const { cardData, extraSmallCards = [] } = entry;
  const virtual = [];
  let esgMicrositeLink = null;

  if (Array.isArray(cardData?.buttons)) {
    for (const btn of cardData.buttons) {
      const href = btn?.href;
      if (href && href !== "#") {
        const label = (btn.label || "Link").trim();
        if (isEsgMicrositeButtonLabel(label)) {
          esgMicrositeLink = {
            id: "annual-esg-microsite",
            title: label,
            pdfUrl: href,
            isActive: true,
          };
          continue;
        }
        const title =
          label.toLowerCase() === "download now" ? "Integrated AR" : label;
        virtual.push({
          id: `annual-btn-${virtual.length}-${btn.label}`,
          title,
          pdfUrl: href,
          isActive: true,
        });
      }
    }
  }
  const merged = [
    ...virtual,
    ...extraSmallCards.map((c, i) => ({
      id: c.id ?? `pdf-${i}-${c.title}`,
      title: c.title || "Document",
      pdfUrl: c.pdfUrl,
      isActive: c.isActive !== false,
    })),
  ];
  return {
    left: merged.slice(0, 6),
    right: merged.slice(6),
    cardData,
    esgMicrositeLink,
  };
}

function linkHrefForRow(row) {
  if (row.isActive === false) return null;
  const raw = row.pdfUrl;
  const normalized = normalizeUploadUrl(raw) || raw;
  if (!normalized || normalized === "#") return null;
  return normalized;
}

/** Safe inside `url("...")` in inline CSS: escape `\` first, then `"`. */
function escapeForCssQuotedUrl(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export default function AnnualReportClient({ tabs = [], tabsData = {}, error = null }) {
  const [selectedYear, setSelectedYear] = useState(() => tabs[0] || "");

  useEffect(() => {
    if (tabs.length === 0) {
      setSelectedYear("");
      return;
    }
    if (!tabs.includes(selectedYear)) {
      setSelectedYear(tabs[0]);
    }
  }, [tabs, selectedYear]);

  const { left, right, cardData, esgMicrositeLink } = useMemo(
    () => buildColumnsForYear(selectedYear, tabsData),
    [selectedYear, tabsData]
  );

  const cardBgUrl =
    (cardData?.image?.url && String(cardData.image.url).trim()) || DEFAULT_CARD_BG;

  const esgMicrositeHref = useMemo(
    () => (esgMicrositeLink ? linkHrefForRow(esgMicrositeLink) : null),
    [esgMicrositeLink]
  );

  const renderRow = (row) => {
    const href = linkHrefForRow(row);
    return (
      <li key={String(row.id)} className="annual-report__item">
        <Link
          href={href || "#"}
          className="annual-report__link"
          target={href ? "_blank" : undefined}
          rel={href ? "noopener noreferrer" : undefined}
          onClick={!href ? (e) => e.preventDefault() : undefined}
          aria-disabled={!href}
        >
          <img
            src="/assets/images/investors/shapes/petal.png"
            alt=""
            className="annual-report__petal"
            aria-hidden
          />
          <span className="annual-report__link-body">
            <span className="annual-report__link-text">{row.title}</span>
            <img src="/assets/images/investors/shapes/nav-arrow.png" alt="" className="annual-report__arrow" aria-hidden />
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="quarterly-results">
      <InnerBanner data={BANNER_DATA} />

      <section className="quarterly-results__content">
        <NavigationLinks
          links={[
            {
              id: "financial-info",
              label: "Financial Information",
              href: "/investors/financial-reporting/financial-info",
            },
            {
              id: "quarterly-results",
              label: "Quarterly Results",
              href: "/investors/financial-reporting/quarterly-results",
            },
            {
              id: "annual-report",
              label: "Integrated Annual Report",
              href: "/investors/financial-reporting/annual-report",
            },
            {
              id: "financial-statements-of-subsidiaries",
              label: "Financial Statement Of Subsidiaries",
              href: "/investors/financial-reporting/financial-statements-of-subsidiaries",
            },
          ]}
        />

        <div className="quarterly-results__bg">
          <h1 className="quarterly-results__header">Integrated Annual Report</h1>

          {error && (
            <p className="annual-report__link-text" role="alert">
              Unable to load annual report data. Please try again later.
              {process.env.NODE_ENV === "development" ? ` (${error})` : ""}
            </p>
          )}

          <div className="annual-report__years">
            {tabs.map((year) => (
              <button
                key={year}
                type="button"
                className={`annual-report__year-btn ${
                  selectedYear === year ? "annual-report__year-btn--active" : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="annual-report__content">
            <div className="annual-report__list-section">
              <div
                className={`annual-report__list-wrap${
                  right.length === 0 ? " annual-report__list-wrap--single" : ""
                }`}
              >
                <ul className="annual-report__list">
                  {tabs.length === 0 ? (
                    <li className="annual-report__item">
                      <span className="annual-report__link-text">
                        No annual report data is available at this time.
                      </span>
                    </li>
                  ) : left.length === 0 ? (
                    <li className="annual-report__item">
                      <span className="annual-report__link-text">
                        No documents for this year.
                      </span>
                    </li>
                  ) : (
                    left.map(renderRow)
                  )}
                </ul>
                {right.length > 0 ? (
                  <>
                    <div
                      className="annual-report__divider"
                      role="presentation"
                      aria-hidden
                    />
                    <ul className="annual-report__list">
                      {right.map(renderRow)}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>

            <div className="annual-report__card">
              <div
                className="annual-report__card-bg"
                style={{
                  backgroundImage: `url("${escapeForCssQuotedUrl(cardBgUrl)}")`,
                }}
              />
              {esgMicrositeLink ? (
                <div className="annual-report__card-esg">
                  <Link
                    href={esgMicrositeHref || "#"}
                    className="annual-report__card-esg-link"
                    target={esgMicrositeHref ? "_blank" : undefined}
                    rel={esgMicrositeHref ? "noopener noreferrer" : undefined}
                    onClick={
                      !esgMicrositeHref ? (e) => e.preventDefault() : undefined
                    }
                    aria-label={esgMicrositeLink.title}
                  >
                    <span className="annual-report__card-esg-text">
                      {esgMicrositeLink.title}
                    </span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
