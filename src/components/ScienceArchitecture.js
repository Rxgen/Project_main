'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ScienceArchitecture.scss';

export default function ScienceArchitecture({ data }) {

  const architectureData = data;
  const content = architectureData?.content || architectureData?.paragraphs || architectureData?.text;

  const CustomParagraph = ({ children }) => {
    return <p className="science-architecture__paragraph">{children}</p>;
  }

  return (
    <section className="science-architecture" data-node-id="3102:601">
      <div className="science-architecture__container">
        <div className="science-architecture__content">

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
    </section>
  );
}

