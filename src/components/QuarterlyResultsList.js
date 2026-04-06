'use client';

import '@/scss/components/QuarterlyResultsList.scss';

/**
 * QuarterlyResultsList - Component to display quarterly results list
 * Based on Figma design: https://www.figma.com/design/QNIbuokNouJSBEY7GUGsEI/Jash---Final-Home-page-auto-layout--Copy-?node-id=2300-601
 * 
 * API Endpoint: /api/report-filing
 * Function: getReportFiling() from @/lib/strapi-reports
 * 
 * API Structure:
 * - QuarterlyResultsSection (grouped by FinancialYear, e.g., "FY 2024-25")
 *   - QuarterlyEarningsSection (contains quarterLabel and PdfCard array)
 *     - quarterLabel: "Q4 (Jan – Mar)" (extracted and formatted as "Q4(Jan – Mar)")
 *     - PdfCard[]: Array of PDF documents for that quarter
 * 
 * Data Flow:
 * 1. getReportFiling() fetches from /api/report-filing
 * 2. mapReportFilingData() maps QuarterlyResultsSection -> QuarterlyEarningsSection
 * 3. transformQuarterlyResultsForComponent() groups by FinancialYear and processes quarters
 * 4. processQuarterlyDataForYear() extracts quarterLabel and formats as "Q{number}(period)"
 * 
 * This component only displays the quarter labels (period + status), not the PDFs.
 * PDFs are displayed separately in the cards section below.
 * 
 * @param {Array} items - Array of quarterly result items with { period, status }
 *   - period: Formatted quarter label (e.g., "Q4(Jan – Mar)")
 *   - status: "Audited" or "Unaudited"
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <QuarterlyResultsList 
 *   items={[
 *     { period: 'Q1(July-Sep)', status: 'Unaudited' },
 *     { period: 'Q2(Oct-Dec)', status: 'Unaudited' },
 *     { period: 'Q3(Jan-Mar)', status: 'Unaudited' },
 *     { period: 'Q4(Apr-Jun)', status: 'Unaudited' }
 *   ]}
 * />
 */
export default function QuarterlyResultsList({ 
  items = [],
  className = '' 
}) {
  // Use API data if provided, otherwise show empty state
  const displayItems = items && items.length > 0 ? items : [];

  if (process.env.NODE_ENV === 'development') {
    console.log('QuarterlyResultsList - Received items:', {
      itemsCount: items?.length || 0,
      displayItemsCount: displayItems.length,
      items: items
    });
  }

  // Show empty state if no items
  if (displayItems.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('QuarterlyResultsList - No items provided, returning null');
    }
    return null; // Or return empty state if needed
  }

  return (
    <section className={`quarterly-results-list ${className}`}>
      <div className="quarterly-results-list__container">
        {displayItems.map((item, index) => (
          <div key={index} className="quarterly-results-list__item">
            <p className="quarterly-results-list__period">{item.period}</p>
            <p className="quarterly-results-list__status">{item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

