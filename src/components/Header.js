'use client'; // Need client for mobile menu toggle

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlobalSearch from './GlobalSearch';
import '../scss/components/Header.scss';

// Country/region links (globe dropdown)
const GLOBAL_LINKS = [
  { label: 'India', href: '/our-business/india', flagSrc: '/assets/country-icons/india.png', flagAlt: 'India flag icon' },
  { label: 'USA', href: 'https://www.lupin.com/US/', flagSrc: '/assets/country-icons/usa.png', flagAlt: 'USA flag icon' },
  { label: 'UK', href: 'https://www.lupinhealthcare.co.uk/', flagSrc: '/assets/country-icons/great-britain.png', flagAlt: 'Great Britain flag icon' },
  { label: 'South Africa', href: 'https://www.mydynamics.co.za/', flagSrc: '/assets/country-icons/south-africa.png', flagAlt: 'South Africa flag icon' },
  { label: 'Australia', href: 'https://generichealth.com.au/', flagSrc: '/assets/country-icons/australia.png', flagAlt: 'Australia flag icon' },
  { label: 'Philippines', href: 'https://www.multicare.com.ph/', flagSrc: '/assets/country-icons/philippines.png', flagAlt: 'Philippines flag icon' },
  { label: 'Germany', href: 'https://www.hormosan.com/', flagSrc: '/assets/country-icons/germany.png', flagAlt: 'Germany flag icon' },
  { label: 'Netherlands', href: 'https://www.nanomi.com/', flagSrc: '/assets/country-icons/netherlands.png', flagAlt: 'Netherlands flag icon' },
  { label: 'Mexico', href: 'https://www.laboratoriosgrin.com/', flagSrc: '/assets/country-icons/mexico.png', flagAlt: 'Mexico flag icon' },
  { label: 'Brazil', href: 'https://medquimica.ind.br/', flagSrc: '/assets/country-icons/brazil.png', flagAlt: 'Brazil flag icon' },
  { label: 'Canada', href: 'https://www.lupinpharma.ca/', flagSrc: '/assets/country-icons/canada.png', flagAlt: 'Canada flag icon' },
  { label: 'Switzerland', href: 'https://lupin-neurosciences.com/our-world/', flagSrc: '/assets/country-icons/switzerland.png', flagAlt: 'Switzerland flag icon' },
];

// Sub-navigation per main section (Figma node 3515-31)
const SUB_NAV = {
  'About Us': [
    { label: 'The Lupin Story', href: '/about-us/our-story' },
    { label: 'Our Purpose', href: '/about-us/our-purpose' },
    { label: 'Our Values', href: '/about-us/our-values' },
    { label: 'Our Leadership', href: '/about-us/leadership' },
    { label: 'Compliance, Ethics and Governance', href: '/about-us/compliance-ethics-governance' },
    { label: 'Global Presence', href: '/about-us/global-presence' },
    { label: 'Our Manufacturing Approach', href: '/about-us/global-technical-operations' },
    { label: 'Quality in Action', href: '/about-us/quality-in-action' },
    { label: 'Our Science', href: '/about-us/our-science' },
    { label: 'Awards and Recognitions', href: '/about-us/awards-and-recognition' }
  ],
  'Our Business': [
    { label: 'Global Generics', href: '/our-business/global-generics' },
    { label: 'Emerging Markets', href: '/our-business/emerging-markets' },
    { label: 'India', href: '/our-business/india' },
    { label: 'Specialty and Innovation', href: '/our-business/specialty' },
    { label: 'Biosimilars', href: '/our-business/biosimilars' },
    { label: 'Our Adjacencies', href: '/our-business/our-adjacencies' },
    // { label: 'Patient Support Programs', href: '/our-business/india/patient-support-programs' }
  ],
  'Investors': [
    { label: 'Financials', href: '/investors/financials' },
    { label: 'Reports and Filings', href: '/investors/reports-filings' },
    { label: 'Committees of the Board', href: '/investors/committees-of-the-board' },
    { label: 'Code of Conduct', href: '/investors/code-of-conduct' },
    { label: 'Policies', href: '/investors/policies' },
    { label: 'Shareholder Information', href: '/investors#shareholding-information' },
    { label: 'Memorandum and Articles of Association', href: '/assets/share-price/Lupin-Revised-MOA-AOA-Lupin-Limited.pdf', target: '_blank' },
    { label: 'Employee Stock Option Schemes', href: '/investors/employee-stock-option-schemes' },

    { label: 'News and Events', href: '/investors/news-events' },
    { label: 'Business Responsibility', href: '/assets/share-price/business-responsiblity-report.pdf', target: '_blank' },
    { label: 'Analyst Coverage', href: '/investors/analyst-coverage' },
    { label: 'Investor FAQs', href: '/investors/investor-faqs' },
    { label: 'Disclosure under Regulation 46 of SEBI (LODR) Regulations, 2015', href: '/investors/disclosure-under-regulation-46-of-sebi-regulations-2015' }
  ],
  'Media': [
    { label: 'Press Releases', href: '/media/press-releases' },
    { label: 'Media Coverage', href: '/media/media-coverage' },
    { label: 'Perspectives', href: '/media/perspectives' },
    { label: 'Media Kit', href: '/media/media-kit' }
  ],
  'Sustainability': [

    { label: 'ESG Framework', href: '/sustainability#esg-framework' },
    { label: 'ESG Goals and Progress', href: '/sustainability#esg-goals-progress' },
    { label: 'Key Highlights', href: '/sustainability#key-highlights' },
    { label: 'ESG Ratings', href: '/sustainability#esg-ratings' },
    { label: 'ESG Governance', href: '/sustainability#esg-governance' }
  ]
};

