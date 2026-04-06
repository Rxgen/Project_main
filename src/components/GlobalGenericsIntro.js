'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import '../scss/components/GlobalGenericsIntro.scss';

export default function GlobalGenericsIntro({ data }) {
  if (!data) {
    return null;
  }

  // Get content from data - handle both string and array formats
  let content = data.content || data.text || data.description || '';


  const CustomParagraph = ({ children }) => {
    return <p className="global-generics-intro__paragraph">{children}</p>;
  };

  return (
    <section className="global-generics-intro" data-node-id="3112:602">
      <div className="global-generics-intro__container">
        <div className="global-generics-intro__content">
          <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: CustomParagraph,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
        </div>
        <div className="global-generics-intro__line">
          <div className="global-generics-intro__line-pointer">
            <Image
              src="/assets/images/global-generic/smallicon2.svg"
              alt=""
              width={48}
              height={48}
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

