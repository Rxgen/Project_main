'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '../scss/components/ProductFinderSearchForm.scss';

/** Empty value shows the "Locations" placeholder; real selection uses country names. */
const LOCATION_PLACEHOLDER = '';

const COUNTRY_OPTIONS = [
  'India',
  'USA',
  'UK',
  'South Africa',
  'Australia',
  'Philippines',
  'Germany',
  'Mexico',
  'Brazil',
  'Canada',
  'Switzerland',
];

export default function ProductFinderSearchForm({
  data,
  onSearch,
  searchTerm: externalSearchTerm = '',
  geography: externalGeography = '',
  selectedCountry: externalSelectedCountry = '',
  category: externalCategory = '',
  oncology: externalOncology = '',
}) { 
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  const [geography, setGeography] = useState(() =>
    COUNTRY_OPTIONS.includes(externalGeography) ? '' : externalGeography
  );
  const [selectedLocation, setSelectedLocation] = useState(() =>
    externalSelectedCountry?.trim() ? externalSelectedCountry : LOCATION_PLACEHOLDER
  );
  const [category, setCategory] = useState(externalCategory);
  const [oncology, setOncology] = useState(externalOncology);

  useEffect(() => {
    setGeography(COUNTRY_OPTIONS.includes(externalGeography) ? '' : externalGeography);
  }, [externalGeography]);

  useEffect(() => {
    setSelectedLocation(
      externalSelectedCountry?.trim() ? externalSelectedCountry : LOCATION_PLACEHOLDER
    );
  }, [externalSelectedCountry]);

  // Default data structure with proper fallbacks
  const defaultFormData = {
    heading: {
      line1: "Search for Lupin Generics",
      line2: "or products from other categories here:"
    },
    searchPlaceholder: "Search by Active Ingredient or Brand Name",
    geographyOptions: [],
    categoryOptions: [],
    oncologyOptions: []
  };

  // Merge provided data with defaults, ensuring heading is always present
  const formData = {
    ...defaultFormData,
    ...data,
    heading: {
      ...defaultFormData.heading,
      ...(data?.heading || {})
    },
    geographyOptions: data?.geographyOptions || defaultFormData.geographyOptions,
    categoryOptions: data?.categoryOptions || defaultFormData.categoryOptions,
    oncologyOptions: data?.oncologyOptions || defaultFormData.oncologyOptions
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form - at least one field must have a value
    const hasSearchTerm = searchTerm && searchTerm.trim() !== '';
    const hasGeography = geography && geography.trim() !== '';
    const hasCategory = category && category.trim() !== '';
    const hasOncology = oncology && oncology.trim() !== '';

    if (!hasSearchTerm && !hasGeography && !hasCategory && !hasOncology) {
      // Form is empty, don't submit
      return;
    }

    if (onSearch) {
      onSearch({ searchTerm, geography, category, oncology, country: selectedLocation });
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setGeography('');
    setSelectedLocation(LOCATION_PLACEHOLDER);
    setCategory('');
    setOncology('');
    if (onSearch) {
      onSearch({
        searchTerm: '',
        geography: '',
        category: '',
        oncology: '',
        country: LOCATION_PLACEHOLDER,
      });
    }
  };

const countryLinks = {
  USA: "https://www.lupin.com/US/product",
  UK: "https://www.lupinhealthcare.co.uk/public-patient-information/",
  "South Africa": "https://www.mydynamics.co.za/patient-information-leaflets/",
  Australia: 'https://generichealth.com.au/product-listing/',
  Philippines: "https://multicare.com.ph/products/",
  Germany: "https://www.hormosan.com/produkte.php",
  Mexico: "https://laboratoriosgrin.com/nuestros-productos/",
  Brazil: "https://medquimica.ind.br/en/nossos-produtos/",
  Canada: "https://www.lupinpharma.ca/our-products#our-products-branded-medicines",
  Switzerland: "https://lupin-neurosciences.com/healthcare-professionals/portfolio/",
};

  return (
    <div className="product-finder-search-form" data-node-id="2953:3818">
      {/* Heading */}
      <div className="product-finder-search-form__heading" data-node-id="2953:3819">
        <p className="product-finder-search-form__heading-line">
          {formData.heading.line1}
        </p>
        <p className="product-finder-search-form__heading-line">
          {formData.heading.line2}
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="product-finder-search-form__form">


        <div className="product-finder-search-form__dropdowns-row">
          {/* Oncology Dropdown */}
          <div className="product-finder-search-form__select-wrapper" data-node-id="2953:3840">
            <select
              value={selectedLocation}
              onChange={(e) => {
                const selected = e.target.value;
                const url = countryLinks[selected]?.trim();

                if (selected && selected !== 'India' && url) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                  setSelectedLocation(LOCATION_PLACEHOLDER);
                } else {
                  setSelectedLocation(selected);
                }
              }}
              className="product-finder-search-form__select"
            >
              <option value={LOCATION_PLACEHOLDER} hidden disabled>
                Locations
              </option>
              {COUNTRY_OPTIONS.map((country, i) => (
                <option key={i} value={country}>
                  {country}
                </option>
              ))}
            </select>
            
            <div className="product-finder-search-form__select-arrow" data-node-id="2953:3843">
              <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L9 9L17 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="product-finder-search-form__after-location">
          {/* Search Input */}
          <div className="product-finder-search-form__input-wrapper" data-node-id="2953:3820">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={formData.searchPlaceholder}
              className="product-finder-search-form__input"
              data-node-id="2953:3821"
            />
          </div>

          <div className="product-finder-search-form__dropdowns-row">
          {/* Oncology Dropdown */}
          <div className="product-finder-search-form__select-wrapper" data-node-id="2953:3840">
              <select
                value={oncology}
                onChange={(e) => setOncology(e.target.value)}
                className="product-finder-search-form__select"
                data-node-id="2953:3841"
              >
                <option value="">Therapy</option>
                {formData.oncologyOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="product-finder-search-form__select-arrow" data-node-id="2953:3825">
                <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L9 9L17 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="product-finder-search-form__select-wrapper" data-node-id="2953:3826">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="product-finder-search-form__select"
                data-node-id="2953:3827"
              >
                <option value="">Category</option>
                {formData.categoryOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="product-finder-search-form__select-arrow" data-node-id="2953:3829">
                <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L9 9L17 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdowns Row 2 */}
        

          {/* Buttons */}
          <div className="product-finder-search-form__buttons">
            {/* Search Button */}
            <button
              type="submit"
              className="product-finder-search-form__button product-finder-search-form__button--search"
              data-node-id="2953:3830"
            >
              <span className="product-finder-search-form__button-text" data-node-id="2953:3833">
                Search
              </span>
              <div className="product-finder-search-form__button-arrow" data-node-id="2953:3834">
                <Image
                  src="/assets/images/product-finder/arrow.svg"
                  alt="Arrow icon"
                  width={18}
                  height={18}
                />
              </div>
            </button>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="product-finder-search-form__button product-finder-search-form__button--clear"
              data-node-id="2953:3837"
            >
              <span className="product-finder-search-form__button-text" data-node-id="2953:3839">
                Clear
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

