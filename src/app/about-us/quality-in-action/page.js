import InnerBanner from '@/components/InnerBanner';
import QualityInActionContent from '@/components/quality/QualityInActionContent';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

// Generate metadata for the Quality in Action page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'quality-in-action',
    'https://www.lupin.com/about-us/quality-in-action',
    {
      title: 'Quality in Action | Compliance and Safety Standards - Lupin',
      description: 'Learn how Lupin ensures patient safety through quality systems, compliance frameworks and continuous improvement across global operations.',
    }
  );
}

export default function QualityInActionPage() {
  // Banner data for InnerBanner – desktop and mobile use quality banner
  const bannerData = {
    title: {
      line1: "Quality",
      line2: "in Action",
    },
    subheading: {
      enabled: false,
      text: "",
    },
    images: {
      banner: {
        url: "/assets/images/quality/banner.png",
        alt: "Quality in Action - Scientist in lab with Lupin branding",
      },
      bannerMobile: {
        url: "/assets/images/quality/mobile-banner.png",
        alt: "Quality in Action - Scientist in lab with Lupin branding",
      },
      petal: {
        url: "/assets/images/quality/petals.svg",
        alt: "Decorative petals",
      },
    },
  };

  return (
    <div className="quality-in-action-page" style={{ position: "relative" }}>
      <InnerBanner data={bannerData} />
      <QualityInActionContent />
    </div>
  );
}
