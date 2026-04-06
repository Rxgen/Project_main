'use client';

import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/SakshamNiveshak.scss';

export default function SakshamNiveshak({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="saksham-niveshak">
        <div className="saksham-niveshak__container">
          <div className="saksham-niveshak__content">
            <div className="saksham-niveshak__placeholder">
              <p>Unable to load Saksham Niveshak information at this time. Please try again later.</p>
              {process.env.NODE_ENV === 'development' && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback content
  const fallbackContent = `No Saksham Niveshak information available at this time.`;

  // Use API data if available, otherwise use fallback
  const hasApiData = data?.description;
  const contentToRender = hasApiData ? data.description : fallbackContent;

  // Static decorative image (not from API)
  const decorativeImage = {
    url: "/assets/saksham-niveshak/5a520e5b63258cdda90b9f1f24d3b53d61fd8d2c.svg",
    alt: ""
  };

  return (
    <section className="saksham-niveshak" data-node-id="66:641">
      <div className="saksham-niveshak__container">
        <div className="saksham-niveshak__content">
          {/* Render Description using ReactMarkdown */}
          <div className="saksham-niveshak__description">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {contentToRender}
            </ReactMarkdown>
          </div>
        </div>

        {/* Decorative Image */}
        {decorativeImage && (
          <div className="saksham-niveshak__decorative">
            <Image
              src={decorativeImage.url}
              alt={decorativeImage.alt || ""}
              width={600}
              height={600}
              className="saksham-niveshak__decorative-img"
              quality={100}
            />
          </div>
        )}
      </div>
    </section>
  );
}

