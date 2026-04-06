'use client';

import '../scss/components/FinancialBarChart.scss';

/**
 * FinancialBarChart - Component to display financial data as horizontal bar charts
 * 
 * @param {string} title - Chart title
 * @param {Array} data - Array of data objects with { label, value, maxValue }
 * @param {string} className - Additional CSS classes
 */
export default function FinancialBarChart({ title, data = [], className = '' }) {
  if (!data || data.length === 0) return null;

  // Find max value for percentage calculation
  const maxValue = Math.max(...data.map(item => item.value || 0));

  return (
    <div className={`financial-bar-chart ${className}`}>
      <h3 className="financial-bar-chart__title">{title}</h3>
      <div className="financial-bar-chart__bars">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="financial-bar-chart__item">
              <p className="financial-bar-chart__label">{item.label}</p>
              <div className="financial-bar-chart__bar-wrapper">
                <div 
                  className="financial-bar-chart__bar"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

