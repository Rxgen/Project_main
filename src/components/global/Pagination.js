'use client';

import '@/scss/components/global/Pagination.scss';

/**
 * Pagination - Reusable pagination component with smart ellipsis
 * 
 * @param {number} currentPage - Current active page (required)
 * @param {number} totalPages - Total number of pages (required)
 * @param {function} onPageChange - Callback function when page changes (required)
 * @param {function} onNext - Callback function for next button (optional)
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <Pagination 
 *   currentPage={1}
 *   totalPages={5}
 *   onPageChange={(page) => console.log(page)}
 *   onNext={() => console.log('next')}
 * />
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  onNext,
  className = ''
}) {
  // Generate smart page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 4);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageClick = (page) => {
    if (onPageChange && page !== currentPage && typeof page === 'number') {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (onPageChange && !isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (onPageChange && !isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`pagination ${className}`}>
      {/* Previous Button */}
      {!isFirstPage && (
        <a
          type="button"
          className="pagination__prev"
          onClick={handlePrevious}
          aria-label="Go to previous page"
          rel="prev"
        >
          Previous
        </a>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="pagination__ellipsis"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        return (
          <a
            key={page}
            type="button"
            className={`pagination__number ${page === currentPage ? 'pagination__number--active' : ''
              }`}
            onClick={() => handlePageClick(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            rel="next"
          >
            {page}
          </a>
        );
      })}

      {/* Next Button */}
      {!isLastPage && (
        <a
          type="button"
          className="pagination__next"
          onClick={handleNext}
          aria-label="Go to next page"
        >
          Next
        </a>
      )}
    </div>
  );
}

