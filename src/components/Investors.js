'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/Investors.scss';

const SHAREPRICE_API = 'https://content.dionglobal.in/lupinworldnew/JSON/shareprice.aspx';

const defaultStockQuotes = {
  title: "Stock Quotes",
  lastUpdated: "Last updated on —",
  nse: "—",
  bse: "—",
  time: "—",
  change: "—",
  changePercent: "—"
};

function formatDateWithSpace(dateStr) {
  if (dateStr == null || dateStr === "—") return dateStr;
  const s = String(dateStr).trim();
  return s.replace(/,(?!\s)/g, ", ");
}

function parseSharePriceResponse(json) {
  if (!Array.isArray(json) || json.length === 0) return null;
  const byExchange = {};
  json.forEach((item) => {
    const rawDateTime = item.DateTime ?? "—";
    byExchange[item.exchange] = {
      current: item.Current ?? "—",
      change: item.Change_Nos ?? "—",
      changePercent: item.Change_Pct != null ? `${item.Change_Pct}%` : "—",
      dateTime: formatDateWithSpace(rawDateTime)
    };
  });
  const nse = byExchange.NSE;
  const bse = byExchange.BSE;
  if (!nse && !bse) return null;
  const lastItem = json[0];
  const lastUpdated = lastItem?.DateTime ? `Last updated on ${formatDateWithSpace(lastItem.DateTime)}` : "Last updated on —";
  return {
    title: "Stock Quotes",
    lastUpdated,
    nse: nse?.current ?? "—",
    bse: bse?.current ?? "—",
    nseMeta: nse ? { time: nse.dateTime, change: nse.change, changePercent: nse.changePercent } : null,
    bseMeta: bse ? { time: bse.dateTime, change: bse.change, changePercent: bse.changePercent } : null
  };
}

export default function Investors({ data }) {
  const [stockQuotes, setStockQuotes] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(SHAREPRICE_API)
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (cancelled) return;
        const parsed = parseSharePriceResponse(json);
        setStockQuotes(parsed || defaultStockQuotes);
      })
      .catch(() => {
        if (!cancelled) setStockQuotes(defaultStockQuotes);
      });
    return () => { cancelled = true; };
  }, []);

  // Default data (will be replaced by Strapi); stock quotes overridden by API when available
  const baseData = data || {
    eyebrow: "Investors",
    stockQuotes: defaultStockQuotes,
    performance: {
      title: "Performance",
      subtitle: {
        line1: "Lupin Q1 FY26",
        line2: "Financial Results"
      },
      downloads: [
        { label: "Earnings Release", href: "/investors/reports-filings", available: true },
        { label: "Analyst Presentation", href: "/investors/reports-filings", available: true }
      ]
    },
    exchangeReleases: {
      title: "Exchange Releases",
      description: {
        line1: "Lupin Financial Results",
        line2: "for the quarter",
        line3: "June 30, 2025"
      },
      cta: {
        text: "View Investor Reports",
        href: "/investors"
      }
    }
  };

  const quotes = stockQuotes ?? baseData.stockQuotes ?? defaultStockQuotes;
  const investorsData = {
    ...baseData,
    stockQuotes: quotes
  };

  const nseMeta = quotes.nseMeta ?? { time: quotes.time, change: quotes.change, changePercent: quotes.changePercent };
  const bseMeta = quotes.bseMeta ?? { time: quotes.time, change: quotes.change, changePercent: quotes.changePercent };

  return (
    <section className="investors">
      {/* Background Gradient */}
      <div className="investors__bg"></div>

      {/* Woman Image - Bottom Left */}
      <div className="investors__woman">
        <Image
          src="/assets/6e01a9ab02dfdbf2b098d95bb83f779151169bff.png"
          alt="Professional Woman"
          width={986}
          height={746}
          className="investors__woman-img"
          quality={100}
        />
      </div>

      {/* Content Container */}
      <div className="investors__container">
        {/* Top Text Section */}
        <h2 className="investors__eyebrow">{investorsData.eyebrow}</h2>
        <div className="investors__top">




          <div className="pricewrapper">
            <div className="investors__stock-header">
              <div className="investors__stock-title">
                <p>Stock</p>
                <p>Quotes</p>
              </div>
              <p className="investors__stock-updated">{investorsData.stockQuotes.lastUpdated}</p>
            </div>
            <div className="investors__stock-item investors__stock-item--1">
              <p className="investors__stock-value investors__stock-value--small">
                NSE : {investorsData.stockQuotes.nse} <span className="investors__stock-meta">{nseMeta.time}    {nseMeta.change}    {nseMeta.changePercent}</span>
              </p>
            </div>

            <div className="investors__stock-item investors__stock-item--2">
              <p className="investors__stock-value investors__stock-value--small">
                BSE : {investorsData.stockQuotes.bse} <span className="investors__stock-meta">{bseMeta.time}    {bseMeta.change}    {bseMeta.changePercent}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Circles Section */}
        <div className="investors__circles">
          {/* Circle 1 - Performance */}
          <div className="investors__circle investors__circle--1">
            <div className="investors__circle-title">{investorsData.performance.title}</div>
            <div className="investors__circle-subtitle">
              <p>{investorsData.performance.subtitle.line1}</p>
              <p>{investorsData.performance.subtitle.line2}</p>
            </div>

            <div className="investors__downloads">
              {investorsData.performance.downloads.map((download, index) => (
                <div key={index} className="investors__download-item">
                  <p className="investors__download-label">{download.label}</p>
                  {download.available ? (
                    <Link href={download.href} className="investors__download-btn investors__download-btn--active">
                      View
                    </Link>
                  ) : (
                    <span className="investors__download-btn investors__download-btn--active">
                      View
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Circle 2 - Exchange Releases */}
          <div className="investors__circle investors__circle--2">
            <div className="investors__circle-title">{investorsData.exchangeReleases.title}</div>
            <div className="investors__circle-description">
              <p>{investorsData.exchangeReleases.description.line1}</p>
              <p>{investorsData.exchangeReleases.description.line2}</p>
              <p>{investorsData.exchangeReleases.description.line3}</p>
            </div>

            <Link href={investorsData.exchangeReleases.cta.href} className="our-story__cta">
              <div className="investors__cta-inner">
                <span className="investors__cta-text">
                  View Investor Reports
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

