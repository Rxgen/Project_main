import Hero from '@/components/Hero';
import OurStory from '@/components/OurStory';
import OurPurpose from '@/components/OurPurpose';
import Overview from '@/components/Overview';
import OurBusiness from '@/components/OurBusiness';
import Investors from '@/components/Investors';
import Sustainability from '@/components/Sustainability';
import CSR from '@/components/CSR';
import Life from '@/components/Life';
import NewsInsights from '@/components/NewsInsights';
import GoldenLine from '@/components/GoldenLine';
import MobileLine from '@/components/MobileLine';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { generateOrganizationSchema } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { getHomepage, mapHomepageHeroData, mapHomepageOurStoryData, mapHomepageOurPurposeData, mapHomepageOverviewData, mapHomepageOurBusinessData, mapHomepageSustainabilityData, mapHomepageCSRData, mapHomepageLifeData, mapHomepageNewsInsightsData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the home page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'homepage',
    'https://www.lupin.com'
  );
}

export default async function Home() {
  // Generate structured data for SEO
  const organizationSchema = generateOrganizationSchema();

  // Fetch homepage data – let errors throw so Next.js shows default error page
  const homepageData = await getHomepage();

  if (!homepageData) {
    notFound();
  }

  // Map data – let errors throw so you see the real error in default error page
  const heroData = mapHomepageHeroData(homepageData);
  const ourStoryData = mapHomepageOurStoryData(homepageData);
  const ourPurposeData = mapHomepageOurPurposeData(homepageData);
  const overviewData = mapHomepageOverviewData(homepageData);
  const ourBusinessData = mapHomepageOurBusinessData(homepageData);
  const sustainabilityData = mapHomepageSustainabilityData(homepageData);
  const csrData = mapHomepageCSRData(homepageData);
  const lifeData = mapHomepageLifeData(homepageData);
  const newsInsightsData = mapHomepageNewsInsightsData(homepageData);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <div>
        <GoldenLine />
       
        <Hero data={heroData} />
        <main>
          {ourStoryData && <OurStory data={ourStoryData} />}
          {ourPurposeData && <OurPurpose data={ourPurposeData} />}
          {overviewData && <Overview data={overviewData} />}
          {ourBusinessData && <OurBusiness data={ourBusinessData} />}
          <Investors />
          {sustainabilityData && <Sustainability data={sustainabilityData} />}
          {csrData && <CSR data={csrData} />}
          {lifeData && <Life data={lifeData} />}
          {newsInsightsData && <NewsInsights data={newsInsightsData} />}
        </main>
      </div>
    </>
  );
}
