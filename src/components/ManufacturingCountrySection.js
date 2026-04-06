'use client';

import ManufacturingSiteCard from './ManufacturingSiteCard';
import '../scss/components/ManufacturingCountrySection.scss';

export default function ManufacturingCountrySection({ data }) {
  // Return null if no data
  if (!data) {
    return null;
  }

  // Extract data from props - no fallbacks
  const heading = data?.heading || data?.country || data?.title || '';
  const sites = data?.sites || data?.manufacturingSites || data?.cards || data?.facilities || [];

  // Return null if no heading or no sites
  if (!heading || !sites || sites.length === 0) {
    return null;
  }

  // Check if should use full-width layout
  const useFullWidth = data?.fullWidth || false;
  
  // Check if should show background (default true, can be disabled)
  const showBackground = data?.showBackground !== false;

  // Determine grid class based on layout
  const gridClass = useFullWidth 
    ? 'manufacturing-country-section__grid--full-width'
    : sites.length === 1 
      ? 'manufacturing-country-section__grid--single'
      : '';

  // Add modifier class for India section
  const isIndia = heading === "INDIA";
  const sectionClasses = [
    'manufacturing-country-section',
    !showBackground ? 'manufacturing-country-section--no-background' : '',
    isIndia ? 'manufacturing-country-section--india' : ''
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses}>
      <div className="manufacturing-country-section__container">
        <h2 className="manufacturing-country-section__heading">
          {heading}
        </h2>
        <div className={`manufacturing-country-section__grid ${gridClass}`}>
          {sites.map((site, index) => (
            <ManufacturingSiteCard key={site.id || index} data={site} />
          ))}
        </div>
      </div>
    </section>
  );
}
