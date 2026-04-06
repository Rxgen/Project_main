import InnerBanner from '@/components/InnerBanner';
import WhatsNew from '@/components/WhatsNew';
import MediaCoverage from '@/components/MediaCoverage';
import MediaContact from '@/components/global/MediaContact';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getPressReleases, getPerspectives, getMediaCoverage, getFeaturedArticlesByCategory, getStrapiMedia } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';
import '@/scss/pages/media.scss';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';

/* // Generate metadata for the Media page
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lupin.com';
  return generateSEOMetadata({
    title: "Media - Lupin | Corporate Communications",
    description: "Contact our media relations team for press inquiries, media kits, and corporate communications from Lupin Limited.",
    canonicalUrl: `${siteUrl}/media`,
    keywords: "Lupin media, press contact, corporate communications, media relations, Lupin Limited, media kit",
  });
} */

export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'media-page',
    'https://www.lupin.com/media'
  );
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Helper function to split title into headline array (no line limit so full title shows)
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

export default async function MediaPage() {
  // Banner data for Media page
  const bannerData = {
    title: {
      line1: "Media",

    },
    images: {
      banner: {
        url: "/assets/inner-banner/media.png",
        alt: "Product Finder"
      },
      bannerMobile: {
        url: "/assets/inner-banner/media-mobile.png",
        alt: "Product Finder"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Fetch press releases from Strapi
  let whatsNewData = {
    title: "Press Releases",
    items: []
  };

  try {
    const pressReleasesResponse = await getPressReleases(10);
    const articles = pressReleasesResponse?.data || [];

    whatsNewData.items = articles.map((article) => ({
      id: article.id,
      date: formatDate(article.publishedOn || article.publishedAt),
      headline: splitTitleIntoHeadline(article.title),
      category: "Press Releases",
      href: `/media/press-releases/${article.slug}`
    }));
  } catch (error) {
    console.error('Error fetching press releases from Strapi:', error);
    // Fallback to empty array - component will handle gracefully
  }

  // Fetch perspectives from Strapi
  let perspectivesData = {
    title: "Perspectives",
    description: "Insights from the leading minds in our industry",
    items: []
  };

  try {
    const perspectivesResponse = await getPerspectives(10);
    const perspectivesArticles = perspectivesResponse?.data || [];

    perspectivesData.items = perspectivesArticles.map((article) => {
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

  // Fetch media coverage from Strapi
  let mediaCoverageData = {
    title: "Media Coverage",
    items: [],
    profileCards: []
  };

  try {
    // Fetch top 10 articles for the list (sorted by publishedAt desc)
    const mediaCoverageResponse = await getMediaCoverage(10);
    const articles = mediaCoverageResponse?.data || [];

    // Map articles to list items format
    mediaCoverageData.items = articles.map((article) => {
      // Check if article has video link
      const videoLink = article.video || article.videoLink || null;
      // Check if article has external link
      const externalLink = article.link || null;
      // Determine if link is external (starts with http/https)
      const isExternal = externalLink && (externalLink.startsWith('http://') || externalLink.startsWith('https://'));

      return {
        id: article.id,
        date: formatDate(article.publishedOn || article.publishedAt),
        text: sanitizeText(article.title) || '',
        link: videoLink ? null : (isExternal ? externalLink : null), // No detail page links
        videoLink: videoLink,
        externalLink: isExternal ? externalLink : null
      };
    });

    // Fetch featured articles for profile cards (only articles marked as featured)
    const featuredResponse = await getFeaturedArticlesByCategory('media-coverage', 3);
    const featuredArticles = featuredResponse?.data || [];

    // Map featured articles to profile cards format
    mediaCoverageData.profileCards = featuredArticles.map((article) => {
      // Get image URL from media field if available
      let imageUrl = null;
      if (article.media) {
        imageUrl = getStrapiMedia(article.media);
      }
      // No fallback image - only show if provided by API

      // Check if article has video link
      const videoLink = article.video || article.videoLink || null;
      // Check if article has external link
      const externalLink = article.link || null;
      // Determine if link is external (starts with http/https)
      const isExternal = externalLink && (externalLink.startsWith('http://') || externalLink.startsWith('https://'));

      return {
        id: article.id,
        name: formatDate(article.publishedOn || article.publishedAt),
        title: sanitizeText(article.title) || '',
        image: imageUrl,
        link: videoLink ? null : (isExternal ? externalLink : null), // No detail page links
        videoLink: videoLink,
        externalLink: isExternal ? externalLink : null
      };
    });
  } catch (error) {
    console.error('Error fetching media coverage from Strapi:', error);
    // Fallback to empty arrays - component will handle gracefully
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />

      <section className="sectionPressReleases pd0">
        <WhatsNew className="whats-new--media-page" data={whatsNewData} exploreLink="/media/press-releases" />
      </section>

      <MediaCoverage
        data={mediaCoverageData}
        id="media-coverage"
        exploreLink="/media/media-coverage"
      />

      <section id="perspectives" className="sectionPressReleases">
        <WhatsNew
          className="whats-new--media-page"
          data={perspectivesData}
          useProfileCard={true}
          exploreLink="/media/perspectives"
        />
      </section>


      <MediaContact
        contact={{
          name: "Rajalakshmi Azariah",
          title: "Vice President and Global Head – Corporate Communications",
          email: "rajalakshmiazariah@lupin.com"
        }}
        mediaKitLink="/media/media-kit"
      />
    </div>
  );
}
