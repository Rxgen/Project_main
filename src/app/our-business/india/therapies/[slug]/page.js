import InnerBanner from "@/components/InnerBanner";
import Approach from "@/components/therapies/Approach";
import BottomHero from "@/components/therapies/BottomHero";
import Milestones from "@/components/therapies/Milestones";
import ProductPortfolio from "@/components/therapies/ProductPortfolio";
import ResourceHub from "@/components/therapies/ResourceHub";
import StrategicOutlook from "@/components/therapies/StrategicOutlook";
import Testimonials from "@/components/therapies/Testimonials";
import TherapeuticCategories from "@/components/therapies/TherapeuticCategories";
import {
  mapTherapyApproach,
  mapTherapyCategories,
  mapTherapyIntro,
  mapTherapyMilestones,
  mapTherapyPortfolio,
  mapTherapyResourceHub,
  mapTherapySvgLine,
  mapTherapyTestimonials,
  mapTherapyWayForward,
  pickTherapySection,
} from "@/lib/therapy-strapi-map";
import { fetchStrapi, mapTopBannerData } from "@/lib/strapi";
import "@/scss/pages/therapies.scss";
import Image from "next/image";

export const dynamic = "force-dynamic";

/** Noindex only India therapy detail pages (not the rest of the site). */
export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

const THERAPIES_POPULATE =
  "populate[banner][populate]=*" +
  "&populate[svgLine][populate]=*" +
  "&populate[sections][on][therapies.intro][populate]=*" +
  "&populate[sections][on][therapies.approach][populate][highlights][populate][icon]=true" +
  "&populate[sections][on][therapies.categories][populate][card][populate]=*" +
  "&populate[sections][on][therapies.portfolio][populate][tabs][populate]=*" +
  "&populate[sections][on][therapies.milestones][populate][milestone][populate]=*" +
  "&populate[sections][on][therapies.testimonials][populate][testimonial][populate]=*" +
  "&populate[sections][on][therapies.resource-hub][populate][poster]=true" +
  "&populate[sections][on][therapies.way-forward][populate][image]=true";

export default async function TherapiesSlugPage({ params }) {
  const { slug } = await Promise.resolve(params);

  let bannerData = null;
  let introData = null;
  let approachData = null;
  let categoriesData = null;
  let portfolioData = null;
  let milestonesData = null;
  let testimonialsData = null;
  let resourceHubData = null;
  let wayForwardData = null;
  let lineArt = null;

  try {
    const response = await fetchStrapi(
      `/api/therapies?filters[slug][$eq]=${encodeURIComponent(slug)}&${THERAPIES_POPULATE}`,
      { cache: "no-store" }
    );
    const data = response?.data ?? null;
    const therapy = Array.isArray(data) ? data[0] : null;
    const sections = therapy?.sections ?? [];

    if (therapy?.banner) {
      bannerData = mapTopBannerData(therapy.banner);
    }

    lineArt = mapTherapySvgLine(therapy?.svgLine);

    introData = mapTherapyIntro(
      pickTherapySection(sections, "therapies.intro")
    );
    approachData = mapTherapyApproach(
      pickTherapySection(sections, "therapies.approach")
    );
    categoriesData = mapTherapyCategories(
      pickTherapySection(sections, "therapies.categories")
    );
    portfolioData = mapTherapyPortfolio(
      pickTherapySection(sections, "therapies.portfolio")
    );
    milestonesData = mapTherapyMilestones(
      pickTherapySection(sections, "therapies.milestones")
    );
    testimonialsData = mapTherapyTestimonials(
      pickTherapySection(sections, "therapies.testimonials")
    );
    resourceHubData = mapTherapyResourceHub(
      pickTherapySection(sections, "therapies.resource-hub")
    );
    wayForwardData = mapTherapyWayForward(
      pickTherapySection(sections, "therapies.way-forward")
    );
  } catch (error) {
    console.error("Error fetching therapy page from Strapi:", error);
  }

  if (!bannerData) {
    bannerData = {
      title: {
        line1: slug?.replace(/-/g, " ") || "Therapy",
        line2: "",
      },
      subHeading: {
        enabled: true,
        text: "",
      },
      images: {
        banner: {
          url: "/assets/inner-banner/diabetes-banner.png",
          alt: "Lupin",
        },
        bannerMobile: {
          url: "/assets/inner-banner/diabetes-banner-mobile.png",
          alt: "Lupin",
        },
      },
    };
  }

  const lineSrc =
    lineArt?.src ?? "";
  const lineIsSvg = lineSrc.toLowerCase().includes(".svg");

  return (
    <div className="therapies-page" style={{ position: "relative" }}>
      <div className="therapies-page__line" aria-hidden="true">
        {lineIsSvg ? (
          <Image
            src={lineSrc}
            alt={lineArt?.alt ?? ""}
            width={lineArt?.width ?? 1875}
            height={lineArt?.height ?? 8200}
            quality={100}
            unoptimized={lineIsSvg}
          />
        ) : null}
      </div>
      <InnerBanner data={bannerData} />
      <BottomHero data={introData} />
      <Approach data={approachData} />
      <TherapeuticCategories data={categoriesData} />
      <ProductPortfolio data={portfolioData} />
      <Milestones data={milestonesData} />
      {testimonialsData ? (
        <Testimonials data={testimonialsData} />
      ) : null}
      {/* <ResourceHub data={resourceHubData} /> */}
      <StrategicOutlook data={wayForwardData} />
    </div>
  );
}   