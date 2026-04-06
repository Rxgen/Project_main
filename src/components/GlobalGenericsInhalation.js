'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/GlobalGenericsInhalation.scss';

export default function GlobalGenericsInhalation({ data }) {
  if (!data) {
    return null;
  }

  // Get content from data
  const heading = data.heading || data.title || '';
  const description = data.description || data.text || data.content || '';
  const linkText = data.link?.text || data.linkText || '';
  const linkUrl = data.link?.url || data.linkUrl || '';

  const CustomParagraph = ({ children }) => {
    return <p className="global-generics-inhalation__description-text">{children}</p>;
  };

  return (
    <section className="global-generics-inhalation" data-node-id="3114:638">
      <div className="global-generics-inhalation__container">
        <h2 className="global-generics-inhalation__heading">
          {heading}
        </h2>
        <div className="global-generics-inhalation__description">
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
        {linkText && (() => {
          const match = linkText.match(/^(.*?)(click here)(.*)$/i);
          if (!match) {
            return (
              <Link href={linkUrl || '#'} className="global-generics-inhalation__link">
                {linkText}
              </Link>
            );
          }
          const [, before, clickHere, after] = match;
          return (
            <p className="global-generics-inhalation__link-wrap">
              {before && <span>{before}</span>}
              <Link href={linkUrl || '#'} className="global-generics-inhalation__link">
                {clickHere}
              </Link>
              {after && <span>{after}</span>}
            </p>
          );
        })()}
      </div>
    </section>
  );
}

