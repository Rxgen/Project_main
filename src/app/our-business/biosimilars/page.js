import InnerBanner from '@/components/InnerBanner';
import BiosimilarsIntro from '@/components/biosimilars/BiosimilarsIntro';
import BiosimilarsContent from '@/components/biosimilars/BiosimilarsContent';
import BiosimilarsWhatAre from '@/components/biosimilars/BiosimilarsWhatAre';
import BiosimilarsMarketTrends from '@/components/biosimilars/BiosimilarsMarketTrends';
import BiosimilarsTherapyAreas from '@/components/biosimilars/BiosimilarsTherapyAreas';
import BiosimilarsFocus from '@/components/biosimilars/BiosimilarsFocus';
import BiosimilarsCapabilities from '@/components/biosimilars/BiosimilarsCapabilities';
import BiosimilarsProducts from '@/components/biosimilars/BiosimilarsProducts';
import BiosimilarsGlobalMarket from '@/components/biosimilars/BiosimilarsGlobalMarket';
import BiosimilarsLookingAhead from '@/components/biosimilars/BiosimilarsLookingAhead';
import BiosimilarsIntegrated from '@/components/biosimilars/BiosimilarsIntegrated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import '@/scss/pages/biosimilars.scss';

// Generate metadata for the Biosimilars page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'biosimilar',
    'https://www.lupin.com/our-business/biosimilars'
  );
}

