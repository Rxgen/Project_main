'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/TransferPhysicalShares.scss';

export default function TransferPhysicalShares({ data, error = null }) {
  const description = data?.description || '';
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('TransferPhysicalShares component - Received data:', {
      hasData: !!data,
      hasDescription: !!description,
      descriptionLength: description?.length || 0,
      descriptionPreview: description?.substring(0, 100) || 'N/A'
    });
  }

  return (
    <section className="transfer-physical-shares">
      {/* Background Petals */}
      <div className="transfer-physical-shares__bg-petals">
        <Image
          src="/assets/bg-petals.svg"
          alt=""
          width={1099}
          height={1210}
          className="transfer-physical-shares__bg-petals-img"
          quality={100}
        />
      </div>
      
      <div className="transfer-physical-shares__container">
        <div className="transfer-physical-shares__content">
          {description && (
            <div className="transfer-physical-shares__description">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
      a: ({ node, ...props }) => (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
        />
      ),
    }}
              >
                {description}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

