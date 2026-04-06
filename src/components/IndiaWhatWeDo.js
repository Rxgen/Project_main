'use client';

import '../scss/components/IndiaWhatWeDo.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

export default function IndiaWhatWeDo({ data }) {
  const defaultData = {
    heading: "What We Do",
    content: [
      "Lupin's IRF business delivers a strong portfolio of generics with leading therapies across diabetes, cardiology, gastroenterology and more, improving affordability and everyday access to care.",
      "In the biosimilars segment, Etanercept is Lupin's flagship therapy for chronic immune-mediated inflammatory diseases, including rheumatoid arthritis, psoriatic arthritis, axial spondyloarthritis, and plaque psoriasis, addressing significant unmet patient needs. These capabilities are anchored in Lupin Biotech, our dedicated research and state-of-the-art manufacturing platform focused on developing high-quality biosimilars at scale.",
      "Complementing this, Lupin continues to expand its footprint in complex specialty drugs, including inhalation therapies and innovative combinations, strengthening long-term, patient-centric healthcare solutions."
    ]
  };

  const whatWeDoData = data || defaultData;
  const heading = whatWeDoData?.heading || whatWeDoData?.title || defaultData.heading;
  const content = whatWeDoData?.content || whatWeDoData?.paragraphs || whatWeDoData?.text || defaultData.content;

  const markdownContent = Array.isArray(content) ? content.join('\n\n') : content;

  const CustomParagraph = ({ children }) => {
    return <p className="india-what-we-do__paragraph">{children}</p>;
  }

  // Don't render if no content
  if (!markdownContent) {
    return null;
  }

  return (
    <section className="india-what-we-do" data-node-id="3067:3094">
      <div className="india-what-we-do__container">
        <h2 className="india-what-we-do__heading">
          {heading}
        </h2>
        <div className="india-what-we-do__content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
              p: CustomParagraph,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

