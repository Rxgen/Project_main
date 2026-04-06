import PressReleasesClient from './PressReleasesClient';
import { getPressReleases } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'press-release',
    'https://www.lupin.com/media/press-releases'
  );
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Helper function to split title into headline array (for display with line breaks; no line limit so full title shows)
function splitTitleIntoHeadline(title) {
  if (!title) return [];

  // Remove HTML entities and tags using sanitizeText
  const cleanTitle = sanitizeText(title);

  // Split by words
  const words = cleanTitle.split(' ');
  const lines = [];
  let currentLine = '';

  // Try to create lines of roughly equal length (aim for ~4 lines for layout, but include all words)
  const targetLines = 4;
  const avgWordsPerLine = Math.max(1, Math.ceil(words.length / targetLines));

  for (let i = 0; i < words.length; i++) {
    if (currentLine && (currentLine.split(' ').length >= avgWordsPerLine || i === words.length - 1)) {
      lines.push(currentLine.trim());
      currentLine = words[i];
    } else {
      currentLine += (currentLine ? ' ' : '') + words[i];
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  // Return all lines so full title is shown
  return lines;
}

export default async function PressReleasesPage() {
  // Fetch press releases from Strapi
  let pressReleasesData = [];

  try {
    // Fetch all press releases (handles pagination automatically if > 100 records)
    const pressReleasesResponse = await getPressReleases(100); // Will fetch all pages if needed
    const articles = pressReleasesResponse?.data || [];

    pressReleasesData = articles.map((article) => ({
      id: article.id,
      date: formatDate(article.publishedOn || article.publishedAt),
      headline: splitTitleIntoHeadline(article.title),
      category: "Press Releases",
      href: `/media/press-releases/${article.slug}`,
      // Add raw data for search and filtering
      title: article.title || '',
      slug: article.slug || '',
      publishedOn: article.publishedOn || null,
      publishedAt: article.publishedAt || null
    }));
  } catch (error) {
    console.error('Error fetching press releases from Strapi:', error);
    // Fallback to empty array - component will handle gracefully
  }

  return <PressReleasesClient initialData={pressReleasesData} />;
}

