import {
  redirectEntriesToLookupMap,
  strapiRedirectResponseToEntries,
} from './cms-redirects-shared';

const PAGE_SIZE = 100;
const CACHE_TTL_MS = 120_000;

/** @type {{ map: Map<string, { destination: string, permanent: boolean }> | null, expiresAt: number }} */
let cache = { map: null, expiresAt: 0 };

function getRuntimeStrapiApiBase() {
  return (
    process.env.STRAPI_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    (process.env.STRAPI_URL
      ? `${String(process.env.STRAPI_URL).replace(/\/$/, '')}/api`
      : null) ||
    (process.env.NEXT_PUBLIC_STRAPI_URL
      ? `${String(process.env.NEXT_PUBLIC_STRAPI_URL).replace(/\/$/, '')}/api`
      : null) ||
    'http://localhost:1380/api'
  );
}

function getRuntimeStrapiToken() {
  return process.env.STRAPI_API_TOKEN || '';
}

function getRuntimeSiteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lupin.com'
  ).replace(/\/$/, '');
}

/** Uncached fetch — for scripts or legacy callers. */
export async function fetchAllRedirectEntries() {
  const STRAPI_API_URL = getRuntimeStrapiApiBase();
  const token = getRuntimeStrapiToken();
  const siteUrl = getRuntimeSiteUrl();
  const all = [];
  let page = 1;
  let pageCount = 1;

  do {
    const url = `${STRAPI_API_URL}/redirects?pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}&populate=*`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new Error(`Redirects API error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const meta = json.meta?.pagination || {};
    pageCount = meta.pageCount ?? 1;
    const chunk = strapiRedirectResponseToEntries(json, { siteUrl });
    all.push(...chunk);
    page += 1;
  } while (page <= pageCount);

  return all;
}

async function getLookupMap() {
  const now = Date.now();
  if (cache.map && now < cache.expiresAt) {
    return cache.map;
  }
  const entries = await fetchAllRedirectEntries();
  const map = redirectEntriesToLookupMap(entries);
  cache = { map, expiresAt: now + CACHE_TTL_MS };
  return map;
}

/**
 * @param {string} pathname - request pathname (e.g. /about)
 * @returns {Promise<{ destination: string, permanent: boolean } | null>}
 */
export async function getRedirectForPathname(pathname) {
  if (!pathname || pathname === '/') {
    return null;
  }
  try {
    const map = await getLookupMap();
    const direct = map.get(pathname);
    if (direct) return direct;
    const alt =
      pathname.endsWith('/') && pathname !== '/'
        ? map.get(pathname.slice(0, -1))
        : map.get(`${pathname}/`);
    return alt || null;
  } catch {
    return null;
  }
}

export function __resetCmsRedirectCacheForTests() {
  cache = { map: null, expiresAt: 0 };
}
