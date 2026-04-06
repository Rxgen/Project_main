import InnerBanner from '@/components/InnerBanner';
import PatientSupportProgramsSection from '@/components/PatientSupportProgramsSection';
import PatientSupportProgramsCard from '@/components/PatientSupportProgramsCard';
import PatientSupportProgramsLookingAhead from '@/components/PatientSupportProgramsLookingAhead';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { mapTopBannerData, mapPatientSupportProgramsIntroData, mapPatientSupportProgramsCardsData, mapPatientSupportProgramsLookingAheadData, fetchAPI } from '@/lib/strapi';

// Generate metadata for the Patient Support Programs page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'patient-support-programs',
    'https://www.lupin.com/our-business/india/patient-support-programs'
  );
}

export const dynamic = 'force-dynamic';

export default async function PatientSupportProgramsPage() {
  // Fetch data from Strapi with specific populate query (single API call)
  const populateQuery = 'populate[hero][populate]=*&populate[intro][populate][image][populate]=*&populate[lookingAhead][populate]=*&populate[card][populate][logo][populate]=*&populate[card][populate][image][populate]=*';

  let strapiData = null;
  let bannerData = null;
  let sectionData = null;
  let programsData = null;
  let lookingAheadData = null;

  try {
    strapiData = await fetchAPI(`patient-support-programs?${populateQuery}`, {
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

    // Map intro section data
    sectionData = mapPatientSupportProgramsIntroData(strapiData);

    // Map cards data
    const cardsData = mapPatientSupportProgramsCardsData(strapiData);
    programsData = cardsData?.cards || [];

    // Map looking ahead data
    lookingAheadData = mapPatientSupportProgramsLookingAheadData(strapiData);
  } catch (error) {
    console.error('Error fetching patient-support-programs data from Strapi:', error);
  }

  // Default banner data if Strapi data is not available
  if (!bannerData) {
    bannerData = {
      title: {
        line1: "Patient Support",
        line2: "Programs",
      },
      subHeading: {
        enabled: true,
        text: ""
      },
      images: {
        banner: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "Patient Support Programs - Lupin"
        },
        bannerMobile: {
          url: "/assets/inner-banner/freepik-enhance-42835.jpg",
          alt: "Patient Support Programs - Lupin"
        },
        petal: {
          url: "/assets/inner-banner/petal-2.svg",
          alt: "Decorative petal"
        }
      }
    };
  }

  // Default section data if Strapi data is not available
  if (!sectionData) {
    sectionData = {
      content: [
        "At Lupin, our commitment to patients goes beyond words, it defines who we are and what we stand for. Our Patient Support Programs (PSPs) reflect our purpose-driven approach by enabling awareness, early diagnosis, treatment adherence, and long-term disease management for healthcare across chronic, acute, and preventive needs in India. Our PSPs encompass the use of technology, AI, and a personal connection to ensure reach and impactful care.",
        "Here are our Patient Support Programs:"
      ],
      image: {
        url: "/assets/images/patient-support-programs/top.png",
        alt: "Patient Support Programs - Healthcare Professional and Patient"
      },
      backgroundSvg: {
        url: "/assets/images/patient-support-programs/lefpetals.svg",
        alt: "Decorative petals"
      }
    };
  }

  // Default programs data if Strapi data is not available
  if (!programsData || programsData.length === 0) {
    programsData = [
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "HuMrahi Logo"
        },
        content: "HuMrahi is Lupin's patient support program for diabetes and cardiac care, supporting 100,000+ patients in FY25. The program offers personalized counseling, health monitoring tools, free medicines and tests, and access in 12 Indian languages. Through 10,000+ health camps, HuMrahi has screened over 75,000 individuals, advancing chronic disease care across India.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "Human Heart Hologram with Hand and Cardiogram Line"
        }
      },
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "SAARTHI Logo"
        },
        content: "SAARTHI is a mental health support platform designed for healthcare professionals and patients. Through its 'Say Yes to Life' campaign, patients receive consistent care. The platform uses multi-lingual tools to strengthen patient–doctor dialogue, and manage conditions such as stress, anxiety, and depression. SAARTHI supports improved treatment outcomes and enhances mental well-being nationwide.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "SAARTHI Program"
        }
      },
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "JAI Logo"
        },
        content: "JAI (Joint Airways Initiative) is India's first digital asthma education platform, guiding patients on the correct use of inhalers and on disease management. Addressing India's high asthma burden, JAI plays a vital role in improving respiratory health outcomes. To date, 30,000+ patients have been enrolled under this program.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "JAI Program"
        }
      },
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "Breast Cancer Screening Logo"
        },
        content: "Lupin's breast cancer screening initiative, in partnership with Niramai, uses AI-based ThermalytixTM technology for early, non-invasive detection. With higher accuracy than manual thermography, the program conducted 65 screening camps in FY25, reaching 2,500 women. This internationally certified initiative strengthens access to early oncology diagnostics, saving lives and battling cancer.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "Breast Cancer Screening Program"
        }
      },
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "NovaShakti Logo"
        },
        content: "NovaShakti focuses on empowering women against heart diseases through awareness, early diagnosis, and access to care. The program has reached 25,000+ patients, engaged 6,000+ healthcare professionals, and screened over 2,000 women. With a vivid campaign featuring popular female boxer Mary Kom and through active digital engagement, NovaShakti builds a strong community focused on women's heart health.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "NovaShakti Program"
        }
      },
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "Prothsahan Logo"
        },
        content: "Prothsahan is Lupin's flagship breast cancer awareness program, promoting early detection and community education. Partnering with renowned women from various fields, the program has engaged communities through expert-led Facebook live sessions over three years. Prothsahan highlights survivor stories and treatment insights to encourage timely intervention and better outcomes.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "Prothsahan Program"
        }
      },
      {
        logo: {
          url: "/assets/images/patient-support-programs/logo1.png",
          alt: "LivAlert Logo"
        },
        content: "Launched in 2021, LivAlert focuses on liver health awareness and early detection in India, where liver-related disorders affect a significant population. The Screen–Detect–Treat initiative has tested 130,000+ patients and engaged 1,200 healthcare professionals through 11,000+ camps.",
        image: {
          url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
          alt: "LivAlert Program"
        }
      }
    ];
  }

  // Default looking ahead data if Strapi data is not available
  if (!lookingAheadData) {
    lookingAheadData = {
      heading: "Looking Ahead",
      content: "Through our Patient Support Programs, we aim to continue empowering patients and strengthening healthcare access at the grassroots level in India. We are committed to improving outcomes through efficient diagnosis and intervention, driven by our steadfast innovation, collaboration, and compassion."
    };
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <PatientSupportProgramsSection data={sectionData} />
      {programsData.map((program, index) => (
        <PatientSupportProgramsCard
          key={index}
          data={program}
          isEven={(index + 1) % 2 === 0}
        />
      ))}
      <PatientSupportProgramsLookingAhead data={lookingAheadData} />
    </div>
  );
}

