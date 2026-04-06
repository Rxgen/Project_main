/**
 * Logo paths under public/images/adjacencies for allied business headings.
 * Used by AlliedBusinessLightBox and other allied business components.
 */
const ADJACENCY_LOGOS = {
  diagnostics: '/images/adjacencies/lupin-diagnostics.png',
  lupinLife: '/images/adjacencies/lupin Life.png',
  atharvAbility: '/images/adjacencies/atharva.png',
  digitalHealth: '/images/adjacencies/Lupin Digital health.png',
  manufacturing: '/images/adjacencies/lupin manufacturing.png',
};

/**
 * Normalize heading to a string (Strapi may return object e.g. { line1, line2 } or localized).
 * @param {string|object|undefined} heading - Business heading/title
 * @returns {string}
 */
function normalizeHeading(heading) {
  if (typeof heading === 'string' && heading.trim()) return heading.trim();
  if (heading && typeof heading === 'object') {
    const s = heading.title ?? heading.line1 ?? heading.text ?? heading.en ?? heading[0];
    if (typeof s === 'string' && s.trim()) return s.trim();
    if (Array.isArray(heading) && heading[0]) return normalizeHeading(heading[0]);
  }
  return '';
}

/**
 * Resolve logo path for a heading using partial match (so API title variations still work).
 * @param {string|object} heading - Business heading/title (string or Strapi object)
 * @returns {string|null} Logo path, or null if no logo (e.g. Lupin Life Sciences)
 */
export function getLogoForHeading(heading) {
  const str = normalizeHeading(heading);
  if (!str) return ADJACENCY_LOGOS.diagnostics;
  const h = str.toLowerCase();
  if (h.includes('diagnostics')) return ADJACENCY_LOGOS.diagnostics;
  if (h.includes('atharv') || h.includes('ability')) return ADJACENCY_LOGOS.atharvAbility;
  if (h.includes('digital health')) return ADJACENCY_LOGOS.digitalHealth;
  if (h.includes('lupin life sciences')) return null; // text-only, no logo
  if (h.includes('lupinlife') || h.includes('consumer healthcare') || h.includes('life sciences'))
    return ADJACENCY_LOGOS.lupinLife;
  if (h.includes('manufacturing') || h.includes('lms')) return ADJACENCY_LOGOS.manufacturing;
  return ADJACENCY_LOGOS.diagnostics;
}
