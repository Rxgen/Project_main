'use client';

import { useState, useEffect, useRef, startTransition } from 'react';
import Pagination from '@/components/global/Pagination';
import '../scss/components/ProductFinderResults.scss';

export default function ProductFinderResults({
  searchTerm = '',
  selectedLetter = '',
  geography = '',
  category = '',
  oncology = ''
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const resultsRef = useRef(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: itemsPerPage.toString(),
        });

        if (searchTerm) {
          params.append('searchTerm', searchTerm);
        }
    if (selectedLetter) {
          params.append('selectedLetter', selectedLetter);
    }
        if (geography) {
          params.append('geography', geography);
        }
        if (category) {
          params.append('category', category);
        }
        if (oncology) {
          params.append('oncology', oncology);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (data.data) {
          setProducts(data.data);
          const pagination = data.meta?.pagination || {};
          setTotalPages(pagination.pageCount || 0);
          setTotal(pagination.total || 0);
        } else {
          setProducts([]);
          setTotalPages(0);
          setTotal(0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalPages(0);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedLetter, geography, category, oncology]);

  // Reset to page 1 when filters change
  const prevFiltersRef = useRef({ searchTerm, selectedLetter, geography, category, oncology });
  useEffect(() => {
    const prevFilters = prevFiltersRef.current;
    const filtersChanged =
      prevFilters.searchTerm !== searchTerm ||
      prevFilters.selectedLetter !== selectedLetter ||
      prevFilters.geography !== geography ||
      prevFilters.category !== category ||
      prevFilters.oncology !== oncology;

    if (filtersChanged) {
      prevFiltersRef.current = { searchTerm, selectedLetter, geography, category, oncology };
      startTransition(() => {
        setCurrentPage(1);
      });
    }
  }, [searchTerm, selectedLetter, geography, category, oncology]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results section
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={resultsRef} className="product-finder-results" data-node-id="2953:3897">
      {/* Mobile Heading */}
      <h2 className="product-finder-results__mobile-heading">Search Results</h2>

      {/* Table Header */}
      <div className="product-finder-results__header">
        <div className="product-finder-results__header-cell product-finder-results__header-cell--green" data-node-id="2953:3899">
          <span className="product-finder-results__header-text" data-node-id="2953:3900">Brand Name</span>
        </div>
        <div className="product-finder-results__header-cell product-finder-results__header-cell--light-green" data-node-id="2953:3905">
          <span className="product-finder-results__header-text" data-node-id="2953:3906">Active Ingredient</span>
        </div>
        <div className="product-finder-results__header-cell product-finder-results__header-cell--green" data-node-id="2953:3902">
          <span className="product-finder-results__header-text" data-node-id="2953:3903">Therapy Area</span>
        </div>
        <div className="product-finder-results__header-cell product-finder-results__header-cell--light-green" data-node-id="2953:3908">
          <span className="product-finder-results__header-text" data-node-id="2953:3909">Form</span>
        </div>
      </div>

      {/* Table Body */}
      <div className="product-finder-results__body">
        {loading ? (
          <div className="product-finder-results__loading">
            <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id} className="product-finder-results__row" data-node-id={`2953:${3910 + index * 9}`}>
              {/* Desktop Table Cells */}
              <div className="product-finder-results__cell product-finder-results__cell--brand" data-node-id={`2953:${3912 + index * 9}`}>
                {product.brandName || '-'}
              </div>
              <div className="product-finder-results__cell product-finder-results__cell--ingredient" data-node-id={`2953:${3913 + index * 9}`}>
                {product.activeIngredient || product.name || '-'}
              </div>
              <div className="product-finder-results__cell product-finder-results__cell--therapy" data-node-id={`2953:${3914 + index * 9}`}>
                {product.therapyArea || '-'}
              </div>
              <div className="product-finder-results__cell product-finder-results__cell--form" data-node-id={`2953:${3915 + index * 9}`}>
                {product.form || '-'}
              </div>

              {/* Mobile Card Format */}
              <div className="product-finder-results__mobile-card">
                <div className="product-finder-results__mobile-item">
                  <span className="product-finder-results__mobile-label">Brand Name :</span>
                  <span className="product-finder-results__mobile-value">{product.brandName || '-'}</span>
                </div>
                <div className="product-finder-results__mobile-item">
                  <span className="product-finder-results__mobile-label">Active Ingredient :</span>
                  <span className="product-finder-results__mobile-value">{product.activeIngredient || product.name || '-'}</span>
                </div>
                <div className="product-finder-results__mobile-item">
                  <span className="product-finder-results__mobile-label">Therapy Area :</span>
                  <span className="product-finder-results__mobile-value">{product.therapyArea || '-'}</span>
                </div>
                <div className="product-finder-results__mobile-item">
                  <span className="product-finder-results__mobile-label">Form :</span>
                  <span className="product-finder-results__mobile-value">{product.form || '-'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="product-finder-results__empty">
            <p>No products found. Please try different search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="product-finder-results__pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

