"use client";

import Image from "next/image";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/TherapeuticCategories.scss";

export const CategoryCard = ({
  title,
  description,
  iconUrl,
  isActive,
  onMouseEnter,
}) => {
  const isSvg =
    typeof iconUrl === "string" && iconUrl.toLowerCase().includes(".svg");
  return (
    <div
      className={`category-card ${isActive ? "category-card--active" : ""}`}
      onMouseEnter={onMouseEnter}
    >
      <div className="card-content">
        <h3 className="category-card__title">
          <TherapyMarkdown
            components={{
              p: ({ children }) => (
                <span className="category-card__title-line">{children}</span>
              ),
            }}
          >
            {title}
          </TherapyMarkdown>
        </h3>
        <span className="divider"></span>
        <div className="category-card__description">
          <TherapyMarkdown>{description}</TherapyMarkdown>
        </div>
      </div>

      <div className="card-svg">
        <Image
          src={iconUrl}
          alt=""
          width={120}
          height={120}
          unoptimized={isSvg}
        />
      </div>
    </div>
  );
};

const STATIC_CARDS = [
  {
    id: 1,
    title: "Type 2 Diabetes Mellitus (T2DM)",
    description:
      "Chronic metabolic disorder where the body becomes resistant to insulin and where support requires control through oral anti-diabetic medicines and combination therapies.",
    iconUrl: "/assets/images/india/therapies/shapes/category-1-machine.svg",
  },
  {
    id: 2,
    title: "Type 1 Diabetes Mellitus (T1DM)",
    description:
      "A chronic autoimmune condition  where pancreas produce little or no insulin. Supported through insulin therapies and education initiatives.",
    iconUrl: "/assets/images/india/therapies/shapes/category-2-injection.svg",
  },
  {
    id: 3,
    title: "Diabetes-Related Cardiometabolic Risk",
    description:
      "Diabetes significantly increases the risk of cardiovascular conditions such as heart disease and stroke. Care initiatives help manage blood glucose and associated cardiac risks.",
    iconUrl: "/assets/images/india/therapies/shapes/category-3-droplet.svg",
  },
  {
    id: 4,
    title: "Diabetes Complications Management",
    description:
      "Uncontrolled diabetes can lead to complications affecting the kidneys, nerves, eyes, and heart. Long-term management is imperative in this case for improved lifestyle and health outcomes.",
    iconUrl: "/assets/images/india/therapies/shapes/category-4-shield.svg",
  },
];

export default function TherapeuticCategories({ data }) {
  const fromCms = data?.cards?.length > 0;
  const heading = fromCms
    ? data.heading
    : "Therapeutic Categories";
  const description = fromCms
    ? data.description
    : "Our anti-diabetes portfolio addresses multiple stages of disease progression and patient needs across various care settings.";
  const cards = fromCms ? data.cards : STATIC_CARDS;

  return (
    <div className="catergory__container">
      <div className="category__text">
        <h1 className="category__heading">
          <TherapyMarkdown
            components={{
              p: ({ children }) => (
                <span className="category__heading-line">{children}</span>
              ),
            }}
          >
            {heading}
          </TherapyMarkdown>
        </h1>
        <div className="category__description">
          <TherapyMarkdown>{description}</TherapyMarkdown>
        </div>
      </div>
      <div className="card">
        {cards.map((card, index) => (
          <CategoryCard
            key={card.id}
            title={card.title}
            description={card.description}
            iconUrl={card.iconUrl}
          />
        ))}
      </div>
    </div>
  );
}
