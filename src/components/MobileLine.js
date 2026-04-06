'use client';

import { useEffect, useRef, useState } from 'react';

// Simple mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(max-width: 767px)');
    setIsMobile(query.matches);
    const update = () => setIsMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return isMobile;
}

export default function MobileLine() {
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;
    
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    // Update container height to match document height
    const updateHeight = () => {
      if (container) {
        container.style.height = `${document.documentElement.scrollHeight}px`;
      }
    };
    updateHeight();

    // Get the total length of the path
    const pathLength = path.getTotalLength();
    
    // Set up the starting positions - path completely hidden
    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;
    path.style.transition = 'none';

    // Function to update the path drawing based on scroll
    const handleScroll = () => {
      if (!path) return;
      
      // Get current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Get total scrollable height
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = documentHeight - windowHeight;
      
      // Calculate scroll percentage (0 at top, 1 at bottom)
      let percentage = 0;
      if (maxScroll > 0) {
        percentage = scrollTop / maxScroll;
      }
      
      // Ensure percentage is between 0 and 1
      percentage = Math.max(0, Math.min(1, percentage));
      
      // Slow down the animation by using a slower factor (0.5 = half speed)
      const slowFactor = 0.5;
      const adjustedPercentage = percentage * slowFactor;
      
      // Calculate offset (goes from pathLength down to 0)
      const offset = pathLength * (1 - adjustedPercentage);
      
      // Update stroke-dashoffset
      path.style.strokeDashoffset = `${offset}`;
    };

    // Use requestAnimationFrame for smoother animation
    let ticking = false;
    const requestScrollUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Handle resize to update height and scroll
    const handleResize = () => {
      updateHeight();
      requestScrollUpdate();
    };

    // Add scroll event listener with passive flag for better performance
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    // Also listen to resize in case viewport changes
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial call after a short delay to ensure DOM is ready
    setTimeout(() => {
      handleScroll();
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div ref={containerRef} className="mobile-line" style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '100%', pointerEvents: 'none', zIndex: 9998 }}>
      <svg
        width="2px"
        height="100%"
        viewBox="0 0 2 10000"
        preserveAspectRatio="none"
        style={{ width: '2px', height: '100%', display: 'block' }}
      >
        <path
          ref={pathRef}
          d="M1,0 L1,10000"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}
