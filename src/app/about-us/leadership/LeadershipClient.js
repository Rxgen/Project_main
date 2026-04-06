'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function LeadershipClient({ children }) {
  const pathname = usePathname();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Check if we're on the leadership page
    if (pathname === '/about-us/leadership') {
      // Check if we came from a leadership detail page using sessionStorage
      const cameFromDetail = typeof window !== 'undefined' && 
                            sessionStorage.getItem('navigatedFromLeaderDetail') === 'true';
      
      if (cameFromDetail && !hasRefreshed.current) {
        hasRefreshed.current = true;
        // Clear the flag first
        sessionStorage.removeItem('navigatedFromLeaderDetail');
        // Force a full page reload
        window.location.reload();
        return;
      } else if (!cameFromDetail) {
        // Reset the flag if we land on the leadership page directly (not from detail)
        hasRefreshed.current = false;
        sessionStorage.removeItem('navigatedFromLeaderDetail');
      }
    }
  }, [pathname]);

  // Handle browser back/forward navigation using pageshow event
  useEffect(() => {
    const handlePageShow = (e) => {
      // If page was loaded from cache (back/forward navigation)
      if (e.persisted && pathname === '/about-us/leadership') {
        // Check if we came from a detail page
        if (sessionStorage.getItem('navigatedFromLeaderDetail') === 'true' && !hasRefreshed.current) {
          hasRefreshed.current = true;
          sessionStorage.removeItem('navigatedFromLeaderDetail');
          window.location.reload();
        }
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [pathname]);

  return <>{children}</>;
}

