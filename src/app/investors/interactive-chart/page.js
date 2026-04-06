import InnerBanner from '@/components/InnerBanner';
import InteractiveChart from '@/components/InteractiveChart/InteractiveChart';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { mapTopBannerData } from '@/lib/strapi';
import { getSharePrice } from '@/lib/strapi-reports';

export const dynamic = 'force-dynamic';

// Generate metadata for the interactive chart page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'interactive-chart',
    'https://www.lupin.com/investors/interactive-chart'
  );
}

export default async function InteractiveChartPage() {
  let bannerData = null;

  try {
    const rawData = await getSharePrice();
    if (rawData?.data?.TopBanner || rawData?.TopBanner) {
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
    }
  } catch (err) {
    console.error('Interactive Chart - Error fetching banner:', err);
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <InteractiveChart />
      <SubscriberUpdated />
    </div>
  );
}
