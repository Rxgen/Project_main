import InnerBanner from '@/components/InnerBanner';
import InvestorIntro from '@/components/InvestorIntro';
import WhatsNew from '@/components/WhatsNew';
import CorporateGovernance from '@/components/CorporateGovernance';
import InteractiveChart from '@/components/InteractiveChart/InteractiveChart';
import ShareholderInformation from '@/components/ShareholderInformation';
import ReportsAndFilings from '@/components/ReportsAndFilings';
import NewsInsights from '@/components/NewsInsights';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import ShareholdingPattern from '@/components/ShareholdingPattern';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getPressReleases, fetchAPI } from '@/lib/strapi';
import { getInvestor, mapInvestorData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

// Generate metadata for the investors page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'investor',
    'https://www.lupin.com/investors'
  );
}

export default async function InvestorsPage() {
  // Fetch investor page data from /api/investor
  let investorData = null;
  let bannerData = null;
  let introData = null;
  let governanceData = null;
  let shareholderData = null;
  let reportsFilingsData = null;
  let newsInsightsData = null;
  let error = null;

  try {
    const rawInvestorData = await getInvestor();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Investors page - Raw API data received:', {
        hasData: !!rawInvestorData,
        isDataObject: !Array.isArray(rawInvestorData?.data) && !!rawInvestorData?.data,
        hasTopBanner: !!(rawInvestorData?.data?.TopBanner || rawInvestorData?.TopBanner)
      });
    }

    if (rawInvestorData) {
      const mappedData = mapInvestorData(rawInvestorData);
      
      // Map banner data
      const topBanner = rawInvestorData?.data?.TopBanner || rawInvestorData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);

      // Map introduction section (Rich text - Markdown)
      if (mappedData.introductionSection) {
        // Split by newlines if it's a string, or use as is if it's already processed
        const introText = typeof mappedData.introductionSection === 'string' 
          ? mappedData.introductionSection 
          : mappedData.introductionSection;
        introData = {
          text: introText,
          paragraphs: typeof introText === 'string' 
            ? introText.split('\n').filter(p => p.trim())
            : []
        };
      }

      // Map Corporate Governance Section
      if (mappedData.corporateGovernanceSection) {
        const cg = mappedData.corporateGovernanceSection;
        governanceData = {
          title: cg.sectionTitle || "Corporate Governance",
          backgroundImage: cg.desktopImage ? {
            url: cg.desktopImage,
            alt: cg.sectionTitle || "Corporate Governance"
          } : null,
          buttons: cg.links.map((link, index) => ({
            id: index + 1,
            label: link.text,
            href: link.href,
            isActive: false
          }))
        };
      }

      // Map Shareholder Information Section
      if (mappedData.shareholderInformationSection) {
        const sh = mappedData.shareholderInformationSection;
        // Split shareholder information into left and right columns
        // For now, we'll put all items in leftColumn and empty rightColumn
        // You can adjust the logic based on your needs
        const midPoint = Math.ceil(sh.shareholderInformation.length / 2);
        shareholderData = {
          title: sh.sectionTitle || "Shareholder Information",
          centerImage: sh.image ? {
            url: sh.image,
            alt: sh.sectionTitle || "Shareholder Information"
          } : null,
          leftColumn: sh.shareholderInformation.slice(0, midPoint).map(item => ({
            text: item.pdfTitle,
            href: item.documentPdf || item.cta.href || '#',
            download: !!item.documentPdf
          })),
          rightColumn: sh.shareholderInformation.slice(midPoint).map(item => ({
            text: item.pdfTitle,
            href: item.documentPdf || item.cta.href || '#',
            download: !!item.documentPdf
          }))
        };
      }

      // Map Reports and Filings Section
      if (mappedData.reportsFilingSection) {
        const rf = mappedData.reportsFilingSection;
        const financialHighlight = rf.financialHighlightCard;
        const integratedReport = rf.integratedReport;

        reportsFilingsData = {
          title: "Reports and Filings",
          leftCard: financialHighlight ? {
            badge: financialHighlight.financialYear || "Q2 FY26",
            items: [
              financialHighlight.grossProfit ? `Gross Profit : ${financialHighlight.grossProfit}` : null,
              financialHighlight.grossProfitMargin ? `Gross profit margin : ${financialHighlight.grossProfitMargin}` : null,
              financialHighlight.rndInvestment ? `Investment in R&D : ${financialHighlight.rndInvestment}` : null
            ].filter(Boolean),
            buttons: [
              {
                label: "Download Now",
                href: financialHighlight.documentFile || financialHighlight.cta.href || '#',
                download: !!financialHighlight.documentFile
              },
              {
                label: "View all",
                href: financialHighlight.viewAllUrl || '#'
              }
            ]
          } : null,
          middleCard: integratedReport ? {
            title: integratedReport.reportTitle ? integratedReport.reportTitle.split(' ') : ["Integrated", "Report"],
            image: integratedReport.coverImage ? {
              url: integratedReport.coverImage.url,
              alt: integratedReport.coverImage.alt
            } : null,
            buttons: [
              {
                label: integratedReport.downloadLabel || "Download Now",
                href: integratedReport.reportFile || '#',
                variant: "outline",
                download: !!integratedReport.reportFile
              },
              {
                label: integratedReport.viewAllLabel || "View all",
                href: integratedReport.viewAllUrl || '#',
                variant: "filled"
              }
            ]
          } : null,
          rightCard: mappedData.reportsFilingSection?.nseExchangeSection ? {
            badge: mappedData.reportsFilingSection.nseExchangeSection.sectionTitle || "Exchange filings (BSE/NSE)",
            links: mappedData.reportsFilingSection.nseExchangeSection.pdfDocuments.map(pdf => ({
              text: pdf.title,
              href: pdf.pdf || '#',
              download: !!pdf.pdf
            })),
            button: mappedData.reportsFilingSection.nseExchangeSection.cta ? {
              label: mappedData.reportsFilingSection.nseExchangeSection.cta.text || "View all",
              href: mappedData.reportsFilingSection.nseExchangeSection.cta.href || "#"
            } : {
              label: "View all",
              href: "#"
            }
          } : null
        };
      }

      // Map NewsSection from investor data
      if (mappedData.newsSection) {
        newsInsightsData = mappedData.newsSection;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Investors page - Mapped data:', {
          hasBanner: !!bannerData,
          hasIntro: !!introData,
          hasGovernance: !!governanceData,
          hasShareholder: !!shareholderData,
          hasReportsFilings: !!reportsFilingsData,
          hasNewsInsights: !!newsInsightsData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Investors page - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch investor data from Strapi';
    console.error('Error fetching Investors page data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }


  // Fetch latest Press Releases for What's New section
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

  try {
    // Fetch latest 4 press releases for the slider
    const pressReleasesResponse = await getPressReleases(4);
    const articles = pressReleasesResponse?.data || [];

    if (articles && articles.length > 0) {
      whatsNewData = {
        title: "What's New",
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

  // Default What's New data (fallback) - Keep Press Release with 4 items for slider
  if (!whatsNewData || !whatsNewData.items || whatsNewData.items.length === 0) {
    whatsNewData = {
      title: "What's New",
      items: [
        {
          id: 1,
          date: "December 29, 2025",
          headline: "Lupin Signs Exclusive Licensing Agreement with Gan & Lee Pharmaceuticals for novel GLP-1 receptor agonist",
          category: "Press Release",
          href: "https://www.lupin.com/lupin-signs-exclusive-licensing-agreement-with-gan-lee-pharmaceuticals-for-novel-glp-1-receptor-agonist/"
        },
        {
          id: 2,
          date: "December 18, 2025",
          headline: "Lupin Signs Exclusive Licensing Agreement with Neopharmed for Gastroenterology Brand Plasil® in the Philippines and Brazil",
          category: "Press Release",
          href: "https://www.lupin.com/lupin-signs-exclusive-licensing-agreement-with-neopharmed-for-gastroenterology-brand-plasil-in-the-philippines-and-brazil/"
        },
        {
          id: 3,
          date: "December 17, 2025",
          headline: "Lupin Receives Positive CHMP Opinion for Biosimilar Ranibizumab",
          category: "Press Release",
          href: "https://www.lupin.com/lupin-receives-positive-chmp-opinion-for-biosimilar-ranibizumab/"
        },
        {
          id: 4,
          date: "December 16, 2025",
          headline: "Lupin Receives EIR from US FDA for its Nagpur Injectable Facility",
          category: "Press Release",
          href: "https://www.lupin.com/lupin-receives-eir-from-us-fda-for-its-nagpur-injectable-facility/"
        }
      ]
    };
  }

  // Fetch shareholding pattern iframe data
  let shareholdingPatternData = {
    iframeUrl: "https://content.dionglobal.in/lupinworldnew/ShareHolding.aspx",
    iframeTitle: "Shareholding Pattern"
  };
  
  try {
    const shareholdingData = await fetchAPI('shareholding-pattern?populate=*', {
      cache: 'no-store',
    });
    
    // Handle different response structures (Single Type in Strapi v4)
    // Structure can be: { data: { attributes: {...} } } or { data: {...} } or direct {...}
    const data = shareholdingData?.data || shareholdingData;
    const attributes = data?.attributes || data;
    
    if (attributes) {
      // Try multiple possible field names
      const iframeUrl = attributes.iframeUrl || attributes.iframe?.url || attributes.iframeUrl || "";
      const iframeTitle = attributes.iframeTitle || attributes.iframe?.title || attributes.iframeTitle || "Shareholding Pattern";
      
      // Only update if we got a valid URL
      if (iframeUrl && iframeUrl.trim() !== '' && iframeUrl !== 'null' && iframeUrl !== 'undefined') {
        shareholdingPatternData = {
          iframeUrl: iframeUrl,
          iframeTitle: iframeTitle
        };
      }
    }
  } catch (error) {
    console.error('Error fetching shareholding pattern data from Strapi:', error);
    // Keep default URL on error
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <InvestorIntro data={introData} />
      <WhatsNew data={whatsNewData} />
      <ReportsAndFilings data={reportsFilingsData} />
      <CorporateGovernance data={governanceData} />
      <InteractiveChart showNavigationLinks={false} />

      <ShareholderInformation data={shareholderData} />
     
      {newsInsightsData && <NewsInsights data={newsInsightsData} />}
      <SubscriberUpdated />
    </div>
  );
}

