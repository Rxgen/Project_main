"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getConsent,
  setConsent,
  defaultPreferences,
  categoryLabels,
  toggleableCategories,
} from "@/lib/cookie-consent";
import "@/scss/components/CookieConsent.scss";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState(() => ({ ...defaultPreferences }));

  const applyAndClose = useCallback((prefs) => {
    setConsent(prefs);
    setShowBanner(false);
    setShowModal(false);
    // Defer event so consent is written to localStorage before the listener reads it
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: prefs }));
      }, 0);
    }
  }, []);

  useEffect(() => {
    const stored = getConsent();
    if (stored) {
      setShowBanner(false);
      setPreferences(stored);
    } else {
      setShowBanner(true);
    }
  }, []);

  // Open Cookie settings modal from footer (or anywhere) via custom event
  useEffect(() => {
    const openSettings = () => {
      const stored = getConsent();
      setPreferences(stored ? { ...defaultPreferences, ...stored } : { ...defaultPreferences });
      setShowModal(true);
    };
    window.addEventListener("cookie-consent-open-settings", openSettings);
    return () => window.removeEventListener("cookie-consent-open-settings", openSettings);
  }, []);

  const handleAccept = () => {
    applyAndClose({ ...defaultPreferences });
  };

  const handleReject = () => {
    applyAndClose({
      ...defaultPreferences,
      functional: false,
      performance: false,
      analytics: false,
      advertisement: false,
      others: false,
    });
  };

  const handleCookieSettings = () => {
    const stored = getConsent();
    setPreferences(stored ? { ...defaultPreferences, ...stored } : { ...defaultPreferences });
    setShowModal(true);
  };

  const handleSaveAndAccept = () => {
    applyAndClose({ ...preferences });
  };

  const setCategory = (key, value) => {
    if (key === "necessary") return;
    setPreferences((p) => ({ ...p, [key]: !!value }));
  };

  const handleCloseBanner = () => {
    // Closing without choice = treat as reject (no non-necessary cookies)
    handleReject();
  };

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Bottom banner */}
      {showBanner && (
        <div className="cookie-consent-banner" role="dialog" aria-label="Cookie consent">
          <button
            type="button"
            className="cookie-consent-banner__close"
            onClick={handleCloseBanner}
            aria-label="Close"
          >
            ×
          </button>
          <p className="cookie-consent-banner__text">
            We use cookies on our website to give you the most relevant experience by remembering
            your preferences and repeat visits. By clicking &quot;Accept&quot;, you consent to the
            use of ALL the cookies. However you may visit{" "}
            <button type="button" className="cookie-consent-banner__link" onClick={handleCookieSettings}>
              Cookie Settings
            </button>{" "}
            to provide a controlled consent.
          </p>
          <div className="cookie-consent-banner__actions">
            <Link href="/cookie-policy" className="cookie-consent-banner__read-more">
              Read More
            </Link>
            <button type="button" className="cookie-consent-banner__btn cookie-consent-banner__btn--settings" onClick={handleCookieSettings}>
              Cookie settings
            </button>
            <button type="button" className="cookie-consent-banner__btn cookie-consent-banner__btn--reject" onClick={handleReject}>
              REJECT
            </button>
            <button type="button" className="cookie-consent-banner__btn cookie-consent-banner__btn--accept" onClick={handleAccept}>
              ACCEPT
            </button>
          </div>
        </div>
      )}

      {/* Privacy Overview modal */}
      {showModal && (
        <div className="cookie-consent-modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="cookie-consent-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="privacy-overview-title"
            aria-modal="true"
          >
            <div className="cookie-consent-modal__header">
              <h2 id="privacy-overview-title" className="cookie-consent-modal__title">
                Privacy Overview
              </h2>
              <button
                type="button"
                className="cookie-consent-modal__close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="cookie-consent-modal__intro">
              This website uses cookies to improve your experience while you navigate through the
              website. Out of these, the cookies that are categorized as necessary are stored on
              your browser as they are essential for the working of basic functionalities of the
              website. We also use third-party cookies (e.g. Google Analytics and Google Ads) that
              help us analyze and improve our site when you allow analytics and advertisement
              cookies.
            </p>
            <Link href="/cookie-policy" className="cookie-consent-modal__show-more">
              Show more
            </Link>
            <ul className="cookie-consent-modal__categories">
              <li className="cookie-consent-modal__category">
                <span className="cookie-consent-modal__category-name">
                  <span className="cookie-consent-modal__category-arrow">›</span>{" "}
                  {categoryLabels.necessary}
                </span>
                <span className="cookie-consent-modal__category-status cookie-consent-modal__category-status--always">
                  Always Enabled
                </span>
              </li>
              {toggleableCategories.map((key) => (
                <li key={key} className="cookie-consent-modal__category">
                  <span className="cookie-consent-modal__category-name">
                    <span className="cookie-consent-modal__category-arrow">›</span>{" "}
                    {categoryLabels[key]}
                  </span>
                  <label className="cookie-consent-modal__toggle-wrap">
                    <span className="cookie-consent-modal__category-status">
                      {preferences[key] ? "Enabled" : "Disabled"}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!preferences[key]}
                      onChange={(e) => setCategory(key, e.target.checked)}
                      className="cookie-consent-modal__toggle"
                    />
                    <span className="cookie-consent-modal__toggle-slider" />
                  </label>
                </li>
              ))}
            </ul>
            <div className="cookie-consent-modal__footer">
              <button
                type="button"
                className="cookie-consent-modal__save"
                onClick={handleSaveAndAccept}
              >
                Save &amp; Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
