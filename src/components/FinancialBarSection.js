'use client';

import FinancialBarChart from './FinancialBarChart';
import '../scss/components/FinancialBarSection.scss';

/**
 * FinancialBarSection - Section component for financial bar charts
 */
export default function FinancialBarSection({ data }) {
  // If no data provided, don't render
  if (!data || !data.charts || data.charts.length === 0) {
    return null;
  }

  const sectionData = data;

  return (
    <section className="financial-bar-section">
      <div className="financial-bar-section__container">
        <h2 className="financial-bar-section__title">{sectionData.title}</h2>
        
        {/* Charts Grid */}
        <div className="financial-bar-section__charts">
          {sectionData.charts && sectionData.charts.map((chart, index) => (
            <FinancialBarChart
              key={index}
              title={chart.title}
              data={chart.data}
            />
          ))}
        </div>

    
      </div>
    </section>
  );
}

