
"use client";

import React, { useMemo, useState } from "react";
import "@/scss/pages/shareholding/stock-exchange-intimations.scss";
import "@/scss/pages/shareholding/share-price-v2.scss";
import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import Image from "next/image";
import Link from "next/link";

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

const YEARS = ["FY2025-26", "FY2024-25", "FY2023-24", "FY2022-23", "FY2021-22", "FY2020-21"];

const INTIMATION_ITEMS = [
  { id: "esg-ratings", label: "ESG ratings", href: "#" },
  { id: "esop-allotment", label: "Allotment of shares under ESOP", href: "#" },
  { id: "newspaper-ad", label: "Newspaper Ad - Q3 FY26 financial results", href: "#" },
  {
    id: "gst-search-1",
    label: "Disclosure on Inspection and Search by GST Department",
    href: "#",
  },
  {
    id: "gst-search-2",
    label: "Disclosure on conclusion of Inspection and Search by GST Department",
    href: "#",
  },
  {
    id: "board-meeting",
    label: "Board meeting – Appointment of Mr. Anand Kripalu",
    href: "#",
  },
  { id: "settlement", label: "Settlement and License Agreement", href: "#" },
  {
    id: "analyst-meet",
    label: "Intimation about participating in the Analyst / Institutional Investors Meet",
    href: "#",
  },
  {
    id: "newspaper-publication",
    label:
      "Newspaper Publication for the information regarding Special Window for Transfer and Dematerialization of Physical Shares",
    href: "#",
  },
  {
    id: "visufarma",
    label: "Update on acquisition of VISUfarma B.V., the Netherlands",
    href: "#",
  },
];

const StockExchangeIntimations = () => {
  const [activeYear, setActiveYear] = useState(YEARS[0]);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INTIMATION_ITEMS;
    return INTIMATION_ITEMS.filter((x) => x.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="stock-exchange-intimations__container">
      <div className="stock-exchange-intimations__banner">
        <InnerBanner data={BANNER_DATA} />
      </div>
      <div className="stock-exchange-intimations__content">
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
      </div>

      {/* main content */}
      <div className="stock-exchange-intimations__main-content">
        <section className="stock-exchange-intimations__panel">
          <div className="stock-exchange-intimations__panel-header-strip">

            <div className="stock-exchange-intimations__panel-header">
              <h1 className="stock-exchange-intimations__title">
                Stock Exchange Intimations
              </h1>

              <div className="stock-exchange-intimations__search">
                <Image
                  src="/assets/images/investors/search-icon.svg"
                  alt="Search"
                  width={22}
                  height={22}
                  className="stock-exchange-intimations__search-icon"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="stock-exchange-intimations__search-input"
                  type="search"
                  placeholder=""
                  aria-label="Search intimations"
                />
              </div>
            </div>

            <div
              className="stock-exchange-intimations__years"
              role="tablist"
              aria-label="Financial years"
            >
              {YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setActiveYear(year)}
                  className={
                    year === activeYear
                      ? "stock-exchange-intimations__year stock-exchange-intimations__year--active"
                      : "stock-exchange-intimations__year"
                  }
                  aria-pressed={year === activeYear}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="stock-exchange-intimations__panel-body">
            <div className="stock-exchange-intimations__grid" role="list">
              {filteredItems.map((item) => (
                <Link
                  key={`${activeYear}-${item.id}`}
                  href={item.href}
                  className="stock-exchange-intimations__grid-item"
                  role="listitem"
                >
                  <span className="stock-exchange-intimations__grid-item-inner">
                    <Image
                      src="/assets/images/investors/shapes/petal.png"
                      alt=""
                      width={16}
                      height={16}
                      className="stock-exchange-intimations__grid-bullet"
                    />
                    <span className="stock-exchange-intimations__grid-label">
                      <span className="stock-exchange-intimations__grid-text">
                        {item.label}
                      </span>
                      <Image
                        src="/assets/images/investors/shapes/nav-arrow.png"
                        alt=""
                        width={16}
                        height={16}
                        className="stock-exchange-intimations__grid-arrow"
                      />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section
        className="share-price__subscribe"
        aria-labelledby="share-price-subscribe-heading"
      >
        <div className="share-price__subscribe-grid">
          <div className="share-price__subscribe-visual">
            <Image
              src="/assets/images/investors/investors-subscibe-image.png"
              alt=""
              fill
              className="share-price__subscribe-image"
              sizes="(max-width: 425px) 100vw, (max-width: 768px) 100vw, 50vw"
            />
            <div className="share-price__subscribe-visual-inner">
              <h2
                id="share-price-subscribe-heading"
                className="share-price__subscribe-heading"
              >
                <p>Subscribe For</p>
                <p>Investor updates</p>
              </h2>
              <form className="share-price__subscribe-form" noValidate>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="share-price__subscribe-input"
                  autoComplete="email"
                />
                <label className="share-price__subscribe-agree">
                  <input
                    type="checkbox"
                    name="agree"
                    className="share-price__subscribe-checkbox-input"
                  />
                  <span className="share-price__subscribe-agree-label">
                    I agree and accept the{" "}
                    <Link
                      href="/privacy-policy"
                      className="share-price__subscribe-agree-link"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href="/terms-of-service"
                      className="share-price__subscribe-agree-link"
                    >
                      Terms of use
                    </Link>{" "}
                    of this website
                  </span>
                </label>
                <button type="submit" className="share-price__subscribe-submit">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <aside className="share-price__subscribe-aside">
            <h2 className="share-price__subscribe-aside-title1">
              <p>Investor</p>
              <p>Contacts</p>
            </h2>
            <p className="share-price__subscribe-aside-subtitle">
              Shareholder Services
            </p>
            <ul className="share-price__subscribe-aside-emails">
              <li>
                <a href="mailto:investorservices@lupin.com">
                  investorservices@lupin.com
                </a>
              </li>
              <li>
                <a href="mailto:rnt.helpdesk@in.mpms.mufg.com">
                  rnt.helpdesk@in.mpms.mufg.com
                </a>
              </li>
            </ul>
            <h2 className="share-price__subscribe-aside-subtitle2">
              <p>Investor Relations</p>
            </h2>
            <ul className="share-price__subscribe-aside-emails">
              <li>
                <a href="mailto:InvestorRelations@lupin.com">
                  InvestorRelations@lupin.com
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default StockExchangeIntimations;
