import AwardsAndRecognitionClient from './AwardsAndRecognitionClient';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getAwardsAndRecognition, getStrapiMedia } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

// Generate metadata for the Awards and Recognition page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'award-recognition',
    'https://www.lupin.com/about-us/awards-and-recognition'
  );
}

export default async function AwardsAndRecognitionPage() {
  // Fetch awards and recognition from Strapi
  let awardsData = [];

  try {
    const awardsResponse = await getAwardsAndRecognition(100); // Fetch all for year filtering
    const articles = awardsResponse?.data || [];

    awardsData = articles.map((article) => {
      // Get image URL from media field if available
      let imageUrl = null;
      if (article.media) {
        imageUrl = getStrapiMedia(article.media);
      }
      // No fallback - only use image if it exists in Strapi

      return {
        id: article.id,
        title: sanitizeText(article.title) || '',
        image: imageUrl,
        imagePosition: "bottom",
        publishedOn: article.publishedOn || null,
        publishedAt: article.publishedAt || null
      };
    });
  } catch (error) {
    console.error('Error fetching awards and recognition from Strapi:', error);
    // Fallback to empty array - component will handle gracefully
  }

  return <AwardsAndRecognitionClient initialData={awardsData} />;
}
