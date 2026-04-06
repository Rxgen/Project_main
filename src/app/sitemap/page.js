import InnerBanner from '@/components/InnerBanner';
import SitemapContent from '@/components/SitemapContent';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

// Generate metadata for the Sitemap page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'site-map',
    'https://www.lupin.com/sitemap'
  );
}



export default function SitemapPage() {
  const bannerData = {
    title: {
      line1: "Site",
      line2: "map",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Sitemap - Lupin"
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
      <SitemapContent />
    </div>
  );
}

