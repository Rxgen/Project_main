import InnerBanner from '@/components/InnerBanner';
import PressReleaseDetail from '@/components/PressReleaseDetail';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getArticle, getStrapiMedia } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';
import { notFound } from 'next/navigation';
import '@/scss/pages/press-release-detail.scss';

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export async function generateMetadata({ params }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lupin.com';

  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    if (!slug) {
      return generateSEOMetadata({
        title: "Perspective - Lupin | Corporate Communications",
        description: "Read insights and perspectives from the leading minds in our industry.",
        canonicalUrl: `${siteUrl}/media/perspectives/${slug || ''}`,
        keywords: "Lupin perspectives, industry insights, Lupin Limited",
      });
    }

    const article = await getArticle(slug);

    if (!article) {
      return generateSEOMetadata({
        title: "Perspective - Lupin | Corporate Communications",
        description: "Read insights and perspectives from the leading minds in our industry.",
        canonicalUrl: `${siteUrl}/media/perspectives/${slug}`,
        keywords: "Lupin perspectives, industry insights, Lupin Limited",
      });
    }

    const title = sanitizeText(article.title) || 'Perspective';
    const excerpt = sanitizeText(article.excerpt) || '';

    return generateSEOMetadata({
      title: `${title} - Lupin | Perspective`,
      description: excerpt || "Read insights and perspectives from the leading minds in our industry.",
      canonicalUrl: `${siteUrl}/media/perspectives/${slug}`,
      keywords: "Lupin perspectives, industry insights, Lupin Limited",
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || '';
    return generateSEOMetadata({
      title: "Perspective - Lupin | Corporate Communications",
      description: "Read insights and perspectives from the leading minds in our industry.",
      canonicalUrl: `${siteUrl}/media/perspectives/${slug}`,
      keywords: "Lupin perspectives, industry insights, Lupin Limited",
    });
  }
}

export default async function PerspectiveDetailPage({ params }) {
  let perspectiveData = null;

  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    if (!slug) {
      console.warn('No slug provided in params');
      notFound();
    }

    const article = await getArticle(slug);

    if (!article) {
      console.warn(`Article not found for slug: ${slug}`);
      notFound();
    }

    // Handle Strapi v4 structure - data might be in attributes
    const articleData = article.attributes || article;

    // Get author image from media field if available
    let authorImage = null;
    if (articleData.media) {
      authorImage = getStrapiMedia(articleData.media);
    }
    // Fallback to default if no media
    if (!authorImage) {
      authorImage = "/assets/press/Image.png";
    }

    perspectiveData = {
      title: sanitizeText(articleData.title) || '',
      date: formatDate(articleData.publishedOn || articleData.publishedAt),
      excerpt: sanitizeText(articleData.excerpt) || '',
      publishedOn: articleData.publishedOn,
      author: {
        name: sanitizeText(articleData.author?.name || articleData.author?.username) || '',
        designation: sanitizeText(articleData.author?.designation) || '',
        image: authorImage
      },
      content: articleData.content || '',
      Name: sanitizeText(articleData.Name || articleData.name) || '',
      Designation: sanitizeText(articleData.Designation || articleData.designation) || '',
      activeCategory: 'perspectives'
    };
  } catch (error) {
    console.error('Error fetching perspective from Strapi:', error);
    // Only call notFound if it's a real error, not just missing data
    notFound();
  }

  const siteUrl ='https://www.lupin.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: perspectiveData.title,
    image: `${siteUrl}/assets/media/lupin-logo-download.jpg`,
    author: {
      '@type': 'Organization',
      name: 'Lupin Limited',
      url: 'https://www.lupin.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lupin Limited',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lupin.com/assets/logo-lupin.png'
      }
    },
    datePublished: perspectiveData.publishedOn,
    description: perspectiveData.excerpt
  }

  console.log('JSON-LD for Perspective:', jsonLd);

  const bannerData = {
    title: {
      line1: "Perspectives",
      line2: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/perspectives.png",
        alt: "Product Finder"
      },
      bannerMobile: {
        url: "/assets/inner-banner/perspectives-mobile.png",
        alt: "Product Finder"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <InnerBanner data={bannerData} titleAsDiv />
      <PressReleaseDetail data={perspectiveData} />
    </div>
  );
}

