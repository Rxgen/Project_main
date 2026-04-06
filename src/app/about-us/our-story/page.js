import InnerBanner from '@/components/InnerBanner';
import OurStorySvgOverlay from '@/components/OurStorySvgOverlay';
import HeroGradientSection from '@/components/HeroGradientSection';
import OurStoryAlternatingSection from '@/components/OurStoryAlternatingSection';
import OurStoryDidYouKnow from '@/components/OurStoryDidYouKnow';
import OurStorySection from '@/components/OurStorySection';
import AwardsAndRecognitionSection from '@/components/AwardsAndRecognitionSection';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import '@/scss/pages/our-story.scss';

// Generate metadata for the our-story page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'our-story',
    'https://www.lupin.com/about-us/our-story'
  );
}

export default function OurStoryPage() {
  // Default banner data
  const bannerData = {
    title: {
      line1: "The Lupin Story",
    },
    subheading: {
      enabled: true,
      text: "Five Decades of Transforming Healthcare"
    },
    images: {
      banner: {
        url: "/assets/images/our-story/desktopbanner.webp",
        alt: "Our Story - Lupin"
      },
      bannerMobile: {
        url: "/assets/images/our-story/mobile.webp",
        alt: "Our Story - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Sections data array
  const sections = [
    {
      image: "/assets/images/our-story/1.png",
      text: <>After completing his post-graduate studies in science, Dr. Gupta chose a path that went beyond academia. While teaching at the Birla Institute of Technology and Science in Pilani, Rajasthan, he recognized the urgent need to translate scientific knowledge into practical solutions for public health. </>,
      imageAlt: "Dr. Gupta and team at early Lupin facility"
    },
    {
      image: "/assets/images/our-story/2.png",
      text: "From its very inception, Lupin was envisioned as a company that would place community health at its core. Lupin started operations as a manufacturer of vitamins and soon started producing drugs to combat tuberculosis.",
      imageAlt: "Lupin early operations and community health focus"
    },
    {
      image: "/assets/images/our-story/3.png",
      text: "Lupin’s first manufacturing facility focused on producing iron and folic acid tablets for the Indian Government’s flagship maternal and child health program. These early efforts laid the foundation for what Lupin continues to stand for today: Science-led innovation guided by compassion, purpose, and commitment to improving lives.",
      imageAlt: "Lupin's first manufacturing facility"
    },
    {
      image: "/assets/images/our-story/4.png",
      quoteText: "I have the conviction that only by doing selfless service to the needy and the poorest of the poor, one can achieve a true sense of satisfaction and happiness; the highest purpose of life.",
      quoteAuthor: "Dr. Desh Bandhu Gupta",
      text: "Guided by this belief, Lupin’s commitment to social responsibility took an institutional form with the establishment of the Lupin Foundation. Lupin Human Welfare and Research Foundation is dedicated to rural development and community well-being, translating our founder’s philosophy of selfless service into a sustained movement.",
      imageAlt: "Lupin Foundation and community development"
    }
  ];

  return (
    <>
      <InnerBanner data={bannerData} />
      <OurStorySvgOverlay />
      <HeroGradientSection />
      {sections.map((section, index) => (
        <OurStoryAlternatingSection
          key={index}
          {...section}
          isEven={index % 2 === 1}
          isLast={index === sections.length - 1}
        />
      ))}
      <OurStoryDidYouKnow />
      <OurStorySection />
      <AwardsAndRecognitionSection />

    </>
  );
}

