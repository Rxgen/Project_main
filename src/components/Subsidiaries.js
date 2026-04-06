'use client';

import Link from 'next/link';
import NavigationLinks from './NavigationLinks';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '../scss/components/Subsidiaries.scss';

export default function Subsidiaries({ data, error = null }) {
  // Show error state if API failed
  if (error) {
    return (
      
      <section className="subsidiaries">
         
        <div className="subsidiaries__container">
         <NavigationLinks />
          <div className="subsidiaries__placeholder">
            <p>Unable to load subsidiaries at this time. Please try again later.</p>
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
  if (!data || !data.subsidiaries || data.subsidiaries.length === 0) {
    return (
      <section className="subsidiaries">
        <div className="subsidiaries__container">
          <NavigationLinks />
          <div className="subsidiaries__placeholder">
            <p>No subsidiaries available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  const subsidiariesData = data;

  // Split years into two rows: first row (5 years) and second row (4 years)
  const getYearRows = (years) => {
    return {
      firstRow: years.slice(0, 5),
      secondRow: years.slice(5)
    };
  };

  return (
    <section className="subsidiaries">
      <div className="subsidiaries__container">
        <NavigationLinks />
        <div className="subsidiaries__grid">
          {subsidiariesData.subsidiaries.map((subsidiary) => {
            const { firstRow, secondRow } = getYearRows(subsidiary.years);
            
            return (
              <div key={subsidiary.id} className="subsidiary-card">
                <div className="subsidiary-card__content">
                  <h3 className="subsidiary-card__title">{subsidiary.name}</h3>
                  
                  <div className="subsidiary-card__years">
                    {/* First Row - 5 years */}
                    <div className="subsidiary-card__years-row">
                      {firstRow.map((yearItem, index) => (
                        <Link
                          key={index}
                          href={normalizeUploadUrl(yearItem.url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`subsidiary-card__year ${yearItem.isActive ? 'subsidiary-card__year--active' : ''}`}
                        >
                          {yearItem.year}
                        </Link>
                      ))}
                    </div>
                    
                    {/* Second Row - 4 years */}
                    <div className="subsidiary-card__years-row">
                      {secondRow.map((yearItem, index) => (
                        <Link
                          key={index}
                          href={normalizeUploadUrl(yearItem.url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`subsidiary-card__year ${yearItem.isActive ? 'subsidiary-card__year--active' : ''}`}
                        >
                          {yearItem.year}
                        </Link>
                      ))}
                      {/* Annual Returns Link - Only show if PDF is present */}
                      {subsidiary.annualReturns && subsidiary.annualReturns.url && (
                        <Link 
                          href={normalizeUploadUrl(subsidiary.annualReturns.url) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="subsidiary-card__year subsidiary-card__year--annual-returns"
                        >
                          {subsidiary.annualReturns.title || 'Annual Returns'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