export default function BiosimilarsPage() {
  const bannerData = {
    title: {
      line1: "Biosimilars",
      line2: "",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/biosimilars.png",
        alt: "Biosimilars - Lupin"
      },
      bannerMobile: {
        url: "/assets/inner-banner/biosimilars-mobile.png",
        alt: "Biosimilars - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Biosimilars intro data
  const biosimilarsIntroData = {
    heading: "Advancing Access to High-Quality Medication Worldwide",
    paragraphs: [
      "Our biosimilars business is a fundamental building block of the global healthcare vision we carry. It combines deep scientific excellence, cutting-edge technology, high-end manufacturing and vast regulatory expertise to improve access to affordable yet advanced, research-driven therapies.",
      "Established in 2008 in Pune, India, Lupin Biotech is our dedicated research center and state-of-the-art manufacturing facility to develop biosimilars. From development, including cell line, process, assays, to clinical testing, regulatory submissions and commercial manufacturing, the center continues to expand its biosimilar capabilities for global markets."
    ]
  };

  // Biosimilars What Are data
  const biosimilarsWhatAreData = {
    heading: "Understanding Biosimilars",
    paragraphs: [
      "Biosimilars are biologic medicines that are highly similar to an already approved reference biologic in terms of their quality, efficacy and safety. Unlike other small-molecule drugs made through chemical synthesis, biosimilars are manufactured using living systems, making their development scientifically complex and highly regulated."
    ],
    image: {
      url: "/assets/images/biosimilars/young-woman-using-phone-while-sitting-table 2.png",
      alt: "Biosimilars research"
    }
  };

  // Biosimilars Market Trends data
  const researchAndMarketsUrl = "https://www.globenewswire.com/news-release/2025/07/24/3120835/28124/en/Biosimilars-Markets-Global-Forecast-Report-2025-2035-Launch-of-Glp-1-Biosimilars-Increasing-Strategic-Partnerships-and-Collaborations-Growing-Focus-on-Advanced-R-D-Fueling-Opportun.html";
  const biosimilarsMarketTrendsData = {
    heading: "Global Market Trends",
    paragraphs: [
      <>
        {" "}
        <a href={researchAndMarketsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
        As per a study published by Research and Markets
        </a>
        , the global biosimilars market is expected to surge to USD 72.29 billion by 2035. There is significant potential for growth in the biosimilars market, particularly in oncology, immunology, and ophthalmology. Consistent with these global trends, Lupin's biosimilars operations are expanding across comparable therapeutic domains, through a vast and evolving portfolio.
      </>
    ],
    image: {
      url: "/assets/images/biosimilars/man-holds-globe-with-world-his-hands 1.png",
      alt: "Global biosimilars market"
    }
  };

  // Biosimilars Therapy Areas data
  const biosimilarsTherapyAreasData = {
    heading: "Focused Therapy Areas",
    paragraphs: [
      "Our biosimilars portfolio spans multiple disease areas where biologics play a critical role in patient care, including:"
    ],
    therapyAreas: [
      "Immunology and Inflammatory Diseases",
      "Oncology and Supportive Care",
      "Ophthalmology",
      "Respiratory"
    ],
    image: {
      url: "/assets/images/biosimilars/middleaged-male-doctor-with-clipboard-wearing-white-lab-coat-microscopic-cells-background 1.png",
      alt: "Biosimilars therapy areas"
    }
  };

  // Biosimilars Focus data
  const biosimilarsFocusData = {
    heading: "Our Strategic Priorities",
    paragraphs: [
      "In recent years, Lupin has strengthened its biosimilars presence through technology-based differentiation, strategic launches, regulatory filings, and commercial partnerships, supported by a resilient supply chain and scalable manufacturing infrastructure. Looking ahead, our biosimilars strategy is guided by three priorities."
    ],
    priorities: [
      "Expanding access to vital biologic therapies.",
      "Increasing relevance across global markets.",
      "Excellence in scientific innovation and operational tactics."
    ],
    image: {
      url: "/assets/images/biosimilars/female-doctors-checking-results-digital-tablet 1.png",
      alt: "Biosimilars focus"
    },
    manufacturingText: "The manufacturing platform at Biotech is designed to support global operations through"
  };

  // Biosimilars Capabilities data
  const biosimilarsCapabilitiesData = {
    capabilities: [
      {
        title: "Extensive Research and Development",
        description: "Cell line development, upstream and downstream process development, analytical characterization, formulation and device development, and regulatory science",
        icon: "/assets/images/biosimilars/icon1.svg"
      },
      {
        title: "State-of-the-art Manufacturing",
        description: "cGMP-compliant microbial and mammalian manufacturing facilities for clinical and commercial supply",
        icon: "/assets/images/biosimilars/state.png"
      },
      {
        title: "Clinical and Regulatory Expertise",
        description: "Across pre-clinical, clinical, and regulatory pathways aligned with leading global agencies",
        icon: "/assets/images/biosimilars/clinical.png"
      },
      {
        title: "Quality and Compliance",
        description: "Robust systems and processes aligned with stringent international standards",
        icon: "/assets/images/biosimilars/quality.png"
      }
    ]
  };

  // Biosimilars Products data
  const biosimilarsProductsData = {
    heading: "Some of our key approved biosimilar products include:",
    products: [
      {
        title: "Etanercept",
        description: "Our flagship biosimilar is used in treating chronic immune-related inflammatory diseases such as rheumatoid arthritis, psoriatic arthritis, axial spondyloarthritis, and plaque psoriasis.",
        icon: "/assets/images/biosimilars/icon2.svg"
      },
      {
        title: "Pegfilgrastim",
        description: "It is used in oncology supportive care to help manage chemotherapy-induced neutropenia.",
        icon: "/assets/images/biosimilars/peg.png"
      },
      {
        title: "Ranibizumab",
        description: "Our biosimilar developed for ophthalmic indications, reinforces Lupin's presence in complex therapies for retinal disorders.",
        icon: "/assets/images/biosimilars/rani.png"
      }
    ]
  };

  // Biosimilars Global Market data
  const biosimilarsGlobalMarketData = {
    heading: "Our Global Market Focus",
    paragraphs: [
      "Lupin's biosimilars range is designed with a global outlook in mind, from inception to reaching the very end of the supply chain. Lupin has introduced biosimilars in more than 30 countries (United States, Europe, Japan, Canada, Australia, India, emerging markets such as Latin America, Asia Pacific, the Middle East, North Africa, CIS and Russia) and is continually expanding into newer geographies, breaking barriers to access and strengthening its global footprint. Its global reach is driven by a hybrid commercial model: with direct presence in key regions and strategic partnerships elsewhere."
    ],
    image: {
      url: "/assets/images/biosimilars/global-healthcare-earth-stethoscope-white-isolated-background-3d 2.png",
      alt: "Global market focus"
    }
  };

  // Biosimilars Looking Ahead data
  const biosimilarsLookingAheadData = {
    heading: "Way Forward",
    paragraphs: [
      "Lupin remains committed to expanding its biosimilars portfolio and capabilities by fostering a culture of scientific excellence, collaboration and continuous improvement. We will keep focusing on unmet medical needs through advances in research on biosimilars, ensuring that complex therapies become more affordable and accessible for all."
    ],
    image: {
      url: "/assets/images/biosimilars/medium-shot-doctors-working-together 1.png",
      alt: "Looking ahead"
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <BiosimilarsIntro data={biosimilarsIntroData} />
      <BiosimilarsContent>
        <BiosimilarsWhatAre data={biosimilarsWhatAreData} />
      </BiosimilarsContent>
      <BiosimilarsMarketTrends data={biosimilarsMarketTrendsData} />
      <BiosimilarsContent>
        <BiosimilarsFocus data={biosimilarsFocusData} />
      </BiosimilarsContent>
  
      <BiosimilarsContent>
        <BiosimilarsCapabilities data={biosimilarsCapabilitiesData} />
      </BiosimilarsContent>
      <BiosimilarsIntegrated />

      <BiosimilarsTherapyAreas data={biosimilarsTherapyAreasData} />
      <BiosimilarsProducts data={biosimilarsProductsData} />
      <BiosimilarsContent>
        <BiosimilarsGlobalMarket data={biosimilarsGlobalMarketData} />
      </BiosimilarsContent>
      <BiosimilarsLookingAhead data={biosimilarsLookingAheadData} />
    </div>
  );
}
