'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/BrandedEmergingMarketsIntro.scss';

export default function BrandedEmergingMarketsIntro({ data }) {
  const defaultData = {
    content: [
      "Lupin's purpose to catalyze treatments that transform hope into healing, finds strong expression in the work it does across emerging markets in Africa, Asia and Latin America.",
      {
        text: "As per a recent study, emerging pharma markets are growing at an immense pace due to rising healthcare needs, supportive policies, and an expanding middle-class population. However, widespread access to high- quality, effective medicines remain a challenge in these markets.",
        link: {
          text: "As per a recent study",
          url: "https://link.springer.com/article/10.1007/s11095-025-03856-w"
        }
      },
      "Lupin's strategy of expanding access, enhancing impact and fostering resilience with a foundation in excellence and patient-centric care has led these markets to contribute to 11% of Lupin's global sales, reflecting an on-growing stronghold Lupin has through localized offerings and public health partnerships."
    ]
  };

  const introData = data || defaultData;
  const content = introData?.content || introData?.paragraphs || introData?.text || defaultData.content;

  const CustomParagraph = ({ children }) => {
    return <p className="branded-emerging-markets-intro__paragraph">{children}</p>;
  };

  // Convert content to markdown format
  const convertToMarkdown = (item) => {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'object' && item.text) {
      // Convert link object to markdown link
      if (item.link && item.link.text && item.link.url) {
        const linkText = item.link.text;
        const linkUrl = item.link.url;
        // Replace the link text with markdown link syntax
        return item.text.replace(
          linkText,
          `[${linkText}](${linkUrl})`
        );
      }
      return item.text;
    }
    return '';
  };

  return (
    <section className="branded-emerging-markets-intro" data-node-id="3117:1558">
      <div className="branded-emerging-markets-intro__container">
        <div className="branded-emerging-markets-intro__content">
          {Array.isArray(content) ? (
            content.map((item, index) => {
              const markdownContent = convertToMarkdown(item);
              return (
                <ReactMarkdown
                  key={index}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: CustomParagraph,
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className="branded-emerging-markets-intro__link" />
                    ),
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              );
            })
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: CustomParagraph,
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" className="branded-emerging-markets-intro__link" />
                ),
              }}
            >
              {convertToMarkdown(content)}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </section>
  );
}