// Social links match Footer (same URLs only; icons are inline)
const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://x.com/LupinGlobal', icon: 'x' },
  { name: 'Facebook', href: 'https://www.facebook.com/LupinWorld/', icon: 'facebook' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lupin/', icon: 'linkedin' },
  { name: 'YouTube', href: 'https://www.youtube.com/c/LupinGlobal', icon: 'youtube' }
];

const SHAREPRICE_API = 'https://content.dionglobal.in/lupinworldnew/JSON/shareprice.aspx';

function parseSharePriceResponse(json) {
  if (!Array.isArray(json) || json.length === 0) return null;
  const byExchange = {};
  json.forEach((item) => {
    byExchange[item.exchange] = {
      current: item.Current ?? "—",
      change: item.Change_Nos ?? "—",
      changePercent: item.Change_Pct != null ? `${item.Change_Pct}%` : "—",
      dateTime: item.DateTime ?? "—"
    };
  });
  const nse = byExchange.NSE;
  const bse = byExchange.BSE;
  if (!nse && !bse) return null;
  return {
    nse: nse?.current ?? "—",
    bse: bse?.current ?? "—",
    nseMeta: nse ? { time: nse.dateTime, change: nse.change, changePercent: nse.changePercent } : null,
    bseMeta: bse ? { time: bse.dateTime, change: bse.change, changePercent: bse.changePercent } : null
  };
}

const SCROLL_THRESHOLD = 80;
const SCROLL_TOP_THRESHOLD = 20;

