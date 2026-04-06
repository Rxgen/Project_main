/**
 * Pure helpers: Strapi /redirects collection -> Next-style redirect rows.
 */

/**
 * @param {object} json - Strapi REST response { data: [...], meta }
 * @param {{ siteUrl?: string }} opts
 * @returns {Array<{ source: string, destination: string, permanent: boolean }>}
 */
export function strapiRedirectResponseToEntries(json, opts = {}) {
  const siteUrl = (opts.siteUrl || 'https://www.lupin.com').replace(/\/$/, '');
  const data = json.data || [];
  const redirects = [];

  for (const item of data) {
    const entry = item.attributes ?? item;
    const active = entry.isActive ?? item.isActive;
    if (!active) continue;

    const rawSource =
      entry.Source ??
      entry.source ??
      item.Source ??
      item.source ??
      '';
    const rawDest =
      entry.Destination ??
      entry.destination ??
      item.Destination ??
      item.destination ??
      '';
    if (!rawSource || !rawDest) continue;

    const source = rawSource.startsWith('/') ? rawSource : `/${rawSource}`;

    let destination;
    if (rawDest.startsWith('http://') || rawDest.startsWith('https://')) {
      destination = rawDest;
    } else {
      const normalizedDest = rawDest.startsWith('/') ? rawDest : `/${rawDest}`;
      const hasSpecialChars =
        normalizedDest.includes('%') ||
        normalizedDest.includes('(') ||
        normalizedDest.includes(')');
      destination = hasSpecialChars
        ? `${siteUrl}${normalizedDest}`
        : normalizedDest;
    }

    const redirectType = (
      entry.redirectType ??
      item.redirectType ??
      ''
    ).toLowerCase();
    const permanent = redirectType === 'permanent-301';

    redirects.push({ source, destination, permanent });

    if (source.endsWith('/') && source !== '/') {
      redirects.push({
        source: source.slice(0, -1),
        destination,
        permanent,
      });
    } else if (source !== '/') {
      redirects.push({
        source: source + '/',
        destination,
        permanent,
      });
    }
  }

  return redirects;
}

/**
 * @param {Array<{ source: string, destination: string, permanent: boolean }>} entries
 * @returns {Map<string, { destination: string, permanent: boolean }>}
 */
export function redirectEntriesToLookupMap(entries) {
  const map = new Map();
  for (const row of entries) {
    map.set(row.source, {
      destination: row.destination,
      permanent: row.permanent,
    });
  }
  return map;
}
