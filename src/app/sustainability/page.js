// Test comment
import Image from 'next/image';
import InnerBanner from '@/components/InnerBanner';
import SustainabilityIntro from '@/components/sustainability/SustainabilityIntro';
import OurPlanet from '@/components/sustainability/OurPlanet';
import OurPeople from '@/components/sustainability/OurPeople';
import OurPatients from '@/components/sustainability/OurPatients';
import ESGReportLink from '@/components/sustainability/ESGReportLink';
import SustainabilityHighlights from '@/components/sustainability/SustainabilityHighlights';
import ESGRatingsSection from '@/components/sustainability/ESGRatingsSection';
import ESGGovernanceSection from '@/components/sustainability/ESGGovernanceSection';
import ESGInfographicSection from '@/components/sustainability/ESGInfographicSection';
import SustainabilityCTASection from '@/components/sustainability/SustainabilityCTASection';
import GlobalFrameworksSection from '@/components/sustainability/GlobalFrameworksSection';
import LookingAheadSection from '@/components/sustainability/LookingAheadSection';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import '@/scss/pages/sustainability.scss';

// Generate metadata for the Sustainability page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'sustainability',
    'https://www.lupin.com/sustainability',
    {
      title: 'Sustainability - Lupin',
      description: 'Discover Lupin\'s commitment to sustainability, ESG initiatives, and our approach to environmental, social, and governance excellence.',
      keywords: 'sustainability, ESG, Lupin, environmental, social governance, corporate responsibility',
    }
  );
}

export default function SustainabilityPage() {
  // Banner data for InnerBanner
  const bannerData = {
    title: {
      line1: "Sustainability",
      line2: ""
    },
    images: {
      banner: {
        url: "/assets/sustainability/banner-desktop.png",
        alt: "Sustainability"
      },
      bannerMobile: {
        url: "/assets/sustainability/mobile-banner.png",
        alt: "Sustainability"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  return (
    <div className="sustainability-page" style={{ position: 'relative' }}>
      <div className="sustainability-page__line" aria-hidden="true">
        <Image
          src="/assets/sustainability/line.svg"
          alt=""
          width={1875}
          height={8200}
          quality={100}
        />
      </div>
      <InnerBanner data={bannerData} />
      <SustainabilityIntro />
      <OurPlanet />
      <OurPeople />
      <OurPatients />
      <ESGReportLink />
      <SustainabilityHighlights />
      <ESGRatingsSection />
      <ESGGovernanceSection />
      <ESGInfographicSection />
      <SustainabilityCTASection />
      <GlobalFrameworksSection />
      <LookingAheadSection />
    </div>
  );
}

