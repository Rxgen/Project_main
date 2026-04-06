import PoliciesClient from "./PoliciesClient";
import { generateSEOMetadataFromStrapi } from "@/lib/seo-utils";
import { isPhase2Enabled } from "@/lib/phase2";
import { getPolicy, mapPolicyData } from "@/lib/strapi-reports";
import { mapTopBannerData } from "@/lib/strapi";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CANONICAL =
  "https://www.lupin.com/investors/corporate-governance/policies";

export async function generateMetadata() {
  if (!isPhase2Enabled()) notFound();
  return await generateSEOMetadataFromStrapi("policy", CANONICAL, {
    title: "Policies — Corporate Governance | Lupin",
    description: "Corporate governance policies and related documents from Lupin.",
  });
}

export default async function PoliciesPage() {
  let policies = [];
  let bannerData = null;
  let error = null;

  try {
    const rawData = await getPolicy();

    if (rawData) {
      const mapped = mapPolicyData(rawData);
      policies = mapped?.policies || [];
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
    } else {
      error = "No data received from Strapi API";
    }
  } catch (err) {
    error = err.message || "Failed to fetch policy data from Strapi";
    console.error("Corporate governance policies — Strapi error:", err);
  }

  return (
    <PoliciesClient
      bannerData={bannerData}
      policies={policies}
      error={error}
    />
  );
}
