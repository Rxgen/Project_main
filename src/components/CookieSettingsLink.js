"use client";

export default function CookieSettingsLink({ className = "footer__legal-link" }) {
  const openCookieSettings = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cookie-consent-open-settings"));
    }
  };

  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
