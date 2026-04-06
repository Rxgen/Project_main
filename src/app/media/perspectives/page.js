import PerspectivesClient from './PerspectivesClient';
import { getPerspectives, getStrapiMedia } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'perspective',
    'https://www.lupin.com/media/perspectives'
  );
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default async function PerspectivesPage() {
  // Fetch perspectives from Strapi
  let perspectivesData = [];

  try {
    const perspectivesResponse = await getPerspectives(100); // Fetch more for listing page
    const articles = perspectivesResponse?.data || [];

    perspectivesData = articles.map((article) => {
      // Get image URL from media field if available
      let imageUrl = null;
      if (article.media) {
        imageUrl = getStrapiMedia(article.media);
      }
      // Fallback to default image if no media in article
      if (!imageUrl) {
        imageUrl = "/assets/media-kit-card/demo2.png";
      }

      return {
        id: article.id,
        name: formatDate(article.publishedOn || article.publishedAt),
        title: sanitizeText(article.title) || '',
        image: imageUrl,
        imagePosition: "bottom-right",
        showArrow: false,
        link: `/media/perspectives/${article.slug}`
      };
    });
  } catch (error) {
    console.error('Error fetching perspectives from Strapi:', error);
    // Fallback to empty array - component will handle gracefully
  }

  return <PerspectivesClient initialData={perspectivesData} />;
}

