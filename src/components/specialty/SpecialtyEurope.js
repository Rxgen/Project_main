import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../../scss/components/specialty/SpecialtyEurope.scss';

export default function SpecialtyEurope({ data }) {
  if (!data) {
    return null;
  }

  const contentData = data;

  return (
    <div className="specialty-europe" data-node-id="2957:1420">
      {/* Background Petals - Top Left (for even sections) */}
      <div className="specialty-europe__petals">
        <Image
          src="/assets/images/specialty/petalright.svg"
          alt="Decorative petals"
          width={1452}
          height={767}
          className="specialty-europe__petals-img"
          quality={100}
        />
      </div>

      {/* Top Section - Content and Image (reversed layout) */}
      <div className="specialty-europe__wrapper">
        {/* Left Side - Content */}
        <div className="specialty-europe__content">
          {/* Heading */}
          <h2 className="specialty-europe__heading" data-node-id="2957:1430">
            {contentData.heading}
          </h2>

          {/* Intro Paragraphs (1st, 2nd, 3rd, 4th) */}
          <div className="specialty-europe__intro" data-node-id="2957:1429">
            {contentData.paragraphs.slice(0, 4).map((paragraph, index) => (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="specialty-europe__paragraph">{children}</p>,
                }}
              >
                {paragraph}
              </ReactMarkdown>
            ))}
          </div>

          {/* Button after 4th paragraph */}
          {contentData.buttons[0] && (
            <Link
              href={contentData.buttons[0].href}
              className="specialty-europe__button specialty-europe__button--filled"
              data-node-id="2957:1443"
              target="_blank"
            >
              <span className="specialty-europe__button-text">
                {contentData.buttons[0].text}
              </span>
              <svg
                className="specialty-europe__button-arrow"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                data-node-id="2957:1447"
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

        {/* Right Side - Circular Image */}
        <div className="specialty-europe__image-wrapper">
          <div className="specialty-europe__image-circle">
            <Image
              src="/assets/images/specialty/side-view-nurse-helping-patient 1.png"
              alt="Nurse helping patient"
              fill
              className="specialty-europe__image"
              quality={100}
              sizes="587px"
            />
          </div>
        </div>
      </div>

      {/* Full Width Section - Paragraphs 5-7 */}
      <div className="specialty-europe__full-width">
        {/* Fifth, Sixth, Seventh Paragraphs */}
        <div className="specialty-europe__section" data-node-id="2957:1441">
          {contentData.paragraphs.slice(4, 7).map((paragraph, index) => (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ children }) => <p className="specialty-europe__paragraph">{children}</p>,
              }}
            >
              {paragraph}
            </ReactMarkdown>
          ))}
        </div>
      </div>
    </div>
  );
}

