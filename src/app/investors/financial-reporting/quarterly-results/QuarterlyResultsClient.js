"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import { normalizeUploadUrl } from "@/lib/strapi-utils";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import "@/scss/pages/investors-quarterly-results.scss";

const BANNER_DATA = {
  title: { line1: "Financial", line2: "Reporting" },
  subheading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/investors-quarterly-results-banner.png",
      alt: "Quarterly Results - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/investors-quarterly-results-mobile-banner.png",
      alt: "Quarterly Results - Lupin",
    },
  },
};

/** Fallback headings if CMS period is missing; display order Q1 → Q4. */
const QUARTER_ORDER = [
  { id: "q1", label: "Q1 (APR-JUN)" },
  { id: "q2", label: "Q2 (JULY- SEPT)" },
  { id: "q3", label: "Q3 (OCT-DEC)" },
  { id: "q4", label: "Q4 (JAN-MAR)" },
];

function quarterNumberFromPeriod(period) {
  const m = String(period || "").match(/\bQ\s*([1-4])\b/i);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Map `quarters[]` from transformQuarterlyResultsForComponent into Q1–Q4:
 * cards per column + CMS period label per column (items[0].period).
 */
function quarterColumnsFromYear(yearPayload) {
  const cardsByQuarter = { 1: [], 2: [], 3: [], 4: [] };
  const periodByQuarter = {};
  const quarters = yearPayload?.quarters;
  if (!Array.isArray(quarters)) {
    return { cardsByQuarter, periodByQuarter };
  }

  for (const block of quarters) {
    const periodRaw = block?.items?.[0]?.period || "";
    const period = String(periodRaw).trim();
    const n = quarterNumberFromPeriod(period);
    if (n == null) continue;
    if (period && !periodByQuarter[n]) {
      periodByQuarter[n] = period;
    }
    const cards = Array.isArray(block.cards) ? block.cards : [];
    cardsByQuarter[n] = cardsByQuarter[n].concat(cards);
  }
  return { cardsByQuarter, periodByQuarter };
}

function hrefForCard(card) {
  if (card?.isActive === false) return null;
  const raw = card?.pdfUrl;
  const normalized = normalizeUploadUrl(raw) || raw;
  if (!normalized || normalized === "#") return null;
  return normalized;
}

export default function QuarterlyResultsClient({
  tabs = [],
  tabsData = {},
  error = null,
}) {
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

  const visibleQuarterColumns = useMemo(() => {
    const { cardsByQuarter, periodByQuarter } = quarterColumnsFromYear(
      tabsData[selectedYear]
    );
    return QUARTER_ORDER.map((q) => {
      const qn = parseInt(q.id.replace("q", ""), 10);
      const cards = cardsByQuarter[qn] || [];
      if (cards.length === 0) return null;
      return {
        columnKey: q.id,
        qn,
        heading: periodByQuarter[qn] || q.label,
        cards,
      };
    }).filter(Boolean);
  }, [tabsData, selectedYear]);

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
          <h1 className="quarterly-results__header">Quarterly Results</h1>

          {error && (
            <p className="quarterly-results__placeholder" role="alert">
              Unable to load quarterly results. Please try again later.
              {process.env.NODE_ENV === "development" ? ` (${error})` : ""}
            </p>
          )}

          <div className="quarterly-results__years">
            {tabs.map((year) => (
              <button
                key={year}
                type="button"
                className={`quarterly-results__year-btn ${
                  selectedYear === year
                    ? "quarterly-results__year-btn--active"
                    : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="quarterly-results__cards">
            {tabs.length === 0 ? (
              <p className="quarterly-results__placeholder">
                No financial year data available.
              </p>
            ) : visibleQuarterColumns.length === 0 ? (
              <p className="quarterly-results__placeholder">
                No quarterly documents for this year.
              </p>
            ) : (
              visibleQuarterColumns.map((col) => {
                const { columnKey, qn, heading, cards } = col;

                return (
                  <div key={columnKey} className="quarterly-results__card">
                    <h2 className="quarterly-results__card-heading">
                      {heading}
                    </h2>
                    <ul className="quarterly-results__card-list">
                      {cards.map((card, index) => {
                        const href = hrefForCard(card);
                        const itemKey =
                          card.id ?? `${qn}-${index}-${card.title}`;
                        return (
                          <li
                            key={itemKey}
                            className="quarterly-results__card-item"
                          >
                            <Link
                              href={href || "#"}
                              className="quarterly-results__card-link"
                              target={href ? "_blank" : undefined}
                              rel={href ? "noopener noreferrer" : undefined}
                              onClick={
                                !href ? (e) => e.preventDefault() : undefined
                              }
                              aria-disabled={!href}
                            >
                              <img
                                src="/assets/images/investors/shapes/petal.png"
                                alt=""
                                className="quarterly-results__card-petal"
                                aria-hidden
                              />
                              <span className="quarterly-results__card-link-text-wrap">
                                <span>{card.title || "Document"}</span>
                                <img
                                  src="/assets/images/investors/shapes/nav-arrow.png"
                                  alt=""
                                  className="quarterly-results__card-arrow"
                                  aria-hidden
                                />
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
