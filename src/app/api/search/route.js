import { NextResponse } from 'next/server';
import {
  fetchAPI,
  getMediaCoverage,
  getPerspectives,
  getPressReleases,
  getStrapiMedia,
} from '@/lib/strapi';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import {
  getAnalystCoverage,
  getCodeOfConduct,
  getCommittee,
  getDividend,
  getEmployeeStockOptionScheme,
  getFinancial,
  getInvestor,
  getInvestorFAQs,
  getInvestorRegulationDisclosure,
  getLeadership,
  getLeaders,
  getNewsAndEvent,
  getNotice,
  getOtherStatutoryInformation,
  getPolicy,
  getReportFiling,
  getSakshamNiveshak,
  getSharePrice,
  getShareholdingPattern,
  getSubsidiary,
  getTipsForShareholder,
  getTransferPhysicalShare,
  getUnclaimedDividend,
} from '@/lib/strapi-reports';
import {
  getAboutUs,
  getCommunity,
  getContactUs,
  getEthicsAndCompliance,
  getGlobalPresence,
  getOurManufacturingApproach,
  getOurPurpose,
  getOurScience,
  getOurStory,
  getOurValue,
} from '@/lib/strapi-pages';
import { staticPages } from '@/lib/staticPages';

/** In-memory cache for Strapi payloads used only for search (same logic, fewer round-trips). */
const searchStrapiCache = new Map();
const searchStrapiInflight = new Map();

function getSearchStrapiCacheTtlMs() {
  const sec = parseInt(process.env.SEARCH_STRAPI_CACHE_TTL_SECONDS || '90', 10);
  return Number.isFinite(sec) && sec > 0 ? sec * 1000 : 90_000;
}

/** Max parallel Strapi fetches for page search; set SEARCH_STRAPI_CONCURRENCY=0 for unlimited parallel. */
function getSearchStrapiConcurrency() {
  const raw = process.env.SEARCH_STRAPI_CONCURRENCY;
  if (raw === '0') return Number.POSITIVE_INFINITY;
  const n = parseInt(raw ?? '12', 10);
  if (!Number.isFinite(n) || n < 0) return 12;
  return Math.min(64, n);
}

/**
 * Cache + single-flight: repeated searches (or overlapping requests) reuse the same Strapi JSON.
 * Search still runs on fresh data per request when cache expires; results stay correct.
 */
async function cachedStrapiSearchFetch(cacheKey, fetcher) {
  const ttl = getSearchStrapiCacheTtlMs();
  const now = Date.now();
  const hit = searchStrapiCache.get(cacheKey);
  if (hit && now - hit.ts < ttl) {
    return hit.data;
  }
  if (searchStrapiInflight.has(cacheKey)) {
    return searchStrapiInflight.get(cacheKey);
  }
  const promise = (async () => {
    try {
      const data = await fetcher();
      searchStrapiCache.set(cacheKey, { data, ts: Date.now() });
      return data;
    } finally {
      searchStrapiInflight.delete(cacheKey);
    }
  })();
  searchStrapiInflight.set(cacheKey, promise);
  return promise;
}

