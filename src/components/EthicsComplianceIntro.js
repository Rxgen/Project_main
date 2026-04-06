'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/pages/ethics-compliance-governance.scss';

export default function EthicsComplianceIntro({ data }) {
  if (!data) {
    return null;
  }

  const sectionTitle = data?.sectionTitle || '';
  const introDetail = data?.introDetail || '';
  const detailDescription = data?.detailDescription || '';

  const CustomParagraph = ({ children }) => {
    return <p className="ethics-compliance-governance-content__pledge-text">{children}</p>;
  }

  const CustomParagraph2 = ({ children }) => {
    return <p className="ethics-compliance-governance-content__text-paragraph">{children}</p>;
  }

  return (
    <section className="ethics-compliance-governance-content">
      <div className="ethics-compliance-governance-content__container">
        <div className="ethics-compliance-governance-content__wrapper">
          {/* Section Title */}
          {sectionTitle && (
            <h2 className="ethics-compliance-governance-content__section-title">
              {sectionTitle}
            </h2>
          )}

          {/* Intro Detail Section (P.L.E.D.G.E. Box) */}
          {introDetail && (
            <div className="ethics-compliance-governance-content__pledge-box" data-node-id="2849:57">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: CustomParagraph,
                }}
              >
                {introDetail}
              </ReactMarkdown>
            </div>
          )}

          {/* Detail Description Section (Text Content Box) */}
          {detailDescription && (
            <div className="ethics-compliance-governance-content__text-box" data-node-id="2849:9">
              <div className="ethics-compliance-governance-content__text-content" data-node-id="2849:10">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: CustomParagraph2,
                  }}
                >
                  {detailDescription}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

