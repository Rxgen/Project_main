"use client";

import "@/scss/components/therapies/Approach.scss";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const APPROACH_MD_COMPONENTS = {
  a: ({ href, children }) => (
    <div className="redirect">
      <Link href={href}  rel="noopener noreferrer">
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
};

const HEADING_MD_COMPONENTS = {
  ...APPROACH_MD_COMPONENTS,
  p: ({ children }) => (
    <span className="approach__heading-line">{children}</span>
  ),
};

const SUBHEADING_MD_COMPONENTS = {
  ...APPROACH_MD_COMPONENTS,
  p: ({ children }) => (
    <span className="approach__subheading-line">{children}</span>
  ),
};

export const ApproachCard = ({ src, alt, text }) => {
  const isSvg = typeof src === "string" && src.toLowerCase().includes(".svg");
  return (
    <div className="approach-card">
      <div className="icon">
        <Image
          src={src}
          alt={alt || ""}
          width={50}
          height={50}
          unoptimized={isSvg}
        />
      </div>

      <div className="text">
        <div className="approach-card__markdown">
          <ReactMarkdown components={APPROACH_MD_COMPONENTS}>
            {text}
          </ReactMarkdown>
        </div>
        <span className="line"></span>
      </div>
    </div>
  );
};

const STATIC_DEFAULT = {
  heading: "Our Approach to Diabetes Management",
  descriptionParagraphs: [
    "Lupin has established a strong presence in anti-diabetes segment through comprehensive portfolio therapies",
    "and patient-centric initiatives that support long-term disease management.",
  ],
  subHeading: "Key highlights of our leadership in this therapy area include",
  middleParagraphs: [
    "Our commitment to anti-TB treatment is rooted in the personal journey of our founder, Dr. Gupta. As a young boy growing up in Rajasthan, India, he witnessed the devastating impact of TB firsthand, when a close childhood friend succumbed to the disease.",
    "At a time when effective medicines existed but remained inaccessible to many in the country, this loss left a lasting impression on him. Years later, when he founded Lupin with a vision to make high-quality medication affordable and accessible, TB became one of the company’s earliest and most important focus area.",
    "What began as a great personal resolve has since evolved into a global mission, expanding access to life-saving TB treatment for patients globally.",
    "Today, we are recognized as one of the world’s leading suppliers of anti-tuberculosis medicines, with strong manufacturing capabilities and deep expertise in TB drug development.",
  ],
  highlights: [
    {
      src: "/assets/images/india/therapies/shapes/ranking.png",
      alt: "ranking",
      text: "We rank #3 in the anti-diabetic market in India with approximately 8% market share",
    },
    {
      src: "/assets/images/india/therapies/shapes/shield-capsuel.png",
      alt: "research",
      text: "We manufacture and market 15 of the top 20 anti-diabetic molecules in India",
    },
    {
      src: "/assets/images/india/therapies/shapes/petal-plus.png",
      alt: "patient",
      text: "We hold a strong presence across oral anti-diabetic therapies, insulin products, and combination treatments",
    },
    {
      src: "/assets/images/india/therapies/shapes/ranking-petal-shield.png",
      alt: "portfolio",
      text: "Two of our diabetes medicines rank among the top products in the IPM (Indian Pharma Market)",
    },
    {
      src: "/assets/images/india/therapies/shapes/machine-petal.png",
      alt: "doctors",
      text: "Continued expansion of the diabetes portfolio through strategic acquisitions and collaborations",
    },
  ],
  bottomParagraphs: [
    "Our approach to diabetes care extends beyond medicines to include patient education, digital tools, and professional healthcare engagement to improve long-term outcomes.",
    "HuMrahi is our patient support program for diabetes and cardiac care, supporting thousands of patients, by offering personalized counselling, monitoring tools, free medication and tests, across India.",
  ],
};

export default function Approach({ data }) {
  const fromCms = data && Object.keys(data).length > 0;
  const heading = fromCms ? data.heading : STATIC_DEFAULT.heading;
  const descriptionParagraphs = fromCms
    ? data.descriptionParagraphs
    : STATIC_DEFAULT.descriptionParagraphs;
  const subHeading = fromCms ? data.subHeading : STATIC_DEFAULT.subHeading;
  const middleParagraphs = fromCms
    ? data.middleParagraphs?.length
      ? data.middleParagraphs
      : []
    : STATIC_DEFAULT.middleParagraphs;
  const highlights = fromCms ? data.highlights : STATIC_DEFAULT.highlights;
  const bottomParagraphs = fromCms
    ? data.bottomParagraphs?.length
      ? data.bottomParagraphs
      : []
    : STATIC_DEFAULT.bottomParagraphs;

  return (
    <div className="approach__container">
      <div>
        {heading ? (
          <h1 className="approach__heading">
            <ReactMarkdown components={HEADING_MD_COMPONENTS}>
              {heading}
            </ReactMarkdown>
          </h1>
        ) : null}
        {descriptionParagraphs.map((p, i) => (
          <div key={`d-${i}`} className="approach__para-block">
            <ReactMarkdown components={APPROACH_MD_COMPONENTS}>{p}</ReactMarkdown>
          </div>
        ))}
        {subHeading ? (
          <h3 className="approach__subheading">
            <ReactMarkdown components={SUBHEADING_MD_COMPONENTS}>
              {subHeading}
            </ReactMarkdown>
          </h3>
        ) : null}

        {middleParagraphs.length > 0 ? (
          <div className="approach_bottom-header-para">
            {middleParagraphs.map((para, i) => (
              <div className="approach_para" key={`m-${i}`}>
                <ReactMarkdown components={APPROACH_MD_COMPONENTS}>
                  {para}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="approach-cards">
        {highlights.map((card, i) => (
          <ApproachCard
            key={i}
            src={card.src}
            alt={card.alt}
            text={card.text}
          />
        ))}
      </div>
      {bottomParagraphs.length > 0 ? (
        <div className="bottom-texts">
          {bottomParagraphs.map((p, i) => (
            <div key={`b-${i}`} className="bottom-texts__md">
              <ReactMarkdown components={APPROACH_MD_COMPONENTS}>{p}</ReactMarkdown>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
