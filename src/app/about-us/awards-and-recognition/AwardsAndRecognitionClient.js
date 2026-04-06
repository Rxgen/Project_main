'use client';

import { useState, useMemo, useEffect } from 'react';
import InnerBanner from '@/components/InnerBanner';
import ProfileCard from '@/components/global/ProfileCard';
import Pagination from '@/components/global/Pagination';
import YearSelector from './components/YearSelector';
import '@/scss/pages/awards-and-recognition.scss';

// Default image when no image has been added in CMS for an award
const DEFAULT_AWARDS_IMAGE = '/assets/awards.webp';

export default function AwardsAndRecognitionClient({ initialData }) {
  const [activeYear, setActiveYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Extract unique years from publishedAt dates
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    initialData.forEach((item) => {
      const dateToUse = item.publishedOn || item.publishedAt;
      if (dateToUse) {
        const year = new Date(dateToUse).getFullYear();
        if (!isNaN(year)) {
          yearsSet.add(year);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a); // Sort descending (newest first)
  }, [initialData]);

  // Set default active year to the newest year on mount
  useEffect(() => {
    if (!activeYear && availableYears.length > 0) {
      setActiveYear(availableYears[0]);
    }
  }, [availableYears, activeYear]);

  // Filter articles by active year
  const filteredArticles = useMemo(() => {
    if (!activeYear) return [];

    return initialData.filter((item) => {
      const dateToUse = item.publishedOn || item.publishedAt;
      if (dateToUse) {
        const year = new Date(dateToUse).getFullYear();
        return year === activeYear;
      }
      return false;
    });
  }, [initialData, activeYear]);

  // Pagination logic
  const totalItems = filteredArticles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeYear]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of content section when page changes
      const contentSection = document.querySelector('.awards-and-recognition-year-content');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Banner data
  const bannerData = {
    title: {
      line1: "Awards and",
      line2: "Recognitions"
    },
    subheading: {
      enabled: true,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/awards-and-recognition.png",
        alt: "Awards and Recognition"
      },
      bannerMobile: {
        url: "/assets/inner-banner/awards-and-recognition-mobile.png",
        alt: "Awards and Recognition"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  return (
    <div className="awards-and-recognition-page">
      <InnerBanner data={bannerData} />

      {/* Content sections */}
      <section className="awards-and-recognition-content">
        <div className="awards-and-recognition-content__container">
          <div className="awards-and-recognition-content__text" data-node-id="2849:235">
            <h2 className="awards-and-recognition-content__heading" data-node-id="2849:236">
              Setting the Bar Higher
            </h2>
            <div className="awards-and-recognition-content__paragraph" data-node-id="2849:237">
              <p>Our actions have earned us a number of accolades for various facets of our journey, including innovation, employee satisfaction, quality<br />standards and social upliftment efforts. Learn more about our award-winning journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Year Selector Section */}
      {availableYears.length > 0 && (
        <section className="awards-and-recognition-years-section">
          <div className="awards-and-recognition-years-section__container">
            <YearSelector
              years={availableYears}
              activeYear={activeYear}
              onYearChange={setActiveYear}
            />
          </div>
        </section>
      )}

      {/* Year Content Section */}
      {activeYear && (
        <section className="awards-and-recognition-year-content">
          <div className="awards-and-recognition-year-content__container">
            <div className="profile-cards-container">
              <div className="profile-card-grid">
                {currentPageItems.length > 0 ? (
                  currentPageItems.map((item) => (
                    <ProfileCard
                      key={item.id}
                      name=""
                      title={item.title}
                      image={item.image || DEFAULT_AWARDS_IMAGE}
                      imagePosition={item.imagePosition || "bottom"}
                      showArrow={false}
                    />
                  ))
                ) : (
                  <div className="profile-cards-no-results">
                    <p>No awards found for {activeYear}.</p>
                  </div>
                )}
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
          </div>
        </section>
      )}
    </div>
  );
}

