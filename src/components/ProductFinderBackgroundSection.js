'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ProductFinderSearchForm from './ProductFinderSearchForm';
import ProductFinderLetterFilter from './ProductFinderLetterFilter';
import ProductFinderResults from './ProductFinderResults';
import '../scss/components/ProductFinderBackgroundSection.scss';

export default function ProductFinderBackgroundSection({ data }) {
  // Shared state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [geography, setGeography] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [category, setCategory] = useState('');
  const [oncology, setOncology] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    geographyOptions: [],
    categoryOptions: [],
    oncologyOptions: []
  });
  const [loadingFilters, setLoadingFilters] = useState(true);
  const resultsSectionRef = useRef(null);

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/products/filters');
        const data = await response.json();

        if (data) {
          setFilterOptions({
            geographyOptions: data.geography || [],
            categoryOptions: data.category || [],
            oncologyOptions: data.oncology || []
          });
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Default data structure
  const sectionData = data || {
    searchForm: {
      heading: {
        line1: "Search for Lupin Generics",
        line2: "or products from other categories here:"
      },
      searchPlaceholder: "Search by Active Ingredient or Brand Name",
      geographyOptions: filterOptions.geographyOptions,
      categoryOptions: filterOptions.categoryOptions,
      oncologyOptions: filterOptions.oncologyOptions
    },
    letterFilter: {}
  };

  // Scroll to results section
  const scrollToResults = () => {
    if (resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handlers to update state
  const handleSearchSubmit = (searchData) => {
    // Always update state, even if all fields are empty (for clear functionality)
    // This allows showing all products when form is cleared
    setSearchTerm(searchData.searchTerm || '');
    setGeography(searchData.geography || '');
    setSelectedCountry(searchData.country?.trim() ? searchData.country : '');
    setCategory(searchData.category || '');
    setOncology(searchData.oncology || '');

    // Scroll to results after search
    setTimeout(() => {
      scrollToResults();
    }, 100);
  };

  const handleLetterSelect = (letter) => {
    // Only scroll if a letter is actually selected (not when deselecting)
    if (letter && letter.trim() !== '') {
      setSelectedLetter(letter);
      // Scroll to results after letter selection
      setTimeout(() => {
        scrollToResults();
      }, 100);
    } else {
      setSelectedLetter('');
      // Don't scroll when deselecting a letter
    }
  };

  return (
    <section className="product-finder-background-section">
      <div className="product-finder-background-section__container">
        {/* Background Image */}
        <div className="product-finder-background-section__bg-image">
          <Image
            src="/assets/images/product-finder/bg.png"
            alt="Background"
            fill
            className="product-finder-background-section__bg-img"
            quality={100}
          />
        </div>

        {/* Content Wrapper */}
        <div className="product-finder-background-section__content-wrapper">
          {/* Search Form - Left Side */}
          <div className="product-finder-background-section__left">
            <ProductFinderSearchForm
              data={{
                heading: sectionData.searchForm?.heading || {
                  line1: "Search for Lupin Generics",
                  line2: "or products from other categories here:"
                }, 
                searchPlaceholder: sectionData.searchForm?.searchPlaceholder || "Search by Active Ingredient or Brand Name",
                geographyOptions: filterOptions.geographyOptions,
                categoryOptions: filterOptions.categoryOptions,
                oncologyOptions: filterOptions.oncologyOptions
              }}
              onSearch={handleSearchSubmit}
              searchTerm={searchTerm}
              geography={geography}
              selectedCountry={selectedCountry}
              category={category}
              oncology={oncology}
            />
          </div>

          {/* Letter Filter - Right Side */}
          <div className="product-finder-background-section__right">
            <ProductFinderLetterFilter
              data={sectionData.letterFilter}
              onLetterSelect={handleLetterSelect}
              selectedLetter={selectedLetter}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div ref={resultsSectionRef} className="product-finder-background-section__results">
        <ProductFinderResults
          searchTerm={searchTerm}
          selectedLetter={selectedLetter}
          geography={geography}
          category={category}
          oncology={oncology}
        />
      </div>
    </section>
  );
}

