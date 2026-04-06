'use client';

import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/GlobalGenericsRegionalPresence.scss';

export default function GlobalGenericsRegionalPresence({ data }) {
  if (!data) {
    return null;
  }

  const heading = data?.heading || data?.title || '';
  const backgroundDesktop = data?.background?.desktop || data?.backgroundImage?.desktop || '';
  const backgroundMobile = data?.background?.mobile || data?.backgroundImage?.mobile || backgroundDesktop;
  const regions = data?.regions || data?.cards || data?.items || [];

  // Don't render if essential data is missing
  if (!backgroundDesktop || !regions || regions.length === 0) {
    return null;
  }

  // Custom paragraph component for ReactMarkdown
  const CustomParagraph = ({ children }) => {
    return <p className="global-generics-regional__description">{children}</p>;
  };

  return (
    <section className="global-generics-regional" data-node-id="3115:643">
      <div className="global-generics-regional__background">
        <Image
          src={backgroundDesktop}
          alt="Regional presence background"
          fill
          className="global-generics-regional__bg-image global-generics-regional__bg-image--desktop"
          quality={100}
        />
        {backgroundMobile && (
          <Image
            src={backgroundMobile}
            alt="Regional presence background"
            fill
            className="global-generics-regional__bg-image global-generics-regional__bg-image--mobile"
            quality={100}
          />
        )}
      </div>
      <div className="global-generics-regional__container">
        {heading && (
          <h2 className="global-generics-regional__heading">
            {heading}
          </h2>
        )}
        <div className="global-generics-regional__cards">
          {regions.map((region, index) => {
            if (!region.position || !region.backgroundColor || !region.title) {
              return null;
            }
            
            const position = region.position;
            const backgroundColor = region.backgroundColor;
            const title = region.title;
            const link = region.link || region.Link || null;
            
            // Format link to ensure it has protocol
            const formattedLink = link && !link.startsWith('http') && !link.startsWith('/') 
              ? `https://${link}` 
              : link;

            return (
              <div 
                key={region.id || index} 
                className={`global-generics-regional__card global-generics-regional__card--${position}`}
                style={{ backgroundColor: backgroundColor }}
              >
                {title && (
                  <h3 className="global-generics-regional__card-title">
                    {formattedLink ? (
                      <Link href={formattedLink} target={formattedLink.startsWith('http') ? '_blank' : '_self'} rel={formattedLink.startsWith('http') ? 'noopener noreferrer' : ''}>
                        {title}
                      </Link>
                    ) : (
                      title
                    )}
                  </h3>
                )}
                {region.highlights && region.highlights.length > 0 && (
                  <ul className="global-generics-regional__highlights">
                    {region.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="global-generics-regional__highlight">
                        <div className="global-generics-regional__highlight-icon">
                          <Image
                            src="/assets/images/global-generic/extrasmall.svg"
                            alt=""
                            width={18}
                            height={17}
                            quality={100}
                          />
                        </div>
                        <span className="global-generics-regional__highlight-text">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {region.description && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: CustomParagraph,
                    }}
                  >
                    {region.description}
                  </ReactMarkdown>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

