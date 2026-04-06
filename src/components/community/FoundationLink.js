'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '@/scss/components/community/FoundationLink.scss';

export default function FoundationLink({ detailDescription = null }) {
  // Custom link component for ReactMarkdown to handle external links
  const CustomLink = ({ href, children, ...props }) => {
    // Check if it's an external link
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
    
    if (isExternal) {
      return (
        <a
          href={href}
          className="foundation-link__link"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }
    
    // Internal links use Next.js Link
    return (
      <a href={href} className="foundation-link__link" {...props}>
        {children}
      </a>
    );
  };

  if (!detailDescription) {
    return null;
  }

  // Preprocess markdown: replace double newlines with <br /> tags to preserve line breaks
  // Replace single newlines with spaces to keep inline content together
  const processedContent = detailDescription.replace(/\n\n+/g, '<br />').replace(/\n/g, ' ').trim();

  return (
    <section className="foundation-link">
      <div className="foundation-link__container">
        <p className="foundation-link__text">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Override paragraph to render inline (no extra p tag)
              p: ({ children }) => <>{children}</>,
              // Override root to render inline
              root: ({ children }) => <>{children}</>,
              a: CustomLink,
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </p>
      </div>
    </section>
  );
}

