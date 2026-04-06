import CodeOfConductClient from "./CodeOfConductClient";
import { generateSEOMetadataFromStrapi } from "@/lib/seo-utils";
import { isPhase2Enabled } from "@/lib/phase2";
import { notFound } from "next/navigation";
import { getCodeOfConduct, mapCodeOfConductData } from "@/lib/strapi-reports";
import { mapTopBannerData } from "@/lib/strapi";
import { normalizeUploadUrl } from "@/lib/strapi-utils";

export const dynamic = "force-dynamic";

const CANONICAL =
  "https://www.lupin.com/investors/corporate-governance/code-of-conduct";

export async function generateMetadata() {
  if (!isPhase2Enabled()) notFound();
  return await generateSEOMetadataFromStrapi("code-of-conduct", CANONICAL, {
    title: "Code of Conduct — Corporate Governance | Lupin",
    description:
      "Code of conduct and related documents for Lupin corporate governance.",
  });
}

/**
 * Same source as the legacy /investors/code-of-conduct page: Strapi DocumentSection
 * (main PDF + optional LangaugePdfDocument rows). CodeOfConduct.js never rendered
 * CodeOfConductDocumentsSection; that list is unchanged in the API.
 */
function buildCodeOfConductCards(mapped) {
  if (!mapped) return [];

  return (mapped.documentSections || []).map((section) => ({
    id: `ds-${section.id}`,
    title: section.pdfTitle || "",
    downloadHref: normalizeUploadUrl(section.pdfUrl) || "#",
    languages: (section.languagePdfs || []).map((l) => ({
      label: l.title || "",
      href: normalizeUploadUrl(l.pdfUrl) || "#",
    })),
  }));
}

export default async function CodeOfConductPage() {
  let cards = [];
  let bannerData = null;
  let error = null;

  try {
    const rawData = await getCodeOfConduct();

    if (rawData) {
      const codeOfConductData = mapCodeOfConductData(rawData);
      cards = buildCodeOfConductCards(codeOfConductData);
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
    } else {
      error = "No data received from Strapi API";
    }
  } catch (err) {
    error = err.message || "Failed to fetch code of conduct data from Strapi";
    console.error("Corporate governance code of conduct — Strapi error:", err);
  }

  return (
    <CodeOfConductClient
      bannerData={bannerData}
      cards={cards}
      error={error}
    />
  );
}
