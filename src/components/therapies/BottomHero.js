"use client";

import Image from "next/image";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/BottomHero.scss";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

const DEFAULT = {
  petalSrc: "/assets/images/india/therapies/shapes/bottom-hero-flower.png",
  sideImage:
    "/assets/images/india/therapies/high-angle-diabetic-woman-checking-her-glucose-level 1.png",
  paragraphs: [
    "Diabetes is one of the fastest-growing chronic metabolic disease, affecting people across geographies, age groups, and socio-economic groups. The condition requires lifelong management, continuous monitoring, and consistent access to medication.",
    "According to the International Diabetes Federation, number of people living with diabetes is projected to hit over 800 million by 2050. India is one of the top countries with the highest diabetes burden, making access to effective and affordable treatment critical for long-term disease management.",
    "The treatment landscape for diabetes has evolved significantly in recent years. Diabetes management approach now extends beyond glucose control to and includes integrated care, involving combination therapies, insulin treatments, digital monitoring tools, lifestyle management, and patient education. Lupin is at the forefront of these innovations that are helping with improved outcomes and reduced risk of complication that comes with diabetes.",
  ],
};

export default function BottomHero({ data }) {
  const petalSrc = data?.petalSrc ?? DEFAULT.petalSrc;
  const sideImage = data?.sideImage ?? DEFAULT.sideImage;
  const paragraphs =
    data?.paragraphs?.length > 0 ? data.paragraphs : DEFAULT.paragraphs;

  return (
    <div className="bottom-banner__container">
      <div className="bottom-banner___petal-image">
        <Image
          src={petalSrc}
          width={1427}
          height={961}
          alt=""
          className="bottom-banner__petal-img"
        />
      </div>
      <div className="bottom-banner__text">
        {paragraphs.map((p, i) => (
          <div key={i} className="bottom-banner__markdown-block">
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                a: ({ node, ...props }) => (
                  <Link
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {p}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="bottom-banner__image">
        <Image src={sideImage} width={818} height={544} alt="" />
      </div>
    </div>
  );
}
