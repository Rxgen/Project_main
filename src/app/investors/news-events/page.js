import InnerBanner from '@/components/InnerBanner';
import WhatsNew from '@/components/WhatsNew';
import MeetingVideo from '@/components/MeetingVideo';
import Events from '@/components/Events';
import Presentations from '@/components/Presentations';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getPressReleases } from '@/lib/strapi';
import { getNewsAndEvent, mapNewsAndEventData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

// Generate metadata for the News and Events page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'news-and-event',
    'https://www.lupin.com/investors/news-events'
  );
}

export default async function NewsAndEventsPage() {
  let newsAndEventData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getNewsAndEvent();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('News and Event - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasAnnualGeneralMeetingSection: !!(rawData?.data?.AnnualGeneralMeetingSection || rawData?.AnnualGeneralMeetingSection),
        hasEventSection: !!(rawData?.data?.EventSection || rawData?.EventSection),
        hasPresentationSection: !!(rawData?.data?.PresentationSection || rawData?.PresentationSection)
      });
    }
    
    if (rawData) {
      newsAndEventData = mapNewsAndEventData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('News and Event - Mapped data:', {
          hasMeetingVideoSection: !!newsAndEventData?.meetingVideoSection,
          hasEventsSection: !!newsAndEventData?.eventsSection,
          hasPresentationsSection: !!newsAndEventData?.presentationsSection,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('News and Event - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch news and event data from Strapi';
    console.error('Error fetching News and Event data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Fetch Press Releases for What's New section
  let whatsNewData = null;
  
  // Helper function to format date
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Helper function to split title into headline array (max 4 lines)
  function splitTitleIntoHeadline(title) {
    if (!title) return [];

    // Remove HTML entities and tags using sanitizeText
    const cleanTitle = sanitizeText(title);

    // Split by words and filter out empty strings
    const words = cleanTitle.split(' ').filter(word => word.trim() !== '');
    if (words.length === 0) return [];
    
    const lines = [];
    let currentLine = '';

    // Try to create lines of roughly equal length
    const avgWordsPerLine = Math.max(1, Math.ceil(words.length / 4));

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isLastWord = i === words.length - 1;
      
      // Add word to current line
      currentLine += (currentLine ? ' ' : '') + word;
      
      // Check if we should start a new line
      const wordCount = currentLine.split(' ').length;
      
      if (isLastWord || wordCount >= avgWordsPerLine) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
    }

    // Add any remaining words (safety check)
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    // Return all lines (up to 4, but ensure all words are included)
    return lines;
  }

  // Default fallback card data (same structure as WhatsNew component default)
  const defaultWhatsNewItems = [
    {
      id: 1,
      date: "September 17, 2025",
      headline: [
        "Lupin Receives Positive",
        "CHMP Opinion for",
        "Biosimilar Ranibizu",
        "mab"
      ],
      category: "Press Releases",
      href: "#"
    },
    {
      id: 2,
      date: "September 17, 2025",
      headline: [
        "Lupin Receives Positive",
        "CHMP Opinion for",
        "Biosimilar Ranibizu",
        "mab"
      ],
      category: "Press Releases",
      href: "#"
    },
    {
      id: 3,
      date: "September 17, 2025",
      headline: [
        "Lupin Receives Positive",
        "CHMP Opinion for",
        "Biosimilar Ranibizu",
        "mab"
      ],
      category: "Press Releases",
      href: "#"
    },
    {
      id: 4,
      date: "September 17, 2025",
      headline: [
        "Lupin Receives Positive",
        "CHMP Opinion for",
        "Biosimilar Ranibizu",
        "mab"
      ],
      category: "Press Releases",
      href: "#"
    }
  ];

  try {
    // Fetch latest press releases for the slider
    const pressReleasesResponse = await getPressReleases(10); // Fetch more for slider
    const articles = pressReleasesResponse?.data || [];

    if (articles && articles.length > 0) {
      whatsNewData = {
        title: "Press Releases",
        items: articles.map((article) => ({
          id: article.id,
          date: formatDate(article.publishedOn || article.publishedAt),
          headline: splitTitleIntoHeadline(article.title),
          category: "Press Release",
          href: `/media/press-releases/${article.slug}`
        }))
      };
    }
  } catch (error) {
    console.error('Error fetching Press Releases from Strapi:', error);
  }

  // Default fallback data if API fails
  if (!whatsNewData || !whatsNewData.items || whatsNewData.items.length === 0) {
    whatsNewData = {
      title: "Press Releases",
      items: defaultWhatsNewItems
    };
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <WhatsNew data={whatsNewData} className="whats-new--light-bg" exploreLink="/media/press-releases"/>
       <MeetingVideo />
      {newsAndEventData?.eventsSection && <Events data={newsAndEventData.eventsSection} />}
      {newsAndEventData?.presentationsSection && <Presentations data={newsAndEventData.presentationsSection} />}
      <SubscriberUpdated />
    </div>
  );
}


