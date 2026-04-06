import InnerBanner from '@/components/InnerBanner';
import AlliedBusinessIntro from '@/components/AlliedBusinessIntro';
import AlliedBusinessLupinLife from '@/components/AlliedBusinessLupinLife';
import AlliedBusinessLightBox from '@/components/AlliedBusinessLightBox';
import AlliedBusinessDigitalHealth from '@/components/AlliedBusinessDigitalHealth';
import AlliedBusinessAtharvAbility from '@/components/AlliedBusinessAtharvAbility';
import AlliedBusinessLifeSciences from '@/components/AlliedBusinessLifeSciences';
import AlliedBusinessManufacturingSolutions from '@/components/AlliedBusinessManufacturingSolutions';
import AlliedBusinessLookingAhead from '@/components/AlliedBusinessLookingAhead';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { mapTopBannerData, mapAlliedBusinessIntroData, mapAlliedBusinessLookingAheadData, mapAlliedBusinessItemsData, fetchAPI } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the Allied Business page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'allied-business',
    'https://www.lupin.com/our-business/our-adjacencies'
  );
}

/**
 * Get the appropriate component for a business based on its title
 * @param {string} title - Business title
 * @param {object} data - Business data
 * @returns {JSX.Element|null} Component or null
 */
function getBusinessComponent(title, data) {
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedTitle.includes('lupinlife') || normalizedTitle.includes('consumer healthcare')) {
    return <AlliedBusinessLupinLife data={data} />;
  } else if (normalizedTitle.includes('diagnostics')) {
    return <AlliedBusinessLightBox data={data} />;
  } else if (normalizedTitle.includes('digital health')) {
    return <AlliedBusinessDigitalHealth data={data} />;
  } else if (normalizedTitle.includes('atharv') || normalizedTitle.includes('ability')) {
    return <AlliedBusinessAtharvAbility data={data} />;
  } else if (normalizedTitle.includes('life sciences')) {
    return <AlliedBusinessLifeSciences data={data} />;
  } else if (normalizedTitle.includes('manufacturing solutions') || normalizedTitle.includes('lms')) {
    return <AlliedBusinessManufacturingSolutions data={data} />;
  }

  return null;
}

export default async function AlliedBusinessPage() {
  // Fetch data from Strapi with specific populate query (single API call)
  const populateQuery = 'populate[hero][populate]=*&populate[intro][populate]=*&populate[lookingAhead][populate][image][populate]=*&populate[business][populate][image][populate]=*&populate[business][populate][cta][populate]=*';

  let strapiData = null;
  let bannerData = null;
  let introData = null;
  let lookingAheadData = null;
  let businessItemsData = null;

  try {
    strapiData = await fetchAPI(`allied-business?${populateQuery}`, {
      cache: 'no-store',
    });

    // Extract data from response
    const data = strapiData?.data || strapiData;

    // Map hero data for InnerBanner
    if (data?.hero) {
      bannerData = mapTopBannerData(data.hero);
    } else if (data?.TopBanner) {
      // Fallback to old structure
      bannerData = mapTopBannerData(data.TopBanner);
    }

    // Map intro data
    introData = mapAlliedBusinessIntroData(strapiData);

    // Map looking ahead data
    lookingAheadData = mapAlliedBusinessLookingAheadData(strapiData);

    // Map business items data
    businessItemsData = mapAlliedBusinessItemsData(strapiData);
  } catch (error) {
    console.error('Error fetching allied-business data from Strapi:', error);
  }
  // Default banner data if Strapi data is not available
  if (!bannerData) {
    bannerData = {
      title: {
        line1: "Allied Business",
      },
      subHeading: {
        enabled: true,
        text: "Caring for our Patients Beyond Medicines "
      },
      images: {
        banner: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "Allied Business - Lupin"
        },
        bannerMobile: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "Allied Business - Lupin"
        },
        petal: {
          url: "/assets/inner-banner/petal-2.svg",
          alt: "Decorative petal"
        }
      }
    };
  }

  // Default intro data if Strapi data is not available
  if (!introData) {
    introData = {
      text: "At Lupin, patient centricity is about building meaningful, accessible and holistic healthcare solutions. Through our allied businesses, we are addressing unmet needs across diagnosis, prevention, treatment and rehabilitation. Our specialized arms and focused services reflect our commitment to making healthcare more inclusive, personalized, and impactful. Discover how our allied businesses are transforming care and enhancing lives."
    };
  }

  // Default looking ahead data if Strapi data is not available
  if (!lookingAheadData) {
    lookingAheadData = {
      heading: "Looking Ahead",
      content: [
        "By combining the power of science, technology and empathy, Lupin is continuing to create integrated care models and services that serve as touchpoints across various stages of the patient journey."
      ],
      image: {
        url: "/assets/images/AlliedBusiness/biopharmaceutical-industry-laboratory-with-scientist-handling-vials-modern-research-facility (1) 1.png",
        alt: "Biopharmaceutical Industry Laboratory"
      },
      pointerIcon: {
        url: "/assets/images/AlliedBusiness/Group.svg",
        alt: "Pointer Icon"
      }
    };
  }

  // Default business items data if Strapi data is not available
  if (!businessItemsData || !businessItemsData.businesses || businessItemsData.businesses.length === 0) {
    businessItemsData = {
      businesses: [
        {
          heading: "LupinLife Consumer Healthcare",
          content: [
            "LupinLife is our consumer healthcare arm, focused on delivering science-led, trusted wellness solutions that are aligned with India's evolving healthcare needs."
          ],
          websiteUrl: "https://lupinlife.com/",
          websiteText: "LupinLife",
          image: {
            url: "/assets/images/AlliedBusiness/joyful-family-moments-children-play-parents-laugh-umbrella-protection 1.png",
            alt: "Joyful family moments"
          }
        }
      ]
    };
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <AlliedBusinessIntro data={introData} />

      {/* Dynamically render business components from API */}
      {businessItemsData.businesses.map((business, index) => {
        const businessComponent = getBusinessComponent(business.heading, business);
        return businessComponent ? <div key={index}>{businessComponent}</div> : null;
      })}

      <AlliedBusinessLookingAhead data={lookingAheadData} />
    </div>
  );
}

