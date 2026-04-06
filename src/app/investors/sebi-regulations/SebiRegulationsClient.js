"use client";

import Link from "next/link";
import InnerBanner from "@/components/InnerBanner";
import { normalizeUploadUrl } from "@/lib/strapi-utils";
import "@/scss/pages/sebi-regulations.scss";

const SHAREHOLDING_INFORMATION_SECTION_ID = "shareholding-information";
const SHAREHOLDING_INFORMATION_HREF = "/investors#shareholding-information";

const FALLBACK_TITLE =
  "Disclosure under Regulation 46 of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015";

const FALLBACK_BANNER = {
  title: {
    line1: "Disclosure under Regulation 46 of",
    line2: "SEBI Regulations, 2015",
  },
  subHeading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/sebi-regulations-banner.png",
      alt: "SEBI Regulations - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/sebi-regulations-banner.png",
      alt: "SEBI Regulations - Lupin",
    },
  },
};

function isShareholdingInformationLink(url, doc) {
  if (!url || url === "#") return false;
  const normalized = String(url).trim().toLowerCase();
  if (normalized === SHAREHOLDING_INFORMATION_SECTION_ID) return true;
  if (normalized === `#${SHAREHOLDING_INFORMATION_SECTION_ID}`) return true;
  if (normalized === `/investors#${SHAREHOLDING_INFORMATION_SECTION_ID}`)
    return true;
  if (doc?.sectionId?.toLowerCase?.() === SHAREHOLDING_INFORMATION_SECTION_ID)
    return true;
  return false;
}

function renderParticulars(particulars) {
  if (typeof particulars !== "string") {
    return particulars;
  }
  if (particulars.includes("\n")) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: particulars.replace(/\n/g, "<br />"),
        }}
      />
    );
  }
  return particulars;
}

export default function SebiRegulationsClient({
  bannerData,
  regulationsData,
  error,
}) {
  const effectiveBanner = FALLBACK_BANNER;

  const title =
    regulationsData?.introSection?.sectionTitle?.trim() || FALLBACK_TITLE;
  const description = regulationsData?.introSection?.description || null;
  const items = regulationsData?.items || [];

  return (
    <div style={{ position: "relative" }}>
      <InnerBanner data={effectiveBanner} />
      <section className="sebi-regulations">
        <div className="sebi-regulations__container">
          {error && (
            <div className="sebi-regulations__placeholder" role="alert">
              <p>
                Unable to load regulation disclosures at this time. Please try
                again later.
              </p>
              {process.env.NODE_ENV === "development" && (
                <p style={{ fontSize: "14px", opacity: 0.85, marginTop: "10px" }}>
                  {error}
                </p>
              )}
            </div>
          )}

          {!error && items.length === 0 && (
            <div className="sebi-regulations__placeholder">
              <p>No regulation disclosures available at this time.</p>
            </div>
          )}

          {!error && items.length > 0 && (
            <>
              {/* <div className="sebi-regulations__header">
                <h1 className="sebi-regulations__title">{title}</h1>
                {description && (
                  <div
                    className="sebi-regulations__description"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </div> */}

              <div className="sebi-regulations__table-wrapper">
                <div className="sebi-regulations__table-header">
                  <div className="sebi-regulations__header-number">
                    <img
                      src="/assets/images/investors/shapes/sebi-number-icon.png"
                      alt="No."
                      className="sebi-regulations__header-number-icon"
                    />
                  </div>
                  <div className="sebi-regulations__header-particulars">
                    Particulars
                  </div>
                  <div className="sebi-regulations__header-url">URL</div>
                </div>

                <div className="sebi-regulations__table-body">
                  {items.map((item) => (
                    <div key={item.id} className="sebi-regulations__row">
                      <div className="sebi-regulations__cell sebi-regulations__cell--number">
                        {item.number}
                      </div>
                      <div className="sebi-regulations__cell sebi-regulations__cell--particulars">
                        {renderParticulars(item.particulars)}
                      </div>
                      <div className="sebi-regulations__cell sebi-regulations__cell--url">
                        {item.documents && item.documents.length > 0 ? (
                          <div className="sebi-regulations__links">
                            {item.documents.map((doc, docIndex) => {
                              const isShareholding =
                                isShareholdingInformationLink(doc.url, doc);
                              const normalizedUrl = normalizeUploadUrl(doc.url);
                              const href = isShareholding
                                ? SHAREHOLDING_INFORMATION_HREF
                                : normalizedUrl;
                              const isDisabled =
                                !isShareholding &&
                                (normalizedUrl === "#" || !normalizedUrl);
                              const openInNewTab =
                                !isDisabled && href && href !== "#";

                              return (
                                <Link
                                  key={doc.id || docIndex}
                                  href={isDisabled ? "#" : href}
                                  target={openInNewTab ? "_blank" : undefined}
                                  rel={
                                    openInNewTab
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className={`sebi-regulations__link${isDisabled ? " sebi-regulations__link--disabled" : ""}`}
                                  onClick={
                                    isDisabled
                                      ? (e) => e.preventDefault()
                                      : undefined
                                  }
                                  aria-disabled={isDisabled}
                                >
                                  <span>{doc.label}</span>
                                  {!isDisabled && (
                                    <img
                                      src="/assets/images/investors/shapes/nav-arrow.png"
                                      alt=""
                                      className="sebi-regulations__arrow"
                                    />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="sebi-regulations__na">NA</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
