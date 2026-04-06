import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../../scss/components/specialty/SpecialtyUnitedStates.scss';

export default function SpecialtyUnitedStates({ data }) {
  if (!data) {
    return null;
  }

  const contentData = data;

  return (
    <div className="specialty-united-states" data-node-id="2957:1375">
      {/* Background Petals - Top Right */}
      <div className="specialty-united-states__petals">
        <Image
          src="/assets/images/specialty/petals.svg"
          alt="Decorative petals"
          width={1452}
          height={767}
          className="specialty-united-states__petals-img"
          quality={100}
        />
      </div>

      {/* Top Section - Image and First Content */}
      <div className="specialty-united-states__wrapper">
        {/* Left Side - Circular Image */}
        <div className="specialty-united-states__image-wrapper">
          <div className="specialty-united-states__image-circle">
            <Image
              src="/assets/images/specialty/serious-male-doctor-medical-mask-protective-suit-standing-operating-room-with-chest-x-ray-his-hands 1.png"
              alt="Doctor with chest X-ray"
              fill
              className="specialty-united-states__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>

        {/* Right Side - Content (Heading, Paragraphs 1-2, First Button) */}
        <div className="specialty-united-states__content">
          {/* Heading */}
          <h2 className="specialty-united-states__heading" data-node-id="2957:1401">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs (1st and 2nd) */}
          <div className="specialty-united-states__intro" data-node-id="2957:1400">
            {contentData.paragraphs.slice(0, 2).map((paragraph, index) => (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="specialty-united-states__paragraph">{children}</p>,
                }}
              >
                {paragraph}
              </ReactMarkdown>
            ))}
          </div>

          {/* First Button */}
          {contentData.buttons[0] && (
            <Link
              href={contentData.buttons[0].href}
              className="specialty-united-states__button specialty-united-states__button--outline"
              data-node-id="2957:1385"
              target="_blank"
            >
              <span className="specialty-united-states__button-text">
                {contentData.buttons[0].text}
              </span>
              <svg
                className="specialty-united-states__button-arrow"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                data-node-id="2957:1389"
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
      </div>

      {/* Full Width Section - Paragraphs 3-4 with Buttons */}
      <div className="specialty-united-states__full-width">
        {/* Third Paragraph (no link - third para link removed) */}
        {contentData.paragraphs[2] && (
          <div className="specialty-united-states__section" data-node-id="2957:1403">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ children }) => <p className="specialty-united-states__paragraph">{children}</p>,
              }}
            >
              {contentData.paragraphs[2]}
            </ReactMarkdown>
          </div>
        )}

        {/* Fourth Paragraph with its link (use last button so it appears below fourth para when third link was removed) */}
        {contentData.paragraphs[3] && (
          <div className="specialty-united-states__section" data-node-id="2957:1405">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ children }) => <p className="specialty-united-states__paragraph">{children}</p>,
              }}
            >
              {contentData.paragraphs[3]}
            </ReactMarkdown>
            {(() => {
              const fourthButton = contentData.buttons?.length >= 2
                ? contentData.buttons[contentData.buttons.length - 1]
                : contentData.buttons?.[2];
              return fourthButton ? (
                <Link
                  href={fourthButton.href}
                  className="specialty-united-states__button specialty-united-states__button--outline"
                  data-node-id="2957:1414"
                  target="_blank"
                >
                  <span className="specialty-united-states__button-text">
                    {fourthButton.text}
                  </span>
                  <svg
                    className="specialty-united-states__button-arrow"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-node-id="2957:1417"
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
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

