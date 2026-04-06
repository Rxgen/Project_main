/**
 * Fetch all redirects from Strapi (uncached). Same rules as runtime CMS redirects.
 * Prefer getRedirectForPathname / API route for normal request handling.
 */

import { fetchAllRedirectEntries } from './cms-redirects-runtime';

/**
 * @returns {Promise<Array<{ source: string, destination: string, permanent: boolean }>>}
 */
export async function getAllRedirects() {
  return fetchAllRedirectEntries();
}

export { getRedirectForPathname } from './cms-redirects-runtime';
