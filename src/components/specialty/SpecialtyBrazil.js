import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../../scss/components/specialty/SpecialtyBrazil.scss';

export default function SpecialtyBrazil({ data }) {
  if (!data) {
    return null;
  }

  const contentData = data;

  return (
    <div className="specialty-brazil" data-node-id="2957:1450">
      {/* Background Petals - Top Left (for even sections) */}
      <div className="specialty-brazil__petals">
        <Image
          src="/assets/images/specialty/petalright.svg"
          alt="Decorative petals"
          width={1452}
          height={767}
          className="specialty-brazil__petals-img"
          quality={100}
        />
      </div>

      {/* Top Section - Content and Image (reversed layout) */}
      <div className="specialty-brazil__wrapper">
        {/* Left Side - Content */}
        <div className="specialty-brazil__content">
          {/* Heading */}
          <h2 className="specialty-brazil__heading" data-node-id="2957:1461">
            {contentData.heading}
          </h2>

          {/* First Paragraph from moreInfo[0] */}
          {contentData.paragraphs[0] && (
            <div className="specialty-brazil__intro" data-node-id="2957:1460">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="specialty-brazil__paragraph">{children}</p>,
                }}
              >
                {contentData.paragraphs[0]}
              </ReactMarkdown>
              
              {/* First CTA from moreInfo[0] */}
              {contentData.buttons[1] && (
                <Link
                  href={contentData.buttons[1].href}
                  className="specialty-brazil__button specialty-brazil__button--outline"
                  data-node-id="2957:1465"
                  target="_blank"
                >
                  <span className="specialty-brazil__button-text">
                    {contentData.buttons[1].text}
                  </span>
                  <svg
                    className="specialty-brazil__button-arrow"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-node-id="2957:1469"
                  >
                    <path
                      d="M1 14L14 1M14 1H1M14 1V14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>
          )}

          {/* Second Paragraph from moreInfo[1] */}
          {contentData.paragraphs[1] && (
            <div className="specialty-brazil__section" data-node-id="2957:1463">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="specialty-brazil__paragraph">{children}</p>,
                }}
              >
                {contentData.paragraphs[1]}
              </ReactMarkdown>
              
              {/* Second CTA from moreInfo[1] */}
              {contentData.buttons[2] && (
                <Link
                  href={contentData.buttons[2].href}
                  className="specialty-brazil__button specialty-brazil__button--outline"
                  data-node-id="2957:1465"
                  target="_blank"
                >
                  <span className="specialty-brazil__button-text">
                    {contentData.buttons[2].text}
                  </span>
                  <svg
                    className="specialty-brazil__button-arrow"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-node-id="2957:1469"
                  >
                    <path
                      d="M1 14L14 1M14 1H1M14 1V14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Circular Image */}
        <div className="specialty-brazil__image-wrapper">
          <div className="specialty-brazil__image-circle">
            <Image
              src="/assets/images/specialty/professional-medical-office-with-diagnostic-tools-computer-screen 1.png"
              alt="Professional medical office with diagnostic tools"
              fill
              className="specialty-brazil__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}







