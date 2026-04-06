"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/Testimonials.scss";

const NAV_ARROW_IMG = "/assets/images/india/therapies/shapes/nav-arrow.png";
const QUOTES_IMG = "/assets/images/india/therapies/shapes/quotes.png";

const STATIC_ITEMS = [
  {
    id: 1,
    text1:
      "For years, I struggled with diabetes and hypertension, often facing severe chest pain and breathlessness, yet my condition remained undiagnosed. Living in a remote coastal area in India, with limited healthcare access made regular treatment difficult.",
    text2:
      "The health outreach program by Lupin finally helped me receive timely interventions and care. Community mobilizer visited me, guided me to a health camp, and ensured that I received advanced diagnostics and specialist care. I am truly blessed that this support has added many years to my life.",
    name: "Jitendra, Beneficiary",
    address: "- Dahanu Block, Palghar",
  },
  {
    id: 2,
    text1:
      "For years, I struggled with diabetes and hypertension, often facing severe chest pain and breathlessness, yet my condition remained undiagnosed. Living in a remote coastal area in India, with limited healthcare access made regular treatment difficult.",
    text2:
      "The health outreach program by Lupin finally helped me receive timely interventions and care. Community mobilizer visited me, guided me to a health camp, and ensured that I received advanced diagnostics and specialist care. I am truly blessed that this support has added many years to my life.",
    name: "Jitendra, Beneficiary",
    address: "- Dahanu Block, Palghar",
  },
];

const INLINE_MD = {
  p: ({ children }) => <span className="testimonial-card__inline-md">{children}</span>,
};

const TestimonialCard = ({ text1, text2, name, address, isActive }) => (
  <div
    className={`testimonial-card ${isActive ? "testimonial-card--active" : ""}`}
  >
    <div className="testimonial-card__quote-top">
      <Image src={QUOTES_IMG} alt="" width={48} height={48} />
    </div>
    {text1 ? (
      <div className="testimonial-card__text">
        <TherapyMarkdown>{text1}</TherapyMarkdown>
      </div>
    ) : null}
    {text2 ? (
      <div className="testimonial-card__text">
        <TherapyMarkdown>{text2}</TherapyMarkdown>
      </div>
    ) : null}
    <div className="testimonial-card__footer">
      <div className="testimonial-card__details">
        <p className="testimonial-card__name">
          <TherapyMarkdown components={INLINE_MD}>{name}</TherapyMarkdown>
        </p>
        <p className="testimonial-card__address">
          <TherapyMarkdown components={INLINE_MD}>{address}</TherapyMarkdown>
        </p>
      </div>
      <div className="testimonial-card__quote-bg" aria-hidden="true">
        <Image src={QUOTES_IMG} alt="" width={200} height={200} />
      </div>
    </div>
  </div>
);

export default function Testimonials({ data }) {
  const fromCms = data?.items?.length > 0;
  const items = fromCms ? data.items : STATIC_ITEMS;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, items.length - 1)));
  }, [items.length]);

  const testimonialHeading = fromCms
    ? data.heading
    : "Patient Testimonials and Case Studies";
  const introParagraphs = fromCms
    ? data.introParagraphs
    : [
        "Hear from patients, healthcare professionals, and caregivers who have experienced the impact of",
        "our diabetes care solutions. ",
      ];

  const goPrevious = () => {
    setActiveIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    setActiveIndex((i) => Math.min(items.length - 1, i + 1));
  };

  const [cardWidthVw, setCardWidthVw] = useState((1170 / 1920) * 100);
  const [gapVw, setGapVw] = useState((24 / 1920) * 100);

  useEffect(() => {
    const updateCarouselWidth = () => {
      const w = window.innerWidth;
      if (w <= 425) {
        setCardWidthVw(90);
        setGapVw(4);
      } else if (w <= 768) {
        setCardWidthVw(88);
        setGapVw(4);
      } else {
        setCardWidthVw((1170 / 1920) * 100);
        setGapVw((24 / 1920) * 100);
      }
    };
    updateCarouselWidth();
    window.addEventListener("resize", updateCarouselWidth);
    return () => window.removeEventListener("resize", updateCarouselWidth);
  }, []);

  const translateX = activeIndex * (cardWidthVw + gapVw);

  return (
    <div className="testimonial__container">
      <div className="testimonial-text">
        <div className="testimonial-text__header">
          <h1 className="testimonial__heading">
            <TherapyMarkdown
              components={{
                p: ({ children }) => (
                  <span className="testimonial__heading-line">{children}</span>
                ),
              }}
            >
              {testimonialHeading}
            </TherapyMarkdown>
          </h1>
          <div
            className="testimonial-nav-buttons"
            aria-label="testimonial navigation"
          >
            <button
              type="button"
              className="testimonial-nav-buttons__btn"
              aria-label="Previous"
              onClick={goPrevious}
              disabled={activeIndex === 0}
            >
              <Image src={NAV_ARROW_IMG} alt="" width={24} height={24} />
            </button>
            <button
              type="button"
              className="testimonial-nav-buttons__btn testimonial-nav-buttons__btn--next"
              aria-label="Next"
              onClick={goNext}
              disabled={activeIndex === items.length - 1}
            >
              <Image src={NAV_ARROW_IMG} alt="" width={24} height={24} />
            </button>
          </div>
        </div>
        {introParagraphs.map((p, i) => (
          <div key={i} className="testimonial-text__md">
            <TherapyMarkdown>{p}</TherapyMarkdown>
          </div>
        ))}
      </div>
      <div className="testimonial-cards">
        <div
          className="testimonial-cards__track"
          style={{ transform: `translateX(-${translateX}vw)` }}
        >
          {items.map((item, index) => (
            <TestimonialCard
              key={item.id}
              text1={item.text1}
              text2={item.text2}
              name={item.name}
              address={item.address}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
