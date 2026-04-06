'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import InnerBanner from '@/components/InnerBanner';
import MediaNavigation from '@/components/MediaNavigation';
import MediaContact from '@/components/global/MediaContact';
import Pagination from '@/components/global/Pagination';
import '@/scss/pages/media.scss';
import '@/scss/components/WhatsNew.scss';

export default function PressReleasesClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Banner data for Press Releases page
  const bannerData = {
    title: {
      line1: "Press Releases",
    },
    images: {
      banner: {
        url: "/assets/inner-banner/press-releases.png",
        alt: "Product Finder"
      },
      bannerMobile: {
        url: "/assets/inner-banner/press-releases-mobile.png",
        alt: "Product Finder"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Use initial data from server
  const allPressReleases = initialData || [];

  // Extract unique years from publishedOn dates (fallback to publishedAt)
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    allPressReleases.forEach((item) => {
      const dateToUse = item.publishedOn || item.publishedAt;
      if (dateToUse) {
        const year = new Date(dateToUse).getFullYear();
        if (!isNaN(year)) {
          yearsSet.add(year.toString());
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
  }, [allPressReleases]);

  // Search and filter logic
  const filteredPressReleases = allPressReleases.filter((item) => {
    // Search filter - check title and slug
    const title = item.title || '';
    const slug = item.slug || '';
    const headlineText = Array.isArray(item.headline)
      ? item.headline.join(' ')
      : item.headline || '';

    const matchesSearch = searchQuery === '' ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      headlineText.toLowerCase().includes(searchQuery.toLowerCase());

    // Year filter - extract year from publishedOn (fallback to publishedAt) and match
    let matchesYear = true;
    if (selectedYear !== '') {
      const dateToUse = item.publishedOn || item.publishedAt;
      if (dateToUse) {
        const itemYear = new Date(dateToUse).getFullYear();
        matchesYear = itemYear.toString() === selectedYear;
      } else {
        matchesYear = false;
      }
    }

    return matchesSearch && matchesYear;
  });

  // Pagination logic
  const totalItems = filteredPressReleases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredPressReleases.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of cards section when page changes
      const cardsSection = document.querySelector('.sectionPressReleases');
      if (cardsSection) {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <MediaNavigation
        onSearch={(query) => setSearchQuery(query)}
        onYearChange={(year) => setSelectedYear(year)}
        years={availableYears}
      />

      {/* Press Releases Grid Section */}
      <section className="sectionPressReleases">
        <div className="whats-new__container">
          <div className="whats-new__cards-wrapper">
            <div className="whats-new__grid">
              {currentPageItems.length > 0 ? (
                currentPageItems.map((item, index) => (
                  <div key={item.id || index} className="whats-new__card">
                    {/* Date */}
                    <div className="whats-new__date">
                      {item.date}
                    </div>

                    {/* Category Button */}
                    {item.category && (() => {
                      // Split category text (e.g., "Press Releases" -> ["Press", "Releases"])
                      const categoryParts = item.category.split(' ');
                      const firstPart = categoryParts[0] || item.category;
                      const secondPart = categoryParts.slice(1).join(' ') || '';

                      return (
                        <Link href={item.href || "#"} className="whats-new__category-btn">
                          <div className="whats-new__category-line">
                            <span className="whats-new__category-text">{firstPart}</span>
                            <svg
                              className="whats-new__category-arrow"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 11L11 1M11 1H1M11 1V11"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          {secondPart && (
                            <span className="whats-new__category-text">{secondPart}</span>
                          )}
                        </Link>
                      );
                    })()}

                    {/* Headline */}
                    <Link href={item.href || "#"}>
                    
                    <h3 className="whats-new__headline">
                      {decodeAmpersand(
                        Array.isArray(item.headline) ? (
                          item.headline.join(' ')
                        ) : (
                          item.headline
                        )
                      )}
                    </h3>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="whats-new__no-results">
                  <p>No press releases found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>

      <MediaContact
        contact={{
          name: "Rajalakshmi Azariah",
          title: "Vice President and Global Head – Corporate Communications",
          email: "rajalakshmiazariah@lupin.com"
        }}
        mediaKitLink="/media/media-kit"
      />
    </div>
  );
}

