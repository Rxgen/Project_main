import SebiRegulationsClient from "./SebiRegulationsClient";
import { generateSEOMetadataFromStrapi } from "@/lib/seo-utils";
import { isPhase2Enabled } from "@/lib/phase2";
import { notFound } from "next/navigation";
import {
  getInvestorRegulationDisclosure,
  mapInvestorRegulationDisclosureData,
} from "@/lib/strapi-reports";
import { mapTopBannerData } from "@/lib/strapi";

export const dynamic = "force-dynamic";

const CANONICAL = "https://www.lupin.com/investors/sebi-regulations";

export async function generateMetadata() {
  if (!isPhase2Enabled()) notFound();
  return await generateSEOMetadataFromStrapi(
    "investor-regulation-disclosure",
    CANONICAL,
    {
      title:
        "Disclosure under Regulation 46 of SEBI Regulations, 2015 | Lupin",
      description:
        "Disclosures under Regulation 46 of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.",
    }
  );
}

export default async function SebiRegulationsPage() {
  let regulationsData = null;
  let bannerData = null;
  let error = null;

  try {
    const rawData = await getInvestorRegulationDisclosure();

    if (rawData) {
      regulationsData = mapInvestorRegulationDisclosureData(rawData);
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
    } else {
      error = "No data received from Strapi API";
    }
  } catch (err) {
    error =
      err.message ||
      "Failed to fetch investor regulation disclosure data from Strapi";
    console.error("SEBI regulations page — Strapi error:", err);
  }

  return (
    <SebiRegulationsClient
      bannerData={bannerData}
      regulationsData={regulationsData}
      error={error}
    />
  );
}
