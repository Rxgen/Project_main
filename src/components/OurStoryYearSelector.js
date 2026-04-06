'use client';

import { useState, useRef, useEffect } from 'react';
import '@/scss/components/OurStoryYearSelector.scss';

export default function OurStoryYearSelector({ years = [], activeYear, onYearChange }) {
  const [internalActiveYear, setInternalActiveYear] = useState(activeYear || (years.length > 0 ? years[0] : null));
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  // Use provided activeYear or internal state
  const currentActiveYear = activeYear !== undefined ? activeYear : internalActiveYear;
  
  // Use provided years or fallback to default
  const yearList = years.length > 0 ? years : [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

  // Sync with external activeYear prop
  useEffect(() => {
    if (activeYear !== undefined && activeYear !== currentActiveYear) {
      setInternalActiveYear(activeYear);
    }
  }, [activeYear, currentActiveYear]);

  // Notify parent component when active year changes
  useEffect(() => {
    if (onYearChange && currentActiveYear) {
      onYearChange(currentActiveYear);
    }
  }, [currentActiveYear, onYearChange]);

  // Check scrollability on mount and when active year changes
  useEffect(() => {
    const checkScrollability = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const tolerance = 1;
        setCanScrollLeft(scrollLeft > tolerance);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - tolerance);
      }
    };

    checkScrollability();
    
    // Also check on scroll
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [currentActiveYear]);

  useEffect(() => {
    // Scroll to active year when it changes - ensure it's centered on mobile
    const centerActiveYear = () => {
      if (scrollContainerRef.current && currentActiveYear) {
        const container = scrollContainerRef.current;
        const yearButtons = Array.from(container.querySelectorAll('.our-story-year-selector__year'));
        const targetButton = yearButtons.find(btn => parseInt(btn.textContent.trim()) === currentActiveYear);
        
        if (targetButton) {
          const isMobile = window.innerWidth <= 768;
          
          if (isMobile) {
            // On mobile: center the active year
            // Wait for layout to settle
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const buttonRect = targetButton.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const containerWidth = containerRect.width;
                const buttonWidth = buttonRect.width;
                const buttonLeft = targetButton.offsetLeft;
                
                // Calculate scroll position to center the button
                const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
                
                container.scrollTo({
                  left: Math.max(0, targetScroll),
                  behavior: 'smooth'
                });
                
                // Double-check after scroll animation
                setTimeout(() => {
                  const newButtonLeft = targetButton.offsetLeft;
                  const newContainerWidth = container.clientWidth;
                  const newTargetScroll = newButtonLeft - (newContainerWidth / 2) + (buttonWidth / 2);
                  container.scrollTo({
                    left: Math.max(0, newTargetScroll),
                    behavior: 'smooth'
                  });
                }, 400);
              });
            });
          } else {
            // Desktop: normal centering
            const buttonLeft = targetButton.offsetLeft;
            const buttonWidth = targetButton.offsetWidth;
            const containerWidth = container.clientWidth;
            const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
            
            container.scrollTo({
              left: Math.max(0, targetScroll),
              behavior: 'smooth'
            });
          }
        }
      }
    };
    
    // Initial centering with multiple attempts for mobile
    setTimeout(centerActiveYear, 150);
    setTimeout(centerActiveYear, 400);
    
    // Also center on window resize
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setTimeout(centerActiveYear, 150);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentActiveYear]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    // Find current active year index
    const currentIndex = yearList.indexOf(currentActiveYear);
    
    // Calculate new active year based on direction - move by one year
    let newActiveYear = currentActiveYear;
    if (direction === 'right' && currentIndex < yearList.length - 1) {
      // Right arrow = move to next year (older year, e.g., 2023 → 2022)
      newActiveYear = yearList[currentIndex + 1];
    } else if (direction === 'left' && currentIndex > 0) {
      // Left arrow = move to previous year (newer year, e.g., 2022 → 2023)
      newActiveYear = yearList[currentIndex - 1];
    }
    
    // Don't proceed if year hasn't changed or if we're at the boundary
    if (newActiveYear === currentActiveYear) return;
    
    // Update active year
    if (activeYear === undefined) {
      setInternalActiveYear(newActiveYear);
    }
    if (onYearChange) {
      onYearChange(newActiveYear);
    }
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      
      // Get all year buttons
      const yearButtons = Array.from(scrollContainerRef.current.querySelectorAll('.our-story-year-selector__year'));
      if (yearButtons.length === 0) return;
      
      // Find the button for the new active year and scroll to it
      const targetButton = yearButtons.find(btn => parseInt(btn.textContent.trim()) === newActiveYear);
      if (targetButton) {
        const container = scrollContainerRef.current;
        const buttonLeft = targetButton.offsetLeft;
        const buttonWidth = targetButton.offsetWidth;
        const containerWidth = container.clientWidth;
        
        // Center the active year in the viewport
        const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
        
        // Update scrollability state after scroll completes
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const tolerance = 1;
            setCanScrollLeft(scrollLeft > tolerance);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - tolerance);
          }
        }, 500);
      }
    });
  };

  const handleYearClick = (year) => {
    if (year === currentActiveYear) return;
    
    if (activeYear === undefined) {
      setInternalActiveYear(year);
    }
    if (onYearChange) {
      onYearChange(year);
    }
    
    // Scroll to the clicked year
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const yearButtons = Array.from(scrollContainerRef.current.querySelectorAll('.our-story-year-selector__year'));
        const targetButton = yearButtons.find(btn => parseInt(btn.textContent.trim()) === year);
        if (targetButton) {
          const container = scrollContainerRef.current;
          const buttonLeft = targetButton.offsetLeft;
          const buttonWidth = targetButton.offsetWidth;
          const containerWidth = container.clientWidth;
          
          const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          
          container.scrollTo({
            left: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      }
    }, 10);
  };

  // Check if we can navigate based on current active year position
  const currentIndex = yearList.indexOf(currentActiveYear);
  const canNavigateLeft = currentIndex > 0; // Can go to newer year
  const canNavigateRight = currentIndex < yearList.length - 1; // Can go to older year

  return (
    <div className="our-story-year-selector" data-node-id="2849:222">
      <button
        className={`our-story-year-selector__arrow our-story-year-selector__arrow--left ${!canNavigateLeft ? 'our-story-year-selector__arrow--disabled' : ''}`}
        onClick={() => scroll('left')}
        disabled={!canNavigateLeft}
        data-node-id="2849:223"
        aria-label="Previous year"
      >
        <svg width="16" height="30" viewBox="0 0 16 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.3292 29.2129L0.712224 14.615L13.633 0.763517" stroke="#126430" strokeWidth="1.47674" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div 
        className="our-story-year-selector__container"
        ref={scrollContainerRef}
        data-node-id="2849:225"
      >
        {yearList.map((year) => (
          <button
            key={year}
            className={`our-story-year-selector__year ${currentActiveYear === year ? 'our-story-year-selector__year--active' : ''}`}
            onClick={() => handleYearClick(year)}
          >
            {year}
          </button>
        ))}
      </div>
      
      <button
        className={`our-story-year-selector__arrow our-story-year-selector__arrow--right ${!canNavigateRight ? 'our-story-year-selector__arrow--disabled' : ''}`}
        onClick={() => scroll('right')}
        disabled={!canNavigateRight}
        data-node-id="2849:233"
        aria-label="Next year"
      >
        <svg width="16" height="30" viewBox="0 0 16 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <path d="M14.3292 29.2129L0.712224 14.615L13.633 0.763517" stroke="#126430" strokeWidth="1.47674" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

