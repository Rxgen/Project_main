'use client';

import React, { useRef, useEffect } from 'react';
import '@/scss/components/OurStoryVerticalYearSlider.scss';

export default function OurStoryVerticalYearSlider({ years = [], activeYear, onYearClick }) {
  const scrollContainerRef = useRef(null);
  const activeYearRef = useRef(null);

  // Function to center the active year
  const centerActiveYear = () => {
    if (activeYearRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeYearRef.current;
      
      // Get container and element dimensions
      const containerHeight = container.clientHeight;
      const elementOffsetTop = activeElement.offsetTop;
      const elementHeight = activeElement.offsetHeight;
      
      // Calculate scroll position to center the element
      // elementOffsetTop is relative to the container's content, including padding
      // We want to scroll so the element is in the center of the visible area
      const scrollPosition = elementOffsetTop + (elementHeight / 2) - (containerHeight / 2);
      
      // Allow scrolling even for first/last items (no Math.max constraint)
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to active year when it changes
  useEffect(() => {
    centerActiveYear();
  }, [activeYear]);

  // Center on initial mount
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      centerActiveYear();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Center on window resize
  useEffect(() => {
    const handleResize = () => {
      centerActiveYear();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeYear]);

  return (
    <div className="our-story-vertical-year-slider" data-node-id="2936:182">
      {/* Fixed "20" prefix in the middle */}
      <div className="our-story-vertical-year-slider__prefix">
        20
      </div>
      
      <div 
        className="our-story-vertical-year-slider__container"
        ref={scrollContainerRef}
      >
        {years.map((year, index) => {
          const yearDisplay = year.toString().slice(-2); // Last 2 digits
          const isActive = activeYear === year;
          
          return (
            <button
              key={`${year}-${index}`}
              ref={isActive ? activeYearRef : null}
              className={`our-story-vertical-year-slider__year ${isActive ? 'our-story-vertical-year-slider__year--active' : ''}`}
              onClick={() => onYearClick && onYearClick(year)}
              data-node-id={`2936:${331 + index}`}
            >
              {yearDisplay}
            </button>
          );
        })}
      </div>
    </div>
  );
}

