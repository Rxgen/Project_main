'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '../scss/components/MediaSearch.scss';

export default function MediaSearch({ onSearch, onYearChange, years = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  // Default years if not provided
  const defaultYears = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    defaultYears.push(i.toString());
  }

  const yearOptions = years.length > 0 ? years : defaultYears;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };

    if (isYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isYearDropdownOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Trigger search on input change for real-time filtering
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  return (
    <div className="media-search">
      {/* Search Input */}
      <div className="media-search__search-wrapper">
        <div className={`media-search__input-wrapper ${searchQuery ? 'media-search__input-wrapper--has-value' : ''}`}>
          <input
            type="text"
            className="media-search__input"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          {searchQuery && (
            <button
              type="button"
              className="media-search__clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="button"
          className="media-search__icon-button"
          onClick={handleSearchSubmit}
          aria-label="Search"
        >
          <div className="media-search__icon-wrapper">
            <Image
              src="/assets/icon-search-black.svg"
              alt="Search"
              width={28}
              height={28}
              className="media-search__icon"
            />
          </div>
        </button>
      </div>

      {/* Year Dropdown */}
      <div 
        ref={yearDropdownRef}
        className={`media-search__year-wrapper ${isYearDropdownOpen ? 'media-search__year-wrapper--open' : ''}`}
      >
        <button
          type="button"
          className="media-search__year-button"
          onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
          aria-expanded={isYearDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="media-search__year-text">
            {selectedYear || 'Select Year'}
          </span>
          <div className={`media-search__year-arrow ${isYearDropdownOpen ? 'media-search__year-arrow--open' : ''}`}>
            <svg
              width="15"
              height="8"
              viewBox="0 0 15 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7.5 7L14 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
        
        {isYearDropdownOpen && (
          <div className="media-search__year-dropdown">
            <ul
              className="media-search__year-list"
              role="listbox"
            >
              <li
                role="option"
                className="media-search__year-option"
                onClick={() => handleYearSelect('')}
              >
                All Years
              </li>
              {yearOptions.map((year) => (
                <li
                  key={year}
                  role="option"
                  className={`media-search__year-option ${
                    selectedYear === year ? 'media-search__year-option--active' : ''
                  }`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

