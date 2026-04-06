'use client';

import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/GlobalGenericsPortfolio.scss';

export default function GlobalGenericsPortfolio({ data }) {
  if (!data) {
    return null;
  }

  // Get data from Strapi
  const description = data.description || data.text || data.content || '';
  const linkText = data.cta?.text || data.link?.text || data.linkText || '';
  const linkUrl = data.cta?.href || data.cta?.url || data.link?.url || data.linkUrl || '';
  const imageUrl = data.image?.url || data.image || null;
  const imageAlt = data.image?.alternativeText || data.image?.alt || data.imageAlt || '';

  // Don't render image if URL is empty or null
  const hasImage = imageUrl && imageUrl.trim() !== '';

  const CustomParagraph = ({ children }) => {
    return <p className="global-generics-portfolio__description-text">{children}</p>;
  };

  return (
    <section className="global-generics-portfolio" data-node-id="3030:2227">
      <div className="global-generics-portfolio__content">
        {hasImage && (
          <div className="global-generics-portfolio__left">
            <div className="global-generics-portfolio__image-wrapper">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="global-generics-portfolio__image"
                quality={100}
              />
            </div>
          </div>
        )}
        <div className="global-generics-portfolio__right">
          <div className="global-generics-portfolio__background"></div>
          <div className="global-generics-portfolio__petals">
            <Image
              src="/assets/images/global-generic/petals.svg"
              alt=""
              width={447}
              height={214}
              className="global-generics-portfolio__petals-image"
              quality={100}
            />
          </div>
          <div className="global-generics-portfolio__right-content">
            <div className="global-generics-portfolio__description">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: CustomParagraph,
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
            {linkText && (
              <Link href={linkUrl} className="global-generics-portfolio__link">
                {linkText}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="global-generics-portfolio__link-arrow">
                  <path d="M1 12L12 1M12 1H1M12 1V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