async function mapWithConcurrency(items, limit, mapper) {
  if (items.length === 0) return [];
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await mapper(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * About Us /leadership uses two Strapi calls (banner single type + leaders collection).
 * Merge them so search covers names, titles, bios, and banner text in one result (same URL).
 */
async function getLeadershipPageDataForSearch() {
  const [leadership, leaders] = await Promise.all([getLeadership(), getLeaders()]);
  const banner = leadership?.data || leadership;
  const list = leaders?.data || leaders;
  const leadersArray = Array.isArray(list) ? list : [];
  const bannerObj =
    banner && typeof banner === 'object' && !Array.isArray(banner) ? banner : {};
  return {
    data: {
      ...bannerObj,
      _LeadersEntries: leadersArray,
    },
  };
}

/**
 * Global Search API Route
 * 
 * Searches across:
 * - Strapi collections: articles, news, events
 * - Strapi single types: community, about-us, strapi-pages (our-values, etc.), strapi-reports (investor pages), branded-emerging-markets
 * - Static Next.js pages
 * 
 * Query parameter: ?q=keyword
 * 
 * Returns:
 * {
 *   pages: [],
 *   articles: [],
 *   media: [],
 *   news: [],
 *   events: [],
 *   community: [],
 *   aboutUs: [],
 *   strapiPages: [],  // other Strapi pages (our-values, our-science, investor/reports pages, etc.)
 *   emergingMarkets: []
 * }
 *
 * Performance (same search behaviour):
 * - SEARCH_STRAPI_CACHE_TTL_SECONDS (default 90): reuse Strapi JSON for page/event/emerging-markets fetches.
 * - SEARCH_STRAPI_CONCURRENCY (default 12, use 0 for unlimited): cap parallel page fetches so Strapi is not overloaded.
 */

/** Config for all Strapi single-type pages from strapi-pages.js – one search covers 30+ pages */
const STRAPI_PAGE_SEARCH_CONFIG = [
  { getter: getAboutUs, path: '/about-us', defaultTitle: 'About Us', type: 'about-us' },
  { getter: getCommunity, path: '/community', defaultTitle: 'Community', type: 'community' },
  { getter: getContactUs, path: '/contact-us', defaultTitle: 'Contact Us', type: 'contact-us' },
  { getter: getEthicsAndCompliance, path: '/about-us/compliance-ethics-governance', defaultTitle: 'Compliance, Ethics and Governance', type: 'ethics-and-compliance' },
  { getter: getGlobalPresence, path: '/about-us/global-presence', defaultTitle: 'Global Presence', type: 'global-presence' },
  { getter: getOurManufacturingApproach, path: '/about-us/global-technical-operations', defaultTitle: 'Our Manufacturing Approach', type: 'global-technical-operations' },
  { getter: getOurPurpose, path: '/about-us/our-purpose', defaultTitle: 'Our Purpose', type: 'our-purpose' },
  { getter: getOurScience, path: '/about-us/our-science', defaultTitle: 'Our Science', type: 'our-science' },
  { getter: getOurStory, path: '/about-us/our-story', defaultTitle: 'Our Story', type: 'our-story' },
  { getter: getOurValue, path: '/about-us/our-values', defaultTitle: 'Our Values', type: 'our-values' },
  { getter: getLeadershipPageDataForSearch, path: '/about-us/leadership', defaultTitle: 'Leadership', type: 'leadership' },
];

/** Config for investor/reports Strapi single-type pages from strapi-reports.js */
const STRAPI_REPORTS_SEARCH_CONFIG = [
  { getter: getInvestor, path: '/investors', defaultTitle: 'Investors', type: 'investor' },
  { getter: getReportFiling, path: '/investors/reports-filings', defaultTitle: 'Reports and Filings', type: 'report-filing' },
  { getter: getPolicy, path: '/investors/policies', defaultTitle: 'Policies', type: 'policy' },
  { getter: getCodeOfConduct, path: '/investors/code-of-conduct', defaultTitle: 'Code of Conduct', type: 'code-of-conduct' },
  { getter: getAnalystCoverage, path: '/investors/analyst-coverage', defaultTitle: 'Analyst Coverage', type: 'analyst-coverage' },
  { getter: getInvestorFAQs, path: '/investors/investor-faqs', defaultTitle: 'Investor FAQs', type: 'investor-faqs' },
  { getter: getFinancial, path: '/investors/financials', defaultTitle: 'Financials', type: 'financial' },
  { getter: getSubsidiary, path: '/investors/subsidiaries', defaultTitle: 'Subsidiaries', type: 'subsidiary' },
  { getter: getEmployeeStockOptionScheme, path: '/investors/employee-stock-option-schemes', defaultTitle: 'Employee Stock Option Schemes', type: 'employee-stock-option-scheme' },
  { getter: getInvestorRegulationDisclosure, path: '/investors/disclosure-under-regulation-46-of-sebi-regulations-2015', defaultTitle: 'Disclosure under Regulation 46', type: 'investor-regulation-disclosure' },
  { getter: getDividend, path: '/investors/dividend', defaultTitle: 'Dividend', type: 'dividend' },
  { getter: getNotice, path: '/investors/notices', defaultTitle: 'Notices', type: 'notice' },
  { getter: getOtherStatutoryInformation, path: '/investors/other-statutory-information', defaultTitle: 'Other Statutory Information', type: 'other-statutory-information' },
  { getter: getSakshamNiveshak, path: '/investors/iepf-saksham-niveshak', defaultTitle: 'IEPF Saksham Niveshak', type: 'saksham-niveshak' },
  { getter: getTipsForShareholder, path: '/investors/tips-for-shareholders', defaultTitle: 'Tips for Shareholders', type: 'tips-for-shareholder' },
  { getter: getSharePrice, path: '/investors/share-price', defaultTitle: 'Share Price', type: 'share-price' },
  { getter: getTransferPhysicalShare, path: '/investors/transfer-of-physical-shares-re-lodgement', defaultTitle: 'Transfer of Physical Shares', type: 'transfer-physical-share' },
  { getter: getUnclaimedDividend, path: '/investors/unclaimed-dividend', defaultTitle: 'Unclaimed Dividend', type: 'unclaimed-dividend' },
  { getter: getShareholdingPattern, path: '/investors/shareholding-pattern', defaultTitle: 'Shareholding Pattern', type: 'shareholding-pattern' },
  { getter: getCommittee, path: '/investors/committees-of-the-board', defaultTitle: 'Committees of the Board', type: 'committee' },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Return empty results if no query
    if (!query || query.trim() === '') {
      return NextResponse.json({
        pages: [],
        articles: [],
        media: [],
        news: [],
        events: [],
        community: [],
        aboutUs: [],
        strapiPages: [],
        emergingMarkets: []
      });
    }

    const searchTerm = query.trim();
    const results = {
      pages: [],
      articles: [],
      media: [],
      news: [],
      events: [],
      community: [],
      aboutUs: [],
      strapiPages: [],
      emergingMarkets: []
    };

    // Check if Strapi URL is configured
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (!STRAPI_URL) {
      // If Strapi not configured, only search static pages
      results.pages = searchStaticPages(searchTerm);
      return NextResponse.json(results);
    }

    // Search Strapi collections and all config-driven Strapi pages in parallel
    const searchPromises = [
      searchArticles(searchTerm),
      searchMediaFromStrapi(searchTerm),
      searchNews(searchTerm),
      searchEvents(searchTerm),
      searchStrapiPages(searchTerm),
      searchEmergingMarkets(searchTerm)
    ];

    const [articles, media, news, events, strapiPageResults, emergingMarkets] = await Promise.all(searchPromises);

    // Search static pages
    results.pages = searchStaticPages(searchTerm);
    results.articles = articles;
    results.media = media;
    results.news = news;
    results.events = events;
    results.community = strapiPageResults.community;
    results.aboutUs = strapiPageResults.aboutUs;
    results.strapiPages = strapiPageResults.strapiPages;
    results.emergingMarkets = emergingMarkets;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
      return NextResponse.json(
      {
        pages: [],
        articles: [],
        media: [],
        news: [],
        events: [],
        community: [],
        aboutUs: [],
        strapiPages: [],
        emergingMarkets: [],
        error: 'Search failed'
      },
      { status: 200 } // Return 200 so it doesn't trigger error handling
    );
  }
}

/**
 * Search static pages by title
 */
function searchStaticPages(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  return staticPages
    .filter((page) => {
      const title = (page.title || '').toLowerCase();
      const content = (page.searchableContent || '').toLowerCase();
      return title.includes(searchLower) || content.includes(searchLower);
    })
    .map(page => ({
      title: page.title,
      url: page.url,
      description: (() => {
        const content = page.searchableContent || '';
        if (!content) return '';
        const idx = content.toLowerCase().indexOf(searchLower);
        if (idx === -1) return '';
        const start = Math.max(0, idx - 40);
        const end = Math.min(content.length, idx + searchTerm.length + 110);
        let snippet = content.substring(start, end).trim();
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        return snippet;
      })()
    }));
}

/**
 * Search articles from Strapi
 */
async function searchArticles(searchTerm) {
  try {
    const filters = [
      `filters[$or][0][title][$containsi]=${encodeURIComponent(searchTerm)}`,
      `filters[$or][1][description][$containsi]=${encodeURIComponent(searchTerm)}`
    ].join('&');

    const data = await fetchAPI(`articles?${filters}&populate=*`, {
      cache: 'no-store',
    });

    if (!data || !data.data) {
      return [];
    }

    return data.data.map(item => {
      const image = item.attributes?.image;
      const imageUrl = image ? getStrapiMedia(image) : null;
      
      return {
        id: item.id,
        title: item.attributes?.title || '',
        description: item.attributes?.description || item.attributes?.excerpt || '',
        url: `/media/${item.attributes?.slug || item.id}`,
        image: imageUrl,
        date: item.attributes?.publishedAt || item.attributes?.createdAt || null
      };
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

/**
 * Search Media categories from Strapi (press-releases, perspectives, media-coverage).
 * Uses category helpers from strapi.js and filters by title/description/content.
 */
async function searchMediaFromStrapi(searchTerm) {
  try {
    const searchLower = searchTerm.toLowerCase();
    const [pressReleases, perspectives, mediaCoverage] = await Promise.all([
      cachedStrapiSearchFetch('search:media:press-releases', () => getPressReleases(100)),
      cachedStrapiSearchFetch('search:media:perspectives', () => getPerspectives(100)),
      cachedStrapiSearchFetch('search:media:media-coverage', () => getMediaCoverage(100)),
    ]);

    const mapCategoryItems = (response, category) => {
      const items = Array.isArray(response?.data) ? response.data : [];
      return items
        .filter((item) => {
          const attrs = item?.attributes || item;
          const title = attrs?.title || attrs?.headline || '';
          const description = attrs?.description || attrs?.excerpt || attrs?.content || '';
          return (
            title.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower)
          );
        })
        .map((item, index) => {
          const attrs = item?.attributes || item;
          const image = attrs?.image || attrs?.media;
          const imageUrl = image ? getStrapiMedia(image) : null;
          const slug = attrs?.slug || '';
          const baseUrl = category === 'media-coverage'
            ? '/media/media-coverage'
            : category === 'perspectives'
              ? '/media/perspectives'
              : '/media/press-releases';
          const pdfRaw = attrs?.pdf?.data?.attributes?.url || attrs?.pdf?.url || attrs?.Pdf?.data?.attributes?.url || attrs?.Pdf?.url || attrs?.Pdf || attrs?.pdf;
          const pdfUrl = typeof pdfRaw === 'string' ? normalizeUploadUrl(pdfRaw) : null;
          const externalLink = attrs?.link || attrs?.externalLink || null;
          const videoLink = attrs?.video || attrs?.videoLink || null;
          const resolvedUrl =
            (typeof externalLink === 'string' && externalLink) ||
            (typeof videoLink === 'string' && videoLink) ||
            (typeof pdfUrl === 'string' && pdfUrl) ||
            (slug ? `${baseUrl}/${slug}` : baseUrl);
          return {
            id: `${category}-${item?.id || index}`,
            title: attrs?.title || attrs?.headline || 'Media',
            description: attrs?.description || attrs?.excerpt || attrs?.content || '',
            url: resolvedUrl,
            image: imageUrl,
            date: attrs?.publishedAt || attrs?.createdAt || null,
          };
        });
    };

    return [
      ...mapCategoryItems(pressReleases, 'press-releases'),
      ...mapCategoryItems(perspectives, 'perspectives'),
      ...mapCategoryItems(mediaCoverage, 'media-coverage'),
    ];
  } catch (error) {
    console.error('Error searching media categories:', error);
    return [];
  }
}

/**
 * Search news from Strapi
 * Uses getNewsAndEvent() function from strapi-reports.js
 */
async function searchNews(searchTerm) {
  try {
    // Use existing getNewsAndEvent function
    const data = await getNewsAndEvent();

    if (!data || !data.data) {
      return [];
    }

    const pageData = data.data || data;
    const newsSection = pageData?.NewsSection || pageData?.newsSection;
    
    if (!newsSection || !newsSection.items) {
      return [];
    }

    const searchLower = searchTerm.toLowerCase();
    const newsItems = Array.isArray(newsSection.items) ? newsSection.items : [];

    return newsItems
      .filter(item => {
        const headline = item?.headline || item?.Headline || '';
        const description = item?.description || item?.Description || '';
        return (
          headline.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower)
        );
      })
      .map((item, index) => {
        const circleInner = item?.circleInner || item?.CircleInner;
        const imageUrl = circleInner ? getStrapiMedia(circleInner) : null;
        
        return {
          id: item?.id || index,
          title: item?.headline || item?.Headline || '',
          description: item?.description || item?.Description || '',
          url: item?.cta?.href || item?.Cta?.href || '#',
          image: imageUrl,
          date: item?.date || item?.Date || null
        };
      });
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
}

/**
 * Helper function to recursively search for a term in an object
 */
function searchInObject(obj, searchTerm, depth = 0) {
  if (depth > 5) return false; // Prevent infinite recursion
  if (!obj || typeof obj !== 'object') return false;

  const searchLower = searchTerm.toLowerCase();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Skip certain keys that are not searchable
      if (key === 'id' || key === 'createdAt' || key === 'updatedAt' ||
          key === 'publishedAt' || key === 'url' || key === 'alternativeText' ||
          key === 'caption' || key === 'width' || key === 'height' ||
          key === 'data' || key === 'attributes' || key === 'formats') {
        continue;
      }

      if (typeof value === 'string') {
        if (value.toLowerCase().includes(searchLower)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string') {
            if (item.toLowerCase().includes(searchLower)) {
              return true;
            }
          } else if (typeof item === 'object' && item !== null) {
            if (searchInObject(item, searchTerm, depth + 1)) {
              return true;
            }
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        if (searchInObject(value, searchTerm, depth + 1)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Extract a snippet from an object that contains the search term.
 * Finds the first string value that contains the term and returns a snippet centered on the match.
 * @param {Object} obj - Object to search (e.g. page data)
 * @param {string} searchTerm - Search phrase
 * @param {number} maxLength - Max snippet length
 * @returns {string|null} Snippet containing the match, or null if not found
 */
function extractSnippetFromObject(obj, searchTerm, maxLength = 200, depth = 0) {
  if (depth > 5) return null;
  if (!obj || typeof obj !== 'object') return null;

  const searchLower = searchTerm.toLowerCase();

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];

    if (key === 'id' || key === 'createdAt' || key === 'updatedAt' ||
        key === 'publishedAt' || key === 'url' || key === 'alternativeText' ||
        key === 'caption' || key === 'width' || key === 'height' ||
        key === 'data' || key === 'attributes' || key === 'formats') {
      continue;
    }

    if (typeof value === 'string') {
      const idx = value.toLowerCase().indexOf(searchLower);
      if (idx !== -1) {
        const before = Math.max(0, idx - 50);
        const after = Math.min(value.length, idx + searchTerm.length + 100);
        let snippet = value.substring(before, after);
        if (before > 0) snippet = '...' + snippet;
        if (after < value.length) snippet = snippet + '...';
        if (snippet.length > maxLength) {
          snippet = snippet.substring(0, maxLength - 3) + '...';
        }
        return snippet.trim();
      }
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          const idx = item.toLowerCase().indexOf(searchLower);
          if (idx !== -1) {
            const before = Math.max(0, idx - 50);
            const after = Math.min(item.length, idx + searchTerm.length + 100);
            let snippet = item.substring(before, after);
            if (before > 0) snippet = '...' + snippet;
            if (after < item.length) snippet = snippet + '...';
            if (snippet.length > maxLength) snippet = snippet.substring(0, maxLength - 3) + '...';
            return snippet.trim();
          }
        } else if (typeof item === 'object' && item !== null) {
          const found = extractSnippetFromObject(item, searchTerm, maxLength, depth + 1);
          if (found) return found;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      const found = extractSnippetFromObject(value, searchTerm, maxLength, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Generic search for one Strapi single-type page. Uses existing getter, returns one result with snippet when the page matches.
 */
async function searchStrapiSinglePage(config, searchTerm) {
  try {
    const data = await cachedStrapiSearchFetch(`search-page:${config.type}`, config.getter);
    const pageData = data?.data || data;
    if (!pageData || !searchInObject(pageData, searchTerm)) return [];

    const topBanner = pageData?.TopBanner || pageData?.topBanner;
    const pageIntro = pageData?.PageIntroSection || pageData?.pageIntroSection;

    const title =
      topBanner?.Heading || topBanner?.heading ||
      pageIntro?.PageIntroContent || pageIntro?.pageIntroContent ||
      pageIntro?.Heading || pageIntro?.heading ||
      pageIntro?.SectionTitle || pageIntro?.sectionTitle ||
      config.defaultTitle;

    let imageUrl = null;
    if (topBanner?.DesktopImage) imageUrl = getStrapiMedia(topBanner.DesktopImage);
    else if (pageIntro?.Image) imageUrl = getStrapiMedia(pageIntro.Image);

    const fallbackDesc =
      pageIntro?.PageIntroContent || pageIntro?.pageIntroContent ||
      pageIntro?.Description || pageIntro?.description ||
      pageIntro?.IntroDetail || pageIntro?.introDetail ||
      '';
    const description =
      extractSnippetFromObject(pageData, searchTerm, 200) ||
      (typeof fallbackDesc === 'string' ? (fallbackDesc.length > 200 ? fallbackDesc.substring(0, 200) + '...' : fallbackDesc) : '');

    const titleStr = typeof title === 'string' ? (title.length > 100 ? title.substring(0, 100) + '...' : title) : config.defaultTitle;

    return [
      {
        id: `${config.type}-page`,
        title: titleStr,
        description: description || config.defaultTitle,
        url: config.path,
        image: imageUrl,
        date: null,
        type: config.type,
      },
    ];
  } catch (error) {
    console.error(`Error searching Strapi page ${config.type}:`, error);
    return [];
  }
}

/**
 * Search all Strapi single-type pages (strapi-pages + strapi-reports) in parallel.
 * Returns { community, aboutUs, strapiPages } for backward compatibility; strapiPages includes other pages + all investor/reports pages.
 */
async function searchStrapiPages(searchTerm) {
  const allConfigs = [...STRAPI_PAGE_SEARCH_CONFIG, ...STRAPI_REPORTS_SEARCH_CONFIG];
  const limit = getSearchStrapiConcurrency();
  const all = await mapWithConcurrency(allConfigs, limit, (config) =>
    searchStrapiSinglePage(config, searchTerm)
  );
  const flat = all.flat();
  return {
    community: flat.filter((r) => r.type === 'community'),
    aboutUs: flat.filter((r) => r.type === 'about-us'),
    strapiPages: flat.filter((r) => r.type !== 'community' && r.type !== 'about-us'),
  };
}

/**
 * Search events from Strapi
 * Uses getNewsAndEvent() function from strapi-reports.js
 * Searches through EventSection and AnnualGeneralMeetingSection
 */
async function searchEvents(searchTerm) {
  try {
    const data = await cachedStrapiSearchFetch('search:news-and-event', getNewsAndEvent);

    if (!data || !data.data) {
      return [];
    }

    const pageData = data.data || data;
    const searchLower = searchTerm.toLowerCase();
    const results = [];

    // Search EventSection
    const eventSection = pageData?.EventSection || pageData?.eventSection;
    if (eventSection) {
      const events = Array.isArray(eventSection) ? eventSection : [eventSection];
      
      events.forEach((event, index) => {
        if (event?.isActive === false) return;
        
        const title = event?.EventTitle || event?.eventTitle || event?.title || '';
        const description = event?.Description || event?.description || '';
        
        // Search in title, description, or recursively in the object
        if (
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          searchInObject(event, searchTerm)
        ) {
          const eventImage = event?.image || event?.Image;
          const imageUrl = eventImage ? getStrapiMedia(eventImage) : null;
          
          results.push({
            id: event?.id || `event-${index}`,
            title: title || 'Event',
            description: description || '',
            url: event?.href || event?.Href || '#',
            image: imageUrl,
            date: event?.Date || event?.date || event?.EventDate || event?.eventDate || null
          });
        }
      });
    }

    // Search AnnualGeneralMeetingSection
    const agmSection = pageData?.AnnualGeneralMeetingSection || pageData?.annualGeneralMeetingSection;
    if (agmSection) {
      const agmEvents = Array.isArray(agmSection) ? agmSection : [agmSection];
      
      agmEvents.forEach((agm, index) => {
        if (agm?.isActive === false) return;
        
        const meetingTitle = agm?.MeetingTitle || agm?.meetingTitle || '';
        const meetingDate = agm?.MeetingDate || agm?.meetingDate || '';
        
        // Search in title, date, or recursively in the object
        if (
          meetingTitle.toLowerCase().includes(searchLower) ||
          meetingDate.toLowerCase().includes(searchLower) ||
          searchInObject(agm, searchTerm)
        ) {
          const posterImage = agm?.PosterImage?.data?.attributes || agm?.PosterImage || 
                             agm?.posterImage?.data?.attributes || agm?.posterImage;
          const imageUrl = posterImage ? getStrapiMedia(posterImage) : null;
          
          results.push({
            id: agm?.id || `agm-${index}`,
            title: meetingTitle || 'Annual General Meeting',
            description: meetingDate ? `Meeting Date: ${meetingDate}` : '',
            url: '/investors/news-events', // Link to the news-events page where AGM is displayed
            image: imageUrl,
            date: meetingDate || null
          });
        }
      });
    }

    // Search PresentationSection
    const presentationSection = pageData?.PresentationSection || pageData?.presentationSection;
    if (presentationSection) {
      const presentations = Array.isArray(presentationSection) ? presentationSection : [presentationSection];
      
      presentations.forEach((presentation, index) => {
        if (presentation?.isActive === false) return;
        
        const title = presentation?.Title || presentation?.title || '';
        const publishedDate = presentation?.PublishedDate || presentation?.publishedDate || '';
        
        // Search in title, date, or recursively in the object
        if (
          title.toLowerCase().includes(searchLower) ||
          publishedDate.toLowerCase().includes(searchLower) ||
          searchInObject(presentation, searchTerm)
        ) {
          results.push({
            id: presentation?.id || `presentation-${index}`,
            title: title || 'Presentation',
            description: publishedDate ? `Published: ${publishedDate}` : '',
            url: '#', // Presentations might have PDF links
            image: null,
            date: publishedDate || null
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.error('Error searching events:', error);
    return [];
  }
}

/**
 * Search branded-emerging-markets data from Strapi
 * Uses the same populate query as the page component
 * Searches through all nested sections in the branded-emerging-markets page
 */
async function searchEmergingMarkets(searchTerm) {
  try {
    const populateQuery = 'populate[description][populate]=*&populate[markets][populate][marketCard][populate][image][populate]=*&populate[markets][populate][marketCard][populate][cta][populate]=*&populate[hero][populate]=*&populate[globalInstitutionalBusiness][populate][image][populate]=*';
    const data = await cachedStrapiSearchFetch('search:branded-emerging-markets', () =>
      fetchAPI(`branded-emerging-markets?${populateQuery}`, {
        cache: 'no-store',
      })
    );

    if (!data || !data.data) {
      return [];
    }

    const pageData = data.data || data;
    const searchLower = searchTerm.toLowerCase();
    const results = [];

    // Check if search term matches anywhere in the branded-emerging-markets data
    if (searchInObject(pageData, searchTerm)) {
      // Extract title from hero or description
      const hero = pageData?.hero || pageData?.Hero;
      const description = pageData?.description || pageData?.Description;
      
      const title = hero?.Heading || hero?.heading || 
                   description?.title || description?.Title ||
                   'Emerging Markets';
      
      // Get image from hero
      let imageUrl = null;
      if (hero?.DesktopImage) {
        imageUrl = getStrapiMedia(hero.DesktopImage);
      } else if (hero?.MobileImage) {
        imageUrl = getStrapiMedia(hero.MobileImage);
      } else if (hero?.image) {
        imageUrl = getStrapiMedia(hero.image);
      }

      // Extract description text
      const descriptionText = description?.content || description?.text || 
                             description?.description || 
                             hero?.SubHeading || hero?.subHeading || '';
      
      // Limit description length
      const descriptionSnippet = typeof descriptionText === 'string' 
        ? (descriptionText.length > 150 ? descriptionText.substring(0, 150) + '...' : descriptionText)
        : '';

      results.push({
        id: 'emerging-markets-page',
        title: typeof title === 'string' ? (title.length > 100 ? title.substring(0, 100) + '...' : title) : 'Emerging Markets',
        description: descriptionSnippet,
        url: '/our-business/emerging-markets',
        image: imageUrl,
        date: null
      });
    }

    // Search markets.marketCard section
    const markets = pageData?.markets || pageData?.Markets;
    if (markets) {
      const marketCards = markets?.marketCard || markets?.MarketCard || markets?.items || markets?.Items || [];
      
      if (Array.isArray(marketCards)) {
        marketCards.forEach((marketCard, index) => {
          const cardTitle = marketCard?.title || marketCard?.Title || marketCard?.name || '';
          const cardDescription = marketCard?.description || marketCard?.Description || '';
          
          // Search in title, description, or recursively in the object
          if (
            cardTitle.toLowerCase().includes(searchLower) ||
            cardDescription.toLowerCase().includes(searchLower) ||
            searchInObject(marketCard, searchTerm)
          ) {
            const cardImage = marketCard?.image || marketCard?.Image;
            const imageUrl = cardImage ? getStrapiMedia(cardImage) : null;
            
            results.push({
              id: `emerging-markets-card-${index}`,
              title: cardTitle || `Market ${index + 1}`,
              description: cardDescription || 'Emerging Market',
              url: marketCard?.cta?.href || marketCard?.Cta?.href || marketCard?.link?.url || '/our-business/emerging-markets',
              image: imageUrl,
              date: null
            });
          }
        });
      }
    }

    // Search globalInstitutionalBusiness section
    const globalBusiness = pageData?.globalInstitutionalBusiness || pageData?.GlobalInstitutionalBusiness;
    if (globalBusiness && searchInObject(globalBusiness, searchTerm)) {
      const businessTitle = globalBusiness?.title || globalBusiness?.Title || 
                           globalBusiness?.heading || globalBusiness?.Heading ||
                           'Global Institutional Business';
      
      if (businessTitle.toLowerCase().includes(searchLower) || searchInObject(globalBusiness, searchTerm)) {
        const businessImage = globalBusiness?.image || globalBusiness?.Image;
        const imageUrl = businessImage ? getStrapiMedia(businessImage) : null;
        
        results.push({
          id: 'emerging-markets-global-business',
          title: businessTitle,
          description: globalBusiness?.description || globalBusiness?.Description || 'Global Institutional Business Section',
          url: '/our-business/emerging-markets',
          image: imageUrl,
          date: null
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching emerging markets:', error);
    return [];
  }
}

