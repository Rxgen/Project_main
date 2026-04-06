'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ScienceDigital.scss';

export default function ScienceDigital({ data }) {
  const defaultData = {
    mainHeading: "Digital Transformation",
    introParagraph: "At Lupin, our digital ambition is anchored in our purpose, to catalyze treatments that transform hope into healing.",
    sectionHeading: {
      line1: "Our Digital",
      line2: "Ambition"
    },
    description: "From Labs to Lives - We aspire to build an intelligent, resilient, and trusted enterprise where digital capabilities strengthen how we operate, innovate, and scale.",
    image: {
      url: "/assets/images/our-sci/doctor-from-future-concept (2) 1.png",
      alt: "Future doctor concept"
    }
  };

  const digitalData = data || defaultData;
  const mainHeading = digitalData?.mainHeading || digitalData?.heading || defaultData.mainHeading;
  const introParagraph = digitalData?.introParagraph || digitalData?.intro || defaultData.introParagraph;
  const sectionHeading = digitalData?.sectionHeading || defaultData.sectionHeading;
  const description = digitalData?.description || digitalData?.text || defaultData.description;
  const imageUrl = digitalData?.image?.url || digitalData?.image || defaultData.image.url;
  const imageAlt = digitalData?.image?.alt || digitalData?.imageAlt || defaultData.image.alt;

  return (
    <section className="science-digital" data-node-id="3097:519">
      <div className="science-digital__content">
        <div className="science-digital__left">
          <div className="science-digital__background">
            <Image
              src="/assets/images/our-sci/BG.svg"
              alt=""
              fill
              className="science-digital__background-image"
              quality={100}
            />
          </div>
          <div className="science-digital__left-content">
            <h2 className="science-digital__main-heading">
              {mainHeading}
            </h2>
            <div className="science-digital__intro">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {introParagraph}
              </ReactMarkdown>
            </div>
            <div className="science-digital__section">
              <h3 className="science-digital__section-heading">
                <span className="science-digital__section-heading-line">{sectionHeading.line1}</span>
                <span className="science-digital__section-heading-line">{sectionHeading.line2}</span>
                <span className="science-digital__section-heading-line">Ambition</span>
              </h3>
              <div className="science-digital__divider"></div>
              <div className="science-digital__description">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
        <div className="science-digital__right">
          <div className="science-digital__image-wrapper">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="science-digital__image"
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

