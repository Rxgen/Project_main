'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@/scss/components/OurStoryVerticalSlider.scss';

export default function OurStoryVerticalSlider() {
  const [activeYear, setActiveYear] = useState(2023);
  const scrollContainerRef = useRef(null);
  const activeYearRef = useRef(null);

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

  // Function to center the active year
  const centerActiveYear = () => {
    if (activeYearRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeYearRef.current;
      
      const containerHeight = container.clientHeight;
      const elementOffsetTop = activeElement.offsetTop;
      const elementHeight = activeElement.offsetHeight;
      
      const scrollPosition = elementOffsetTop + (elementHeight / 2) - (containerHeight / 2);
      
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Center active year when it changes
  useEffect(() => {
    centerActiveYear();
  }, [activeYear]);

  // Center on initial mount
  useEffect(() => {
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

  const handleYearClick = (year) => {
    setActiveYear(year);
  };

  return (
    <div 
      className="our-story-vertical-slider" 
      ref={scrollContainerRef}
      data-node-id="2936:330"
    >
      {years.map((year, index) => {
        const yearDisplay = year.toString().slice(-2); // Last 2 digits
        const isActive = activeYear === year;
        
        // Determine opacity based on position relative to active year
        let opacity = 0.1;
        const activeIndex = years.indexOf(activeYear);
        
        if (isActive) {
          opacity = 1;
        } else if (index === activeIndex - 1 || index === activeIndex + 1) {
          opacity = 0.3;
        }
        
        return (
          <button
            key={year}
            ref={isActive ? activeYearRef : null}
            className={`our-story-vertical-slider__year ${isActive ? 'our-story-vertical-slider__year--active' : ''}`}
            onClick={() => handleYearClick(year)}
            style={{ opacity }}
            data-node-id={`2936:${331 + index}`}
          >
            {yearDisplay}
          </button>
        );
      })}
    </div>
  );
}

