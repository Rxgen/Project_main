'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/GlobalGenericsComplex.scss';

export default function GlobalGenericsComplex({ data }) {
  if (!data) {
    return null;
  }

  // Get content from data - handle both string and array formats
  let content = data.content || data.text || data.description || '';

  // Get image data
  const imageUrl = data.image?.url || data.image || null;
  const imageAlt = data.image?.alt || data.imageAlt || '';
  const hasImage = imageUrl && imageUrl.trim() !== '';

  const CustomParagraph = ({ children }) => {
    return <p className="global-generics-complex__paragraph">{children}</p>;
  };

  return (
    <section className="global-generics-complex" data-node-id="3114:619">
      <div className="global-generics-complex__content">
        <div className="global-generics-complex__left">
          <div className="global-generics-complex__text-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: CustomParagraph,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="global-generics-complex__divider">
          <div className="global-generics-complex__divider-line"></div>
          <div className="global-generics-complex__divider-icon">
            <Image
              src="/assets/images/global-generic/smallicon2.svg"
              alt=""
              width={48}
              height={48}
              quality={100}
            />
          </div>
        </div>
        {hasImage && (
          <div className="global-generics-complex__right">
            <div className="global-generics-complex__image-wrapper">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="global-generics-complex__image"
                quality={100}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

