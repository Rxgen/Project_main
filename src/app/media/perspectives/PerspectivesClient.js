'use client';

import { useState } from 'react';
import InnerBanner from '@/components/InnerBanner';
import MediaNavigation from '@/components/MediaNavigation';
import ProfileCard from '@/components/global/ProfileCard';
import MediaContact from '@/components/global/MediaContact';
import Pagination from '@/components/global/Pagination';
import '@/scss/pages/media.scss';

export default function PerspectivesClient({ initialData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Banner data for Perspectives page
  const bannerData = {
    title: {
      line1: "Perspectives",
    },
    images: {
      banner: {
        url: "/assets/inner-banner/perspectives.png",
        alt: "Product Finder"
      },
      bannerMobile: {
        url: "/assets/inner-banner/perspectives-mobile.png",
        alt: "Product Finder"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Use initial data from server
  const allPerspectives = initialData || [];

  // Pagination logic
  const totalItems = allPerspectives.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = allPerspectives.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of cards section when page changes
      const cardsSection = document.querySelector('.sectionProfileCards');
      if (cardsSection) {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <MediaNavigation hideSearch={true} />

      {/* Profile Cards Section */}
      <section className="sectionProfileCards">
        <div className="profile-cards-container">
          <div className="profile-card-grid">
            {currentPageItems.length > 0 ? (
              currentPageItems.map((item) => (
                <ProfileCard
                  key={item.id}
                  name={item.name}
                  title={item.title}
                  link={item.link}
                  image={item.image}
                  imagePosition={item.imagePosition}
                  showArrow={item.showArrow}
                />
              ))
            ) : (
              <div className="profile-cards-no-results">
                <p>No perspectives found.</p>
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

