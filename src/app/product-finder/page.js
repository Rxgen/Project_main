import InnerBanner from '@/components/InnerBanner';
import ProductFinderSection from '@/components/ProductFinderSection';
import ProductFinderBackgroundSection from '@/components/ProductFinderBackgroundSection';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

// Generate metadata for the Product Finder page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'product-finder',
    'https://www.lupin.com/product-finder'
  );
}

export default function ProductFinderPage() {
  // Banner data for InnerBanner
  const bannerData = {
    title: {
      line1: "Product",
      line2: "Finder",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/product-finder.png",
        alt: "Product Finder"
      },
      bannerMobile: {
        url: "/assets/inner-banner/product-finder-mobile.png",
        alt: "Product Finder"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Section data for ProductFinderSection
  const sectionData = {
    button: {
      text: "View Our API Product List",
      href: "https://www.lupin.com/wp-content/uploads/2021/04/API-List-april-2021.pdf",
      target: "_blank"
    }
  };

  // Background section data (will be updated with Figma design)
  const backgroundSectionData = {
    // Content will be added based on Figma design
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <ProductFinderSection data={sectionData} />
      <ProductFinderBackgroundSection data={backgroundSectionData} />
    </div>
  );
}

