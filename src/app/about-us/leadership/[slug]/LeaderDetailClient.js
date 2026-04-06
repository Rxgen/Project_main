'use client';

import { useEffect } from 'react';

export default function LeaderDetailClient({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is the first time opening the detail page (not a reload)
      const hasReloaded = sessionStorage.getItem('detailPageReloaded');
      
      if (!hasReloaded) {
        // Mark that we've reloaded to prevent infinite loop
        sessionStorage.setItem('detailPageReloaded', 'true');
        // Mark that we're on a leadership detail page
        sessionStorage.setItem('navigatedFromLeaderDetail', 'true');
        // Reload the page on first open
        window.location.reload();
      } else {
        // Clear the reload flag so next navigation will reload again
        sessionStorage.removeItem('detailPageReloaded');
        // Mark that we're on a leadership detail page
        sessionStorage.setItem('navigatedFromLeaderDetail', 'true');
      }
    }
  }, []);

  return <>{children}</>;
}

