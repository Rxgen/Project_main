'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ScienceResearch.scss';

export default function ScienceResearch({ data }) {
  const researchData = data;
  const heading = researchData?.heading || researchData?.title;
  const content = researchData?.content || researchData?.paragraphs || researchData?.text;
  const imageUrl = researchData?.image?.url || researchData?.image;
  const imageAlt = researchData?.image?.alt || researchData?.imageAlt;

  return (
    <section className="science-research" data-node-id="2952:3478">
      <div className="science-research__content">
        <div className="science-research__left">
          <div className="science-research__image-wrapper">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="science-research__image"
              quality={100}
            />
          </div>
        </div>
        <div className="science-research__right">
          <div className="science-research__background">
            <Image
              src="/assets/images/our-sci/BG.svg"
              alt=""
              fill
              className="science-research__background-image"
              quality={100}
            />
          </div>
          <div className="science-research__right-content">
            <h2 className="science-research__heading">
              {heading}
            </h2>
            <div className="science-research__text">
              <div className="science-research__paragraph">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

