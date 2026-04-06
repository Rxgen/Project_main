'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ScienceIntro.scss';

export default function ScienceIntro({ data }) {
  const introData = data || {
    heading: {
      line1: "Turning intellectual capital",
    },
    description: "At Lupin, behind every product manufactured or a formulation created lies the power of science. Our intellectual prowess resides in subject-matter expertise, a passion for innovation, and in-depth research. In everything we do, here at Lupin, science is reflected through our Research and Development unit and our continuous focus on Digital Transformation."
  };

  const headingLine1 = introData?.heading?.line1 || introData?.headingLine1 || "Turning intellectual capital";
  const headingLine2 = introData?.heading?.line2 || introData?.headingLine2 || "into meaningful healthcare impact";
  const description = introData?.description || introData?.text || "";

  return (
    <section className="science-intro" data-node-id="2952:3547">
      <div className="science-intro__container">
        <h2 className="science-intro__heading" data-node-id="2952:3548">
          <span className="science-intro__heading-line">{headingLine1}</span>
          {headingLine2 && introData?.heading?.line2 && (
            <span className="science-intro__heading-line">{headingLine2}</span>
          )}
        </h2>
        {description && (
          <div className="science-intro__description" data-node-id="2952:3549">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {description}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </section>
  );
}

