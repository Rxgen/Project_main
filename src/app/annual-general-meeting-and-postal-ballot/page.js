import InnerBanner from '@/components/InnerBanner';
import AGMAndPostalBallot from '@/components/AGMAndPostalBallot';
import PostalBallotSectionWithNotice from './PostalBallotSectionWithNotice';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

// Generate metadata for the Annual General Meeting and Postal Ballot page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'annual-general-meeting-and-postal-ballot',
    'https://www.lupin.com/annual-general-meeting-and-postal-ballot',
    {
      title: 'Annual General Meeting and Postal Ballot - Lupin',
      description: 'Find details on Lupin’s Annual General Meeting, postal ballot notices, voting information, and shareholder announcements in one place.',
    }
  );
}

export default function AnnualGeneralMeetingAndPostalBallotPage() {
  const bannerData = {
    title: {
      line1: "Annual General Meeting",
      line2: "and Postal Ballot",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/AGM.png",
        alt: "Annual General Meeting and Postal Ballot - Lupin"
      },
      bannerMobile: {
        url: "/assets/inner-banner/AGM-mbl.png",
        alt: "Annual General Meeting and Postal Ballot - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // AGM Section Data
  const agmTabs = ['FY 2024-25', 'FY 2023-24', 'FY 2022-23', 'FY 2021-22'];

  const agmTabsData = {
    'FY 2024-25': {
      cards: [
        {
          id: 1,
          title: 'AGM Transcript',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/08/agm-transcript.pdf'
        },
        {
          id: 2,
          title: 'Outcome of AGM and e-voting Results',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/08/se-intimation-for-outcome-of-agm.pdf'
        },
        {
          id: 3,
          title: 'Newspaper Advertisement (post-dispatch)',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/letter-for-newspaper-publication.pdf'
        },
        {
          id: 4,
          title: 'Integrated Report',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/integrated-report-consolidated.pdf'
        },
        {
          id: 5,
          title: 'AGM Notice',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/notice-forty-third-agm.pdf'
        },
        {
          id: 6,
          title: 'Draft Articles of Association',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/draft-articles-of-association.pdf'
        },
        {
          id: 7,
          title: 'Annual Returns',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/10/form-mgt-7-ll-final.pdf'
        },
        {
          id: 8,
          title: 'Newspaper Advertisement (Pre-dispatch)',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/nse-letter-for-newspaper-publication.pdf'
        }
      ]
    },
    'FY 2023-24': {
      cards: [
        {
          id: 1,
          title: 'Integrated Report',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2024/07/integrated-report-consolidated.pdf'
        },
        {
          id: 2,
          title: 'AGM Notice',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/lupin-2024-agm-notice.pdf'
        },
        {
          id: 3,
          title: 'Outcome of AGM and E-voting results',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/outcome-of-agm-and-e-voting-results.pdf'
        },
        {
          id: 4,
          title: 'AGM Transcript',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/agm-transcript.pdf'
        },
        {
          id: 5,
          title: 'Annual Return',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/annual-return.pdf'
        }
      ]
    },
    'FY 2022-23': {
      cards: [
        {
          id: 1,
          title: 'AGM Notice',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/agm-notice-2023-final.pdf'
        },
        {
          id: 2,
          title: 'Outcome of AGM and E-voting results',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/outcome-of-agm-and-e-voting-results-2.pdf'
        },
        {
          id: 3,
          title: 'Annual Return',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/annual-return-2023.pdf'
        }
      ]
    },
    'FY 2021-22': {
      cards: [
        {
          id: 1,
          title: 'AGM Notice',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/AGM-Notice-Consolidated-Final-21-22.pdf'
        },
        {
          id: 2,
          title: 'Outcome of AGM and E-voting results',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/Outcome-of-AGM-and-E-voting-results-1.pdf'
        },
        {
          id: 3,
          title: 'Annual Return',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/Annual-Return-1.pdf'
        }
      ]
    },
    // 'FY 2021-22': {
    //   cards: [
    //     {
    //       id: 1,
    //       title: 'AGM Notice',
    //       pdfUrl: '#'
    //     },
    //     {
    //       id: 2,
    //       title: 'Code of Conduct for Independent Directors',
    //       pdfUrl: '#'
    //     },
    //     {
    //       id: 3,
    //       title: 'Outcome of AGM and E-voting results',
    //       pdfUrl: '#'
    //     }
    //   ]
    // },
    // 'FY 2020-21': {
    //   cards: [
    //     {
    //       id: 1,
    //       title: 'AGM Notice',
    //       pdfUrl: '#'
    //     },
    //     {
    //       id: 2,
    //       title: 'Code of Conduct for Independent Directors',
    //       pdfUrl: '#'
    //     },
    //     {
    //       id: 3,
    //       title: 'Outcome of AGM and E-voting results',
    //       pdfUrl: '#'
    //     }
    //   ]
    // }
  };

  // Postal Ballot Section Data
  const postalBallotTabs = ['FY 2025-26', 'FY 2024-25'];

  const postalBallotTabsData = {
    'FY 2025-26': {
      cards: [
        {
          id: 1,
          title: 'Voting Results and Scrutinizer\'s Report',
          pdfUrl: 'https://cmsuatlupin.blob.core.windows.net/public/uploads/SEIntimation_VotingScrutinizersReport-1.pdf'
        },
        {
          id: 2,
          title: 'Newspaper Advertisement',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2026/01/seintimation-newspaper-advt.pdf'
        },
        {
          id: 3,
          title: 'Notice of Postal Ballot',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2026/01/notice-of-postal-ballot.pdf'
        }
      ]
    },
    'FY 2024-25': {
      cards: [
        {
          id: 1,
          title: 'Notice of Postal Ballot',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/Notice-of-Postal-Ballot.pdf'
        },
        {
          id: 2,
          title: 'Voting Results and Scrutinizer',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/Voting-Results-and-Scrutinizer.pdf'
        },
        {
          id: 3,
          title: 'Newspaper Advertisement',
          pdfUrl: 'https://www.lupin.com/wp-content/uploads/2025/07/Newspaper-Advertisement.pdf'
        }
      ]
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />

      {/* AGM Section */}
      <AGMAndPostalBallot
        title="AGM"
        tabs={agmTabs}
        tabsData={agmTabsData}
      />

      {/* Postal Ballot Section – Aug 20, 2025 notice only when FY 2025-26 is selected */}
      <PostalBallotSectionWithNotice
        tabs={postalBallotTabs}
        tabsData={postalBallotTabsData}
      />
    </div>
  );
}

