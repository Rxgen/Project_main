import InnerBanner from '@/components/InnerBanner';
import IndiaOverview from '@/components/IndiaOverview';
import IndiaAtAGlance from '@/components/IndiaAtAGlance';
import IndiaWhatWeDo from '@/components/IndiaWhatWeDo';
import IndiaDigitalInitiatives from '@/components/IndiaDigitalInitiatives';
import IndiaTherapies from '@/components/IndiaTherapies';
import IndiaTherapySection from '@/components/IndiaTherapySection';
import IndiaPatientSupport from '@/components/IndiaPatientSupport';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { mapTopBannerData, mapIndiaOverviewData, mapIndiaAtAGlanceData, mapIndiaWhatWeDoData, mapIndiaDigitalInitiativesData, mapIndiaTherapiesData, mapIndiaTherapySectionData, mapIndiaPatientSupportData, fetchAPI } from '@/lib/strapi';
import '@/scss/pages/india.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the India page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'india',
    'https://www.lupin.com/our-business/india'
  );
}

export default async function IndiaPage() {
  // Fetch data from Strapi with specific populate query (single API call)
  const populateQuery = 'populate[hero][populate]=*&populate[overview][populate]=*&populate[IndiaAtAGlance][populate]=*&populate[WhatWeDo][populate]=*&populate[therapies][populate][therapyTab][populate][image][populate]=*&populate[patientSupportPrograms][populate]=*';

  let strapiData = null;
  let bannerData = null;
  let overviewData = null;
  let glanceData = null;
  let whatWeDoData = null;
  let digitalInitiativesData = null;
  let therapiesData = null;
  let therapySectionData = null;
  let patientSupportData = null;

  try {
    strapiData = await fetchAPI(`india?${populateQuery}`, {
      cache: 'no-store',
    });

    // Extract data from response
    const data = strapiData?.data || strapiData;

    // Map hero data for InnerBanner (new API uses 'hero' instead of 'TopBanner')
    if (data?.hero) {
      bannerData = mapTopBannerData(data.hero);
    } else if (data?.TopBanner) {
      // Fallback to old structure
      bannerData = mapTopBannerData(data.TopBanner);
    }

    // Map all section data
    overviewData = mapIndiaOverviewData(strapiData);
    glanceData = mapIndiaAtAGlanceData(strapiData);
    whatWeDoData = mapIndiaWhatWeDoData(strapiData);
    digitalInitiativesData = mapIndiaDigitalInitiativesData(strapiData);
    therapiesData = mapIndiaTherapiesData(strapiData);
    therapySectionData = mapIndiaTherapySectionData(strapiData);
    patientSupportData = mapIndiaPatientSupportData(strapiData);
  } catch (error) {
    console.error('Error fetching india data from Strapi:', error);
  }

  // Default banner data if Strapi data is not available
  if (!bannerData) {
    bannerData = {
      title: {
        line1: "India"
      },
      subHeading: {
        enabled: false,
        text: ""
      },
      images: {
        banner: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "India - Lupin"
        },
        bannerMobile: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "India - Lupin"
        },
        petal: {
          url: "/assets/inner-banner/petal-2.svg",
          alt: "Decorative petal"
        }
      }
    };
  }

  // Default overview data if Strapi data is not available
  if (!overviewData) {
    overviewData = {
      heading: "Overview",
      content: [
        "India is one of the fastest-growing pharma markets globally, with an aging population, an increase in lifestyle diseases, and rising consumer demand for healthcare. At the same time, large gaps in early diagnosis, long-term disease management, and access to affordable quality treatment continue to put pressure on India's healthcare system, intensifying the need for timely and scalable solutions. This urgent need has led businesses to strategize localized innovation and develop holistic care.",
        "Our India Region Formulations (IRF) business is at the forefront of this healthcare revolution and continues to outperform the market, driven by strong performance across our top four therapies, namely, cardiac, respiratory, anti-diabetic, and gastrointestinal, which constitutes 74.5% of our domestic sales."
      ]
    };
  }

  // Default glance data if Strapi data is not available
  if (!glanceData) {
    glanceData = {
      heading: "India at a Glance",
      items: [
        "8th largest company in the Indian Pharmaceutical Market (IPM)",
        "5 Lupin brands ranked in Top 300 IPM brands",
        "#1 in anti-TB, #2 in respiratory segment, #3 in both anti-diabetes and cardiology",
        "5 flagship brands - Gluconorm-G, Budamate, Huminsulin, Ivabrad, and Rablet ranked in the top 300 IPM",
        "19 brands featured in Top 500 IPM",
        "Supported by 250,000 HCPs across India"
      ]
    };
  }

  // Default what we do data if Strapi data is not available
  if (!whatWeDoData) {
    whatWeDoData = {
      heading: "What We Do",
      content: [
        "Lupin's IRF business delivers a strong portfolio of generics with leading therapies across diabetes, cardiology, gastroenterology and more, improving affordability and everyday access to care.",
        "In the biosimilars segment, Etanercept is Lupin's flagship therapy for chronic immune-mediated inflammatory diseases, including rheumatoid arthritis, psoriatic arthritis, axial spondyloarthritis, and plaque psoriasis, addressing significant unmet patient needs. These capabilities are anchored in Lupin Biotech, our dedicated research and state-of-the-art manufacturing platform focused on developing high-quality biosimilars at scale.",
        "Complementing this, Lupin continues to expand its footprint in complex specialty drugs, including inhalation therapies and innovative combinations, strengthening long-term, patient-centric healthcare solutions."
      ]
    };
  }

  // Default digital initiatives data if Strapi data is not available
  if (!digitalInitiativesData) {
    digitalInitiativesData = {
      heading: "Our Digital Initiatives",
      description: [
        "Anya is India's first AI-powered, multilingual health chatbot, offering medically verified answers and a safe space for all users. Accessible 24/7 on WhatsApp, Anya chatbot responds in 20 Indian languages and delivers solutions across 17 therapy areas."
      ],
      link: {
        text: "Visit Askanya website for more information",
        url: "https://www.askanya.in/"
      }
    };
  }

  // Default therapies data if Strapi data is not available
  if (!therapiesData) {
    therapiesData = {
      heading: "Therapies",
      description: "Lupin's India business focuses on key therapy areas, aiming to deliver affordable care with quality, trusted outcomes for people."
    };
  }

  // Default therapy section data if Strapi data is not available
  if (!therapySectionData) {
    therapySectionData = {};
  }

  // Default patient support data if Strapi data is not available
  if (!patientSupportData) {
    patientSupportData = {
      heading: "Patient Support Programs",
      description: "Lupin is committed to extending care beyond prescriptions through patient-centric programs that empower individuals and improve health outcomes. From setting up 10,000+ health camps to battle diabetes and cardiac conditions to India's 1st digital asthma educator platform, our deep patient engagement and purpose-driven innovation are bringing us one step closer to a healthier world.",
      button: {
        text: "Explore our programs",
        url: "#"
      }
    };
  }

  return (
    <div className="page-india" style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <IndiaOverview data={overviewData} />
      <IndiaAtAGlance data={glanceData} />
      <IndiaWhatWeDo data={whatWeDoData} />
      <IndiaDigitalInitiatives data={digitalInitiativesData} />
      <IndiaTherapies data={therapiesData} />
      <IndiaTherapySection data={therapySectionData} />
      <IndiaPatientSupport data={patientSupportData} />
    </div>
  );
}

