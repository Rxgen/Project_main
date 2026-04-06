"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/Milestones.scss";

const NAV_ARROW_IMG = "/assets/images/india/therapies/shapes/nav-arrow.png";
const GREEN_PETAL_IMG = "/assets/images/india/therapies/shapes/green-petal.png";
const LINK_ARROW_IMG = "/assets/images/india/therapies/shapes/arrow.png";

const STATIC_CARDS = [
  {
    header: "Combination Therapy Designed",
    items: [
      "Combination Therapy Designed For Enhanced Glucose Management In Type 2 Diabetes.",
      "GIBTULIO MET® (Empagliflozin + Metformin)",
    ],
    link: null,
  },
  {
    header: "The Initiative",
    items: [
      "The Initiative Led To 10,000+ Health Camps And 75,000+ Individual Screenings In India",
    ],
    link: {
      label: "Read more about this initiative here.",
      href: "#",
    },
  },
  {
    header: "Enhanced Glucose Management",
    items: [
      "Combination Therapy Designed For Enhanced Glucose Management In Type 2 Diabetes.",
      "GIBTULIO MET® (Empagliflozin + Metformin)",
    ],
    link: {
      label: "Learn more about GIBTULIO MET® here.",
      href: "#",
    },
  },
  {
    header: "Dual Therapy Offering",
    items: [
      "Combination Therapy Designed For Enhanced Glucose Management In Type 2 Diabetes.",
      "GIBTULIO MET® (Empagliflozin + Metformin)",
    ],
    link: null,
  },
];

export default function Milestones({ data }) {
  const fromCms = data?.cards?.length > 0;
  const MILESTONE_CARDS = fromCms ? data.cards : STATIC_CARDS;

  const [singleCardMode, setSingleCardMode] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 425 : false
  );

  useEffect(() => {
    const check = () => setSingleCardMode(window.innerWidth <= 425);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((i) =>
      Math.min(i, Math.max(0, MILESTONE_CARDS.length - 1))
    );
  }, [fromCms, data?.cards?.length]);

  const milestoneHeading = fromCms
    ? data.heading
    : "Key Milestones and Outcomes";
  const introParagraphs = fromCms
    ? data.introParagraphs
    : [
        "Lupin continues to expand its diabetes care initiatives through patient programs, healthcare education,",
        "and digital engagement platforms.",
      ];
  const bottomMarkdown = fromCms ? data.bottomMarkdown : "";
  const staticBottomTitle = "Clinical Knowledge Advancement";
  const staticBottomText =
    "We have partnered with experts to launch a book “Complications in Diabetes Mellitus: Bench to Bedside,” providing healthcare professionals with updated global perspectives on diabetes complications and treatment strategies. This endeavor shows Lupin’s ongoing commitment to academic excellence and intellectual growth.";

  const goPrevious = () => {
    setActiveIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    setActiveIndex((i) => Math.min(MILESTONE_CARDS.length - 1, i + 1));
  };

  const progressWidth = singleCardMode
    ? MILESTONE_CARDS.length <= 1
      ? 0
      : (activeIndex / (MILESTONE_CARDS.length - 1)) * 100
    : ((activeIndex + 0.5) / MILESTONE_CARDS.length) * 100;

  return (
    <div className="milestone__container">
      <div className="milestone-text">
        <div className="milestone-text__header">
          <h1 className="milestone__heading">
            <TherapyMarkdown
              components={{
                p: ({ children }) => (
                  <span className="milestone__heading-line">{children}</span>
                ),
              }}
            >
              {milestoneHeading}
            </TherapyMarkdown>
          </h1>
          <div
            className="milestone-nav-buttons"
            aria-label="Milestone navigation"
          >
            <button
              type="button"
              className="milestone-nav-buttons__btn"
              aria-label="Previous"
              onClick={goPrevious}
              disabled={activeIndex === 0}
            >
              <Image src={NAV_ARROW_IMG} alt="" width={24} height={24} />
            </button>
            <button
              type="button"
              className="milestone-nav-buttons__btn milestone-nav-buttons__btn--next"
              aria-label="Next"
              onClick={goNext}
              disabled={activeIndex === MILESTONE_CARDS.length - 1}
            >
              <Image src={NAV_ARROW_IMG} alt="" width={24} height={24} />
            </button>
          </div>
        </div>
        {introParagraphs.map((p, i) => (
          <div key={i} className="milestone-text__md">
            <TherapyMarkdown>{p}</TherapyMarkdown>
          </div>
        ))}
      </div>
      <div
        className="milestone-cards"
        style={{ "--milestone-cards-count": MILESTONE_CARDS.length }}
      >
        <div className="milestone-cards__line-wrap">
          <div className="milestone-cards__line">
            <div
              className="milestone-cards__progress"
              style={{ width: `${progressWidth}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="milestone-cards__petal-row" aria-hidden="true">
            {singleCardMode ? (
              <div
                className="milestone-cards__petal-cell milestone-cards__petal-cell--single"
                style={(() => {
                  const total = MILESTONE_CARDS.length;
                  const atStart = total <= 1 || activeIndex === 0;
                  const leftPct = atStart
                    ? 0
                    : (activeIndex / (total - 1)) * 100;
                  return {
                    left: `${leftPct}%`,
                    transform: atStart
                      ? "translate(0, -50%)"
                      : "translate(-50%, -50%)",
                  };
                })()}
              >
                <div className="milestone-cards__petal">
                  <Image
                    src={GREEN_PETAL_IMG}
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            ) : (
              MILESTONE_CARDS.map((_, index) => (
                <div key={index} className="milestone-cards__petal-cell">
                  {index === activeIndex && (
                    <div className="milestone-cards__petal">
                      <Image
                        src={GREEN_PETAL_IMG}
                        alt=""
                        width={24}
                        height={24}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div
          className="milestone-cards__list"
          style={
            singleCardMode
              ? { transform: `translateX(-${activeIndex * 25}%)` }
              : undefined
          }
        >
          {MILESTONE_CARDS.map((card, index) => (
            <div
              key={index}
              className={`milestone-card ${index === activeIndex ? "milestone-card--active" : ""}`}
            >
              <div className="milestone-card__pointer" aria-hidden="true" />
              <h3 className="milestone-card__header">
                <TherapyMarkdown
                  components={{
                    p: ({ children }) => (
                      <span className="milestone-card__header-line">{children}</span>
                    ),
                  }}
                >
                  {card.header}
                </TherapyMarkdown>
              </h3>
              <ul className="milestone-card__bullets">
                {card.items.map((item, i) => (
                  <li key={i} className="milestone-card__bullet">
                    <TherapyMarkdown
                      components={{
                        p: ({ children }) => (
                          <span className="milestone-card__bullet-line">
                            {children}
                          </span>
                        ),
                      }}
                    >
                      {item}
                    </TherapyMarkdown>
                  </li>
                ))}
              </ul>
              {card.link ? (
                <a
                  className="milestone-card__footer-link"
                  href={card.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="milestone-card__footer-link-label">
                    {card.link.label}
                  </span>
                  <Image
                    src={LINK_ARROW_IMG}
                    alt=""
                    width={16}
                    height={16}
                    className="milestone-card__footer-link-icon"
                  />
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {fromCms && bottomMarkdown ? (
        <div className="milestone__bottom-texts milestone__bottom-texts--cms">
          <TherapyMarkdown>{bottomMarkdown}</TherapyMarkdown>
        </div>
      ) : !fromCms ? (
        <div className="milestone__bottom-texts">
          <h2>{staticBottomTitle}</h2>
          <p>{staticBottomText}</p>
        </div>
      ) : null}
    </div>
  );
}
