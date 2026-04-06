"use client";

import Image from "next/image";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/StrategicOutlook.scss";

const PETALS_IMG = "/assets/images/india/therapies/shapes/side-green-petals.png";
const DEFAULT_IMAGE = "/assets/images/india/therapies/person-doing-yoga.png";
const DEFAULT_HEADING = "Way Forward";
const DEFAULT_PARAGRAPHS = [
  "Diabetes continues to pose one of the most significant global health challenges, requiring sustained innovation, accessible therapies and stronger patient engagement. At Lupin, our commitment to diabetes management is to ensure high-quality accessible medication and care that goes beyond the pills. Through scientific rigor, ongoing strategic partnerships, and patient support programs, we strive to take one step each day towards our goal, that is to enable better outcomes for millions of people living with diabetes worldwide.",
];

export default function StrategicOutlook({ data }) {
  const fromCms = data?.paragraphs?.length > 0;
  const heading = fromCms ? data.heading : DEFAULT_HEADING;
  const paragraphs = fromCms ? data.paragraphs : DEFAULT_PARAGRAPHS;
  const imageSrc = fromCms ? data.imageSrc : DEFAULT_IMAGE;
  const imageAlt = fromCms ? data.imageAlt : "Person doing yoga in nature";

  return (
    <div className="strategic-outlook">
      <div className="strategic-outlook__content">
        <div className="strategic-outlook__petal" aria-hidden="true">
          <img src={PETALS_IMG} alt="" />
        </div>
        <h2 className="strategic-outlook__heading">
          <TherapyMarkdown
            components={{
              p: ({ children }) => (
                <span className="strategic-outlook__heading-line">{children}</span>
              ),
            }}
          >
            {heading}
          </TherapyMarkdown>
        </h2>
        {paragraphs.map((p, i) => (
          <div className="strategic-outlook__text" key={i}>
            <TherapyMarkdown>{p}</TherapyMarkdown>
          </div>
        ))}
      </div>
      <div className="strategic-outlook__media">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={576}
          height={720}
          className="strategic-outlook__img"
        />
      </div>
    </div>
  );
}
