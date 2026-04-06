import InnerBanner from '@/components/InnerBanner';
import SafeHarborStatementContent from '@/components/SafeHarborStatementContent';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

// Generate metadata for the Safe Harbor Statement page
export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Safe Harbor Statement - Lupin',
    description: 'Safe Harbor Statement under the U. S. Private Securities Litigation Reform Act of 1995',
    canonicalUrl: 'https://www.lupin.com/safeharborstatement',
    keywords: 'Safe Harbor Statement, Lupin, Private Securities Litigation Reform Act',
  });
}

export default async function SafeHarborStatementPage() {
  // Always render with static content - API data is optional
  const strapiData = null;

  const bannerData = {
    title: {
      line1: "Safe Harbor",
      line2: "Statement",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Safe Harbor Statement - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <SafeHarborStatementContent data={strapiData} />
    </div>
  );
}

