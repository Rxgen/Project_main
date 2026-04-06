'use client';

import { useState } from 'react';
import AGMAndPostalBallot from '@/components/AGMAndPostalBallot';

const AUG_20_2025_CARDS = [
  { id: 1, title: 'Voting Results and Scrutinizer\'s Report', pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/09/seintimation-scrutinizer-report.pdf' },
  { id: 2, title: 'Newspaper Advertisement', pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/08/seintimation-newspaperadvt.pdf' },
  { id: 3, title: 'Notice of Postal Ballot', pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/08/postal-ballot-notice.pdf' }
];

export default function PostalBallotSectionWithNotice({ tabs, tabsData }) {
  const [activeTabValue, setActiveTabValue] = useState(tabs?.[0] ?? 'FY 2025-26');

  const showAug20Section = activeTabValue === 'FY 2025-26';

  return (
    <>
      <AGMAndPostalBallot
        title="Postal Ballot"
        tabs={tabs}
        tabsData={tabsData}
        noticeText={activeTabValue === 'FY 2025-26' ? 'Postal Ballot Notice dated January 06, 2026' : null}
        className="agm-postal-ballot--postal-ballot"
        onActiveTabChange={setActiveTabValue}
      />
      {showAug20Section && (
        <AGMAndPostalBallot
          title=""
          tabs={[]}
          tabsData={{
            '': { cards: AUG_20_2025_CARDS }
          }}
          noticeText="Postal Ballot Notice dated August 20, 2025"
          className="agm-postal-ballot--postal-ballot"
        />
      )}
    </>
  );
}
