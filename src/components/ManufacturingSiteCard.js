'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ManufacturingSiteCard.scss';

export default function ManufacturingSiteCard({ data }) {
  // Return null if no data
  if (!data) {
    return null;
  }

  // Extract data from props - no fallbacks
  const title = data?.title || data?.name || data?.siteName || '';
  const description = data?.description || data?.text || data?.info || '';
  const addressText = data?.address?.text || data?.address || data?.addressText || '';

  // Return null if no title
  if (!title) {
    return null;
  }

  return (
    <div className="manufacturing-site-card" data-node-id="3030:5834">
      <div className="manufacturing-site-card__background" data-node-id="3030:5835"></div>
      <div className="manufacturing-site-card__content">
        {title && (
          <h3 className="manufacturing-site-card__title" data-node-id="3030:5840">
            {title}
          </h3>
        )}
        {description && (
          <p className="manufacturing-site-card__description" data-node-id="3030:5837">
            {description}
          </p>
        )}
        {addressText && (
          <div className="manufacturing-site-card__address">
            <div className="manufacturing-site-card__address-text" data-node-id="3030:5838">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {addressText}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

