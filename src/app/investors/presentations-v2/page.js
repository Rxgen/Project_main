import PresentationsV2Client from "./PresentationsV2Client";
import { generateSEOMetadataFromStrapi } from "@/lib/seo-utils";
import { isPhase2Enabled } from "@/lib/phase2";
import { notFound } from "next/navigation";
import { getNewsAndEvent, mapNewsAndEventData } from "@/lib/strapi-reports";
import { mapTopBannerData } from "@/lib/strapi";

export const dynamic = "force-dynamic";

const CANONICAL = "https://www.lupin.com/investors/presentations-v2";

export async function generateMetadata() {
  if (!isPhase2Enabled()) notFound();
  return await generateSEOMetadataFromStrapi("news-and-event", CANONICAL, {
    title: "Presentations | Lupin",
    description:
      "Investor presentations and related materials from Lupin Pharmaceuticals.",
  });
}

export default async function PresentationsV2Page() {
  let presentations = [];
  let presentationsTitle = "Presentations";
  let bannerData = null;
  let error = null;

  try {
    const rawData = await getNewsAndEvent();

    if (rawData) {
      const mapped = mapNewsAndEventData(rawData);
      const section = mapped?.presentationsSection;
      if (section) {
        presentations = section.presentations || [];
        if (section.title) {
          presentationsTitle = section.title;
        }
      }
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
    } else {
      error = "No data received from Strapi API";
    }
  } catch (err) {
    error = err.message || "Failed to fetch news and event data from Strapi";
    console.error("Presentations v2 — Strapi error:", err);
  }

  return (
    <PresentationsV2Client
      bannerData={bannerData}
      presentations={presentations}
      presentationsTitle={presentationsTitle}
      error={error}
    />
  );
}
