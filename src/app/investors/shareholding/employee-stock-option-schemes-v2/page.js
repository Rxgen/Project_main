"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "@/scss/pages/corporate-governance/code-of-conduct.scss";
import "@/scss/pages/corporate-governance/policies.scss";
import "@/scss/pages/shareholding/employee-stock-option-schemes-v2.scss";

const BANNER_DATA = {
  title: { line1: "Shareholder", line2: "Information" },
  subheading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/share-price-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/share-price-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
  },
};

const FILTER_YEARS = Array.from({ length: 10 }, (_, i) => 2026 - i);

// TODO: Replace with API/CMS data + real PDF links.
const SCHEMES = [
  {
    title: "Lupin Employees Stock Option Scheme 2025",
    year: 2025,
    href: "#",
  },
];

const EmployeeStockOptionSchemes = () => {
  const [yearFilter, setYearFilter] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  useEffect(() => {
    if (!yearMenuOpen) return undefined;
    const onPointerDown = (e) => {
      if (!yearDropdownRef.current?.contains(e.target)) {
        setYearMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setYearMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [yearMenuOpen]);

  const filteredSchemes = useMemo(() => {
    if (!yearFilter) return SCHEMES;
    const y = Number(yearFilter);
    return SCHEMES.filter((s) => s.year === y);
  }, [yearFilter]);

  const displayIndex =
    activeIndex < filteredSchemes.length ? activeIndex : 0;

  return (
    <div className="employee-stock-option__container">
      <div className="employee-stock-option__banner">
        <InnerBanner data={BANNER_DATA} />
      </div>
      <div className="employee-stock-option__content">
        <div className="media-navigation__tabs">
          <NavigationLinks
            links={[
              {
                id: "stock-exchange-intimations",
                label: "Stock Exchange Intimations",
                href: "/investors/shareholding/stock-exchange-intimations",
              },
              {
                id: "postal-ballot",
                label: "AGM, Postal Ballot and EGM",
                href: "/investors/shareholding/postal-ballot",
              },
              {
                id: "shareholder-pattern",
                label: "Shareholding Pattern",
                href: "/investors/shareholding/shareholder-pattern",
              },
              {
                id: "share-price",
                label: "Share Price",
                href: "/investors/shareholding/share-price-v2",
              },
              {
                id: "ratings",
                label: "Ratings",
                href: "/investors/shareholding/ratings",
              },
              {
                id: "dividend",
                label: "Dividend",
                href: "/investors/shareholding/dividend",
              },
              {
                id: "dividend-and-shares",
                label: "Unclaimed Dividend and Shares",
                href: "/investors/shareholding/dividend-and-shares",
              },
              {
                id: "employee-stock-option-schemes",
                label: "Employee Stock Option Schemes",
                href: "/investors/shareholding/employee-stock-option-schemes-v2",
              },
              {
                id: "important-communication-for-shareholders",
                label: "Important Communication for Shareholders",
                href: "/investors/shareholding/important-communication-for-shareholders",
              },
              {
                id: "investor-fAQs",
                label: "Investor FAQs",
                href: "/investors/shareholding/investor-fAQs",
              },
              {
                id: "investor-contacts",
                label: "Investor Contacts",
                href: "/investors/shareholding/investor-contacts",
              },
            ]}
          />
        </div>

        <header className="employee-stock-option__header">
          <h1 className="employee-stock-option__title">
            Employee Stock Option Schemes
          </h1>
          <div
            className="employee-stock-option__filter"
            ref={yearDropdownRef}
          >
            <div className="employee-stock-option__year-dropdown">
              <button
                type="button"
                id="employee-stock-option-year"
                className="employee-stock-option__year-trigger"
                aria-label="Filter by year"
                aria-haspopup="listbox"
                aria-expanded={yearMenuOpen}
                onClick={() => setYearMenuOpen((o) => !o)}
              >
                <span className="employee-stock-option__year-trigger-label">
                  {yearFilter || "Filter by year"}
                </span>
                <span
                  className={`employee-stock-option__year-trigger-chevron${yearMenuOpen ? " employee-stock-option__year-trigger-chevron--open" : ""}`}
                  aria-hidden
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="9"
                    viewBox="0 0 14 9"
                    fill="none"
                  >
                    <path
                      d="M1 1.5L7 7.5L13 1.5"
                      stroke="#E9FFF1"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {yearMenuOpen ? (
                <div
                  className="employee-stock-option__year-menu"
                  role="listbox"
                  aria-labelledby="employee-stock-option-year"
                >
                  {FILTER_YEARS.map((y) => {
                    const v = String(y);
                    const selected = yearFilter === v;
                    return (
                      <button
                        key={y}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={`employee-stock-option__year-option${selected ? " employee-stock-option__year-option--selected" : ""}`}
                        onClick={() => {
                          setYearFilter(v);
                          setActiveIndex(0);
                          setYearMenuOpen(false);
                        }}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="corporate-governance__main employee-stock-option__main">
          <div className="policies__section">
            <div
              className={`policies__grid${filteredSchemes.length === 1 ? " employee-stock-option__grid--single" : ""}`}
              onMouseLeave={() => setActiveIndex(0)}
            >
              {filteredSchemes.map((doc, index) => {
                const cardClass = `policies__card${index === displayIndex ? " policies__card--active" : ""}`;
                return (
                  <Link
                    key={`${doc.title}-${doc.year}`}
                    href={doc.href}
                    className={cardClass}
                    aria-label={`Download ${doc.title}`}
                    onMouseEnter={() => setActiveIndex(index)}
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
          <img
            src="/assets/images/investors/shapes/light-petal.png"
            alt=""
            className="policies__petal"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeStockOptionSchemes;
