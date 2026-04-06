"use client";

import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import React, { useState } from "react";
import "@/scss/pages/shareholding/share-price-v2.scss";
import Image from "next/image";
import Link from "next/link";
import Chart from "@/components/investors/Chart";

const SHARE_PRICE_GRID_ROWS = [
  [
    { label: "Industry", value: "Pharmaceuticals" },
    { label: "Mkt.Cap (₹ Cr.)", value: "104,781.73" },
    { label: "Book Value (₹)", value: "455.39" },
    { label: "FV/M/L", value: "2/1" },
  ],
  [
    { label: "ISIN No", value: "INE326A01037" },
    { label: "52 Week H/L", value: "2,377.60/1,795.20" },
    { label: "Price (₹)", value: "2,292.60" },
    { label: "EPS (₹)", value: "71.80" },
  ],
  [
    { label: "BSE Code", value: "500257" },
    { label: "NSE Code", value: "LUPIN" },
    { label: "Inst. Investors (%)", value: "47.06" },
    { label: "Promoters (%)", value: "46.89" },
  ],
];

const YEARS = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
];

/** Placeholder rows — replace with API data per selected year / exchange */
const MONTHLY_PRICE_ROWS = [
  { month: "January", open: "2,114.00", close: "2,152.80", returnPct: "1.83" },
  { month: "February", open: "2,153.00", close: "2,301.90", returnPct: "6.91" },
  { month: "March", open: "2,275.60", close: "2,314.90", returnPct: "1.72" },
];

/** Shown under the chart — wire to Chart.js hover / selected point when ready */
const CHART_SUMMARY_ROW = {
  open: "2,114.00",
  close: "2,152.80",
  returnPct: "1.83",
};

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

const SharePriceV2 = () => {
  const [activeExchange, setActiveExchange] = useState("NSE");
  const [activeYear, setActiveYear] = useState(YEARS[0]);

  return (
    <div className="share-price__container">
      <div className="share-price__banner">
        <InnerBanner data={BANNER_DATA} />
      </div>
      <div className="share-price__content">
        <div className="media-navigation__tabs">
          <NavigationLinks
            links={[
              {
                id: "stock-exchange-intimations",
                label: "Stock Exhange Intimations",
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
        {/* Images Cards */}
        <section className="share-price__cards">
          <div className="share-price__card">
            <Image
              className="share-price__card-image"
              src="/assets/images/investors/share-capital-image.png"
              width="884"
              height="400"
              sizes="(max-width: 768px) 100vw, 884px"
            />
            <span className="share-price__texts">
              <h1>Share Capital</h1>
              <p>
                Code of Practices and Procedures for Fair Disclosure of
                Unpublished Price Sensitive Information.
              </p>
            </span>
          </div>
          <div className="share-price__card">
            <Image
              className="share-price__card-image"
              src="/assets/images/investors/listing-securities-image.png"
              width="884"
              height="400"
              sizes="(max-width: 768px) 100vw, 884px"
            />
            <span className="share-price__texts">
              <h1>Listing of Securities</h1>
              <p>
                The Equity Shares of the Company are listed on BSE Limited and
                The National Stock Exchange of India Limited since 10th
                September 2001.
              </p>
            </span>
          </div>
        </section>
        {/* share price section */}
        <div className="share-price__tabular-data">
          <h1>Share Price</h1>
          <div className="share-price__data-grid-panel">
            <div className="share-price__data-grid">
              {SHARE_PRICE_GRID_ROWS.map((row, rowIndex) =>
                row.map((cell) => (
                  <React.Fragment key={`${rowIndex}-${cell.label}`}>
                    <div className="share-price__grid-label">{cell.label}</div>
                    <div className="share-price__grid-value">{cell.value}</div>
                  </React.Fragment>
                )),
              )}
            </div>
            <p className="share-price__grid-footnote">
              You can view the price movement of the company for last 10 years.
              Currently viewing {activeYear} data.
            </p>
          </div>
        </div>
      </div>
      {/* NSE - BSE button*/}
      <div className="share-price__graph">
        <div className="share-price__buttons">
          <button
            type="button"
            className={
              activeExchange === "NSE"
                ? "share-price__exchange-btn--active"
                : undefined
            }
            onClick={() => setActiveExchange("NSE")}
            aria-pressed={activeExchange === "NSE"}
          >
            NSE
          </button>
          <button
            type="button"
            className={
              activeExchange === "BSE"
                ? "share-price__exchange-btn--active"
                : undefined
            }
            onClick={() => setActiveExchange("BSE")}
            aria-pressed={activeExchange === "BSE"}
          >
            BSE
          </button>
        </div>
        <div className="share-price__divider" />
        <div className="share-price__years">
          {YEARS.map((year) => (
            <button
              type="button"
              className={`share-price__year${
                activeYear === year ? " share-price__year--active" : ""
              }`}
              key={year}
              onClick={() => setActiveYear(year)}
              aria-pressed={activeYear === year}
            >
              {year}
            </button>
          ))}
        </div>
        <div className="share-price__year-dashboard">
          <div className="share-price__monthly-table-wrap">
            <table className="share-price__monthly-table">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    scope="col"
                    className="share-price__monthly-th share-price__monthly-th--label"
                  >
                    Month
                  </th>
                  <th
                    colSpan={2}
                    scope="colgroup"
                    className="share-price__monthly-th share-price__monthly-th--label"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="share-price__monthly-th share-price__monthly-th--label"
                  >
                    Return
                  </th>
                </tr>
                <tr>
                  <th
                    scope="col"
                    className="share-price__monthly-th share-price__monthly-th--sub"
                  >
                    Open (Rs.)
                  </th>
                  <th
                    scope="col"
                    className="share-price__monthly-th share-price__monthly-th--sub"
                  >
                    Close (Rs.)
                  </th>
                  <th
                    scope="col"
                    className="share-price__monthly-th share-price__monthly-th--sub"
                  >
                    (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_PRICE_ROWS.map((row) => (
                  <tr key={row.month}>
                    <td className="share-price__monthly-td share-price__monthly-td--month">
                      {row.month}
                    </td>
                    <td className="share-price__monthly-td share-price__monthly-td--num">
                      {row.open}
                    </td>
                    <td className="share-price__monthly-td share-price__monthly-td--num">
                      {row.close}
                    </td>
                    <td className="share-price__monthly-td share-price__monthly-td--num">
                      {row.returnPct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="share-price__chart-column">
            <div className="share-price__chart-slot" aria-label="Price chart">
              {/* Mount Chart.js canvas / component here */}
              <Chart />
            </div>
            <table className="share-price__chart-summary-table">
              <thead>
                <tr>
                  <th scope="col" className="share-price__chart-summary-th">
                    Open (Rs.)
                  </th>
                  <th scope="col" className="share-price__chart-summary-th">
                    Close (Rs.)
                  </th>
                  <th scope="col" className="share-price__chart-summary-th">
                    Return (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="share-price__chart-summary-td">
                    {CHART_SUMMARY_ROW.open}
                  </td>
                  <td className="share-price__chart-summary-td">
                    {CHART_SUMMARY_ROW.close}
                  </td>
                  <td className="share-price__chart-summary-td">
                    {CHART_SUMMARY_ROW.returnPct}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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

export default SharePriceV2;
