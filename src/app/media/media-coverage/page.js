import MediaCoverageClient from './MediaCoverageClient';
import { getMediaCoverage, getStrapiMedia } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'media-coverage',
    'https://www.lupin.com/media/media-coverage'
  );
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default async function MediaCoveragePage() {
  // Fetch media coverage from Strapi
  let mediaCoverageData = [];

  try {
    const mediaCoverageResponse = await getMediaCoverage(100); // Fetch more for listing page
    const articles = mediaCoverageResponse?.data || [];

    mediaCoverageData = articles.map((article) => {
      // Get image URL from media field if available
      let imageUrl = null;
      if (article.media) {
        imageUrl = getStrapiMedia(article.media);
      }
      // No fallback image - if no media exists, imageUrl will be null

      // Check if article has video link
      const videoLink = article.video || article.videoLink || null;
      // Check if article has external link
      const externalLink = article.link || null;
      // Determine the link to use: external link if exists, otherwise internal route
      const link = videoLink ? null : (externalLink || `/media/media-coverage/${article.slug}`);

      return {
        id: article.id,
        name: formatDate(article.publishedOn || article.publishedAt) || article.title,
        title: sanitizeText(article.title) || '',
        image: imageUrl,
        imagePosition: "bottom-right",
        showArrow: false,
        link: link,
        externalLink: externalLink, // Store external link separately
        videoLink: videoLink,
        date: formatDate(article.publishedOn || article.publishedAt),
        // Add raw data for search and filtering
        slug: article.slug || '',
        publishedOn: article.publishedOn || null,
        publishedAt: article.publishedAt || null
      };
    });
  } catch (error) {
    console.error('Error fetching media coverage from Strapi:', error);
    // Fallback to empty array - component will handle gracefully
  }

  return <MediaCoverageClient initialData={mediaCoverageData} />;
}

