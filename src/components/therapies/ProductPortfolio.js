"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/ProductPortfolio.scss";
import Link from "next/link";

const PETAL_ICON = "/assets/images/india/therapies/shapes/petal.png";

/**
 * Intro block from Strapi (green banner copy) that applies only to “Our key products”.
 * Hidden when the “Other Key Brands” tab is selected.
 */
function isKeyProductsOnlyIntroBlock(block) {
  const plain = String(block ?? "")
    .replace(/<[^>]*>/g, " ")
    .toLowerCase();
  return (
    plain.includes("our key brands are also available") ||
    plain.includes("these brands are also available") ||
    (plain.includes("multiple dosage forms") &&
      plain.includes("injectables"))
  );
}

function stripKeyProductsIntroSentenceFromMarkdownParagraph(children) {
  const INTRO_RE =
    /our key brands are also available in multiple dosage forms including tablets, suspensions, and injectables\.\s*/i;
  const arr = Array.isArray(children) ? children : [children];
  let changed = false;

  const next = arr
    .map((node) => {
      if (typeof node !== "string") return node;
      const replaced = node.replace(INTRO_RE, "");
      if (replaced !== node) changed = true;
      return replaced;
    })
    .filter((node) => {
      if (node == null) return false;
      if (typeof node === "string") return node.trim().length > 0;
      return true; // keep React elements (e.g., <a>)
    });

  if (!changed) return children;
  if (next.length === 0) return null;
  return next;
}

const HIGHLIGHT_MD_COMPONENTS = {
  p: ({ children }) => (
    <span className="portfolio-item__highlight-inline">{children}</span>
  ),
};

const renderHighlights = (highlights, keyPrefix) =>
  highlights.map((highlight, index) => {
    const listItem =
      typeof highlight === "string" ? { text: highlight } : highlight;
    const itemKey = `${keyPrefix}-${index}`;

    return (
      <li key={itemKey}>
        <TherapyMarkdown components={HIGHLIGHT_MD_COMPONENTS}>
          {listItem.text}
        </TherapyMarkdown>
        {Array.isArray(listItem.subItems) && listItem.subItems.length > 0 && (
          <ul>{renderHighlights(listItem.subItems, `${itemKey}-sub`)}</ul>
        )}
      </li>
    );
  });

export const ProductPortfolioItem = ({
  heading,
  description,
  highlights = [],
}) => {
  return (
    <div className="portfolio-item">
      <div className="portfolio-item__line" aria-hidden="true" />
      <div className="portfolio-item__content">
        <div className="portfolio-item__heading-row">
          <div className="portfolio-item__icon">
            <Image src={PETAL_ICON} alt="" width={24} height={24} />
          </div>
          <h4 className="portfolio-item__heading">
            <TherapyMarkdown
              components={{
                p: ({ children }) => (
                  <span className="portfolio-item__heading-line">{children}</span>
                ),
              }}
            >
              {heading}
            </TherapyMarkdown>
          </h4>
        </div>
        <div className="portfolio-item__description">
          <TherapyMarkdown>{description}</TherapyMarkdown>
        </div>
        {highlights.length > 0 && (
          <ul className="portfolio-item__highlights">
            {renderHighlights(highlights, heading)}
          </ul>
        )}
      </div>
    </div>
  );
};

const STATIC_ITEMS = [
  {
    id: 1,
    heading: "Gluconorm-G®",
    description:
      "Our leading brand used in the management of T2DM, offering effective and tight glucose control for the past 23 years.",
    highlights: [
      "Combines aceclofenac, paracetamol, and serratiopeptidase, with variants including muscle relaxants",
      "A 100+ crore brand, serving approximately 10 million patients annually",
      {
        text: "Widely prescribed by",
        subItems: [
          "Orthopedicians for arthritis, low back pain, and muscle spasm",
          "Dentists for dental and post-procedural pain",
          "Surgeons for postoperative pain management",
          "Available in topical gel formats for localized pain relief",
        ],
      },
    ],
  },
  {
    id: 2,
    heading: "Huminsulin®",
    description:
      "A conventional insulin therapy which is widely available across India, used to manage T1DM and T2DM, and to improve glycemic levels in both children and adults.",
    highlights: [
      "Supports diabetes management for both pediatric and adult patient groups",
      "Ensures broad access through wide pan-India availability",
    ],
  },
  {
    id: 3,
    heading: "GIBTULIO®/AJADUO®",
    description:
      "We are the pioneers in establishing Empagliflozin in the Indian market since 2016, thus bringing transformation to patient care in their diabetes journey. A novel oral anti-diabetic tablet that manages blood glucose in type 2 diabetes, reducing risk of cardiovascular mortality in those with ASCVD, reducing risk of hospitalization and death of patients with heart failure, and delaying risk of chronic kidney disease progression.",
    highlights: [
      "Helps lower cardiovascular mortality risk in T2DM patients with ASCVD",
      "Reduces hospitalization and death risk in patients with heart failure",
      "Delays chronic kidney disease progression in appropriate patients",
    ],
  },
  {
    id: 4,
    heading: "ONDERO®",
    description:
      "DPP4i is used in T2DM management with or without comorbidities for good glycemic control. We are the leaders in Linagliptin market across SKUs with best safety profile across the T2DM spectrum.",
    highlights: [
      "Suitable for T2DM patients with or without associated comorbidities",
      "Strong Linagliptin portfolio with a well-established safety profile",
    ],
  },
  {
    id: 5,
    heading: "SEMANEXT®",
    description:
      "We are creating next level impact in treating type 2 diabetes and obesity management along with comprehensive benefits in cardiac, renal and hepatic health",
    highlights: [
      "Addresses both glycemic control and obesity management needs",
      "Extends benefit profile across cardiac, renal, and hepatic health parameters",
    ],
  },
];

