import InnerBanner from '@/components/InnerBanner';
import ListItem from '@/components/business/listItem';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { fetchAPI, mapTopBannerData, getStrapiMedia } from '@/lib/strapi';
import '@/scss/pages/our-business.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Our Business page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-business',
    'https://www.lupin.com/our-business'
  );
}

/**
 * Map title to URL slug
 * @param {string} title - Title to convert to slug
 * @returns {string} URL slug
 */
function titleToSlug(title) {
  const slugMap = {
    'Global Generics': '/our-business/global-generics',
    'Branded Emerging Markets': '/our-business/emerging-markets',
    'India': '/our-business/india',
    'Specialty And Innovation': '/our-business/specialty',
    'Specialty and Innovation': '/our-business/specialty',
    'Biosimilars': '/our-business/biosimilars',
    'Our Adjacencies': '/our-business/our-adjacencies',
    'Patient Centric Initiatives': '/our-business/our-adjacencies',
  };

  return slugMap[title] || '#';
}

/**
 * Map Offering array from Strapi to businessItems format
 * @param {Array} offerings - Array of Offering items from Strapi
 * @returns {Array} Mapped business items
 */
function mapOfferingsToBusinessItems(offerings) {
  if (!offerings || !Array.isArray(offerings)) {
    return [];
  }

  return offerings.map((offering) => {
    const imageUrl = offering.image ? getStrapiMedia(offering.image) : null;

    return {
      id: offering.id,
      title: offering.title || '',
      description: offering.description || '',
      image: {
        url: imageUrl || '/assets/our-business/Image.png',
        alt: offering.image?.alternativeText || offering.image?.caption || offering.title || 'Business offering'
      },
      link: offering.link || titleToSlug(offering.title),
      isActive: false
    };
  });
}

export default async function OurBusinessPage() {
  // Fetch data from Strapi
  let strapiData = null;
  let bannerData = null;
  let businessItems = [];

  try {
    const populateQuery = 'populate[hero][populate]=*&populate[Offering][populate]=*';
    strapiData = await fetchAPI(`our-business?${populateQuery}`, {
      cache: 'no-store',
    });

    // Extract data from response
    const data = strapiData?.data || strapiData;

    // Map hero data for InnerBanner
    if (data?.hero) {
      bannerData = mapTopBannerData(data.hero);
    }

    // Map Offering array to businessItems
    if (data?.Offering) {
      businessItems = mapOfferingsToBusinessItems(data.Offering);
    }
  } catch (error) {
    console.error('Error fetching our-business data from Strapi:', error);
  }

  // Fallback banner data if Strapi data is not available
  if (!bannerData) {
    bannerData = {
      title: {
        line1: "Our Business",
      },
      subHeading: {
        enabled: true,
        text: "Delivering Sustainable Healthcare Across Global Markets"
      },
      images: {
        banner: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "Our Business - Global Healthcare"
        },
        petal: {
          url: "/assets/inner-banner/petal-2.svg",
          alt: "Decorative petal"
        }
      }
    };
  }

  // Fallback business items if Strapi data is not available
  if (businessItems.length === 0) {
    businessItems = [
      {
        id: 1,
        title: "Global Generics",
        description: "Lupin continues to be the 3rd largest generic pharmaceutical company by prescription volume in the US, reflecting our scale and market leadership.",
        image: {
          url: "/assets/our-business/Image.png",
          alt: "Global Generics"
        },
        link: "/our-business/global-generics",
        isActive: false
      },
      {
        id: 2,
        title: "Branded Emerging Markets",
        description: "Lupin's purpose finds strong expression in the work it does across emerging markets. From being among the top generic companies in South Africa to ranking #3 in ophthalmology in Mexico.",
        image: {
          url: "/assets/our-business/Image.png",
          alt: "Branded Emerging Markets"
        },
        link: "/our-business/branded-emerging-markets",
        isActive: false
      },
      {
        id: 3,
        title: "India",
        description: "Lupin's home market in India is a cornerstone of our global business, with a diversified portfolio across major therapy areas, including anti-TB, anti-diabetes, respiratory, and cardiology, among others.",
        image: {
          url: "/assets/our-business/Image.png",
          alt: "India"
        },
        link: "/our-business/india",
        isActive: false
      },
      {
        id: 4,
        title: "Specialty and Innovation",
        description: "Lupin's specialty business is anchored in science-led innovations across complex platforms, including a range of inhalation and injectable technologies.",
        image: {
          url: "/assets/our-business/Image.png",
          alt: "Specialty and Innovation"
        },
        link: "/our-business/specialty",
        isActive: false
      },
      {
        id: 5,
        title: "Biosimilars",
        description: "Lupin's biosimilars business is focused on making complex biologics more accessible and affordable through science and quality-led manufacturing.",
        image: {
          url: "/assets/our-business/Image.png",
          alt: "Biosimilars"
        },
        link: "/our-business/biosimilars",
        isActive: false
      },
      {
        id: 6,
        title: "Patient Centric Initiatives",
        description: "Lupin's patient-centric initiatives and businesses are designed to offer holistic healthcare support that goes beyond medication.",
        image: {
          url: "/assets/our-business/Image.png",
          alt: "Patient Centric Initiatives"
        },
        link: "/our-business/our-adjacencies",
        isActive: false
      },
    ];
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <section className="our-business-list">
        <div className="our-business-list__container">
          <div className="our-business-list__grid">
            {businessItems.map((item) => (
              <ListItem
                key={item.id}
                id={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                link={item.link}
                isActive={item.isActive}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