export default function Header({ data }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMainIndex, setActiveMainIndex] = useState(0);
  const [expandedMobileIndex, setExpandedMobileIndex] = useState(null);
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [stockQuotes, setStockQuotes] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerCompact, setHeaderCompact] = useState(false);
  const globalRef = useRef(null);
  const menuRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollPositionWhenMenuOpened = useRef(0);

  // Scroll: show header on scroll up (with compact green bar), hide on scroll down
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY ?? document.documentElement.scrollTop;
        if (y <= SCROLL_TOP_THRESHOLD) {
          setHeaderVisible(true);
          setHeaderCompact(false);
        } else if (y > lastScrollY.current) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
          setHeaderCompact(true);
        }
        lastScrollY.current = y;
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch stock quotes
  useEffect(() => {
    let cancelled = false;
    fetch(SHAREPRICE_API)
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (cancelled) return;
        const parsed = parseSharePriceResponse(json);
        if (parsed) {
          setStockQuotes(parsed);
        }
      })
      .catch(() => {
        // Silently fail - don't show stock quotes if API fails
      });
    return () => { cancelled = true; };
  }, []);

  const closeGlobal = () => setIsGlobalOpen(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (globalRef.current && !globalRef.current.contains(e.target)) setIsGlobalOpen(false);
    }
    if (isGlobalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isGlobalOpen]);

  // Default navigation data (will be replaced by Strapi)
  const headerData = data || {
    logo: {
      url: '/assets/logo-lupin.png',
      alt: 'Lupin Logo'
    },
    navigation: [
      { label: 'About Us', href: '/about-us', active: false },
      { label: 'Our Business', href: '/our-business', active: false },
      { label: 'Investors', href: '/investors', active: false },
      { label: 'Media', href: '/media', active: false },
      { label: 'Community', href: '/community', active: false },
      { label: 'Sustainability', href: '/sustainability', active: false }
    ],
    career: {
      label: 'Careers',
      href: 'https://careers.lupin.com/'
    },
    contact: {
      label: 'Contact',
      href: '/contact-us'
    },
    phone: "+91 22 6640 2323",
    email: "info@lupin.com"
  };

  const mainNavWithCareers = [
    ...headerData.navigation,
    { label: headerData.career.label, href: headerData.career.href, isExternal: true },
    { label: headerData.contact.label, href: headerData.contact.href }
  ];

  const activeMain = mainNavWithCareers[activeMainIndex];
  const subNavItems = activeMain && SUB_NAV[activeMain.label] ? SUB_NAV[activeMain.label] : [];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when mega menu is open (mobile/tablet)
  useEffect(() => {
    if (isMenuOpen) {
      scrollPositionWhenMenuOpened.current = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.classList.add('menu-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionWhenMenuOpened.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      const scrollY = scrollPositionWhenMenuOpened.current;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`header ${isMenuOpen ? 'is-menu-open' : ''} ${!headerVisible ? 'header--hidden' : ''} ${headerCompact ? 'header--compact' : ''}`}
    >
      <div className="header__container">
        {/* Logo */}
        <Link href="/" className="header__logo-link">
          <Image
            src={headerData.logo.url}
            alt={headerData.logo.alt}
            width={87}
            height={106}
            className="header__logo"
            priority
            quality={95}
          />
          <Image
            src="/assets/menu/menu-logo-mobile-openu%20menu.png"
            alt={headerData.logo.alt}
            width={87}
            height={106}
            className="header__logo header__logo--menu-open"
            quality={95}
          />
        </Link>

        {/* Desktop: Main Navigation with dropdown submenus (dropdown full width of nav) */}
        <nav className="header__nav header__nav--desktop" onMouseLeave={() => setOpenDropdownIndex(null)}>
          <div className="header__nav-items">
            {headerData.navigation.map((item, index) => {
              const subItems = SUB_NAV[item.label];
              const hasDropdown = subItems && subItems.length > 0;

              if (hasDropdown) {
                return (
                  <div
                    key={index}
                    className="header__nav-item-wrap"
                    onMouseEnter={() => setOpenDropdownIndex(index)}
                  >
                    <Link
                      href={item.href}
                      className={`header__nav-item ${item.active ? 'header__nav-item--active' : ''} ${openDropdownIndex === index ? 'header__nav-item--open' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`header__nav-item ${item.active ? 'header__nav-item--active' : ''}`}
                  onMouseEnter={() => setOpenDropdownIndex(null)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          {openDropdownIndex !== null && (() => {
            const item = headerData.navigation[openDropdownIndex];
            const subItems = item && SUB_NAV[item.label];
            if (!subItems || !subItems.length) return null;
            const items = subItems.filter((sub) => sub.href);
            const ITEMS_PER_COLUMN = 4;
            const columns = [];
            for (let i = 0; i < items.length; i += ITEMS_PER_COLUMN) {
              columns.push(items.slice(i, i + ITEMS_PER_COLUMN));
            }
            return (
              <div
                className="header__dropdown is-open"
                aria-hidden={false}
              >
                <span className="header__dropdown-petals" aria-hidden>
                  <Image src="/assets/menu/petel.svg" alt="" width={120} height={120} quality={95} />
                </span>
                <div className="header__dropdown-inner">
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="header__dropdown-column">
                      {column.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={sub.href}
                          className="header__dropdown-item"
                          {...(sub.target === '_blank' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </nav>

        {/* Action CTA + Globe dropdown wrapper */}
        <div className="header__global-wrap" ref={globalRef}>
          {/* Stock Quotes - Above actions */}
          {stockQuotes && (() => {
            const nseChange = stockQuotes.nseMeta?.change || "—";
            const bseChange = stockQuotes.bseMeta?.change || "—";
            const nseIsUp = nseChange !== "—" && !nseChange.toString().startsWith("-");
            const bseIsUp = bseChange !== "—" && !bseChange.toString().startsWith("-");

            return (
              <div className="header__stock-quotes">
                <span className="header__stock-item">
                  <span className={`header__stock-arrow ${nseIsUp ? 'header__stock-arrow--up' : 'header__stock-arrow--down'}`} aria-hidden="true">
                    {nseIsUp ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 0L11.1962 10.5H0.803848L6 0Z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L0.803848 1.5H11.1962L6 12Z" fill="currentColor" />
                      </svg>
                    )}
                  </span>
                  NSE: <strong>{stockQuotes.nse}</strong>
                </span>
                <span className="header__stock-item">
                  <span className={`header__stock-arrow ${bseIsUp ? 'header__stock-arrow--up' : 'header__stock-arrow--down'}`} aria-hidden="true">
                    {bseIsUp ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 0L11.1962 10.5H0.803848L6 0Z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L0.803848 1.5H11.1962L6 12Z" fill="currentColor" />
                      </svg>
                    )}
                  </span>
                  BSE: <strong>{stockQuotes.bse}</strong>
                </span>
              </div>
            );
          })()}
          <div className="header__actions">
            <Link href={headerData.career.href} className="header__career" target="_blank">
              {headerData.career.label}
            </Link>
            <div className="header__divider">
              <Image src="/assets/divider-vertical.svg" alt="" width={1} height={36} quality={95} />
            </div>
            <Link href={headerData.contact.href} className="header__contact">
              {headerData.contact.label}
            </Link>
            <div className="header__divider">
              <Image src="/assets/divider-vertical.svg" alt="" width={1} height={36} quality={95} />
            </div>
            <button
              type="button"
              className={`header__icon-btn header__icon-btn--globe ${isGlobalOpen ? 'is-open' : ''}`}
              aria-label="Change country/region"
              aria-expanded={isGlobalOpen}
              aria-haspopup="true"
              onClick={() => setIsGlobalOpen(!isGlobalOpen)}
            >
              <Image src="/assets/icon-globe.svg" alt="Globe" width={26} height={26} quality={95} />
            </button>
            <div className="header__divider">
              <Image src="/assets/divider-vertical.svg" alt="" width={1} height={36} quality={95} />
            </div>
            <div className="header__search-wrapper">
              <GlobalSearch />
            </div>
            <button
              className={`header__menu-btn ${isMenuOpen ? 'is-open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Image
                src="/assets/icon-menu.svg"
                alt="Menu"
                width={24}
                height={14}
                className="header__menu-icon"
                quality={95}
              />
              <span className="header__menu-text">Menu</span>
            </button>
          </div>

          {/* Mobile Globe */}
          <button
            type="button"
            className={`header__icon-btn header__icon-btn--mobile-header header__icon-btn--globe ${isGlobalOpen ? 'is-open' : ''}`}
            aria-label="Change country/region"
            aria-expanded={isGlobalOpen}
            aria-haspopup="true"
            onClick={() => setIsGlobalOpen(!isGlobalOpen)}
          >
            <Image src="/assets/icon-globe.svg" alt="Globe" width={26} height={26} quality={95} />
          </button>

          {/* Country/region dropdown (globe click) */}
          <div
            className={`header__global-content ${isGlobalOpen ? 'is-open' : ''}`}
            id="global-contentid"
            role="list"
            aria-label="Select country or region"
          >
            {GLOBAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="header__global-link"
                onClick={closeGlobal}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.flagSrc} alt={item.flagAlt} className="header__global-flag" width={24} height={18} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet: Full-screen mega menu (Figma 3515-32) - slides right to left */}
      <div
        ref={menuRef}
        className={`header__mega-menu ${isMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="header__mega-menu-inner">
          {/* Top: Close (green text) + X (black icon) per Figma 3515-32 */}
          <div className="header__mega-menu-top">
            <button
              type="button"
              className="header__mega-menu-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <span className="header__mega-menu-close-text">Close</span>
              <span className="header__mega-menu-close-icon header__mega-menu-close-icon--black" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile only: accordion / dropdown list */}
          <div className="header__mega-menu-mobile-accordion">
            {mainNavWithCareers.map((item, index) => {
              const subs = SUB_NAV[item.label] || [];
              const hasSubNav = subs.length > 1; // Mobile: only expand accordion when multiple sub-links (Community/Sustainability are direct)
              const isExpanded = expandedMobileIndex === index;
              return (
                <div key={index} className="header__mega-menu-accordion-item">
                  {hasSubNav ? (
                    <>
                      <button
                        type="button"
                        className={`header__mega-menu-accordion-trigger ${isExpanded ? 'is-open' : ''}`}
                        onClick={() => setExpandedMobileIndex(isExpanded ? null : index)}
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-accordion-panel-${index}`}
                        id={`mobile-accordion-trigger-${index}`}
                      >
                        <span>{item.label}</span>
                        <span className="header__mega-menu-accordion-icon" aria-hidden>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </button>
                      <div
                        id={`mobile-accordion-panel-${index}`}
                        role="region"
                        aria-labelledby={`mobile-accordion-trigger-${index}`}
                        className={`header__mega-menu-accordion-panel ${isExpanded ? 'is-open' : ''}`}
                      >
                        <div className="header__mega-menu-accordion-panel-inner">
                          {/* Overview link at the top */}
                          <Link
                            href={item.href}
                            className="header__mega-menu-accordion-sub-link header__mega-menu-accordion-sub-link--overview"
                            onClick={closeMenu}
                          >
                            Overview
                          </Link>
                          {subs.map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.href}
                              className="header__mega-menu-accordion-sub-link"
                              onClick={closeMenu}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="header__mega-menu-accordion-link"
                      {...(item.isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
            <div className="header__mega-menu-mobile-footer">
              <div className="header__mega-menu-mobile-social">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header__mega-menu-social-link"
                    aria-label={s.name}
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </div>
              <a href={`tel:${(headerData.phone || '+912240189999').replace(/\s/g, '')}`} className="header__mega-menu-contact-item header__mega-menu-contact-item--phone" onClick={closeMenu}>
                <PhoneIcon />
                <span>{headerData.phone || '+91 22 4018 9999'}</span>
              </a>
              <a href={`mailto:${headerData.email || 'lmsinfo@lupin.com'}`} className="header__mega-menu-contact-item header__mega-menu-contact-item--email" onClick={closeMenu}>
                <EmailIcon />
                <span>{headerData.email || 'lmsinfo@lupin.com'}</span>
              </a>
            </div>
          </div>

          {/* Desktop / Tablet: Three columns */}
          <div className="header__mega-menu-columns header__mega-menu-columns--desktop">
            {/* Column 1: Main nav */}
            <div className="header__mega-menu-col header__mega-menu-col--main">
              <span className="header__mega-menu-petal header__mega-menu-petal--right" aria-hidden>
                <Image src="/assets/menu/petel.svg" alt="" width={48} height={48} />
              </span>
              {mainNavWithCareers.map((item, index) => {
                const hasSubNav = SUB_NAV[item.label] && SUB_NAV[item.label].length > 1;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`header__mega-menu-main-link ${index === activeMainIndex ? 'is-active' : ''}`}
                    {...(item.isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                    onMouseEnter={() => {
                      if (hasSubNav) {
                        setActiveMainIndex(index);
                      } else {
                        setActiveMainIndex(null);
                      }
                    }}
                    onClick={(e) => {
                      if (item.isExternal) {
                        closeMenu();
                        return;
                      }
                      if (hasSubNav) {
                        e.preventDefault();
                        setActiveMainIndex(index);
                      } else {
                        closeMenu();
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Column 2: Sub-nav */}
            <div
              className="header__mega-menu-col header__mega-menu-col--sub"
              onMouseEnter={() => {
                if (activeMainIndex !== null) {
                  setActiveMainIndex(activeMainIndex);
                }
              }}
            >
              <span className="header__mega-menu-petal header__mega-menu-petal--right" aria-hidden>
                <Image src="/assets/menu/petel.svg" alt="" width={48} height={48} />
              </span>
              {subNavItems.length > 0 ? (
                <>
                  {/* Overview link at the top */}
                  {activeMain && (
                    <Link
                      href={activeMain.href}
                      className="header__mega-menu-sub-link header__mega-menu-sub-link--overview"
                      onClick={closeMenu}
                    >
                      Overview
                    </Link>
                  )}
                  {subNavItems.map((sub, i) => (
                    <Link
                      key={i}
                      href={sub.href}
                      className="header__mega-menu-sub-link"
                      {...(sub.target === '_blank' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onClick={closeMenu}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </>
              ) : (
                <span className="header__mega-menu-sub-placeholder"></span>
              )}
            </div>

            {/* Column 3: Social + Contact */}
            <div className="header__mega-menu-col header__mega-menu-col--social">
              <div className="header__mega-menu-social">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header__mega-menu-social-link"
                    aria-label={s.name}
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </div>
              <a href={`tel:${(headerData.phone || '+912240189999').replace(/\s/g, '')}`} className="header__mega-menu-contact-item header__mega-menu-contact-item--phone" onClick={closeMenu}>
                <PhoneIcon />
                <span>{headerData.phone || '+91 22 4018 9999'}</span>
              </a>
              <a href={`mailto:${headerData.email || 'lmsinfo@lupin.com'}`} className="header__mega-menu-contact-item header__mega-menu-contact-item--email" onClick={closeMenu}>
                <EmailIcon />
                <span>{headerData.email || 'lmsinfo@lupin.com'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`header__overlay ${isMenuOpen ? 'is-visible' : ''}`}
        aria-hidden={!isMenuOpen}
      />
    </header>
  );
}

function SocialIcon({ name }) {
  const size = 24;
  const color = '#069C3C';
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' };
  switch (name) {
    case 'youtube':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2.02c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill={color} />
          <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="#fff" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2zM7.1 18.43H4.25V9.25H7.1v9.18zM5.67 8.1a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12zm12.76 10.33h-2.85v-4.45c0-1.06-.02-2.43-1.48-2.43s-1.71 1.16-1.71 2.35v4.53H9.75V9.25h2.73v1.26h.04a3 3 0 0 1 2.7-1.49c2.89 0 3.42 1.9 3.42 4.38v5.03z" fill={color} />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.07c0-6.63-5.37-12-12-12S0 5.44 0 12.07c0 6.02 4.42 11 10.22 11.9v-8.4H7.08V12.07h3.14V9.4c0-3.1 1.85-4.81 4.52-4.81 1.31 0 2.67.23 2.67.23v2.93h-1.5c-1.5 0-1.96.93-1.96 1.89v2.23h3.31l-.53 3.5h-2.78v8.4C19.58 23.07 24 18.09 24 12.07z" fill={color} />
        </svg>
      );
    case 'x':
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M18.24 2H21.5L14.06 10.47 22 22h-6.61l-5.2-6.76-5.95 6.76H2.5l8-9.19L2 2h6.62l4.7 6.13L18.24 2z" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
