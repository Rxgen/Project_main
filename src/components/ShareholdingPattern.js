'use client';

import '../scss/components/ShareholdingPattern.scss';

export default function ShareholdingPattern({ data, error = null }) {
  // Fallback data (kept for future reference as requested)
  const fallbackData = {
    iframeUrl: "https://content.dionglobal.in/lupinworldnew/ShareHolding.aspx",
    iframeTitle: "Shareholding Pattern"
  };

  // Use API data if available and has valid iframeUrl, otherwise use fallback
  const hasValidUrl = data?.iframeUrl && 
    typeof data.iframeUrl === 'string' && 
    data.iframeUrl.trim() !== '' && 
    data.iframeUrl !== 'null' && 
    data.iframeUrl !== 'undefined';
  
  const shareholdingData = hasValidUrl ? data : fallbackData;

  return (
    <section className="shareholding-pattern">
      {/* Container */}
      <div className="shareholding-pattern__container">
        {/* Iframe Section */}
        <div className="shareholding-pattern__iframe-wrapper">
          {shareholdingData.iframeUrl ? (
            <iframe
              src={shareholdingData.iframeUrl}
              title={shareholdingData.iframeTitle}
              className="shareholding-pattern__iframe"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="shareholding-pattern__placeholder">
              <p>Iframe content will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

