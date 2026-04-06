'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { sanitizeText } from '@/lib/sanitize';
import {
  normalizeLegacyMediaUrl,
  normalizeLegacyWpContentInHtml,
} from '@/lib/strapi-utils';
import '@/scss/components/PressReleaseDetail.scss';

export default function PressReleaseDetail({ data }) {
  const pathname = usePathname();
  const isPressReleaseRoute = pathname?.includes('/media/press-releases');

  const pressRelease = data || {
    title: "",
    date: "",
    author: {
      name: "",
      image: ""
    },
    content: "",
    Name: "",
    Designation: ""
  };

  // Helper function to decode &amp; entities (handles potential double-encoding)
  const decodeAmpersand = (text) => {
    if (!text) return text;
    let decoded = text;
    // Keep decoding until no more &amp; entities remain
    while (decoded.includes('&amp;')) {
      decoded = decoded.replace(/&amp;/g, '&');
    }
    return decoded;
  };

  return (
    <section className="press-release-detail">
      <div className="press-release-detail__container">
        <div className="press-release-detail__content">
          {/* Title - Secure rendering to prevent XSS */}
          {pressRelease.title && (
            <h1 className="press-release-detail__title">
              {decodeAmpersand(sanitizeText(pressRelease.title))}
            </h1>
          )}

          {/* Header Section with Author - Hide for press-releases route */}
          {!isPressReleaseRoute && (
            <div className="press-release-detail__header">
              {pressRelease.author?.image && (
                <div className="press-release-detail__author-image">
                  <Image
                    src={normalizeLegacyMediaUrl(pressRelease.author.image)}
                    alt={pressRelease.author.name || "Author"}
                    width={314}
                    height={314}
                    className="press-release-detail__author-img"
                    quality={100}
                  />
                </div>
              )}
              <div className="press-release-detail__author-info">
                {pressRelease.date && (
                  <p className="press-release-detail__date">{pressRelease.date}</p>
                )}
                {(pressRelease.author?.name || pressRelease.Name) && (
                  <p className="press-release-detail__author-name">
                    {pressRelease.author?.name || pressRelease.Name}
                  </p>
                )}
                {(pressRelease.author?.designation || pressRelease.Designation) && (
                  <p className="press-release-detail__designation-name">
                    {pressRelease.author?.designation || pressRelease.Designation}
                  </p>
                )}
                <div className="press-release-detail__divider"></div>
              </div>
            </div>
          )}

          {/* Content from Strapi Rich Text Editor */}
          {pressRelease.content && (
            <div className="press-release-detail__body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {normalizeLegacyWpContentInHtml(pressRelease.content)}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <aside className="press-release-detail__sidebar">
          <nav className="press-release-detail__nav">
            <Link
              href="/media/press-releases"
              className={`press-release-detail__nav-link ${pressRelease.activeCategory === 'press-releases' ? 'press-release-detail__nav-link--active' : ''}`}
            >
              Press Releases
            </Link>
            <Link
              href="/media/perspectives"
              className={`press-release-detail__nav-link ${pressRelease.activeCategory === 'perspectives' ? 'press-release-detail__nav-link--active' : ''}`}
            >
              Perspectives
            </Link>
            <Link href="/media/media-coverage" className="press-release-detail__nav-link">
              Media Coverage
            </Link>
            <Link href="/media/media-kit" className="press-release-detail__nav-link">
              Media Kit
            </Link>
          </nav>
          {/* <div className="press-release-detail__sidebar-decoration"></div> */}
        </aside>
      </div>
    </section>
  );
}