export default function ProductPortfolio({ data }) {
  const fromCms = data?.tabs?.some((t) => t.items?.length > 0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActiveTab(0);
  }, [data?.tabs]);

  const heading = fromCms ? data.heading : "Our Product Portfolio";
  const descriptionParagraphs = fromCms
    ? data.descriptionParagraphs
    : [
        "Lupin has built a robust anti-diabetes portfolio which supports comprehensive care through oral therapies,",
        "insulin products, advanced devices, and combination treatments.",
      ];
  const subHeading = fromCms
    ? data.subHeading
    : "Key highlights of our leadership in this therapy area include";
  const bottomMarkdown = fromCms
    ? data.bottomMarkdown
    : "";
  const staticBottomP1 =
    "Through these products and ongoing portfolio expansion, we continue to strengthen our position";
  const staticBottomP2 =
    "as a trusted provider of diabetes management  therapies across global markets.";

  const tabs = fromCms ? data.tabs : [];
  const firstTabWithItems = fromCms
    ? tabs.find((t) => t.items?.length > 0)
    : null;
  const activeItems = !fromCms
    ? STATIC_ITEMS
    : tabs[activeTab]?.items?.length
      ? tabs[activeTab].items
      : firstTabWithItems?.items || [];

  const showTabs = fromCms && tabs.length > 1;
  const activeTabLabel = (tabs[activeTab]?.tabName || "").toLowerCase();
  const isOtherKeyBrandsTab =
    showTabs &&
    activeTabLabel.includes("other") &&
    activeTabLabel.includes("brand");

  return (
    <div className="portfolio__container">
      <div className="portfolio-text">
        <h1 className="portfolio__heading">
          <TherapyMarkdown
            components={{
              p: ({ children }) => (
                <span className="portfolio__heading-line">{children}</span>
              ),
            }}
          >
            {heading}
          </TherapyMarkdown>
        </h1>
        {descriptionParagraphs.map((p, i) => {
          if (isOtherKeyBrandsTab && isKeyProductsOnlyIntroBlock(p)) {
            return null;
          }
          return (
            <div key={i} className="portfolio-text__md">
              <TherapyMarkdown>{p}</TherapyMarkdown>
            </div>
          );
        })}
        {subHeading ? (
          <h3 className="portfolio__subheading">
            <TherapyMarkdown
              components={{
                p: ({ children }) => (
                  <span className="portfolio__subheading-line">{children}</span>
                ),
              }}
            >
              {subHeading}
            </TherapyMarkdown>
          </h3>
        ) : null}
      </div>
      {showTabs ? (
        <div className="portfolio-tabs" role="tablist" aria-label="Portfolio">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={i === activeTab}
              className={`portfolio-tabs__btn ${i === activeTab ? "portfolio-tabs__btn--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.tabName}
            </button>
          ))}
        </div>
      ) : null}
      <div className="portfolio-items">
        {activeItems.map((item) => (
          <ProductPortfolioItem
            key={item.id}
            heading={item.heading}
            description={item.description}
            highlights={item.highlights || []}
          />
        ))}
      </div>
      <div className="portfolio-bottom-text">
        {fromCms && bottomMarkdown ? (
          <div className="portfolio-bottom-text__markdown">
            <TherapyMarkdown
              components={{
                p: ({ children }) => {
                  if (!isOtherKeyBrandsTab) return <p>{children}</p>;
                  const cleaned =
                    stripKeyProductsIntroSentenceFromMarkdownParagraph(children);
                  if (cleaned == null) return null;
                  return <p>{cleaned}</p>;
                },
                a: ({ href, children }) => (
                  <div className="redirect">
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{children}</span>
                      <Image
                        src="/assets/images/india/therapies/shapes/arrow.png"
                        alt=""
                        width={15}
                        height={15}
                      />
                    </Link>
                  </div>
                ),
              }}
            >
              {bottomMarkdown}
            </TherapyMarkdown>
          </div>
        ) : !fromCms ? (
          <>
            <p>{staticBottomP1}</p>
            <p>{staticBottomP2}</p>
            <div className="redirect">
              <a
                href="https://www.lupin.com/product-finder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View our portfolio here</span>
                <Image
                  src="/assets/images/india/therapies/shapes/arrow.png"
                  alt=""
                  width={15}
                  height={15}
                />
              </a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
