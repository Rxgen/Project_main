"use client";

import { useEffect } from "react";
import { getConsent, hasAnalyticsConsent } from "@/lib/cookie-consent";

// IDs from your provided scripts
const GOOGLE_ADS_ID = "AW-10944404470";
const GOOGLE_ANALYTICS_ID = "G-S41GJ4K5RW";
const CONVERSION_LABEL = "odUFCLGH78sDEPa32eIo";

/**
 * Loads Google Tag (gtag.js) and configures Google Ads + Google Analytics
 * only when user has given analytics or advertisement consent.
 * Exposes gtag_report_conversion on window for conversion tracking.
 */
function loadGoogleScripts() {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  if (!consent) return;
  const allowAds = consent.advertisement === true;
  const allowAnalytics = consent.analytics === true;
  if (!allowAds && !allowAnalytics) return;

  // Avoid loading twice
  if (window.__lupin_gtag_loaded) return;
  window.__lupin_gtag_loaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());

  if (allowAds) {
    gtag("config", GOOGLE_ADS_ID);
  }
  if (allowAnalytics) {
    gtag("config", GOOGLE_ANALYTICS_ID);
  }

  // Conversion helper: call from CTAs (e.g. "Contact us" buttons)
  window.gtag_report_conversion = function (url) {
    if (!allowAds) return false;
    var callback = function () {
      if (typeof url !== "undefined" && url) {
        window.location = url;
      }
    };
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABEL}`,
      event_callback: callback,
    });
    return false;
  };

  // Load gtag.js - use GA id when analytics consent so GA4 is the primary tag
  const script = document.createElement("script");
  script.async = true;
  const scriptId = allowAnalytics ? GOOGLE_ANALYTICS_ID : GOOGLE_ADS_ID;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${scriptId}`;
  script.onload = function () {
    // Re-apply config after script loads so GA/Ads receive hits
    if (allowAnalytics) {
      gtag("config", GOOGLE_ANALYTICS_ID);
      // Send page_view for current page (Next.js doesn't full-reload on navigation)
      gtag("event", "page_view", { page_path: window.location.pathname, page_title: document.title });
    }
    if (allowAds) {
      gtag("config", GOOGLE_ADS_ID);
    }
  };
  document.head.appendChild(script);
}

export default function GoogleAnalyticsScripts() {
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      loadGoogleScripts();
    }

    const onConsentUpdate = () => {
      if (hasAnalyticsConsent()) {
        loadGoogleScripts();
      }
    };

    window.addEventListener("cookie-consent-updated", onConsentUpdate);
    return () => window.removeEventListener("cookie-consent-updated", onConsentUpdate);
  }, []);

  return null;
}
