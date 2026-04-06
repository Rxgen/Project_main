'use client';

import Link from 'next/link';
import '../scss/components/Events.scss';

export default function Events({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="events">
        <div className="events__container">
          <div className="events__placeholder">
            <p>Unable to load events at this time. Please try again later.</p>
            {process.env.NODE_ENV === 'development' && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Error: {error}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!data || !data.events || data.events.length === 0) {
    return (
      <section className="events" id="events">
        <div className="events__container">
          <div className="events__placeholder">
            <p>No events available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  const eventsData = {
    title: data.title || "Events",
    events: data.events
  };

  // Sort events by date (latest first)
  const sortedEvents = [...eventsData.events].sort((a, b) => {
    // Parse dates from formatted strings (e.g., "September 17, 2025")
    const parseDate = (dateString) => {
      if (!dateString) return new Date(0); // Put items without dates at the end
      try {
        return new Date(dateString);
      } catch (e) {
        return new Date(0);
      }
    };

    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    // Sort descending (newest first)
    return dateB - dateA;
  });

  return (
    <section className="events" id="events">
      <div className="events__container">
        {/* Title */}
        {eventsData.title && (
          <h2 className="events__title">
            {eventsData.title}
          </h2>
        )}

        {/* Events Grid */}
        <div className="events__grid">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              href={event.href || "#"}
              className={`events__card events__card--light`}
            >
              {/* Card Content */}
              <div className="events__card-content">
                <div className="events__card-text">
                  {event.date && (
                    <p className="events__card-date">
                      {event.date}
                    </p>
                  )}
                  {event.title && (
                    <h3 className="events__card-title">
                      {event.title}
                    </h3>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
