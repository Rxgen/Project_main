import { getStrapiMedia } from "./strapi";
import { normalizeUploadUrl } from "./strapi-utils";

function mediaToSrc(media) {
  const url = getStrapiMedia(media);
  return url ? normalizeUploadUrl(url) : null;
}

function splitBlocks(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function pickTherapySection(sections, componentUid) {
  if (!Array.isArray(sections)) return null;
  return sections.find((s) => s.__component === componentUid) || null;
}

/** Decorative full-page line art (media upload on therapy entry). */
export function mapTherapySvgLine(svgLine) {
  if (!svgLine) return null;
  const src = mediaToSrc(svgLine);
  if (!src) return null;
  return {
    src,
    width: svgLine.width ?? 1875,
    height: svgLine.height ?? 8200,
    alt: svgLine.alternativeText || "",
  };
}

export function mapTherapyIntro(section) {
  if (!section) return null;
  const petalSrc =
    mediaToSrc(section.background) ||
    "/assets/images/india/therapies/shapes/bottom-hero-flower.png";
  const sideImage =
    mediaToSrc(section.image) ||
    "/assets/images/india/therapies/high-angle-diabetic-woman-checking-her-glucose-level 1.png";
  const paragraphs = splitBlocks(section.content);
  const body =
    paragraphs.length > 0 ? paragraphs : section.content ? [section.content.trim()] : [];
  if (body.length === 0) return null;
  return { petalSrc, sideImage, paragraphs: body };
}

export function mapTherapyApproach(section) {
  if (!section) return null;
  const highlights = (section.highlights || []).map((h) => ({
    src:
      mediaToSrc(h.icon) ||
      "/assets/images/india/therapies/shapes/ranking.png",
    alt: h.icon?.alternativeText || h.icon?.name || "",
    text: h.content || "",
  }));
  const descriptionParagraphs = splitBlocks(section.description);
  const mainRaw =
    typeof section.mainContent === "string"
      ? section.mainContent
      : section.mainContent != null
        ? String(section.mainContent)
        : "";
  const middleParagraphs = splitBlocks(mainRaw);
  const hasBody =
    (section.heading && section.heading.trim()) ||
    descriptionParagraphs.length > 0 ||
    middleParagraphs.length > 0 ||
    highlights.length > 0;
  if (!hasBody) return null;
  return {
    heading: section.heading || "",
    descriptionParagraphs,
    subHeading: section.subHeading || "",
    middleParagraphs,
    highlights,
    bottomParagraphs: splitBlocks(section.bottomContent),
  };
}

export function mapTherapyCategories(section) {
  if (!section) return null;
  const cards = (section.card || []).map((c, i) => ({
    id: c.id ?? i,
    title: c.heading || "",
    description: c.description || "",
    iconUrl:
      mediaToSrc(c.icon) ||
      "/assets/images/india/therapies/shapes/category-1-machine.svg",
  }));
  if (!cards.length) return null;
  return {
    heading: section.heading || "",
    description: section.description || "",
    cards,
  };
}

export function mapTherapyPortfolio(section) {
  if (!section) return null;
  const tabs = (section.tabs || []).map((tab, i) => ({
    id: tab.id ?? i,
    tabName: tab.tabName || `Tab ${i + 1}`,
    items: (tab.list || []).map((item, j) => ({
      id: item.id ?? j,
      heading: item.heading || "",
      description: item.description || "",
      highlights: [],
    })),
  }));
  const hasItems = tabs.some((t) => t.items.length > 0);
  if (!hasItems && !section.heading && !section.description) return null;
  return {
    heading: section.heading || "",
    descriptionParagraphs: splitBlocks(section.description),
    subHeading: section.subHeading || "",
    bottomMarkdown: section.bottomContent || "",
    tabs,
  };
}

export function mapTherapyMilestones(section) {
  if (!section) return null;
  const cards = (section.milestone || []).map((m) => ({
    header: m.heading || "",
    items: (m.list || [])
      .map((li) => li.content || "")
      .filter(Boolean),
    link: m.link?.href
      ? { label: m.link.text || "Learn more", href: m.link.href }
      : null,
  }));
  if (!cards.length) return null;
  return {
    heading: section.heading || "",
    introParagraphs: splitBlocks(section.description),
    bottomMarkdown: section.bottomContent || "",
    cards,
  };
}

export function mapTherapyTestimonials(section) {
  if (!section) return null;
  const items = (section.testimonial || []).map((t, i) => {
    const parts = splitBlocks(t.quote);
    return {
      id: t.id ?? i,
      text1: parts[0] || (t.quote || "").trim(),
      text2: parts.slice(1).join("\n\n"),
      name: t.name || "",
      address: t.designation || "",
    };
  });
  if (!items.length) return null;
  return {
    heading: section.heading || "",
    introParagraphs: splitBlocks(section.description),
    items,
  };
}

export function mapTherapyResourceHub(section) {
  if (!section) return null;
  return {
    heading: section.heading || "",
    description: section.description || "",
    posterSrc:
      mediaToSrc(section.poster) ||
      "/assets/images/india/therapies/resourcehub-banner.png",
    videoSrc: section.video
      ? normalizeUploadUrl(getStrapiMedia(section.video))
      : null,
  };
}

export function mapTherapyWayForward(section) {
  if (!section) return null;
  const images = section.image;
  const first = Array.isArray(images) ? images[0] : images;
  const paragraphs = splitBlocks(section.content);
  const raw = section.content?.trim() || "";
  const body =
    paragraphs.length > 0 ? paragraphs : raw ? [raw] : [];
  const heading = (section.heading || "").trim();
  if (!heading && body.length === 0) return null;
  return {
    heading: heading || "Way Forward",
    paragraphs: body,
    imageSrc:
      mediaToSrc(first) || "/assets/images/india/therapies/person-doing-yoga.png",
    imageAlt:
      first?.alternativeText || first?.name || "Therapy illustration",
  };
}
