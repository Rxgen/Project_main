'use client';

import '../scss/components/Policies.scss';
import { getFallbackIEPFTable } from '@/lib/strapi-reports';

export default function IEPFTable({ data }) {
  // Always use fallback/backup data (static data)
  // Fetch data from helper function to ensure consistency
  const tableData = {
    paragraph: "The following unpaid dividend payment of the Company have already been transferred to the Investor Education & Protection Fund (IEPF) as under :-",
    table: getFallbackIEPFTable()
  };

  return (
    <section className="policies policies--light-bg tablePolicies">
      {/* Container */}
      <div className="policies__container">
        {/* Content */}
        <div className="policies__content policies__content--no-top-margin">
          {/* Paragraph */}
          {tableData.paragraph && (
            <p className="policies__table-paragraph">
              The following unpaid dividend payment of the Company have already been<br />transferred to the Investor Education & Protection Fund (IEPF) as under :-
            </p>
          )}

          {/* Table */}
          {tableData.table && (
            <div className="policies__voting-table-wrapper">
              {/* Header Row */}
              <div className="policies__voting-table-header">
                {tableData.table.headers && tableData.table.headers.map((header, index) => (
                  <div 
                    key={index} 
                    className={`policies__voting-table-header-cell ${index === 1 ? 'policies__voting-table-header-cell--large-padding' : ''}`}
                    style={{ 
                      backgroundColor: header.bgColor || '#08a03f',
                      color: header.textColor || '#ffffff'
                    }}
                  >
                    <p>{header.text}</p>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              <div className="policies__voting-table-rows">
                {tableData.table.rows && tableData.table.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="policies__voting-table-row">
                    {tableData.table.headers && tableData.table.headers.map((header, colIndex) => (
                      <p key={colIndex} className="policies__voting-table-cell">
                        {row[header.text] || ''}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

