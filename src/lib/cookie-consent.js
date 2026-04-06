/**
 * Cookie consent storage and defaults.
 * Used by CookieConsent (banner/modal) and GoogleAnalyticsScripts.
 */

export const CONSENT_STORAGE_KEY = "lupin_cookie_consent";
export const CONSENT_VERSION = 1;

export const defaultPreferences = {
  necessary: true, // always true, not toggleable
  functional: true,
  performance: true,
  analytics: true,
  advertisement: true,
  others: true,
  version: CONSENT_VERSION,
};

export const categoryLabels = {
  necessary: "Necessary",
  functional: "Functional",
  performance: "Performance",
  analytics: "Analytics",
  advertisement: "Advertisement",
  others: "Others",
};

/** Categories that can be toggled in Cookie settings (necessary is always on) */
export const toggleableCategories = [
  "functional",
  "performance",
  "analytics",
  "advertisement",
  "others",
];

/**
 * Read consent from localStorage. Returns null if not set or invalid.
 * @returns {typeof defaultPreferences | null}
 */
export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.necessary !== "undefined" && data.version === CONSENT_VERSION) {
      return { ...defaultPreferences, ...data };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persist consent to localStorage (and optionally set a cookie for server-side).
 * @param {typeof defaultPreferences} prefs
 */
export function setConsent(prefs) {
  if (typeof window === "undefined") return;
  try {
    const payload = { ...prefs, version: CONSENT_VERSION };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    // Optional: set a short-lived cookie for SSR (e.g. same key, max-age 1 year)
    document.cookie = `${CONSENT_STORAGE_KEY}=${encodeURIComponent(JSON.stringify(payload))};path=/;max-age=31536000;SameSite=Lax`;
  } catch (e) {
    console.warn("Cookie consent save failed", e);
  }
}

/** Whether we should load analytics (GA + Ads) scripts */
export function hasAnalyticsConsent() {
  const c = getConsent();
  return c !== null && (c.analytics === true || c.advertisement === true);
}
