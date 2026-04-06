'use client';

import { useEffect, useState } from 'react';

const MAP_SVG_PATH = '/assets/global-presence/mapog.svg';
const MEDISOL_LOGO_PATH = '/images/contact/icons/new%20logos/medisol.png';

export default function GlobalPresenceMap() {
  const [svgContent, setSvgContent] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client side - ensure window is available
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Load SVG first (required)
    fetch(MAP_SVG_PATH)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load map SVG: ${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then(svg => {
        // Try to load logo (optional - if it fails, still show SVG without logo)
        return fetch(MEDISOL_LOGO_PATH)
          .then(res => {
            if (!res.ok) {
              // Logo not found is not critical, just log and continue
              console.warn('Medisol logo not found, continuing without logo');
              return null;
            }
            return res.arrayBuffer();
          })
          .then(logoBuffer => {
            let svgWithLogo = svg;
            
            // If logo was loaded successfully, embed it
            if (logoBuffer) {
              try {
                const bytes = new Uint8Array(logoBuffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);
                const dataUrl = `data:image/png;base64,${base64}`;
                // Replace image href so embedded logo loads in inlined SVG (avoids blocked external refs)
                // Match any medisol logo reference (medisol-logo.png or medisol.png)
                svgWithLogo = svg.replace(/href="[^"]*medisol[^"]*\.png"/, `href="${dataUrl}"`);
                svgWithLogo = svgWithLogo.replace(/xlink:href="[^"]*medisol[^"]*\.png"/, `xlink:href="${dataUrl}"`);
              } catch (err) {
                console.warn('Error processing logo, continuing without logo:', err);
              }
            }
            
            setSvgContent(svgWithLogo);
            setIsLoading(false);
          })
          .catch(logoErr => {
            // Logo error is not critical, just use SVG without logo
            console.warn('Logo loading failed, using SVG without logo:', logoErr);
            setSvgContent(svg);
            setIsLoading(false);
          });
      })
      .catch(err => {
        console.error('Error loading map SVG:', err);
        setError(err.message || 'Failed to load map');
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div style={{ width: '100%', position: 'relative', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Unable to load map at this time.</p>
          {process.env.NODE_ENV === 'development' && (
            <p style={{ fontSize: '14px', marginTop: '10px' }}>Error: {error}</p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading || !svgContent) {
    return (
      <div style={{ width: '100%', position: 'relative', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading map...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div 
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
