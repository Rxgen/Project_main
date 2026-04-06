'use client';

import '../scss/components/Policies.scss';
import { getFallbackDividendTransferTable } from '@/lib/strapi-reports';

export default function VotingTable({ data }) {
  // Use provided data (e.g. Dividend History table) or fallback to dividend transfer table
  const tableData = data || {
    paragraph: "Unclaimed/unpaid dividends for the year 2018-19 onwards will be transferred to the IEPF, as under: –",
    table: getFallbackDividendTransferTable()
  };

  return (
    <section className="policies tablePolicies">
      {/* Container */}
      <div className="policies__container">
        {/* Content */}
        <div className="policies__content policies__content--no-top-margin">
          {/* Paragraph */}
          {tableData.paragraph && (
            <p className="policies__table-paragraph">
              {tableData.paragraph}
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

