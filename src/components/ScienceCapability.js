'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ScienceCapability.scss';

export default function ScienceCapability({ data }) {
  const defaultData = {
    text: "We are realizing this ambition through a Core-Common-Distinct business capability model, guided by clear enterprise architecture principles."
  };

  const capabilityData = data || defaultData;
  const text = capabilityData?.text || capabilityData?.content || capabilityData?.description || defaultData.text;

  return (
    <section className="science-capability" data-node-id="3098:522">
      <div className="science-capability__container">
        <div className="science-capability__text">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

