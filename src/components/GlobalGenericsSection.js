'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/GlobalGenericsSection.scss';

export default function GlobalGenericsSection({ data }) {
  const defaultData = {
    heading: "Generics and Complex Generics",
    content: [
      "Lupin's generics business is built on scale, regulatory strength, and a diversified portfolio across high-burden therapeutic areas. In developed markets, generics continue to be the primary driver of affordability, access, and healthcare sustainability, particularly as populations age and chronic disease prevalence rises.",
      "In the U.S., we continue to be the 3rd largest generics company by filled prescriptions, with a 4.9% market share. Lupin markets a broad portfolio, with 50 products ranking number one and 105 products ranking among the top three in their respective categories."
    ]
  };

  const sectionData = data || defaultData;
  const heading = sectionData?.heading || sectionData?.title || defaultData.heading;
  const content = sectionData?.content || sectionData?.paragraphs || sectionData?.text || defaultData.content;

  const CustomParagraph = ({ children }) => {
    return <p className="global-generics-section__paragraph">{children}</p>;
  };

  return (
    <section className="global-generics-section" data-node-id="3113:603">
      <div className="global-generics-section__container">
        <h2 className="global-generics-section__heading">
          {heading}
        </h2>
        <div className="global-generics-section__content">
          {Array.isArray(content) ? (
            content.map((paragraph, index) => (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: CustomParagraph,
                }}
              >
                {paragraph}
              </ReactMarkdown>
            ))
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: CustomParagraph,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </section>
  );
}

