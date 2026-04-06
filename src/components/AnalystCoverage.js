'use client';

import Image from 'next/image';
import NavigationLinks from './NavigationLinks';
import '../scss/components/AnalystCoverage.scss';

export default function AnalystCoverage({ analysts, error }) {
  // Show error state if API failed
  if (error) {
    return (
      <section className="analyst-coverage">
        <div className="analyst-coverage__bg"></div>
        <div className="analyst-coverage__container">
          <NavigationLinks />
          <div className="analyst-coverage__content">
            <div className="analyst-coverage__placeholder">
              <p>Unable to load analyst coverage at this time. Please try again later.</p>
              {process.env.NODE_ENV === 'development' && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!analysts || analysts.length === 0) {
    return (
      <section className="analyst-coverage">
        <div className="analyst-coverage__bg"></div>
        <div className="analyst-coverage__container">
          <NavigationLinks />
          <div className="analyst-coverage__content">
            <div className="analyst-coverage__placeholder">
              <p>No analyst coverage available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="analyst-coverage">
      {/* Background */}
      <div className="analyst-coverage__bg"></div>
      
      {/* Decorative Petals */}
      <div className="analyst-coverage__petal analyst-coverage__petal--left">
        <Image
          src="/assets/analyst-coverage/fill-petal-1.svg"
          alt=""
          width={266}
          height={273}
          className="analyst-coverage__petal-img"
          quality={100}
        />
      </div>
      <div className="analyst-coverage__petal analyst-coverage__petal--right">
        <Image
          src="/assets/analyst-coverage/fill-petal-2.svg"
          alt=""
          width={236}
          height={243}
          className="analyst-coverage__petal-img"
          quality={100}
        />
      </div>

      {/* Container */}
      <div className="analyst-coverage__container">
        {/* Navigation Links */}
        <NavigationLinks />

        {/* Analyst Cards Grid */}
        <div className="analyst-coverage__grid">
          {analysts.map((analyst) => (
            <div
              key={analyst.id}
              className={`analyst-card ${analyst.isActive ? 'analyst-card--active' : ''}`}
            >
              <div className="analyst-card__content">
                <h3 className="analyst-card__institution">{analyst.institution}</h3>
                <div className="analyst-card__info">
                  <p className="analyst-card__name">{analyst.analyst}</p>
                  {/* <a
                    href={`mailto:${analyst.email}`}
                    className="analyst-card__email"
                  >
                    {analyst.email}
                  </a> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

