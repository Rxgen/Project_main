// Strapi API helper functions for Reports & Filings
// Handles the report-filing Single Type with nested repeatable components

import { fetchAPI, getStrapiMedia, mapTopBannerData } from './strapi';
import { normalizeUploadUrl } from './strapi-utils';

/**
 * Fetch report-filing data from Strapi
 * This is a Single Type, so it returns one entry with all sections
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getReportFiling() {
  // Explicitly populate TopBanner DesktopImage and MobileImage (banner images)
  // Populate all nested components following the actual Strapi structure
  // Following chaining method like policies API endpoint
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    // QuarterlyResultsSection -> QuarterlyEarningsSection -> PdfCard -> Pdf
    'populate[QuarterlyResultsSection][populate][QuarterlyEarningsSection][populate][PdfCard][populate][Pdf][populate]=*',
    // AnnualReportSection -> pdfCard -> Pdf, image, pdf (main)
    'populate[AnnualReportSection][populate][pdfCard][populate][Pdf][populate]=*',
    'populate[AnnualReportSection][populate][image][populate]=*',
    'populate[AnnualReportSection][populate][pdf][populate]=*',
    // AnnualReturnsSection -> PdfCard (single component) -> Pdf
    'populate[AnnualReturnsSection][populate][PdfCard][populate][Pdf][populate]=*',
    // Board_Meeting_Filings_Section (with underscores) -> pdfCard -> Pdf
    'populate[Board_Meeting_Filings_Section][populate][pdfCard][populate][Pdf][populate]=*',
    // OtherExchangeFilingsSection -> PdfCard -> Pdf
    'populate[OtherExchangeFilingsSection][populate][PdfCard][populate][Pdf][populate]=*'
  ].join('&');

  return fetchAPI(`report-filing?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map PDF component to standardized format
 * Handles both Pdfcomponent and PdfCard components with various field name cases
 * 
 * @param {Object} pdfCard - PDF card component from Strapi
 * @returns {Object|null} Mapped PDF card or null
 */
function mapPdfCard(pdfCard) {
  if (!pdfCard) return null;

  // Handle different field name cases: Pdf, pdf, PdfCard.pdf, etc.
  // Check for nested structure first (data.attributes), then direct object
  const pdf = pdfCard?.Pdf?.data?.attributes 
    || pdfCard?.Pdf 
    || pdfCard?.pdf?.data?.attributes 
    || pdfCard?.pdf;
  
  // Extract PDF URL - handle both nested and direct structures
  let pdfUrl = null;
  if (pdf) {
    if (typeof pdf === 'string') {
      pdfUrl = getStrapiMedia(pdf);
    } else if (pdf.url) {
      pdfUrl = getStrapiMedia(pdf);
    } else if (pdf.data?.attributes?.url) {
      pdfUrl = getStrapiMedia(pdf.data.attributes);
    }
  }

  // Handle different title field cases: Title, title
  const title = pdfCard?.Title || pdfCard?.title || '';

  // Generate a unique ID if not present
  const cardId = pdfCard.id || pdfCard.documentId || pdf?.documentId || `pdf-${Math.random().toString(36).substr(2, 9)}`;

  if (process.env.NODE_ENV === 'development') {
    console.log('mapPdfCard - Processing card:', {
      cardId,
      title,
      hasPdf: !!pdf,
      pdfUrl,
      pdfStructure: pdf ? Object.keys(pdf) : null,
      isActive: pdfCard?.isActive !== undefined ? pdfCard.isActive : true
    });
  }

  // Normalize PDF URL using the utility function
  const normalizedPdfUrl = normalizeUploadUrl(pdfUrl);
  
  // Return card even if no PDF URL (component will handle it)
  return {
    id: cardId,
    title: title,
    pdfUrl: normalizedPdfUrl || '#',
    pdf: pdf ? {
      url: normalizedPdfUrl,
      name: pdf.name || '',
      size: pdf.size || 0,
      mime: pdf.mime || 'application/pdf',
      alternativeText: pdf.alternativeText || title || ''
    } : null,
    isActive: pdfCard?.isActive !== undefined ? pdfCard.isActive : true,
    publishedDate: pdfCard?.PublishedDate || pdfCard?.publishedDate || null,
    quarterLabel: pdfCard?.QuarterLabel || pdfCard?.quarterLabel || null,
    isAudited: pdfCard?.isAudited !== undefined ? pdfCard.isAudited : false,
  };
}

/**
 * Map Quarterly Earnings Section (nested inside QuarterlyResultsSection)
 * 
 * @param {Object} earningsSection - Quarterly earnings section from Strapi
 * @returns {Object} Mapped quarterly earnings section
 */
function mapQuarterlyEarningsSection(earningsSection) {
  if (!earningsSection) return null;

  // PdfCard (uppercase) in QuarterlyEarningsSection
  // Map all cards and filter out nulls (but keep cards even if they don't have IDs)
  const pdfCards = Array.isArray(earningsSection?.PdfCard)
    ? earningsSection.PdfCard.map(mapPdfCard).filter(card => card !== null)
    : Array.isArray(earningsSection?.pdfCard)
    ? earningsSection.pdfCard.map(mapPdfCard).filter(card => card !== null)
    : [];

  if (process.env.NODE_ENV === 'development') {
    console.log('mapQuarterlyEarningsSection - Processing section:', {
      id: earningsSection.id,
      quarterLabel: earningsSection?.QuarterLabel || earningsSection?.quarterLabel || '',
      pdfCardsCount: pdfCards.length,
      pdfCards: pdfCards.map(card => ({
        id: card.id,
        title: card.title,
        pdfUrl: card.pdfUrl,
        isActive: card.isActive
      }))
    });
  }

  return {
    id: earningsSection.id || null,
    quarterLabel: earningsSection?.QuarterLabel || earningsSection?.quarterLabel || '',
    pdfCards: pdfCards,
  };
}

/**
 * Map Quarterly Results Section data
 * 
 * @param {Object} quarterlySection - Quarterly results section from Strapi
 * @returns {Object} Mapped quarterly results section
 */
function mapQuarterlyResultsSection(quarterlySection) {
  if (!quarterlySection) return null;

  const earningsSections = Array.isArray(quarterlySection?.QuarterlyEarningsSection)
    ? quarterlySection.QuarterlyEarningsSection.map(mapQuarterlyEarningsSection).filter(Boolean)
    : [];

  return {
    id: quarterlySection.id || null,
    financialYear: quarterlySection?.FinancialYear || quarterlySection?.financialYear || '',
    earningsSections: earningsSections,
  };
}

/**
 * Map Annual Report Section data
 * 
 * @param {Object} annualReportSection - Annual report section from Strapi
 * @returns {Object} Mapped annual report section
 */
function mapAnnualReportSection(annualReportSection) {
  if (!annualReportSection) return null;

  // Handle image - check if image exists and is not null
  const image = annualReportSection?.image?.data?.attributes || annualReportSection?.image;
  let imageUrl = null;
  if (image && image !== null && typeof image === 'object') {
    imageUrl = getStrapiMedia(image);
    // If getStrapiMedia returns null or empty, set to null
    if (!imageUrl || imageUrl.trim() === '') {
      imageUrl = null;
    }
  }
  
  const mainPdf = annualReportSection?.pdf?.data?.attributes || annualReportSection?.pdf;
  const mainPdfUrl = mainPdf ? getStrapiMedia(mainPdf) : null;

  // pdfCard is lowercase in AnnualReportSection
  const pdfCards = Array.isArray(annualReportSection?.pdfCard)
    ? annualReportSection.pdfCard.map(mapPdfCard).filter(card => card && card.id !== null)
    : [];

  return {
    id: annualReportSection.id || null,
    tabYear: annualReportSection?.TabYear || annualReportSection?.tabYear || '',
    micrositeUrl: annualReportSection?.MicrositeUrl || annualReportSection?.micrositeUrl || null,
    image: imageUrl ? {
      url: imageUrl,
      alt: image?.alternativeText || image?.caption || '',
      width: image?.width,
      height: image?.height
    } : null,
    mainPdf: mainPdfUrl ? {
      url: mainPdfUrl,
      name: mainPdf.name || '',
      size: mainPdf.size || 0,
      mime: mainPdf.mime || 'application/pdf'
    } : null,
    pdfCards: pdfCards,
  };
}

/**
 * Map Annual Returns Section data
 * 
 * @param {Object} annualReturnsSection - Annual returns section from Strapi
 * @returns {Object} Mapped annual returns section
 */
function mapAnnualReturnsSection(annualReturnsSection) {
  if (!annualReturnsSection) return null;

  // PdfCard is a component (not repeatable) in AnnualReturnsSection
  const pdfCard = annualReturnsSection?.PdfCard 
    ? mapPdfCard(annualReturnsSection.PdfCard) 
    : null;

  return {
    id: annualReturnsSection.id || null,
    pdfCard: pdfCard,
  };
}

/**
 * Map Board Meeting Filings Section data
 * 
 * @param {Object} boardMeetingSection - Board meeting filings section from Strapi
 * @returns {Object} Mapped board meeting filings section
 */
function mapBoardMeetingFilingsSection(boardMeetingSection) {
  if (!boardMeetingSection) return null;

  // pdfCard is lowercase in BoardMeetingFilingsSection
  const pdfCards = Array.isArray(boardMeetingSection?.pdfCard)
    ? boardMeetingSection.pdfCard.map(mapPdfCard).filter(card => card && card.id !== null)
    : [];

  return {
    id: boardMeetingSection.id || null,
    tabYear: boardMeetingSection?.TabYear || boardMeetingSection?.tabYear || '',
    pdfCards: pdfCards,
  };
}

/**
 * Map Other Exchange Filings Section data
 * 
 * @param {Object} otherExchangeSection - Other exchange filings section from Strapi
 * @returns {Object} Mapped other exchange filings section
 */
function mapOtherExchangeFilingsSection(otherExchangeSection) {
  if (!otherExchangeSection) return null;

  const pdfCards = Array.isArray(otherExchangeSection?.PdfCard)
    ? otherExchangeSection.PdfCard.map(mapPdfCard).filter(card => card && card.id !== null)
    : [];

  return {
    id: otherExchangeSection.id || null,
    tabYear: otherExchangeSection?.TabYear || otherExchangeSection?.tabYear || '',
    pdfCards: pdfCards,
  };
}

/**
 * Map complete report-filing data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped report filing data
 */
export function mapReportFilingData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  if (!data) {
    throw new Error('No data received from Strapi API. Check that the report-filing endpoint returns data.');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('mapReportFilingData - Raw data structure:', {
      hasQuarterlyResultsSection: !!data?.QuarterlyResultsSection,
      quarterlyResultsSectionType: Array.isArray(data?.QuarterlyResultsSection) ? 'array' : typeof data?.QuarterlyResultsSection,
      quarterlyResultsSectionLength: Array.isArray(data?.QuarterlyResultsSection) ? data.QuarterlyResultsSection.length : 'N/A',
      quarterlyResultsSectionKeys: data?.QuarterlyResultsSection ? Object.keys(data.QuarterlyResultsSection) : []
    });
  }

  // Map TopBanner if available
  const topBanner = mapTopBannerData(data?.TopBanner);

  // Map each section using new field names
  // Handle both array and single object structures
  let quarterlyResultsSections = [];
  if (Array.isArray(data?.QuarterlyResultsSection)) {
    quarterlyResultsSections = data.QuarterlyResultsSection.map(mapQuarterlyResultsSection).filter(Boolean);
  } else if (data?.QuarterlyResultsSection) {
    // Handle single object structure (if API returns single object instead of array)
    const mapped = mapQuarterlyResultsSection(data.QuarterlyResultsSection);
    if (mapped) {
      quarterlyResultsSections = [mapped];
    }
  }

  const annualReportSections = Array.isArray(data?.AnnualReportSection)
    ? data.AnnualReportSection.map(mapAnnualReportSection).filter(Boolean)
    : [];

  const annualReturnsSections = Array.isArray(data?.AnnualReturnsSection)
    ? data.AnnualReturnsSection.map(mapAnnualReturnsSection).filter(Boolean)
    : [];

  const boardMeetingFilingsSections = Array.isArray(data?.Board_Meeting_Filings_Section)
    ? data.Board_Meeting_Filings_Section.map(mapBoardMeetingFilingsSection).filter(Boolean)
    : Array.isArray(data?.BoardMeetingFilingsSection)
    ? data.BoardMeetingFilingsSection.map(mapBoardMeetingFilingsSection).filter(Boolean)
    : [];

  const otherExchangeFilingsSections = Array.isArray(data?.OtherExchangeFilingsSection)
    ? data.OtherExchangeFilingsSection.map(mapOtherExchangeFilingsSection).filter(Boolean)
    : [];

  if (process.env.NODE_ENV === 'development') {
    console.log('mapReportFilingData - Mapped sections:', {
      quarterlyResultsSectionsCount: quarterlyResultsSections.length,
      quarterlyResultsSections: quarterlyResultsSections.map(section => ({
        id: section.id,
        financialYear: section.financialYear,
        earningsSectionsCount: section.earningsSections?.length || 0,
        earningsSections: section.earningsSections?.map(e => ({
          id: e.id,
          quarterLabel: e.quarterLabel,
          pdfCardsCount: e.pdfCards?.length || 0
        })) || []
      }))
    });
  }

  return {
    topBanner: topBanner,
    quarterlyResultsSections: quarterlyResultsSections,
    annualReportSections: annualReportSections,
    annualReturnsSections: annualReturnsSections,
    boardMeetingFilingsSections: boardMeetingFilingsSections,
    otherExchangeFilingsSections: otherExchangeFilingsSections,
  };
}

/**
 * Get quarterly results grouped by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Quarterly results grouped by year
 */
export function getQuarterlyResultsGrouped(reportFilingData) {
  const grouped = {};

  (reportFilingData.quarterlyResultsSections || []).forEach(section => {
    const year = section.financialYear;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    // Flatten earnings sections into the grouped data
    section.earningsSections.forEach(earnings => {
      grouped[year].push({
        ...earnings,
        financialYear: year
      });
    });
  });

  return grouped;
}

/**
 * Get annual reports grouped by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Annual reports grouped by year
 */
export function getAnnualReportsGrouped(reportFilingData) {
  const grouped = {};

  (reportFilingData.annualReportSections || []).forEach(section => {
    const year = section.tabYear;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(section);
  });

  return grouped;
}

/**
 * Get board meeting filings grouped by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Board meeting filings grouped by year
 */
export function getBoardMeetingFilingsGrouped(reportFilingData) {
  const grouped = {};

  (reportFilingData.boardMeetingFilingsSections || []).forEach(section => {
    const year = section.tabYear;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(section);
  });

  return grouped;
}

/**
 * Get other exchange filings grouped by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Other exchange filings grouped by year
 */
export function getOthersFilingsGrouped(reportFilingData) {
  const grouped = {};

  (reportFilingData.otherExchangeFilingsSections || []).forEach(section => {
    const year = section.tabYear;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(section);
  });

  return grouped;
}

/**
 * Get quarterly results by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @param {string} year - Financial year (e.g., "FY 2025-26")
 * @returns {Array} Quarterly results for the specified year
 */
export function getQuarterlyResultsByYear(reportFilingData, year) {
  return reportFilingData.quarterlyResults.filter(
    result => result.quarterYear === year
  );
}

/**
 * Get annual report by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @param {string} year - Year (e.g., "2025")
 * @returns {Object|null} Annual report for the specified year
 */
export function getAnnualReportByYear(reportFilingData, year) {
  return reportFilingData.annualReports.find(
    report => report.tabYear === year
  ) || null;
}

/**
 * Get board meeting filings by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @param {string} year - Year (e.g., "2025")
 * @returns {Array} Board meeting filings for the specified year
 */
export function getBoardMeetingFilingsByYear(reportFilingData, year) {
  return reportFilingData.boardMeetingFilings.filter(
    filing => filing.tabYear === year
  );
}

/**
 * Get others filings by year
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @param {string} year - Year (e.g., "2025")
 * @returns {Array} Others filings for the specified year
 */
export function getOthersFilingsByYear(reportFilingData, year) {
  return reportFilingData.othersFilings.filter(
    filing => filing.tabYear === year
  );
}

/**
 * Get active annual returns only
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Array} Active annual returns
 */
export function getActiveAnnualReturns(reportFilingData) {
  return (reportFilingData.annualReturnsSections || []).filter(
    section => section.pdfCard && section.pdfCard.isActive !== false
  );
}

/**
 * Get active quarterly results only
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Array} Active quarterly results
 */
export function getActiveQuarterlyResults(reportFilingData) {
  const allResults = [];
  (reportFilingData.quarterlyResultsSections || []).forEach(section => {
    section.earningsSections.forEach(earnings => {
      if (earnings.pdfCards && earnings.pdfCards.some(card => card.isActive !== false)) {
        allResults.push(earnings);
      }
    });
  });
  return allResults;
}

/**
 * Get active annual reports only
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Array} Active annual reports
 */
export function getActiveAnnualReports(reportFilingData) {
  // Annual reports don't have isActive field at section level, so return all
  return reportFilingData.annualReportSections || [];
}

/**
 * Process quarterly data for a specific year
 * Helper function to extract quarterly items and cards from earnings sections
 * 
 * @param {Array} yearData - Array of earnings sections for a specific year
 * @returns {Object} Formatted quarterly data for that year
 */
function processQuarterlyDataForYear(yearData) {
  // New structure: array of quarters, each with its own items and cards
  const quarters = [];
  
  if (process.env.NODE_ENV === 'development') {
    console.log('processQuarterlyDataForYear - Input yearData:', {
      length: yearData.length,
      quarters: yearData.map(e => ({
        quarterLabel: e.quarterLabel,
        pdfCardsCount: e.pdfCards?.length || 0
      }))
    });
  }
  
  if (yearData.length > 0) {
    // Process earnings sections - each section represents a quarter
    // Sort by quarterLabel to ensure Q4 (latest) comes first, then Q3, Q2, Q1
    // Extract quarter number and sort numerically in descending order (Q4, Q3, Q2, Q1)
    const sortedEarnings = [...yearData].sort((a, b) => {
      const aMatch = a.quarterLabel?.match(/Q(\d+)/);
      const bMatch = b.quarterLabel?.match(/Q(\d+)/);
      const aQuarter = aMatch ? parseInt(aMatch[1]) : 999;
      const bQuarter = bMatch ? parseInt(bMatch[1]) : 999;
      return bQuarter - aQuarter; // Sort Q4, Q3, Q2, Q1 in descending order (latest first)
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('processQuarterlyDataForYear - Sorted earnings:', {
        total: sortedEarnings.length,
        quarters: sortedEarnings.map(e => ({
          label: e.quarterLabel,
          quarterNum: e.quarterLabel?.match(/Q(\d+)/)?.[1] || 'N/A',
          pdfCardsCount: e.pdfCards?.length || 0
        }))
      });
    }
    
    // Process each quarter separately
    for (let i = 0; i < sortedEarnings.length; i++) {
      const quarterEarnings = sortedEarnings[i];
      // USE RAW QUARTERLABEL DIRECTLY FROM API - NO REFORMATTING
      const quarterLabel = quarterEarnings.quarterLabel || '';
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Q${i + 1} Label - Using raw from API:`, {
          original: quarterLabel,
          rawQuarterLabel: quarterEarnings.quarterLabel
        });
      }
      
      // Determine status from first card's isAudited field
      const status = quarterEarnings.pdfCards?.[0]?.isAudited ? 'Audited' : 'Unaudited';
      
      // USE RAW QUARTERLABEL DIRECTLY - NO REFORMATTING TO PRESERVE CMS CHANGES
      const formattedPeriod = quarterLabel || `Q${i + 1}`;
      
      // Process cards for this quarter
      const quarterCards = [];
      if (quarterEarnings.pdfCards && quarterEarnings.pdfCards.length > 0) {
        const activeCards = quarterEarnings.pdfCards
          .filter(card => card && card.isActive !== false)
          .map(card => ({
            id: card.id,
            title: card.title || '',
            pdfUrl: card.pdfUrl || '#',
            isActive: card.isActive !== false
          }));
        quarterCards.push(...activeCards);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Q${i + 1} cards added:`, activeCards.length);
        }
      }
      
      // Add this quarter to the quarters array
      quarters.push({
        items: [{
          period: formattedPeriod,
          status: status
        }],
        cards: quarterCards
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Q${i + 1} processed:`, {
          quarterLabel,
          formattedPeriod,
          status,
          pdfCardsCount: quarterEarnings.pdfCards?.length || 0,
          cardsCount: quarterCards.length
        });
      }
    }
  }
  
  // For backward compatibility, also maintain the old structure
  // Q1 goes to quarterlyItems and cards
  // Q2-Q4 go to quarterlyItemsAfterCards and cardsAfterQ2
  const quarterlyItems = quarters[0]?.items || [];
  const cards = quarters[0]?.cards || [];
  const quarterlyItemsAfterCards = quarters.slice(1).flatMap(q => q.items);
  const cardsAfterQ2 = quarters.slice(1).flatMap(q => q.cards);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('processQuarterlyDataForYear - Final result:', {
      quartersCount: quarters.length,
      quarterlyItemsCount: quarterlyItems.length,
      cardsCount: cards.length,
      quarterlyItemsAfterCardsCount: quarterlyItemsAfterCards.length,
      cardsAfterQ2Count: cardsAfterQ2.length,
      quarters: quarters.map((q, idx) => ({
        quarter: q.items[0]?.period,
        cardsCount: q.cards.length
      }))
    });
  }
  
  return {
    quarters, // New structure: array of quarters with items and cards
    quarterlyItems, // Legacy: Q1 items
    cards, // Legacy: Q1 cards
    quarterlyItemsAfterCards, // Legacy: Q2-Q4 items
    cardsAfterQ2 // Legacy: Q2-Q4 cards
  };
}

/**
 * Transform quarterly results for QuarterlyResultsWithTabs component
 * Returns data for all tabs, with each tab having its own quarterly data
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Formatted data for QuarterlyResultsWithTabs
 */
export function transformQuarterlyResultsForComponent(reportFilingData) {
  const grouped = getQuarterlyResultsGrouped(reportFilingData);
  const tabs = Object.keys(grouped).sort().reverse(); // Most recent first
  
  if (process.env.NODE_ENV === 'development') {
    console.log('transformQuarterlyResultsForComponent - Grouped data:', {
      years: tabs,
      yearDataCounts: Object.keys(grouped).map(year => ({
        year,
        quartersCount: grouped[year]?.length || 0,
        quarters: grouped[year]?.map(e => e.quarterLabel) || []
      }))
    });
  }
  
  // Process data for each tab/year
  const tabsData = {};
  
  tabs.forEach(year => {
    const yearData = grouped[year] || [];
    tabsData[year] = processQuarterlyDataForYear(yearData);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`transformQuarterlyResultsForComponent - ${year} processed:`, {
        quarterlyItemsCount: tabsData[year].quarterlyItems.length,
        cardsCount: tabsData[year].cards.length,
        quarterlyItemsAfterCardsCount: tabsData[year].quarterlyItemsAfterCards.length,
        cardsAfterQ2Count: tabsData[year].cardsAfterQ2.length,
        allQuarters: [
          ...tabsData[year].quarterlyItems.map(i => i.period),
          ...tabsData[year].quarterlyItemsAfterCards.map(i => i.period)
        ]
      });
    }
  });
  
  // For backward compatibility, also return data for the first year
  const firstYear = tabs[0];
  const firstYearData = tabsData[firstYear] || {
    quarterlyItems: [],
    cards: [],
    quarterlyItemsAfterCards: [],
    cardsAfterQ2: []
  };
  
  return {
    tabs,
    tabsData,
    // Legacy fields for first year (for components that haven't been updated yet)
    quarterlyItems: firstYearData.quarterlyItems,
    cards: firstYearData.cards,
    quarterlyItemsAfterCards: firstYearData.quarterlyItemsAfterCards,
    cardsAfterQ2: firstYearData.cardsAfterQ2
  };
}

/**
 * Transform annual reports for IntegratedReportAnnualReport component
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Formatted data for IntegratedReportAnnualReport
 */
export function transformAnnualReportsForComponent(reportFilingData) {
  const grouped = getAnnualReportsGrouped(reportFilingData);
  const tabs = Object.keys(grouped).sort().reverse(); // Most recent first
  
  const tabsData = {};
  
  tabs.forEach(year => {
    const reports = grouped[year];
    if (reports.length > 0) {
      const report = reports[0]; // Take first report for this year
      
      // Transform pdfCards to extraSmallCards format
      const extraSmallCards = report.pdfCards.map(card => ({
        id: card.id,
        title: card.title,
        pdfUrl: card.pdfUrl || '#',
        isActive: card.isActive
      }));
      
      // Create cardData
      const cardData = {
        title: report.title ? report.title.split(' ').slice(-2) : ["Financial Year", year],
        image: report.image && report.image.url && typeof report.image.url === 'string' && report.image.url.trim() !== '' ? {
          url: report.image.url,
          alt: report.image.alt || ''
        } : null,
        buttons: [
          {
            label: "Download Now",
            href: report.mainPdf?.url || "#",
            variant: "outline"
          },
          {
            label: "Visit ESG Microsite",
            href: report.micrositeUrl || "#",
            variant: "filled"
          }
        ]
      };
      
      tabsData[year] = {
        cardData,
        extraSmallCards
      };
    }
  });
  
  return {
    tabs,
    tabsData
  };
}

/**
 * Transform annual returns for AnnualReturns component
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Array} Formatted cards for AnnualReturns
 */
export function transformAnnualReturnsForComponent(reportFilingData) {
  const activeReturns = getActiveAnnualReturns(reportFilingData);
  
  return activeReturns.map(section => ({
    id: section.id,
    title: section.pdfCard?.title || 'Annual Return',
    pdfUrl: section.pdfCard?.pdfUrl || '#',
    isActive: section.pdfCard?.isActive !== false
  }));
}

/**
 * Transform board meeting filings for ExchangeFilings component
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Formatted data for ExchangeFilings
 */
export function transformBoardMeetingFilingsForComponent(reportFilingData) {
  const grouped = getBoardMeetingFilingsGrouped(reportFilingData);
  const tabs = Object.keys(grouped).sort().reverse(); // Most recent first
  
  const tabsData = {};
  
  tabs.forEach(year => {
    const filings = grouped[year];
    const cards = [];
    
    filings.forEach(filing => {
      filing.pdfCards.forEach(card => {
        cards.push({
          links: [{
            text: card.title,
            href: card.pdfUrl || '#'
          }]
        });
      });
    });
    
    tabsData[year] = {
      cards: cards.length > 0 ? cards : null
    };
  });
  
  return {
    tabs,
    tabsData
  };
}

/**
 * Transform others filings for ExchangeFilings component
 * 
 * @param {Object} reportFilingData - Mapped report filing data
 * @returns {Object} Formatted data for ExchangeFilings
 */
export function transformOthersFilingsForComponent(reportFilingData) {
  const grouped = getOthersFilingsGrouped(reportFilingData);
  const tabs = Object.keys(grouped).sort().reverse(); // Most recent first
  
  const tabsData = {};
  
  tabs.forEach(year => {
    const filings = grouped[year];
    const cards = [];
    
    filings.forEach(filing => {
      filing.pdfCards.forEach(card => {
        cards.push({
          links: [{
            text: card.title,
            href: card.pdfUrl || '#'
          }]
        });
      });
    });
    
    tabsData[year] = {
      cards: cards.length > 0 ? cards : null
    };
  });
  
  return {
    tabs,
    tabsData
  };
}

/**
 * Fetch policy data from Strapi
 * This is a Single Type, so it returns one entry with PolicyDocumentsSection array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getPolicy() {
  // Use simpler populate format that works - populate all fields recursively
  // This will populate TopBanner (DesktopImage, MobileImage, Heading, SubHeading) and PolicyDocumentsSection (Title, PublishedDate, Pdf, isActive)
  return fetchAPI('policy?populate[TopBanner][populate]=*&populate[PolicyDocumentsSection][populate]=*', {
    cache: 'no-store',
  });
}

/**
 * Map policy data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped policy data for component
 */
export function mapPolicyData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, throw error so page can handle it properly
  if (!data) {
    throw new Error('No data received from Strapi API. Check that the policy endpoint returns data.');
  }

  // Map PolicyDocumentsSection array to component format with chaining
  const policies = Array.isArray(data?.PolicyDocumentsSection)
    ? data.PolicyDocumentsSection.map((card) => {
        let pdfUrl = null;

        // Try to get PDF URL from different possible sources using chaining:
        // 1. PDF stored as Strapi Media file (card.Pdf) - direct structure from API
        if (card?.Pdf) {
          // Handle both nested (data.attributes) and direct structure
          const pdf = card.Pdf?.data?.attributes || card.Pdf;
          if (pdf?.url || pdf) {
            pdfUrl = getStrapiMedia(pdf);
          }
        }
        
        // 2. Fallback to lowercase field names (for backward compatibility)
        if (!pdfUrl && card?.pdf) {
          const pdf = card.pdf?.data?.attributes || card.pdf;
          if (pdf?.url || pdf) {
            pdfUrl = getStrapiMedia(pdf);
          }
        }
        
        // 3. PDF stored as external URL text field (card.pdfUrl)
        if (!pdfUrl && card?.pdfUrl) {
          pdfUrl = card.pdfUrl;
        }
        
        // 4. PDF stored as direct URL string in Pdf field
        if (!pdfUrl && typeof card?.Pdf === 'string' && card.Pdf.startsWith('http')) {
          pdfUrl = card.Pdf;
        }

        // Log in development if PDF URL is missing
        if (process.env.NODE_ENV === 'development' && !pdfUrl) {
          console.warn(`Policy "${card?.Title || card?.title || 'Unknown'}" (ID: ${card?.id || 'N/A'}) is missing PDF URL. Available fields:`, Object.keys(card || {}));
        }

        return {
          id: card?.id || null,
          title: card?.Title || card?.title || '',
          pdfUrl: pdfUrl || '#',
          isActive: card?.isActive !== undefined ? card.isActive : false,
          publishedDate: card?.PublishedDate || card?.publishedDate || null
        };
      }).filter(policy => policy.id !== null) // Filter out invalid policies
    : [];

  // Return in component-expected format (images are static assets, not from API)
  return {
    policies: policies,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorativeGroup: "/assets/policies/group.svg"
    }
  };
}

/**
 * Fetch code-of-conduct data from Strapi
 * This is a Single Type, so it returns one entry with CodeOfConductDocumentsSection array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getCodeOfConduct() {
  // Populate TopBanner, CodeOfConductDocumentsSection, and DocumentSection with nested LangaugePdfDocument
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[DocumentSection][populate][Pdf][populate]=*',
    'populate[DocumentSection][populate][LangaugePdfDocument][populate][Pdf][populate]=*'
  ].join('&');
  
  return fetchAPI(`code-of-conduct?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map code-of-conduct data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped code of conduct data for component
 */
export function mapCodeOfConductData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, throw error so page can handle it properly
  if (!data) {
    throw new Error('No data received from Strapi API. Check that the code-of-conduct endpoint returns data.');
  }

  // Map CodeOfConductDocumentsSection array to component format with chaining
  const codes = Array.isArray(data?.CodeOfConductDocumentsSection)
    ? data.CodeOfConductDocumentsSection.map((card) => {
        let pdfUrl = null;

        // Try to get PDF URL from different possible sources using chaining:
        // 1. PDF stored as Strapi Media file (card.Pdf) - direct structure from API
        if (card?.Pdf) {
          // Handle both nested (data.attributes) and direct structure
          const pdf = card.Pdf?.data?.attributes || card.Pdf;
          if (pdf?.url || pdf) {
            pdfUrl = getStrapiMedia(pdf);
          }
        }
        
        // 2. Fallback to lowercase field names (for backward compatibility)
        if (!pdfUrl && card?.pdf) {
          const pdf = card.pdf?.data?.attributes || card.pdf;
          if (pdf?.url || pdf) {
            pdfUrl = getStrapiMedia(pdf);
          }
        }
        
        // 3. PDF stored as external URL text field (card.pdfUrl)
        if (!pdfUrl && card?.pdfUrl) {
          pdfUrl = card.pdfUrl;
        }
        
        // 4. PDF stored as direct URL string in Pdf field
        if (!pdfUrl && typeof card?.Pdf === 'string' && card.Pdf.startsWith('http')) {
          pdfUrl = card.Pdf;
        }

        // Log in development if PDF URL is missing
        if (process.env.NODE_ENV === 'development' && !pdfUrl) {
          console.warn(`Code of Conduct "${card?.Title || card?.title || 'Unknown'}" (ID: ${card?.id || 'N/A'}) is missing PDF URL. Available fields:`, Object.keys(card || {}));
        }

        return {
          id: card?.id || null,
          title: card?.Title || card?.title || '',
          pdfUrl: normalizeUploadUrl(pdfUrl) || '#',
          isActive: card?.isActive !== undefined ? card.isActive : false,
          publishedDate: card?.PublishedDate || card?.publishedDate || null
        };
      }).filter(code => code.id !== null) // Filter out invalid codes
    : [];

  // Map DocumentSection (new section with language PDFs)
  const documentSections = Array.isArray(data?.DocumentSection)
    ? data.DocumentSection
        .filter(section => section?.isActive !== false && section?.IsActive !== false)
        .map((section) => {
          // Get main PDF URL
          let mainPdfUrl = null;
          if (section?.Pdf) {
            const pdf = section.Pdf?.data?.attributes || section.Pdf;
            if (pdf?.url || pdf) {
              mainPdfUrl = getStrapiMedia(pdf);
            }
          }
          if (!mainPdfUrl && section?.pdf) {
            const pdf = section.pdf?.data?.attributes || section.pdf;
            if (pdf?.url || pdf) {
              mainPdfUrl = getStrapiMedia(pdf);
            }
          }

          // Map LangaugePdfDocument (nested repeatable component)
          const languagePdfs = Array.isArray(section?.LangaugePdfDocument)
            ? section.LangaugePdfDocument
                .filter(lang => lang?.isActive !== false && lang?.IsActive !== false)
                .map((lang) => {
                  let langPdfUrl = null;
                  if (lang?.Pdf) {
                    const pdf = lang.Pdf?.data?.attributes || lang.Pdf;
                    if (pdf?.url || pdf) {
                      langPdfUrl = getStrapiMedia(pdf);
                    }
                  }
                  if (!langPdfUrl && lang?.pdf) {
                    const pdf = lang.pdf?.data?.attributes || lang.pdf;
                    if (pdf?.url || pdf) {
                      langPdfUrl = getStrapiMedia(pdf);
                    }
                  }

                  return {
                    id: lang?.id || null,
                    title: lang?.Title || lang?.title || '',
                    pdfUrl: normalizeUploadUrl(langPdfUrl) || '#',
                    isActive: lang?.isActive !== false,
                    publishedDate: lang?.PublishedDate || lang?.publishedDate || null
                  };
                })
                .filter(lang => lang.id !== null && lang.pdfUrl !== '#')
            : [];

          return {
            id: section?.id || null,
            pdfTitle: section?.PdfTitle || section?.pdfTitle || '',
            pdfUrl: normalizeUploadUrl(mainPdfUrl) || '#',
            isActive: section?.isActive !== false,
            publishedDate: section?.PublishedDate || section?.publishedDate || null,
            languagePdfs: languagePdfs
          };
        })
        .filter(section => section.id !== null)
    : [];

  // Return in component-expected format (images are static assets, not from API)
  return {
    codes: codes,
    documentSections: documentSections,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorativeGroup: "/assets/policies/group.svg"
    }
  };
}

/**
 * Fetch analyst-coverage data from Strapi
 * This is a Single Type, so it returns one entry with AnalystCoverageSection array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getAnalystCoverage() {
  // Explicitly populate TopBanner DesktopImage and MobileImage (banner images)
  // Populate AnalystCoverageSection with all fields (Institution, AnalystName, Email, DisplayOrder)
  // Following chaining method like policies API endpoint
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[AnalystCoverageSection][populate]=*'
  ].join('&');
  
  return fetchAPI(`analyst-coverage?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map analyst coverage data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Array} Mapped analyst data array
 */
export function mapAnalystCoverageData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, throw error so page can handle it properly
  if (!data) {
    throw new Error('No data received from Strapi API. Check that the analyst-coverage endpoint returns data.');
  }

  // Map AnalystCoverageSection array to component format with chaining
  const analysts = Array.isArray(data?.AnalystCoverageSection)
    ? data.AnalystCoverageSection.map((card, index) => ({
        id: card?.id || index + 1,
        institution: card?.Institution || card?.institution || card?.company_name || '',
        analyst: card?.AnalystName || card?.analystName || card?.name || '',
        email: card?.Email || card?.email || '',
        isActive: card?.isActive !== undefined ? card.isActive : false,
        displayOrder: card?.DisplayOrder || card?.displayOrder || null
      }))
    : [];

  // Sort by displayOrder if available, otherwise keep original order
  return analysts.sort((a, b) => {
    if (a.displayOrder !== null && b.displayOrder !== null) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder !== null) return -1;
    if (b.displayOrder !== null) return 1;
    return 0;
  });
}

/**
 * Fetch investor-faqs data from Strapi
 * This is a Single Type, so it returns one entry with FaqSection array and TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getInvestorFAQs() {
  // Explicitly populate TopBanner DesktopImage and MobileImage (banner images)
  // Populate FaqSection with all fields (Question, Answer, isActive)
  // Following chaining method like policies API endpoint
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[FaqSection][populate]=*'
  ].join('&');
  
  return fetchAPI(`investor-faq?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map investor FAQs data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped investor FAQs data for component
 */
export function mapInvestorFAQsData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, throw error so page can handle it properly
  if (!data) {
    throw new Error('No data received from Strapi API. Check that the investor-faqs endpoint returns data.');
  }

  // Map FaqSection array to component format with chaining
  const faqs = Array.isArray(data?.FaqSection)
    ? data.FaqSection.map((faq, index) => ({
        id: faq?.id || index,
        question: faq?.Question || faq?.question || '',
        answer: faq?.Answer || faq?.answer || '',
        isActive: faq?.isActive !== undefined ? faq.isActive : true
      })).filter(faq => faq.isActive && faq.question) // Only include active FAQs with questions
    : [];

  return {
    faqs: faqs
  };
}

/**
 * Fetch financial data from Strapi
 * This is a Single Type, so it returns one entry with all sections
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getFinancial() {
  // Populate all nested components and media
  // Following the structure from the screenshot and same pattern as reports-and-filings:
  // - TopBanner with DesktopImage and MobileImage
  // - RevenueProfitabilitySection with charts (FinancialMetricChart) and data (FinancialMetricItem)
  // - Financial_Document_Item (PdfCard array) - May be top-level or nested
  // - RelatedPartyTransactionsSection (PdfCard array) - Top-level repeatable component
  // 
  // Structure: RevenueProfitabilitySection -> charts (FinancialMetricChart) -> data (FinancialMetricItem)
  // Need to explicitly populate the nested data array within charts
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    // Populate RevenueProfitabilitySection -> charts -> data (nested structure)
    'populate[RevenueProfitabilitySection][populate][charts][populate][data][populate]=*',
    // Financial_Document_Item is nested inside RevenueProfitabilitySection
    'populate[RevenueProfitabilitySection][populate][Financial_Document_Item][populate][Pdf][populate]=*',
    // RelatedPartyTransactionsSection is a top-level repeatable component (PdfCard)
    'populate[RelatedPartyTransactionsSection][populate][Pdf][populate]=*'
  ].join('&');
  
  return fetchAPI(`financial?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map RevenueProfitabilitySection data from Strapi
 * 
 * @param {Object} section - RevenueProfitabilitySection from Strapi
 * @returns {Object} Mapped revenue profitability data for FinancialBarSection
 */
function mapRevenueProfitabilitySection(section) {
  if (!section) return null;

  const sectionTitle = section?.SectionTitle || section?.sectionTitle || 'Revenue and Profitability';
  
  // Map charts array
  const charts = Array.isArray(section?.charts)
    ? section.charts.map((chart) => {
        const metricTitle = chart?.MetricTitleTitle || chart?.metricTitleTitle || chart?.MetricTitle || '';
        const unit = chart?.Unit || chart?.unit || '';
        const chartTitle = unit ? `${metricTitle} (${unit})` : metricTitle;
        
        // Map data array (FinancialMetricItem)
        // Handle both direct data array and nested structure (data or Data)
        const chartData = chart?.data || chart?.Data || [];
        const data = Array.isArray(chartData)
          ? chartData.map((item) => {
              const financialYear = item?.FinancialYear || item?.financialYear || '';
              const year = item?.Year || item?.year || '';
              const amount = item?.Amount || item?.amount || '0';
              
              // Format label: "FY25 – 221,921" or "FY 2025-26 – 221,921"
              const yearLabel = financialYear || year || '';
              // Parse amount - handle string numbers with commas or spaces
              const amountNum = typeof amount === 'string' 
                ? parseFloat(amount.replace(/[,\s]/g, '')) 
                : parseFloat(amount) || 0;
              const formattedAmount = amountNum > 0 ? amountNum.toLocaleString('en-US') : '0';
              const label = yearLabel ? `${yearLabel} – ${formattedAmount}` : formattedAmount;
              
              return {
                label: label,
                value: amountNum
              };
            }).filter(item => item.value > 0 || item.label) // Filter out empty items
          : [];
        
        // Only return chart if it has data
        if (data.length === 0) return null;
        
        return {
          title: chartTitle,
          data: data
        };
      }).filter(chart => chart !== null) // Filter out null charts
    : [];

  return {
    title: sectionTitle,
    charts: charts
  };
}

/**
 * Map financial data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped financial data for components
 */
export function mapFinancialData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, throw error so page can handle it properly
  if (!data) {
    throw new Error('No data received from Strapi API. Check that the financial endpoint returns data.');
  }

  // Map RevenueProfitabilitySection
  const revenueProfitabilityData = mapRevenueProfitabilitySection(
    data?.RevenueProfitabilitySection || data?.revenueProfitabilitySection
  );

  // Map Financial_Document_Item (PdfCard array) - for financial documents
  // Financial_Document_Item is nested inside RevenueProfitabilitySection (as confirmed by API response)
  const financialDocumentsData = data?.RevenueProfitabilitySection?.Financial_Document_Item
    || data?.RevenueProfitabilitySection?.FinancialDocumentItem
    || data?.Financial_Document_Item
    || data?.FinancialDocumentItem;
  const financialDocuments = Array.isArray(financialDocumentsData)
    ? financialDocumentsData.map((card, index) => {
        // Handle Pdf field (uppercase) or pdf (lowercase)
        const pdf = card?.Pdf?.data?.attributes || card?.Pdf || card?.pdf?.data?.attributes || card?.pdf;
        const pdfUrl = pdf ? getStrapiMedia(pdf) : null;

        return {
          id: card?.id || index + 1,
          title: card?.Title || card?.title || '',
          pdfUrl: pdfUrl || '#',
          isActive: card?.isActive !== undefined ? card.isActive : false,
          publishedDate: card?.PublishedDate || card?.publishedDate || null
        };
      }).filter(card => card.title) // Only include cards with titles
    : [];

  // Map RelatedPartyTransactionsSection (PdfCard array) - for related party transactions
  const relatedPartyTransactions = Array.isArray(data?.RelatedPartyTransactionsSection)
    ? data.RelatedPartyTransactionsSection.map((card, index) => {
        // Handle Pdf field (uppercase) or pdf (lowercase)
        const pdf = card?.Pdf?.data?.attributes || card?.Pdf || card?.pdf?.data?.attributes || card?.pdf;
        const pdfUrl = pdf ? getStrapiMedia(pdf) : null;

        return {
          id: card?.id || index + 1,
          title: card?.Title || card?.title || '',
          pdfUrl: pdfUrl || '#',
          isActive: card?.isActive !== undefined ? card.isActive : false,
          publishedDate: card?.PublishedDate || card?.publishedDate || null
        };
      }).filter(card => card.title) // Only include cards with titles
    : [];

  return {
    revenueProfitability: revenueProfitabilityData,
    financialDocuments: financialDocuments,
    relatedPartyTransactions: relatedPartyTransactions
  };
}

/**
 * Fetch subsidiary data from Strapi
 * This is a Collection Type, so it returns an array of entries
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getSubsidiary() {
  // Populate all nested components and media
  // Following the structure from the screenshot and same pattern as Financial API:
  // - TopBanner with DesktopImage and MobileImage
  // - Subsidiaries (Repeatable Component - SubsidiaryItem) with SubsidiaryName
  // - Documents (Repeatable Component - Subsidiary-yearly-document) nested inside Subsidiaries
  //   with FinancialYear, DocumentFilePdf, isActive, DisplayOrder
  // - PdfTitle and AnnualReturnsPdf (at SubsidiaryItem level)
  // 
  // Following the same pattern as getFinancial() which successfully handles nested components
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[Subsidiaries][populate][Documents][populate][DocumentFilePdf][populate]=*',
    'populate[Subsidiaries][populate][AnnualReturnsPdf][populate]=*'
  ].join('&');
  
  return fetchAPI(`subsidiary?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map subsidiary data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped subsidiary data for component
 */
export function mapSubsidiaryData(strapiData) {
  // Handle Strapi v4 response structure (Single Type, not Collection Type)
  // Structure: data.Subsidiaries[] where each item has Documents[]
  const data = strapiData?.data || strapiData;

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('mapSubsidiaryData - Raw data:', {
      hasData: !!strapiData,
      hasDataObject: !!data,
      isArray: Array.isArray(data),
      keys: data ? Object.keys(data) : [],
      subsidiaries: data?.Subsidiaries || data?.subsidiaries
    });
  }

  // If no data, return empty array
  if (!data) {
    if (process.env.NODE_ENV === 'development') {
      console.log('mapSubsidiaryData - No data found');
    }
    return {
      subsidiaries: []
    };
  }

  // Get Subsidiaries array (Repeatable Component - SubsidiaryItem)
  // This is a Single Type, so Subsidiaries is directly on the data object
  const subsidiariesArray = data?.Subsidiaries || data?.subsidiaries || [];

  if (process.env.NODE_ENV === 'development') {
    console.log('mapSubsidiaryData - Subsidiaries array:', {
      length: subsidiariesArray.length,
      firstSubsidiary: subsidiariesArray[0]
    });
  }

  // Map each subsidiary item
  // Documents are nested inside each SubsidiaryItem
  const subsidiaries = subsidiariesArray.map((subsidiaryItem, index) => {
    const subsidiaryName = subsidiaryItem?.SubsidiaryName || subsidiaryItem?.subsidiaryName || '';
    
    // Get Documents from subsidiary item (nested inside each SubsidiaryItem)
    const documentsArray = subsidiaryItem?.Documents || subsidiaryItem?.documents || [];
    
    // Get PdfTitle and AnnualReturnsPdf from subsidiary item (at SubsidiaryItem level)
    const pdfTitle = subsidiaryItem?.PdfTitle || subsidiaryItem?.pdfTitle || 'Annual Returns';
    const annualReturnsPdf = subsidiaryItem?.AnnualReturnsPdf?.data?.attributes || subsidiaryItem?.AnnualReturnsPdf || subsidiaryItem?.annualReturnsPdf?.data?.attributes || subsidiaryItem?.annualReturnsPdf;
    const annualReturnsPdfUrl = annualReturnsPdf ? getStrapiMedia(annualReturnsPdf) : null;
    
    if (process.env.NODE_ENV === 'development' && index === 0) {
      console.log('mapSubsidiaryData - First subsidiary mapping:', {
        name: subsidiaryName,
        documentsCount: documentsArray.length,
        firstDocument: documentsArray[0],
        pdfTitle: pdfTitle,
        hasAnnualReturnsPdf: !!annualReturnsPdf,
        annualReturnsPdfUrl: annualReturnsPdfUrl
      });
    }
    
    // Map documents to years format
    const years = Array.isArray(documentsArray)
      ? documentsArray
          .filter(doc => doc?.isActive !== false) // Only active documents (isActive !== false)
          .map((doc) => {
            const financialYear = doc?.FinancialYear || doc?.financialYear || '';
            const documentPdf = doc?.DocumentFilePdf?.data?.attributes || doc?.DocumentFilePdf || doc?.documentFilePdf?.data?.attributes || doc?.documentFilePdf;
            const pdfUrl = documentPdf ? getStrapiMedia(documentPdf) : '#';
            const displayOrder = doc?.DisplayOrder || doc?.displayOrder || '';
            
            return {
              year: financialYear || displayOrder || '',
              url: pdfUrl,
              isActive: doc?.isActive !== false
            };
          })
          .filter(year => year.year) // Filter out empty years
          .sort((a, b) => {
            // Sort by year (descending - most recent first)
            return b.year.localeCompare(a.year);
          })
      : [];
    
    return {
      id: subsidiaryItem?.id || index + 1,
      name: subsidiaryName,
      years: years,
      annualReturns: annualReturnsPdfUrl ? {
        title: pdfTitle,
        url: annualReturnsPdfUrl
      } : null
    };
  }).filter(subsidiary => subsidiary.name); // Only include subsidiaries with name (years can be empty)

  if (process.env.NODE_ENV === 'development') {
    console.log('mapSubsidiaryData - Mapped result:', {
      subsidiariesCount: subsidiaries.length,
      firstSubsidiary: subsidiaries[0]
    });
  }

  return {
    subsidiaries: subsidiaries
  };
}

/**
 * Fetch employee-stock-option-scheme data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getEmployeeStockOptionScheme() {
  // Populate all nested components and media
  // Following the structure from the screenshot and same pattern as other Single Types:
  // - TopBanner with DesktopImage and MobileImage
  // - EmployeeStockOptionSchemesSection (Repeatable Component - PdfCard) with Title, PublishedDate, Pdf, isActive
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[EmployeeStockOptionSchemesSection][populate][Pdf][populate]=*'
  ].join('&');
  
  return fetchAPI(`employee-stock-option-scheme?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map employee stock option scheme data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped employee stock option scheme data for component
 */
export function mapEmployeeStockOptionSchemeData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty array
  if (!data) {
    return {
      schemes: []
    };
  }

  // Get EmployeeStockOptionSchemesSection array (Repeatable Component - PdfCard)
  const schemesArray = data?.EmployeeStockOptionSchemesSection || data?.employeeStockOptionSchemesSection || [];

  // Map schemes array to component format
  const schemes = schemesArray
    .filter(scheme => scheme?.isActive !== false) // Only active schemes
    .map((scheme, index) => {
      // Handle Pdf field (uppercase) or pdf (lowercase)
      const pdf = scheme?.Pdf?.data?.attributes || scheme?.Pdf || scheme?.pdf?.data?.attributes || scheme?.pdf;
      const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';

      return {
        id: scheme?.id || index + 1,
        title: scheme?.Title || scheme?.title || '',
        pdfUrl: normalizeUploadUrl(pdfUrl),
        isActive: scheme?.isActive !== false
      };
    })
    .filter(scheme => scheme.title); // Only include schemes with titles

  return {
    schemes: schemes
  };
}

/**
 * Fetch investor-regulation-disclosure data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getInvestorRegulationDisclosure() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - DisclosureIntroSection (Component - DisclouserIntroData) with:
  //   - SectionTitle (Text)
  //   - Description (Rich text - Markdown)
  // - RegulationDisclosureSection (Repeatable Component - RegulationDisclosureItem) with:
  //   - Particular (Rich text)
  //   - Documents (Repeatable Component - DisclosureDocumentLink) with Label, DocumentFile, Url, isActive
  //   - isActive (Boolean)
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[DisclosureIntroSection][populate]=*',
    'populate[RegulationDisclosureSection][populate][Documents][populate][DocumentFile][populate]=*'
  ].join('&');
  
  return fetchAPI(`investor-regulation-disclosure?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map investor regulation disclosure data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped investor regulation disclosure data for component
 */
export function mapInvestorRegulationDisclosureData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty array
  if (!data) {
    return {
      items: [],
      introSection: null
    };
  }

  // Map DisclosureIntroSection (Component - DisclouserIntroData)
  const introSection = data?.DisclosureIntroSection || data?.disclosureIntroSection;
  let introData = null;
  
  if (introSection) {
    const sectionTitle = introSection?.SectionTitle || introSection?.sectionTitle || '';
    const description = introSection?.Description || introSection?.description || '';
    
    // Handle rich text (Markdown) for description
    let descriptionText = description;
    if (typeof description === 'object' && description !== null) {
      if (description.markdown) {
        descriptionText = description.markdown;
      } else if (description.data?.markdown) {
        descriptionText = description.data.markdown;
      } else {
        descriptionText = String(description);
      }
    }
    
    introData = {
      sectionTitle: sectionTitle,
      description: descriptionText
    };
  }

  // Get RegulationDisclosureSection array (Repeatable Component - RegulationDisclosureItem)
  const sectionsArray = data?.RegulationDisclosureSection || data?.regulationDisclosureSection || [];

  // Map sections to items
  // One row per section (Particular), with multiple documents/links
  let itemNumber = 1;
  const items = [];

  sectionsArray
    .filter(section => section?.isActive !== false) // Only active sections
    .forEach((section) => {
      const particular = section?.Particular || section?.particular || '';
      const documentsArray = section?.Documents || section?.documents || [];

      if (!particular) {
        return; // Skip sections without particular text
      }

      // Get all active documents for this particular
      const activeDocuments = documentsArray.filter(doc => doc?.isActive !== false);
      const documents = [];

      activeDocuments.forEach((doc) => {
        let url = '#';
        const label = doc?.Label || doc?.label || 'Click here to visit';
        
        // Priority: Url first, then DocumentFile
        if (doc?.Url || doc?.url) {
          url = doc?.Url || doc?.url || '#';
        } else if (doc?.DocumentFile) {
          // Extract DocumentFile URL
          const documentFile = doc?.DocumentFile?.data?.attributes || doc?.DocumentFile || doc?.documentFile?.data?.attributes || doc?.documentFile;
          url = documentFile ? getStrapiMedia(documentFile) : '#';
        }

        // Add all documents - handle "NA" cases and valid links
        // sectionId: when set in CMS (e.g. "shareholding-information"), link redirects to that section on investors page
        const sectionId = doc?.SectionId || doc?.sectionId || doc?.SectionID || null;
        documents.push({
          id: doc?.id || null,
          label: label,
          url: url || '#',
          ...(sectionId ? { sectionId: String(sectionId).trim() } : {})
        });
      });

      // Handle rich text (Markdown) - if it's an object with markdown property, extract it
      let particularsText = particular;
      if (typeof particular === 'object' && particular !== null) {
        if (particular.markdown) {
          particularsText = particular.markdown;
        } else if (particular.data?.markdown) {
          particularsText = particular.data.markdown;
        } else {
          // Fallback: try to stringify or use empty string
          particularsText = String(particular);
        }
      }
      
      // Add item - if no documents, add a default "NA" document
      items.push({
        id: section?.id || itemNumber,
        number: String(itemNumber),
        particulars: particularsText,
        documents: documents.length > 0 ? documents : [{ label: 'NA', url: '#' }] // Default to NA if no documents
      });
      itemNumber++;
    });

  return {
    items: items,
    introSection: introData
  };
}

/**
 * Fetch dividend data from Strapi
 * This is a Single Type, so it returns one entry
 * Note: API endpoint is "divedend" (typo in Strapi)
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getDividend() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - DividendTdsCommunicationSection (Component - DividendTdsDocumentCard) with:
  //   - Heading, SubHeading, Description (Rich text)
  //   - PdfCard (Component - PdfCard) with Title, PublishedDate, Pdf, isActive
  // - DivedendHistorySection (Component - DividendHistorySection) with:
  //   - IntroText (Rich text), DivedendHistory (Rich text), isActive
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[DividendTdsCommunicationSection][populate][PdfCard][populate][Pdf][populate]=*',
    'populate[DivedendHistorySection][populate]=*'
  ].join('&');
  
  return fetchAPI(`divedend?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map dividend data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped dividend data for components
 */
export function mapDividendData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      tdsSection: null,
      historySection: null
    };
  }

  // Map DividendTdsCommunicationSection
  const tdsSection = data?.DividendTdsCommunicationSection || data?.dividendTdsCommunicationSection;
  let mappedTdsSection = null;
  
  if (tdsSection && tdsSection?.isActive !== false) {
    const pdfCard = tdsSection?.PdfCard || tdsSection?.pdfCard;
    const pdf = pdfCard?.Pdf?.data?.attributes || pdfCard?.Pdf || pdfCard?.pdf?.data?.attributes || pdfCard?.pdf;
    const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';

    mappedTdsSection = {
      heading: tdsSection?.Heading || tdsSection?.heading || '',
      subHeading: tdsSection?.SubHeading || tdsSection?.subHeading || '',
      description: tdsSection?.Description || tdsSection?.description || '',
      pdfCard: pdfCard ? {
        title: pdfCard?.Title || pdfCard?.title || '',
        publishedDate: pdfCard?.PublishedDate || pdfCard?.publishedDate || '',
        pdfUrl: pdfUrl,
        isActive: pdfCard?.isActive !== false
      } : null
    };
  }

  // Map DivedendHistorySection
  const historySection = data?.DivedendHistorySection || data?.divedendHistorySection;
  let mappedHistorySection = null;
  
  if (historySection && historySection?.isActive !== false) {
    mappedHistorySection = {
      introText: historySection?.IntroText || historySection?.introText || '',
      dividendHistory: historySection?.DivedendHistory || historySection?.divedendHistory || ''
    };
  }

  return {
    tdsSection: mappedTdsSection,
    historySection: mappedHistorySection
  };
}

/**
 * Convert JSON table data to HTML table format
 * Used as fallback for dividend history table
 * 
 * @param {Object} tableData - Table data with headers and rows
 * @returns {string} HTML table string
 */
export function convertTableDataToHTML(tableData) {
  if (!tableData || !tableData.headers || !tableData.rows) {
    return '';
  }

  const { headers, rows } = tableData;

  // Build HTML table
  let html = '<div class="policies__voting-table-wrapper">';
  
  // Header row
  html += '<div class="policies__voting-table-header">';
  headers.forEach((header, index) => {
    const bgColor = header.bgColor || '#08a03f';
    const textColor = header.textColor || '#ffffff';
    const padding = header.padding || '17px';
    const largePaddingClass = index === 1 ? 'policies__voting-table-header-cell--large-padding' : '';
    
    html += `<div class="policies__voting-table-header-cell ${largePaddingClass}" style="background-color: ${bgColor}; color: ${textColor}; padding: ${padding};">`;
    html += `<p>${header.text || ''}</p>`;
    html += '</div>';
  });
  html += '</div>';

  // Data rows
  html += '<div class="policies__voting-table-rows">';
  rows.forEach((row) => {
    html += '<div class="policies__voting-table-row">';
    headers.forEach((header) => {
      const cellValue = row[header.text] || '';
      html += `<p class="policies__voting-table-cell">${cellValue}</p>`;
    });
    html += '</div>';
  });
  html += '</div>';

  html += '</div>';

  return html;
}

/**
 * Get fallback dividend transfer table data (first table)
 * Used when API data is not available
 * This is the table showing dividends to be transferred to IEPF (2018-19 onwards)
 * 
 * @returns {Object} Fallback table data in VotingTable.js format
 */
export function getFallbackDividendTransferTable() {
  return {
    headers: [
      { text: "Dividend period", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" },
      { text: "Date of Declaration of Dividend", bgColor: "#d9f0e1", textColor: "#08a03f", padding: "58px" },
      { text: "Due Date for transfer to IEPF", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" }
    ],
    rows: [
      { "Dividend period": "2024-2025", "Date of Declaration of Dividend": "11.08.2025", "Due Date for transfer to IEPF": "16.09.2032" },
      { "Dividend period": "2023-2024", "Date of Declaration of Dividend": "02.08.2024", "Due Date for transfer to IEPF": "07.09.2031" },
      { "Dividend period": "2022-2023", "Date of Declaration of Dividend": "03.08.2023", "Due Date for transfer to IEPF": "08.09.2030" },
      { "Dividend period": "2021-2022", "Date of Declaration of Dividend": "03.08.2022", "Due Date for transfer to IEPF": "08.09.2029" },
      { "Dividend period": "2020–2021", "Date of Declaration of Dividend": "11.08.2021", "Due Date for transfer to IEPF": "16.09.2028" },
      { "Dividend period": "2019-2020", "Date of Declaration of Dividend": "12.08.2020", "Due Date for transfer to IEPF": "17.09.2027" },
      { "Dividend period": "2018-2019", "Date of Declaration of Dividend": "07.08.2019", "Due Date for transfer to IEPF": "12.09.2026" }
    ]
  };
}

/**
 * Get fallback IEPF table data (second table)
 * Used when API data is not available
 * This is the table showing dividends already transferred to IEPF
 * 
 * @returns {Object} Fallback table data in IEPFTable.js format
 */
export function getFallbackIEPFTable() {
  return {
    headers: [
      { text: "Year of Dividend", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" },
      { text: "Date of Dividend", bgColor: "#d9f0e1", textColor: "#08a03f", padding: "58px" },
      { text: "Date of Transfer", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" }
    ],
    rows: [
      { "Year of Dividend": "2017-18", "Date of Dividend": "08.08.2018", "Date of Transfer": "01.10.2025" },
      { "Year of Dividend": "2016-17", "Date of Dividend": "05.08.2017", "Date of Transfer": "25.09.2024" },
      { "Year of Dividend": "2015-16", "Date of Dividend": "06.08.2016", "Date of Transfer": "14.09.2023" },
      { "Year of Dividend": "2014-15", "Date of Dividend": "27.07.2015", "Date of Transfer": "19.09.2022" },
      { "Year of Dividend": "2013 – 14 (Final)", "Date of Dividend": "31.07.2014", "Date of Transfer": "14.09.2021" },
      { "Year of Dividend": "2013-2014 (Interim)", "Date of Dividend": "21.02.2014", "Date of Transfer": "25.03.2021" },
      { "Year of Dividend": "2012-2013", "Date of Dividend": "07.08.2013", "Date of Transfer": "07.10.2020" },
      { "Year of Dividend": "2011-2012", "Date of Dividend": "25.07.2012", "Date of Transfer": "19.09.2019" },
      { "Year of Dividend": "2010-2011", "Date of Dividend": "28.07.2011", "Date of Transfer": "21.09.2018" },
      { "Year of Dividend": "2009-2010", "Date of Dividend": "29.07.2010", "Date of Transfer": "08.09.2017" },
      { "Year of Dividend": "2008-2009", "Date of Dividend": "30.07.2009", "Date of Transfer": "07.09.2016" },
      { "Year of Dividend": "2007-2008", "Date of Dividend": "23.07.2008", "Date of Transfer": "03.09.2015" },
      { "Year of Dividend": "2006-2007", "Date of Dividend": "20.07.2007", "Date of Transfer": "25.08.2014" },
      { "Year of Dividend": "2005-2006", "Date of Dividend": "26.07.2006", "Date of Transfer": "30.08.2013" },
      { "Year of Dividend": "2004-2005", "Date of Dividend": "29.07.2005", "Date of Transfer": "27.08.2012" },
      { "Year of Dividend": "2003-2004", "Date of Dividend": "30.07.2004", "Date of Transfer": "29.08.2011" },
      { "Year of Dividend": "2002-2003", "Date of Dividend": "08.08.2003", "Date of Transfer": "15.09.2010" },
      { "Year of Dividend": "2001-2002 (Final)", "Date of Dividend": "03.09.2002", "Date of Transfer": "14.10.2009" },
      { "Year of Dividend": "2001-2002 (Interim)", "Date of Dividend": "15.02.2002", "Date of Transfer": "13.03.2009" },
      { "Year of Dividend": "2000-2001", "Date of Dividend": "26.09.2001", "Date of Transfer": "04.11.2008" }
    ]
  };
}

/**
 * Get fallback dividend history table data
 * Used when API data is not available
 * 
 * @returns {Object} Fallback table data
 */
export function getFallbackDividendHistoryTable() {
  return {
    paragraph: "Lupin's track of dividends is detailed below. Dividends are remitted through the National Electronic Clearing Service (NECS), subject to availability of NECS centres and timely furnishing of complete and correct bank account details by shareowners. Dividend other than NECS is remitted by means of warrants.",
    table: {
      headers: [
        { text: "Dividend period", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" },
        { text: "Dividend (%)", bgColor: "#d9f0e1", textColor: "#08a03f", padding: "17px" },
        { text: "Per Share (Rs.)", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" },
        { text: "Closure/ record date(s)", bgColor: "#d9f0e1", textColor: "#08a03f", padding: "58px" },
        { text: "Date of declaration of dividend", bgColor: "#08a03f", textColor: "#ffffff", padding: "17px" },
        { text: "Dividend payment date", bgColor: "#d9f0e1", textColor: "#08a03f", padding: "17px" }
      ],
      rows: [
        { "Dividend period": "2024-25", "Dividend (%)": "600", "Per Share (Rs.)": "12.00", "Closure/ record date(s)": "25.07.2025", "Date of declaration of dividend": "11.08.2025", "Dividend payment date": "14.08.2025" },
        { "Dividend period": "2023-24", "Dividend (%)": "400", "Per Share (Rs.)": "8.00", "Closure/ record date(s)": "16.07.2024", "Date of declaration of dividend": "02.08.2024", "Dividend payment date": "07.08.2024" },
        { "Dividend period": "2022-23", "Dividend (%)": "200", "Per Share (Rs.)": "4.00", "Closure/ record date(s)": "14.07.2023", "Date of declaration of dividend": "03.08.2023", "Dividend payment date": "08.08.2023" },
        { "Dividend period": "2021-22", "Dividend (%)": "200", "Per Share (Rs.)": "4.00", "Closure/ record date(s)": "15.07.2022", "Date of declaration of dividend": "03.08.2022", "Dividend payment date": "05.08.2022" },
        { "Dividend period": "2020-21", "Dividend (%)": "325", "Per Share (Rs.)": "6.50", "Closure/ record date(s)": "28.07.2021", "Date of declaration of dividend": "11.08.2021", "Dividend payment date": "17.08.2021" },
        { "Dividend period": "2019-20", "Dividend (%)": "300", "Per Share (Rs.)": "6.00", "Closure/ record date(s)": "05.08.2020 – 12.08.2020", "Date of declaration of dividend": "12.08.2020", "Dividend payment date": "18.08.2020" }, 
        { "Dividend period": "2018-19", "Dividend (%)": "250", "Per Share (Rs.)": "5.00", "Closure/ record date(s)": "31.07.2019 – 07.08.2019", "Date of declaration of dividend": "07.08.2019", "Dividend payment date": "13.08.2019" },
        { "Dividend period": "2017-18", "Dividend (%)": "250.", "Per Share (Rs.)": "5.00", "Closure/ record date(s)": "01.08.2018 – 08.08.2018", "Date of declaration of dividend": "08.08.2018", "Dividend payment date": "13.08.2018" },
        { "Dividend period": "2016-17", "Dividend (%)": "375", "Per Share (Rs.)": "7.50", "Closure/ record date(s)": "26.07.2017 – 02.08.2017", "Date of declaration of dividend": "02.08.2017", "Dividend payment date": "05.08.2017" },
        { "Dividend period": "2015-16", "Dividend (%)": "375", "Per Share (Rs.)": "7.50", "Closure/ record date(s)": "27.07.2016 – 03.08.2016", "Date of declaration of dividend": "03.08.2016", "Dividend payment date": "06.08.2016" },
        { "Dividend period": "2014-15", "Dividend (%)": "375", "Per Share (Rs.)": "7.50", "Closure/ record date(s)": "16.07.2015 – 23.07.2015", "Date of declaration of dividend": "23.07.2015", "Dividend payment date": "27.07.2015" },
        { "Dividend period": "2013-14 (Final)", "Dividend (%)": "150", "Per Share (Rs.)": "3.00", "Closure/ record date(s)": "23.07.2014 – 30.07.2014", "Date of declaration of dividend": "30.07.2014", "Dividend payment date": "31.07.2014" },
        { "Dividend period": "2013-14 (Interim)", "Dividend (%)": "150", "Per Share (Rs.)": "3.00", "Closure/ record date(s)": "14.02.2014", "Date of declaration of dividend": "03.02.2014", "Dividend payment date": "21.02.2014" },
        { "Dividend period": "2012-2013", "Dividend (%)": "200", "Per Share (Rs.)": "4.00", "Closure/ record date(s)": "31.07.2013 – 07.08.2013", "Date of declaration of dividend": "07.08.2013", "Dividend payment date": "08.08.2013" },
        { "Dividend period": "2011-2012", "Dividend (%)": "160", "Per Share (Rs.)": "3.20", "Closure/ record date(s)": "17.07.2012 – 24.07.2012", "Date of declaration of dividend": "24.07.2012", "Dividend payment date": "25.07.2012" },
        { "Dividend period": "2010-2011", "Dividend (%)": "150", "Per Share (Rs.)": "3.00", "Closure/ record date(s)": "20-07-2011 – 27-07-2011", "Date of declaration of dividend": "27-07-2011", "Dividend payment date": "28-07-2011" },
        { "Dividend period": "2009-2010", "Dividend (%)": "135", "Per Share (Rs.)": "13.50", "Closure/ record date(s)": "21-07-2010 – 28-07-2010", "Date of declaration of dividend": "28-07-2010", "Dividend payment date": "29-07-2010" },
        { "Dividend period": "2008-2009", "Dividend (%)": "125", "Per Share (Rs.)": "12.50", "Closure/ record date(s)": "22-07-2009 – 29-07-2009", "Date of declaration of dividend": "29-07-2009", "Dividend payment date": "30-07-2009" },
        { "Dividend period": "2007-2008", "Dividend (%)": "100", "Per Share (Rs.)": "10.00", "Closure/ record date(s)": "15.07.2008 – 22.07.2008", "Date of declaration of dividend": "22.07.2008", "Dividend payment date": "23.07.2008" },
        { "Dividend period": "2006-2007", "Dividend (%)": "50", "Per Share (Rs.)": "5.00", "Closure/ record date(s)": "12.07.2007 – 19.07.2007", "Date of declaration of dividend": "19.07.2007", "Dividend payment date": "20.07.2007" },
        { "Dividend period": "2005-2006", "Dividend (%)": "65", "Per Share (Rs.)": "6.50", "Closure/ record date(s)": "11.07.2006 – 12.07.2006", "Date of declaration of dividend": "25.07.2006", "Dividend payment date": "26.07.2006" },
        { "Dividend period": "2004-2005", "Dividend (%)": "65", "Per Share (Rs.)": "6.50", "Closure/ record date(s)": "19.07.2005 – 20.07.2005", "Date of declaration of dividend": "28.07.2005", "Dividend payment date": "29.07.2005" },
        { "Dividend period": "2003-2004", "Dividend (%)": "65", "Per Share (Rs.)": "6.50", "Closure/ record date(s)": "15.07.2004 – 16.07.2004", "Date of declaration of dividend": "29.07.2004", "Dividend payment date": "30.07.2004" },
        { "Dividend period": "2002-2003", "Dividend (%)": "50", "Per Share (Rs.)": "5.00", "Closure/ record date(s)": "17.07.2003 – 18.07.2003", "Date of declaration of dividend": "06.08.2003", "Dividend payment date": "07.08.2003" },
        { "Dividend period": "2001-2002 (Final)", "Dividend (%)": "25", "Per Share (Rs.)": "2.50", "Closure/ record date(s)": "20.08.2002 – 21.08.2002", "Date of declaration of dividend": "02.09.2002", "Dividend payment date": "03.09.2002" },
        { "Dividend period": "2001-2002 (Interim)", "Dividend (%)": "25", "Per Share (Rs.)": "2.50", "Closure/ record date(s)": "07.02.2002", "Date of declaration of dividend": "17.01.2002\n(Board meeting)", "Dividend payment date": "15.02.2002" },
        { "Dividend period": "2000-2001", "Dividend (%)": "35", "Per Share (Rs.)": "3.50", "Closure/ record date(s)": "13.09.2001 – 14.09.2001", "Date of declaration of dividend": "25.09.2001", "Dividend payment date": "26.09.2001" }
      ]
    }
  };
}

/**
 * Fetch notice data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getNotice() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - NoticeSection (Repeatable Component - NoticeCard) with:
  //   - FinancialLabel (Text)
  //   - Documents (Repeatable Component - NoticeDocument) with:
  //     - LanguageLabel (Text)
  //     - DocumentFile (Media)
  //     - isDefault (Boolean)
  //     - DisplayOrder (Text)
  //   - isActive (Boolean)
  //   - DisplayOrder (Text)
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[NoticeSection][populate][Documents][populate][DocumentFile][populate]=*'
  ].join('&');
  
  return fetchAPI(`notice?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map notice data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped notice data for component
 */
export function mapNoticeData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty array
  if (!data) {
    return {
      notices: []
    };
  }

  // Get NoticeSection array (Repeatable Component - NoticeCard)
  const noticeSectionsArray = data?.NoticeSection || data?.noticeSection || [];

  // Map notice sections to component format
  const notices = noticeSectionsArray
    .filter(section => section?.isActive !== false) // Only active sections
    .map((section, index) => {
      const financialLabel = section?.FinancialLabel || section?.financialLabel || '';
      const documentsArray = section?.Documents || section?.documents || [];

      // Get document URLs helper
      const getDocumentUrl = (doc) => {
        if (!doc) return '#';
        const documentFile = doc?.DocumentFile?.data?.attributes || doc?.DocumentFile || doc?.documentFile?.data?.attributes || doc?.documentFile;
        return documentFile ? getStrapiMedia(documentFile) : '#';
      };

      // Map all documents with their LanguageLabel
      const documents = documentsArray
        .filter(doc => doc && getDocumentUrl(doc) !== '#') // Only include documents with valid URLs
        .map((doc) => {
          const languageLabel = doc?.LanguageLabel || doc?.languageLabel || '';
          const documentUrl = getDocumentUrl(doc);
          const displayOrder = doc?.DisplayOrder || doc?.displayOrder || '999';
          const isDefault = doc?.isDefault === true;

          return {
            id: doc?.id || null,
            languageLabel: languageLabel,
            url: documentUrl,
            displayOrder: displayOrder,
            isDefault: isDefault
          };
        })
        .sort((a, b) => {
          // Sort by DisplayOrder, with default documents first
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          return a.displayOrder.localeCompare(b.displayOrder);
        });

      // Get primary PDF URL (first document or default)
      const defaultDoc = documentsArray.find(doc => doc?.isDefault === true);
      const primaryDoc = documents.find(doc => doc.isDefault) || documents[0];
      const pdfUrl = primaryDoc?.url || (defaultDoc ? getDocumentUrl(defaultDoc) : '#');

      return {
        id: section?.id || index + 1,
        financialLabel: financialLabel,
        documents: documents, // All documents with LanguageLabel
        pdfUrl: pdfUrl,
        isActive: section?.isActive !== false && pdfUrl !== '#',
        displayOrder: section?.DisplayOrder || section?.displayOrder || String(index + 1)
      };
    })
    .filter(notice => notice.financialLabel) // Only include notices with financial label
    .sort((a, b) => {
      // Extract year and quarter from financialLabel (e.g., "Q1 FY 2023", "Q4 FY 2022")
      const extractYearAndQuarter = (label) => {
        if (!label) return { year: 0, quarter: 0 };
        
        // Extract year (4-digit year)
        const yearMatch = label.match(/\b(20\d{2})\b/);
        const year = yearMatch ? parseInt(yearMatch[1]) : 0;
        
        // Extract quarter (Q1, Q2, Q3, Q4)
        const quarterMatch = label.match(/Q(\d+)/i);
        const quarter = quarterMatch ? parseInt(quarterMatch[1]) : 0;
        
        return { year, quarter };
      };
      
      const { year: yearA, quarter: quarterA } = extractYearAndQuarter(a.financialLabel);
      const { year: yearB, quarter: quarterB } = extractYearAndQuarter(b.financialLabel);
      
      // First sort by year descending (2023 before 2022)
      if (yearA > 0 && yearB > 0) {
        if (yearA !== yearB) {
          return yearB - yearA; // Descending order (latest year first)
        }
        
        // If same year, sort by quarter descending (Q4, Q3, Q2, Q1)
        if (quarterA > 0 && quarterB > 0) {
          return quarterB - quarterA; // Descending order (Q4 first, then Q3, Q2, Q1)
        }
        
        // If one has quarter and other doesn't, prioritize the one with quarter
        if (quarterA > 0 && quarterB === 0) return -1;
        if (quarterB > 0 && quarterA === 0) return 1;
      }
      
      // If only one has a year, prioritize it
      if (yearA > 0 && yearB === 0) return -1;
      if (yearB > 0 && yearA === 0) return 1;
      
      // If neither has a year, fall back to DisplayOrder sorting
      const orderA = a.displayOrder || '999';
      const orderB = b.displayOrder || '999';
      return orderA.localeCompare(orderB);
    });

  return {
    notices: notices
  };
}

/**
 * Fetch other-statutory-information data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOtherStatutoryInformation() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - ExtraordinaryGeneralMeetingSection (Component) with SectionTitle and Documents (Repeatable PdfCard)
  // - EvotingSection (Component) with SectionTitle, Documents, Heading (Rich text), PdfCard
  // - DivendInfo (Repeatable Component: DividendHistorySection) with IntroText (Rich text), DividendHistory (Rich text), isActive
  // - NoticeSection (Rich text)
  // - PdfSection (Repeatable Component - PdfCard)
  // - KycUpdateSection (Repeatable Component) with SectionTitle and Documents
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[ExtraordinaryGeneralMeetingSection][populate][Documents][populate][Pdf][populate]=*',
    'populate[EvotingSection][populate][Documents][populate][Pdf][populate]=*',
    'populate[EvotingSection][populate][PdfCard][populate][Pdf][populate]=*',
    'populate[EvotingSection][populate][PdfSection][populate][Pdf][populate]=*',
    'populate[KycUpdateSection][populate][Documents][populate][Pdf][populate]=*'
  ].join('&');
  
  return fetchAPI(`other-statutory-information?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map other statutory information data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped other statutory information data for components
 */
export function mapOtherStatutoryInformationData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      egmSection: null,
      evotingSection: null,
      dividendInfo: null,
      noticeSection: null,
      pdfSection: null,
      kycSection: null
    };
  }

  // Map ExtraordinaryGeneralMeetingSection
  const egmSection = data?.ExtraordinaryGeneralMeetingSection || data?.extraordinaryGeneralMeetingSection;
  let mappedEgmSection = null;
  
  if (egmSection) {
    const documentsArray = egmSection?.Documents || egmSection?.documents || [];
    const cards = documentsArray
      .filter(doc => doc?.isActive !== false)
      .map((doc, index) => {
        const pdf = doc?.Pdf?.data?.attributes || doc?.Pdf || doc?.pdf?.data?.attributes || doc?.pdf;
        const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';
        
        return {
          id: doc?.id || index + 1,
          title: doc?.Title || doc?.title || '',
          pdfUrl: pdfUrl,
          isActive: doc?.isActive !== false && pdfUrl !== '#'
        };
      })
      .filter(card => card.title);

    mappedEgmSection = {
      title: egmSection?.SectionTitle || egmSection?.sectionTitle || 'Extraordinary General Meeting (EGM)',
      cards: cards
    };
  }

  // Map EvotingSection
  const evotingSection = data?.EvotingSection || data?.evotingSection;
  let mappedEvotingSection = null;
  
  if (evotingSection) {
    const documentsArray = evotingSection?.Documents || evotingSection?.documents || [];
    const cards = documentsArray
      .filter(doc => doc?.isActive !== false)
      .map((doc, index) => {
        const pdf = doc?.Pdf?.data?.attributes || doc?.Pdf || doc?.pdf?.data?.attributes || doc?.pdf;
        const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';
        
        return {
          id: doc?.id || index + 1,
          title: doc?.Title || doc?.title || '',
          pdfUrl: pdfUrl,
          isActive: doc?.isActive !== false && pdfUrl !== '#'
        };
      })
      .filter(card => card.title);

    // Get PdfCard (Component)
    const pdfCard = evotingSection?.PdfCard || evotingSection?.pdfCard;
    let mappedPdfCard = null;
    if (pdfCard) {
      const pdf = pdfCard?.Pdf?.data?.attributes || pdfCard?.Pdf || pdfCard?.pdf?.data?.attributes || pdfCard?.pdf;
      const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';
      mappedPdfCard = {
        title: pdfCard?.Title || pdfCard?.title || '',
        pdfUrl: pdfUrl,
        isActive: pdfCard?.isActive !== false && pdfUrl !== '#'
      };
    }

    mappedEvotingSection = {
      title: evotingSection?.SectionTitle || evotingSection?.sectionTitle || 'Declaration of Results of E-voting',
      cards: cards,
      heading: evotingSection?.Heading || evotingSection?.heading || '',
      pdfCard: mappedPdfCard
    };
  }

  // Map DivendInfo (Repeatable Component: DividendHistorySection)
  // Try multiple field name variations as Strapi field names can vary
  const dividendInfoArray = data?.DivendInfo 
    || data?.divendInfo 
    || data?.DividendInfo 
    || data?.dividendInfo
    || data?.DivedendInfo
    || data?.divedendInfo
    || [];
  const mappedDividendInfo = dividendInfoArray
    .filter(info => info?.isActive !== false)
    .map((info, index) => ({
      id: info?.id || index + 1,
      introText: info?.IntroText || info?.introText || '',
      dividendHistory: info?.DividendHistory || info?.dividendHistory || ''
    }));

  // Map NoticeSection (Rich text)
  // Note: VotingTable and IEPFTable are rendered as separate components on the page
  // So we don't add the tables to the noticeSection HTML to avoid duplication
  let noticeSection = data?.NoticeSection || data?.noticeSection || '';
  
  // Tables are now rendered as separate components (VotingTable and IEPFTable)
  // So we only use the API noticeSection content without adding tables

  // Map PdfSection (Repeatable Component - PdfCard)
  // PdfSection is nested under EvotingSection, not at top level
  const evotingSectionForPdf = data?.EvotingSection || data?.evotingSection;
  const pdfSectionArray = evotingSectionForPdf?.PdfSection 
    || evotingSectionForPdf?.pdfSection 
    || evotingSectionForPdf?.PdfSections
    || evotingSectionForPdf?.pdfSections
    || data?.PdfSection 
    || data?.pdfSection 
    || data?.PdfSections
    || data?.pdfSections
    || [];

  if (process.env.NODE_ENV === 'development') {
    console.log('mapOtherStatutoryInformationData - PdfSection raw data:', {
      hasEvotingSection: !!evotingSectionForPdf,
      hasPdfSectionInEvoting: !!evotingSectionForPdf?.PdfSection,
      hasPdfSectionTopLevel: !!data?.PdfSection,
      pdfSectionArrayLength: pdfSectionArray.length,
      firstPdfItem: pdfSectionArray[0]
    });
  }

  const mappedPdfSection = pdfSectionArray
    .filter(pdf => pdf && pdf?.isActive !== false)
    .map((pdf, index) => {
      // Try multiple ways to get the PDF file
      const pdfFile = pdf?.Pdf?.data?.attributes 
        || pdf?.Pdf?.data 
        || pdf?.Pdf 
        || pdf?.pdf?.data?.attributes 
        || pdf?.pdf?.data 
        || pdf?.pdf
        || null;
      
      const pdfUrl = pdfFile ? getStrapiMedia(pdfFile) : '#';
      const title = pdf?.Title || pdf?.title || '';
      
      if (process.env.NODE_ENV === 'development' && index === 0) {
        console.log('mapOtherStatutoryInformationData - Mapping first PDF:', {
          id: pdf?.id,
          title: title,
          hasPdfFile: !!pdfFile,
          pdfFileStructure: pdf?.Pdf ? Object.keys(pdf.Pdf) : 'no Pdf field',
          pdfUrl: pdfUrl,
          isActive: pdf?.isActive,
          rawPdf: pdf?.Pdf
        });
      }
      
      return {
        id: pdf?.id || index + 1,
        title: title,
        pdfUrl: pdfUrl,
        isActive: pdf?.isActive !== false && pdfUrl !== '#'
      };
    })
    .filter(pdf => pdf.title && pdf.pdfUrl !== '#'); // Only filter out items without title or valid PDF URL

  if (process.env.NODE_ENV === 'development') {
    console.log('mapOtherStatutoryInformationData - Mapped PdfSection:', {
      mappedCount: mappedPdfSection.length,
      mappedItems: mappedPdfSection
    });
  }

  // Map KycUpdateSection (Repeatable Component)
  const kycSectionArray = data?.KycUpdateSection || data?.kycUpdateSection || [];
  const mappedKycSection = kycSectionArray
    .filter(section => section?.isActive !== false)
    .map((section, index) => {
      const documentsArray = section?.Documents || section?.documents || [];
      const cards = documentsArray
        .filter(doc => doc?.isActive !== false)
        .map((doc, docIndex) => {
          const pdf = doc?.Pdf?.data?.attributes || doc?.Pdf || doc?.pdf?.data?.attributes || doc?.pdf;
          const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';
          
          return {
            id: doc?.id || docIndex + 1,
            title: doc?.Title || doc?.title || '',
            pdfUrl: pdfUrl,
            isActive: doc?.isActive !== false && pdfUrl !== '#'
          };
        })
        .filter(card => card.title);

      return {
        id: section?.id || index + 1,
        title: section?.SectionTitle || section?.sectionTitle || '',
        cards: cards
      };
    })
    .filter(section => section.title);

  return {
    egmSection: mappedEgmSection,
    evotingSection: mappedEvotingSection,
    dividendInfo: mappedDividendInfo.length > 0 ? mappedDividendInfo : null,
    noticeSection: noticeSection || null,
    pdfSection: mappedPdfSection.length > 0 ? mappedPdfSection : null,
    kycSection: mappedKycSection.length > 0 ? mappedKycSection : null
  };
}

/**
 * Fetch news-and-event data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getNewsAndEvent() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - AnnualGeneralMeetingSection (Repeatable Component - AgmEventCard) with:
  //   - MeetingTitle, MeetingDate, VideoFile, VideoUrl, Pdf, isActive, DisplayOrder
  // - EventSection (Repeatable Component - EventCard) with:
  //   - EventTitle, Eventdate, isActive, DisplayOrder
  // - PresentationSection (Repeatable Component - PdfCard) with:
  //   - Title, PublishedDate, Pdf, isActive
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[AnnualGeneralMeetingSection][populate][VideoFile][populate]=*',
    'populate[AnnualGeneralMeetingSection][populate][PosterImage][populate]=*',
    'populate[AnnualGeneralMeetingSection][populate][Pdf][populate]=*',
    'populate[EventSection][populate]=*',
    'populate[PresentationSection][populate][Pdf][populate]=*'
  ].join('&');
  
  return fetchAPI(`news-and-event?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map news and event data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped news and event data for components
 */
export function mapNewsAndEventData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      meetingVideoSection: null,
      eventsSection: null,
      presentationsSection: null
    };
  }

  // Map AnnualGeneralMeetingSection (Repeatable Component - AgmEventCard) -> MeetingVideo
  const agmSectionsArray = data?.AnnualGeneralMeetingSection || data?.annualGeneralMeetingSection || [];
  const mappedMeetingVideos = agmSectionsArray
    .filter(section => section?.isActive !== false)
    .map((section, index) => {
      // Get video URL - VideoFile is Media, VideoUrl might be Text field (if exists)
      let videoUrlString = '';
      
      // Try VideoUrl as text first (URL string) if it exists
      if (section?.VideoUrl && typeof section.VideoUrl === 'string' && section.VideoUrl.trim() !== '') {
        videoUrlString = section.VideoUrl;
      } else {
        // Use VideoFile (Media) as primary source
        const videoFile = section?.VideoFile?.data?.attributes || section?.VideoFile || section?.videoFile?.data?.attributes || section?.videoFile;
        if (videoFile) {
          videoUrlString = getStrapiMedia(videoFile);
          // Ensure videoUrlString is a valid string
          if (!videoUrlString || typeof videoUrlString !== 'string' || videoUrlString.trim() === '') {
            videoUrlString = '';
          }
        }
      }
      
      // Get PDF for transcript
      const pdf = section?.Pdf?.data?.attributes || section?.Pdf || section?.pdf?.data?.attributes || section?.pdf;
      const pdfUrl = pdf ? getStrapiMedia(pdf) : '#';

      // Format meeting date
      const meetingDate = section?.MeetingDate || section?.meetingDate || '';
      const formattedDate = meetingDate ? new Date(meetingDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : '';

      // Get thumbnail - prioritize PosterImage, then fallback to video file thumbnail
      let thumbnail = null;
      const posterImage = section?.PosterImage?.data?.attributes || section?.PosterImage || section?.posterImage?.data?.attributes || section?.posterImage;
      if (posterImage && (posterImage.url || typeof posterImage === 'string')) {
        thumbnail = getStrapiMedia(posterImage);
        // Ensure thumbnail is a valid string
        if (!thumbnail || typeof thumbnail !== 'string' || thumbnail.trim() === '') {
          thumbnail = null;
        }
      }
      
      // Fallback to video file thumbnail if PosterImage not available or invalid
      if (!thumbnail) {
        const videoFile = section?.VideoFile?.data?.attributes || section?.VideoFile || section?.videoFile?.data?.attributes || section?.videoFile;
        if (videoFile) {
          if (videoFile.formats?.thumbnail?.url) {
            thumbnail = getStrapiMedia(videoFile.formats.thumbnail);
          } else if (videoFile.url) {
            thumbnail = getStrapiMedia(videoFile);
          }
          // Ensure thumbnail is a valid string
          if (!thumbnail || typeof thumbnail !== 'string' || thumbnail.trim() === '') {
            thumbnail = null;
          }
        }
      }

      return {
        id: section?.id || index + 1,
        title: section?.MeetingTitle || section?.meetingTitle || '',
        date: formattedDate,
        videoUrl: videoUrlString,
        thumbnail: thumbnail,
        transcriptLink: pdfUrl !== '#' ? {
          text: `${section?.MeetingTitle || section?.meetingTitle || 'Meeting'} Transcript`,
          href: pdfUrl
        } : null,
        displayOrder: section?.DisplayOrder || section?.displayOrder || String(index + 1)
      };
    })
    .filter(video => video.title && video.videoUrl)
    .sort((a, b) => {
      // Sort by DisplayOrder if available
      const orderA = a.displayOrder || '999';
      const orderB = b.displayOrder || '999';
      return orderB.localeCompare(orderA); // Most recent first
    });

  const meetingVideoSection = mappedMeetingVideos.length > 0 ? {
    title: "Annual General Meeting",
    videos: mappedMeetingVideos
  } : null;

  // Map EventSection (Repeatable Component - EventCard) -> Events
  const eventsArray = data?.EventSection || data?.eventSection || [];
  const mappedEvents = eventsArray
    .filter(event => {
      // Filter out inactive events, but allow events without isActive field
      if (event?.isActive === false) return false;
      // Ensure event has a title
      const eventTitle = event?.EventTitle || event?.eventTitle || '';
      return eventTitle && eventTitle.trim() !== '';
    })
    .map((event, index) => {
      // Format event date
      const eventDate = event?.Eventdate || event?.eventdate || event?.EventDate || event?.eventDate || '';
      let formattedDate = '';
      if (eventDate) {
        try {
          formattedDate = new Date(eventDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (e) {
          console.warn('Invalid event date format:', eventDate);
          formattedDate = '';
        }
      }

      // Alternate variant (dark/light) based on index
      const variant = index % 2 === 0 ? 'dark' : 'light';

      return {
        id: event?.id || index + 1,
        date: formattedDate,
        title: event?.EventTitle || event?.eventTitle || '',
        href: '#', // Events might not have links, or could be added later
        variant: variant,
        displayOrder: event?.DisplayOrder || event?.displayOrder || String(index + 1)
      };
    })
    .sort((a, b) => {
      // Sort by DisplayOrder if available
      const orderA = a.displayOrder || '999';
      const orderB = b.displayOrder || '999';
      return orderB.localeCompare(orderA); // Most recent first
    });

  const eventsSection = mappedEvents.length > 0 ? {
    title: "Events",
    events: mappedEvents
  } : null;

  // Map PresentationSection (Repeatable Component - PdfCard) -> Presentations
  const presentationsArray = data?.PresentationSection || data?.presentationSection || [];
  const mappedPresentations = presentationsArray
    .filter(presentation => {
      // Filter out inactive presentations, but allow presentations without isActive field
      if (presentation?.isActive === false) return false;
      // Ensure presentation has a title
      const presentationTitle = presentation?.Title || presentation?.title || '';
      return presentationTitle && presentationTitle.trim() !== '';
    })
    .map((presentation, index) => {
      const pdf = presentation?.Pdf?.data?.attributes || presentation?.Pdf || presentation?.pdf?.data?.attributes || presentation?.pdf;
      let pdfUrl = '#';
      if (pdf) {
        pdfUrl = getStrapiMedia(pdf);
        // Ensure pdfUrl is a valid string
        if (!pdfUrl || typeof pdfUrl !== 'string' || pdfUrl.trim() === '') {
          pdfUrl = '#';
        }
      }

      return {
        id: presentation?.id || index + 1,
        title: presentation?.Title || presentation?.title || '',
        pdfUrl: pdfUrl,
        isActive: presentation?.isActive !== false && pdfUrl !== '#'
      };
    });

  const presentationsSection = mappedPresentations.length > 0 ? {
    title: "Presentations",
    presentations: mappedPresentations,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorative: "/assets/egm/decorative.svg"
    }
  } : null;

  return {
    meetingVideoSection: meetingVideoSection,
    eventsSection: eventsSection,
    presentationsSection: presentationsSection
  };
}

/**
 * Fetch saksham-niveshak data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getSakshamNiveshak() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - Description (Rich text - Markdown)
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*'
  ].join('&');
  
  return fetchAPI(`saksham-niveshak?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map saksham niveshak data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped saksham niveshak data for component
 */
/**
 * Fetch tips-for-shareholder data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getTipsForShareholder() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[TipsShareHolderSectionContent][populate]=*'
  ].join('&');
  
  return fetchAPI(`tips-for-shareholder?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map tips-for-shareholder data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped tips for shareholder data
 */
export function mapTipsForShareholderData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;
  
  if (!data) {
    return {
      banner: null,
      sections: []
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner || data?.topBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map TipsShareHolderSectionContent (Repeatable Component)
  const sectionsArray = data?.TipsShareHolderSectionContent 
    || data?.tipsShareHolderSectionContent 
    || data?.TipsShareHolderSectionContents
    || data?.tipsShareHolderSectionContents
    || [];
  
  const sections = sectionsArray
    .filter(section => section?.isActive !== false && section?.IsActive !== false)
    .map((section, index) => {
      return {
        id: section?.id || `section-${index + 1}`,
        title: section?.Title || section?.title || '',
        content: section?.Content || section?.content || '',
        bgColor: section?.SectionBgColor || section?.sectionBgColor || 'default',
        isActive: section?.isActive !== false
      };
    });

  return {
    banner: banner,
    sections: sections
  };
}

export function mapSakshamNiveshakData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      description: null
    };
  }

  // Map Description (Rich text - Markdown)
  const description = data?.Description || data?.description || '';

  return {
    description: description || null
  };
}

/**
 * Fetch share-price data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getSharePrice() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - SharePriceSection (Repeatable Component - SharePriceCard) with:
  //   - Heading (Text)
  //   - Content (Rich text - Markdown)
  //   - isActive (Boolean)
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[SharePriceSection][populate]=*'
  ].join('&');
  
  return fetchAPI(`share-price?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map share price data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped share price data for component
 */
export function mapSharePriceData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      sections: []
    };
  }

  // Map SharePriceSection (Repeatable Component - SharePriceCard)
  const sharePriceSectionsArray = data?.SharePriceSection || data?.sharePriceSection || [];
  const mappedSections = sharePriceSectionsArray
    .filter(section => section?.isActive !== false)
    .map((section, index) => ({
      id: section?.id || index + 1,
      heading: section?.Heading || section?.heading || '',
      content: section?.Content || section?.content || ''
    }))
    .filter(section => section.heading || section.content);

  // Map to component structure
  // First section -> shareCapital, Second section -> listingOfSecurities
  const shareCapital = mappedSections[0] ? {
    title: mappedSections[0].heading,
    content: mappedSections[0].content
  } : null;

  const listingOfSecurities = mappedSections[1] ? {
    title: mappedSections[1].heading,
    content: mappedSections[1].content
  } : null;

  return {
    shareCapital: shareCapital,
    listingOfSecurities: listingOfSecurities,
    sections: mappedSections // Keep all sections for potential future use
  };
}

/**
 * Fetch transfer-physical-share data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getTransferPhysicalShare() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - Description (Rich text - Markdown)
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*'
  ].join('&');
  
  return fetchAPI(`transfer-physical-share?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map transfer physical share data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped transfer physical share data for component
 */
export function mapTransferPhysicalShareData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      description: null
    };
  }

  // Map Description (Rich text - Markdown)
  const description = data?.Description || data?.description || '';

  return {
    description: description || null
  };
}

/**
 * Fetch unclaimed-dividend data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getUnclaimedDividend() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  // - UnclaimedDivendSection (Component - UnclaimedDividendCard) with:
  //   - SectionTitle (Text)
  //   - DividendInfoSection (Rich text - Markdown)
  //   - DividendNotice (Rich text - Markdown)
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[UnclaimedDivendSection][populate]=*'
  ].join('&');
  
  return fetchAPI(`unclaimed-dividend?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map unclaimed dividend data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped unclaimed dividend data for component
 */
export function mapUnclaimedDividendData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {
      sectionTitle: null,
      dividendInfoSection: null,
      dividendNotice: null
    };
  }

  // Map UnclaimedDivendSection (Component - UnclaimedDividendCard)
  const section = data?.UnclaimedDivendSection || data?.unclaimedDivendSection || {};

  return {
    sectionTitle: section?.SectionTitle || section?.sectionTitle || null,
    dividendInfoSection: section?.DividendInfoSection || section?.dividendInfoSection || null,
    dividendNotice: section?.DividendNotice || section?.dividendNotice || null
  };
}

/**
 * Fetch shareholding-pattern data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getShareholdingPattern() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*'
  ].join('&');
  
  return fetchAPI(`shareholding-pattern?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map shareholding pattern data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped shareholding pattern data for component
 */
export function mapShareholdingPatternData(strapiData) {
  // Handle Strapi v4 response structure (Single Type) with chaining and fallbacks
  const data = strapiData?.data || strapiData;

  // If no data, return empty structure
  if (!data) {
    return {};
  }

  // This API only has TopBanner, no other fields to map
  // Iframe data is handled separately or kept as fallback
  return {};
}

/**
 * Fetch committee data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getCommittee() {
  // Populate all nested components and media
  // Following the structure:
  // - TopBanner with DesktopImage and MobileImage
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*'
  ].join('&');
  
  return fetchAPI(`committee?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Fetch leadership page data from Strapi
 * This is a Single Type, so it returns one entry with TopBanner
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getLeadership() {
  // Populate TopBanner with DesktopImage and MobileImage
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*'
  ].join('&');
  
  return fetchAPI(`leadership?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Fetch leaders data from Strapi
 * This is a Collection Type, so it returns an array
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getLeaders() {
  const populateQuery = [
    'populate[ProfileImage][populate]=*',
    'populate[CommitteeMemberType][populate][committee_group][populate]=*',
    'populate[OtherDirectorships][populate][Pdf][populate]=*',
    'populate[cta][populate]=*',
    'populate[Pdf][populate]=*',
    'filters[isActive][$eq]=true',
    'sort=DisplayOrder:asc'
  ].join('&');
  
  return fetchAPI(`leaders?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Fetch a single leader by slug from Strapi
 * 
 * @param {string} slug - Leader slug
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getLeaderBySlug(slug) {
  if (!slug) {
    return null;
  }

  // URL encode the slug to handle special characters
  const encodedSlug = encodeURIComponent(slug);
  
  const populateQuery = [
    'populate[ProfileImage][populate]=*',
    'populate[CommitteeMemberType][populate][committee_group][populate]=*',
    'populate[OtherDirectorships][populate][Pdf][populate]=*',
    'populate[cta][populate]=*',
    'populate[Pdf][populate]=*',
    `filters[slug][$eq]=${encodedSlug}`,
    'filters[isActive][$eq]=true'
  ].join('&');
  
  return fetchAPI(`leaders?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map leaders data for listing page
 * Separates leaders into Board of Directors and Management Team using CommitteeMemberType with committee_group relation
 * 
 * @param {Object} leadersData - Raw Strapi API response for leaders
 * @returns {Object} Mapped leaders data with boardOfDirectors and managementTeam
 */
export function mapLeadersData(leadersData) {
  // Handle Strapi v4 response structure (Collection Type)
  // Data can be in leadersData.data (array) or directly in leadersData (array)
  // Based on the API response structure: { data: [...], meta: {...} }
  const leadersArray = leadersData?.data || (Array.isArray(leadersData) ? leadersData : []);

  if (!Array.isArray(leadersArray) || leadersArray.length === 0) {
    return {
      boardOfDirectors: [],
      managementTeam: []
    };
  }

  const boardOfDirectors = [];
  const managementTeam = [];

  leadersArray.forEach((leader) => {
    // Extract leader data (handle both direct and attributes structure)
    const leaderData = leader?.attributes || leader;
    
    // Extract leader basic info
    const profileImage = leaderData?.ProfileImage?.data?.attributes || leaderData?.ProfileImage || leader?.ProfileImage?.data?.attributes || leader?.ProfileImage;
    const imageUrl = profileImage ? getStrapiMedia(profileImage) : null;

    const slug = leaderData?.slug || leader?.slug || '';
    const leaderLink = slug ? `/about-us/leadership/${slug}` : '#';

    const leaderName = leaderData?.LeaderName || leader?.LeaderName || leaderData?.leaderName || leader?.leaderName || '';
    const designation = leaderData?.Designation || leader?.Designation || leaderData?.designation || leader?.designation || '';

    // Skip if no name
    if (!leaderName) {
      return;
    }

    // Process CommitteeMemberType array to find Board of Directors and Management Team
    // Use ONLY committee_group relation, NOT boolean fields
    const committeeMemberTypes = leaderData?.CommitteeMemberType || leader?.CommitteeMemberType || [];
    
    if (Array.isArray(committeeMemberTypes) && committeeMemberTypes.length > 0) {
      committeeMemberTypes.forEach((memberType) => {
        // Extract committee_group relation
        const committeeGroup = memberType?.committee_group?.data?.attributes 
          || memberType?.committee_group?.data 
          || memberType?.committee_group?.attributes 
          || memberType?.committee_group;
        
        if (committeeGroup) {
          // Get committee name and order from committee_group
          const committeeName = committeeGroup?.Name || committeeGroup?.name || committeeGroup?.Title || committeeGroup?.title || '';
          const order = committeeGroup?.Order !== undefined && committeeGroup?.Order !== null 
            ? Number(committeeGroup.Order) 
            : (memberType?.Order !== undefined && memberType?.Order !== null ? Number(memberType.Order) : 999);
          
          // Skip if no committee name
          if (!committeeName) {
            return;
          }
          
          // Normalize committee name for comparison (case-insensitive, trim whitespace)
          const normalizedName = committeeName.toLowerCase().trim();
          
          // Create leader object with order
          const leaderObj = {
            id: leader?.id || leader?.documentId || Math.random(),
            name: leaderName,
            title: designation,
            image: imageUrl ? {
              url: imageUrl,
              alt: leaderName
            } : null,
            link: leaderLink,
            slug: slug,
            order: order // Add order for sorting
          };

          // Check if committee is Board of Directors (exact match required)
          // Must contain both "board" AND "director" (case-insensitive)
          if (normalizedName.includes('board') && normalizedName.includes('director')) {
            // Check if member already exists (avoid duplicates)
            const existingMember = boardOfDirectors.find(m => m.id === leaderObj.id);
            if (!existingMember) {
              boardOfDirectors.push(leaderObj);
            }
          }
          
          // Check if committee is Management Team (exact match required)
          // Must contain "management" AND "team" (case-insensitive)
          // This is more specific to avoid false matches
          if (normalizedName.includes('management') && normalizedName.includes('team')) {
            // Check if member already exists (avoid duplicates)
            const existingMember = managementTeam.find(m => m.id === leaderObj.id);
            if (!existingMember) {
              managementTeam.push(leaderObj);
            }
          }
        }
      });
    }
  });

  // Sort both arrays by order (ascending), then by name if order is the same
  boardOfDirectors.sort((a, b) => {
    const orderA = a.order || 999;
    const orderB = b.order || 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  managementTeam.sort((a, b) => {
    const orderA = a.order || 999;
    const orderB = b.order || 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  return {
    boardOfDirectors: boardOfDirectors,
    managementTeam: managementTeam
  };
}

/**
 * Map single leader data for detail page
 * 
 * @param {Object} leaderData - Raw Strapi API response for a single leader
 * @returns {Object|null} Mapped leader detail data
 */
export function mapLeaderDetailData(leaderData) {
  // Handle Strapi v4 response structure (Collection Type - single item)
  // Data can be in leaderData.data (array) or directly in leaderData (array or object)
  let leadersArray = null;
  
  if (leaderData?.data) {
    // Standard Strapi v4 structure: { data: [...] }
    leadersArray = Array.isArray(leaderData.data) ? leaderData.data : [leaderData.data];
  } else if (Array.isArray(leaderData)) {
    // Direct array
    leadersArray = leaderData;
  } else if (leaderData) {
    // Single object
    leadersArray = [leaderData];
  }
  
  if (!leadersArray || leadersArray.length === 0) {
    return null;
  }

  const leader = leadersArray[0];
  // Data is directly on the leader object, not in attributes (based on actual API response)
  const leaderDataObj = leader;

  // Extract profile image - handle both nested and flat structures
  const profileImage = leaderDataObj?.ProfileImage?.data?.attributes 
    || leaderDataObj?.ProfileImage 
    || leader?.ProfileImage?.data?.attributes 
    || leader?.ProfileImage;
  const imageUrl = profileImage ? getStrapiMedia(profileImage) : null;

  // Extract basic info using optional chaining
  const name = leaderDataObj?.LeaderName || '';
  const designation = leaderDataObj?.Designation || '';
  
  // Extract biography/description
  const biography = leaderDataObj?.DetailDescription || '';

  // Extract education (Rich text - Markdown, can be string or array)
  let education = [];
  const educationData = leaderDataObj?.EducationDetail;
  if (educationData) {
    if (typeof educationData === 'string') {
      // Split by newlines if it's a string
      education = educationData.split('\n').filter(line => line.trim());
    } else if (Array.isArray(educationData)) {
      education = educationData;
    }
  }

  // Extract info items
  const infoItems = [];
  
  const age = leaderDataObj?.Age;
  if (age) {
    infoItems.push({
      label: 'Age',
      value: age
    });
  }

  const nationality = leaderDataObj?.Nationality;
  if (nationality) {
    infoItems.push({
      label: 'Nationality',
      value: nationality
    });
  }

  const appointed = leaderDataObj?.Appointed;
  if (appointed) {
    try {
      const appointedDate = new Date(appointed).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      infoItems.push({
        label: 'Appointed',
        value: appointedDate
      });
    } catch (e) {
      infoItems.push({
        label: 'Appointed',
        value: appointed
      });
    }
  }

  const tenure = leaderDataObj?.Tenure;
  if (tenure) {
    infoItems.push({
      label: 'Tenure',
      value: tenure
    });
  }

  // Extract committee membership (rich text markdown)
  const committeeMembership = leaderDataObj?.CommitteeMembership || leader?.CommitteeMembership || '';
  
  // Extract committee membership from CommitteeMemberType array (for committees page)
  const committeeMemberTypes = leaderDataObj?.CommitteeMemberType || leader?.CommitteeMemberType || [];
  const committeeMemberships = [];
  
  if (Array.isArray(committeeMemberTypes) && committeeMemberTypes.length > 0) {
    committeeMemberTypes.forEach((memberType) => {
      // Extract committee_group relation
      const committeeGroup = memberType?.committee_group?.data?.attributes 
        || memberType?.committee_group?.data 
        || memberType?.committee_group?.attributes 
        || memberType?.committee_group;
      
      if (committeeGroup) {
        const committeeName = committeeGroup?.Name || committeeGroup?.name || committeeGroup?.Title || committeeGroup?.title || '';
        if (committeeName) {
          committeeMemberships.push(committeeName);
        }
      }
    });
  }

  // Extract OtherDirectorships component
  const otherDirectorships = leaderDataObj?.OtherDirectorships || leader?.OtherDirectorships;
  let mappedOtherDirectorships = null;
  
  if (otherDirectorships) {
    const otherDirectorshipsPdf = otherDirectorships?.Pdf?.data?.attributes 
      || otherDirectorships?.Pdf 
      || leader?.OtherDirectorships?.Pdf?.data?.attributes 
      || leader?.OtherDirectorships?.Pdf;
    const otherDirectorshipsPdfUrl = otherDirectorshipsPdf ? getStrapiMedia(otherDirectorshipsPdf) : null;
    
    const otherDirectorshipsName = otherDirectorships?.Name || otherDirectorships?.name || '';
    const otherDirectorshipsCtaName = otherDirectorships?.CtaName || otherDirectorships?.ctaName || '';
    
    // Only include if there's data
    if (otherDirectorshipsName || otherDirectorshipsPdfUrl || otherDirectorshipsCtaName) {
      mappedOtherDirectorships = {
        name: otherDirectorshipsName,
        ctaName: otherDirectorshipsCtaName,
        pdf: otherDirectorshipsPdfUrl ? {
          url: otherDirectorshipsPdfUrl,
          title: otherDirectorshipsCtaName || 'Download PDF'
        } : null
      };
    }
  }

  // Extract PDF if available - handle both nested and flat structures
  const pdf = leaderDataObj?.Pdf?.data?.attributes 
    || leaderDataObj?.Pdf 
    || leader?.Pdf?.data?.attributes 
    || leader?.Pdf;
  const pdfUrl = pdf ? getStrapiMedia(pdf) : null;

  // Extract PDF title from cta component if available, otherwise use PdfTitle field
  const pdfTitle = leaderDataObj?.cta?.text 
    || leaderDataObj?.PdfTitle 
    || 'Download PDF';

  return {
    name: name,
    title: designation,
    image: imageUrl ? {
      url: imageUrl,
      alt: name
    } : null,
    biography: biography,
    education: education,
    infoItems: infoItems,
    committeeMembership: committeeMembership, // Rich text markdown string
    committeeMemberships: committeeMemberships, // Array of committee names (for committees page)
    otherDirectorships: mappedOtherDirectorships, // Object with name, ctaName, pdf
    pdf: pdfUrl ? {
      url: pdfUrl,
      title: pdfTitle
    } : null
  };
}

/**
 * Fetch committee-groups data from Strapi
 * This is a Collection Type, so it returns an array
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getCommitteeGroups() {
  const populateQuery = [
    'populate[PdfFile][populate]=*',
    'sort=DisplayOrder:asc'
  ].join('&');
  
  return fetchAPI(`committee-groups?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map committee and leaders data from Strapi
 * Groups leaders by CommitteeMemberType with committee_group relation
 * Merges PDF and DisplayOrder data from committee-groups collection
 * 
 * @param {Object} leadersData - Raw Strapi API response for leaders
 * @param {Object} committeeGroupsData - Raw Strapi API response for committee-groups (optional)
 * @returns {Object} Mapped committees data for component
 */
export function mapCommitteesData(leadersData, committeeGroupsData = null) {
  // Handle Strapi v4 response structure (Collection Type)
  const leadersArray = leadersData?.data || leadersData || [];

  if (!Array.isArray(leadersArray) || leadersArray.length === 0) {
    return {
      committees: []
    };
  }

  // Map to store committees by their ID/name from committee_group
  const committeesMap = new Map();

  // Create a map of committee-groups data by name/slug for quick lookup
  const committeeGroupsMap = new Map();
  if (committeeGroupsData) {
    const groupsArray = committeeGroupsData?.data || (Array.isArray(committeeGroupsData) ? committeeGroupsData : []);
    if (Array.isArray(groupsArray)) {
      groupsArray.forEach((group) => {
        const groupData = group?.attributes || group;
        const groupId = group?.id || group?.documentId || groupData?.id || groupData?.documentId || '';
        const groupName = groupData?.name || groupData?.Name || '';
        const groupSlug = groupData?.slug || groupData?.Slug || '';
        const pdfFile = groupData?.PdfFile?.data?.attributes || groupData?.PdfFile?.data || groupData?.PdfFile;
        const pdfUrl = pdfFile ? getStrapiMedia(pdfFile) : null;
        const displayOrder = groupData?.DisplayOrder || groupData?.displayOrder || groupData?.display_order || '999';
        
        const groupInfo = {
          id: groupId,
          name: groupName,
          slug: groupSlug,
          pdfUrl: pdfUrl,
          displayOrder: displayOrder
        };
        
        // Store by ID, name, and slug for flexible matching
        if (groupId) {
          committeeGroupsMap.set(String(groupId), groupInfo);
        }
        if (groupName) {
          committeeGroupsMap.set(groupName.toLowerCase().trim(), groupInfo);
        }
        if (groupSlug) {
          committeeGroupsMap.set(groupSlug.toLowerCase().trim(), groupInfo);
        }
      });
    }
  }

  // Process each leader and add to relevant committees based on CommitteeMemberType
  leadersArray.forEach((leader) => {
    // Extract leader data (handle both direct and attributes structure)
    const leaderData = leader?.attributes || leader;
    
    // Extract leader basic info
    const profileImage = leaderData?.ProfileImage?.data?.attributes || leaderData?.ProfileImage || leader?.ProfileImage?.data?.attributes || leader?.ProfileImage;
    const imageUrl = profileImage ? getStrapiMedia(profileImage) : null;

    const slug = leaderData?.slug || leader?.slug || '';
    const leaderLink = slug ? `/about-us/leadership/${slug}` : '#';

    const leaderName = leaderData?.LeaderName || leader?.LeaderName || leaderData?.leaderName || leader?.leaderName || '';
    const designation = leaderData?.Designation || leader?.Designation || leaderData?.designation || leader?.designation || '';

    // Skip if no name
    if (!leaderName) {
      return;
    }

    // Process CommitteeMemberType array
    const committeeMemberTypes = leaderData?.CommitteeMemberType || leader?.CommitteeMemberType || [];
    
    if (Array.isArray(committeeMemberTypes) && committeeMemberTypes.length > 0) {
      committeeMemberTypes.forEach((memberType) => {
        // Extract committee_group relation
        const committeeGroup = memberType?.committee_group?.data?.attributes 
          || memberType?.committee_group?.data 
          || memberType?.committee_group?.attributes 
          || memberType?.committee_group;
        
        if (committeeGroup) {
          // Get committee ID and name from committee_group
          const committeeId = committeeGroup?.id || committeeGroup?.documentId || '';
          const committeeName = committeeGroup?.Name || committeeGroup?.name || committeeGroup?.Title || committeeGroup?.title || '';
          
          // Skip if no committee name
          if (!committeeName) {
            return;
          }

          // Normalize committee name for comparison (case-insensitive, trim whitespace)
          const normalizedName = committeeName.toLowerCase().trim();
          
          // Exclude Board of Directors and Management Team from committees page
          // These belong to the Leadership page, not the Committees page
          if ((normalizedName.includes('board') && normalizedName.includes('director')) ||
              (normalizedName.includes('management') && normalizedName.includes('team')) ||
              normalizedName === 'board of directors' ||
              normalizedName === 'management team' ||
              normalizedName === 'the management team') {
            return; // Skip this committee
          }

          // Get order from memberType.Order (CommitteeMemberType relation's Order field)
          // This is the correct field for ordering members within a committee
          const memberOrder = committeeGroup?.Order !== undefined && committeeGroup?.Order !== null 
            ? Number(committeeGroup.Order) 
            : (memberType?.Order !== undefined && memberType?.Order !== null ? Number(memberType.Order) : 999);

          // Get or create committee in map
          if (!committeesMap.has(committeeId)) {
            // Look up PDF and DisplayOrder from committee-groups
            // Try matching by ID first, then by name, then by slug
            let groupData = null;
            if (committeeId) {
              groupData = committeeGroupsMap.get(String(committeeId));
            }
            if (!groupData) {
              groupData = committeeGroupsMap.get(normalizedName);
            }
            
            committeesMap.set(committeeId, {
              id: committeeId,
              title: committeeName,
              members: [],
              pdfUrl: groupData?.pdfUrl || null,
              displayOrder: groupData?.displayOrder || '999'
            });
          }

          // Create member object with order from CommitteeMemberType relation
          const member = {
            id: leader?.id || leader?.documentId || Math.random(),
            name: leaderName,
            title: designation,
            image: imageUrl ? {
              url: imageUrl,
              alt: leaderName
            } : null,
            link: leaderLink,
            order: memberOrder // Use order from CommitteeMemberType relation, not leader's DisplayOrder
          };

          // Add member to committee
          const committee = committeesMap.get(committeeId);
          if (committee) {
            // Check if member already exists (avoid duplicates)
            const existingMember = committee.members.find(m => m.id === member.id);
            if (!existingMember) {
              committee.members.push(member);
            }
          }
        }
      });
    }
  });

  // Convert map to array, filter out empty committees, and sort members by order (numeric)
  const committees = Array.from(committeesMap.values())
    .filter(committee => committee.members.length > 0) // Only include committees with members
    .map(committee => ({
      ...committee,
      members: committee.members.sort((a, b) => {
        const orderA = a.order || 999;
        const orderB = b.order || 999;
        if (orderA !== orderB) {
          return orderA - orderB; // Numeric comparison
        }
        return (a.name || '').localeCompare(b.name || ''); // Sort by name if order is the same
      })
    }));

  // Sort committees by DisplayOrder first, then by title alphabetically
  committees.sort((a, b) => {
    const orderA = a.displayOrder || '999';
    const orderB = b.displayOrder || '999';
    if (orderA !== orderB) {
      return orderA.localeCompare(orderB);
    }
    return (a.title || '').localeCompare(b.title || '');
  });

  return {
    committees: committees
  };
}

/**
 * Fetch our-manufacturing-site data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - IntroSection (Component - IntroSectionData)
 *   - Description (Rich text Markdown)
 * - CountryAddressSection (Component - CountryCardData)
 *   - CountryName, CityAddressSection (repeatable CityAddressCard)
 *     - CityName, Description, AddressDetail (Rich text Markdown), isActive
 * - NorthAmericaSection (Component - InternationalCountryData)
 *   - CountryName, CityAddressSection (repeatable CityAddressCard)
 *     - CityName, Description, AddressDetail (Rich text Markdown), isActive
 * - LatamSection (Component - InternationalCountryData)
 *   - CountryName, CityAddressSection (repeatable CityAddressCard)
 *     - CityName, Description, AddressDetail (Rich text Markdown), isActive
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurManufacturingSite() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[IntroSection][populate]=*',
    'populate[CountryAddressSection][populate][CityAddressSection][populate]=*',
    'populate[NorthAmericaSection][populate][CityAddressSection][populate]=*',
    'populate[LatamSection][populate][CityAddressSection][populate]=*'
  ].join('&');
  
  return fetchAPI(`our-manufacturing-site?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map our-manufacturing-site data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped manufacturing site data for components
 */
export function mapOurManufacturingSiteData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) {
    return {
      banner: null,
      introSection: null,
      countryAddressSection: null,
      northAmericaSection: null,
      latamSection: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map IntroSection
  const introSection = data?.IntroSection;
  const introData = introSection?.Description ? {
    description: introSection.Description
  } : null;

  // Map CountryAddressSection (India)
  const countryAddressSection = data?.CountryAddressSection;
  let countryData = null;
  if (countryAddressSection) {
    const citySections = countryAddressSection?.CityAddressSection || [];
    const sites = citySections
      .filter(city => city?.isActive !== false)
      .map((city) => ({
        id: city?.id || Math.random(),
        title: city?.CityName || '',
        description: city?.Description || '',
        address: {
          label: 'Address',
          text: city?.AddressDetail || ''
        }
      }));

    // Only create data if we have heading and sites
    const heading = countryAddressSection?.CountryName || '';
    if (heading && sites.length > 0) {
      countryData = {
        heading: heading,
        sites: sites
      };
    }
  }

  // Map NorthAmericaSection
  const northAmericaSection = data?.NorthAmericaSection;
  let northAmericaData = null;
  if (northAmericaSection) {
    const citySections = northAmericaSection?.CityAddressSection || [];
    const sites = citySections
      .filter(city => city?.isActive !== false)
      .map((city) => ({
        id: city?.id || Math.random(),
        title: city?.CityName || '',
        description: city?.Description || '',
        address: {
          label: 'Address',
          text: city?.AddressDetail || ''
        }
      }));

    // Only create data if we have heading and sites
    const heading = northAmericaSection?.CountryName || '';
    if (heading && sites.length > 0) {
      northAmericaData = {
        heading: heading,
        showBackground: false,
        sites: sites
      };
    }
  }

  // Map LatamSection
  const latamSection = data?.LatamSection;
  let latamData = null;
  if (latamSection) {
    const citySections = latamSection?.CityAddressSection || [];
    const sites = citySections
      .filter(city => city?.isActive !== false)
      .map((city) => ({
        id: city?.id || Math.random(),
        title: city?.CityName || '',
        description: city?.Description || '',
        address: {
          label: 'Address',
          text: city?.AddressDetail || ''
        }
      }));

    // Only create data if we have heading and sites
    const heading = latamSection?.CountryName || '';
    if (heading && sites.length > 0) {
      latamData = {
        heading: heading,
        fullWidth: true,
        showBackground: false,
        sites: sites
      };
    }
  }

  return {
    banner: banner,
    introSection: introData,
    countryAddressSection: countryData,
    northAmericaSection: northAmericaData,
    latamSection: latamData
  };
}

/**
 * Fetch investor page data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getInvestor() {
  // Populate all nested components and media
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[CorporateGovernanceSection][populate][DesktopImage][populate]=*',
    'populate[CorporateGovernanceSection][populate][MobileImage][populate]=*',
    'populate[CorporateGovernanceSection][populate][Links][populate]=*',
    'populate[ShareholderInformationSection][populate][Image][populate]=*',
    'populate[ShareholderInformationSection][populate][ShareHolderInformation][populate][DocumentPdf][populate]=*',
    'populate[ShareholderInformationSection][populate][ShareHolderInformation][populate][cta][populate]=*',
    'populate[NewsSection][populate][items][populate][circleInner][populate]=*',
    'populate[NewsSection][populate][items][populate][cta][populate]=*',
    'populate[ReportsFilingSection][populate][FinancialHighLightCard][populate][DocumentFile][populate]=*',
    'populate[ReportsFilingSection][populate][FinancialHighLightCard][populate][cta][populate]=*',
    'populate[ReportsFilingSection][populate][IntegratedReport][populate][CoverImage][populate]=*',
    'populate[ReportsFilingSection][populate][IntegratedReport][populate][ReportFile][populate]=*',
    'populate[ReportsFilingSection][populate][NseExchangeSection][populate][PdfDocument][populate][Pdf][populate]=*',
    'populate[ReportsFilingSection][populate][NseExchangeSection][populate][cta][populate]=*'
  ].join('&');
  
  return fetchAPI(`investor?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map investor page data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped investor data for components
 */
export function mapInvestorData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;
  
  if (!data) {
    return {
      introductionSection: null,
      corporateGovernanceSection: null,
      shareholderInformationSection: null,
      newsSection: null,
      reportsFilingSection: null,
      nseExchangeSection: null
    };
  }

  // Map IntroductionSection (Rich text - Markdown)
  const introductionSection = data?.IntroductionSection || data?.introductionSection || null;

  // Map CorporateGovernanceSection
  const corporateGovernanceSection = data?.CorporateGovernanceSection || data?.corporateGovernanceSection;
  let mappedCorporateGovernance = null;
  if (corporateGovernanceSection) {
    const desktopImage = corporateGovernanceSection?.DesktopImage?.data?.attributes || corporateGovernanceSection?.DesktopImage || corporateGovernanceSection?.desktopImage;
    const mobileImage = corporateGovernanceSection?.MobileImage?.data?.attributes || corporateGovernanceSection?.MobileImage || corporateGovernanceSection?.mobileImage;
    const links = Array.isArray(corporateGovernanceSection?.Links) 
      ? corporateGovernanceSection.Links 
      : (Array.isArray(corporateGovernanceSection?.links) ? corporateGovernanceSection.links : []);

    mappedCorporateGovernance = {
      sectionTitle: corporateGovernanceSection?.SectionTitle || corporateGovernanceSection?.sectionTitle || null,
      desktopImage: desktopImage ? getStrapiMedia(desktopImage) : null,
      mobileImage: mobileImage ? getStrapiMedia(mobileImage) : null,
      links: links.map(link => ({
        text: link?.text || link?.Text || '',
        href: link?.href || link?.Href || '#'
      }))
    };
  }

  // Map ShareholderInformationSection
  const shareholderInformationSection = data?.ShareholderInformationSection || data?.shareholderInformationSection;
  let mappedShareholderInformation = null;
  if (shareholderInformationSection) {
    const centerImage = shareholderInformationSection?.Image?.data?.attributes || shareholderInformationSection?.Image || shareholderInformationSection?.image;
    const shareholderInfo = Array.isArray(shareholderInformationSection?.ShareHolderInformation)
      ? shareholderInformationSection.ShareHolderInformation
      : (Array.isArray(shareholderInformationSection?.shareHolderInformation) ? shareholderInformationSection.shareHolderInformation : []);

    // Filter by isActive and sort by DisplayOrder
    const filteredInfo = shareholderInfo
      .filter(item => item?.isActive !== false && item?.IsActive !== false)
      .sort((a, b) => {
        const orderA = a?.DisplayOrder || a?.displayOrder || '999';
        const orderB = b?.DisplayOrder || b?.displayOrder || '999';
        return orderA.localeCompare(orderB);
      })
      .map(item => {
        const documentPdf = item?.DocumentPdf?.data?.attributes || item?.DocumentPdf || item?.documentPdf;
        const cta = item?.cta || item?.Cta || {};
        const pdfUrl = documentPdf ? getStrapiMedia(documentPdf) : null;
        
        return {
          pdfTitle: item?.PdfTitle || item?.pdfTitle || '',
          documentPdf: pdfUrl,
          cta: {
            text: cta?.text || cta?.Text || '',
            href: cta?.href || cta?.Href || cta?.href || '#'
          }
        };
      });

    mappedShareholderInformation = {
      sectionTitle: shareholderInformationSection?.SectionTitle || shareholderInformationSection?.sectionTitle || null,
      image: centerImage ? getStrapiMedia(centerImage) : null,
      shareholderInformation: filteredInfo
    };
  }

  // Map NewsSection
  const newsSection = data?.NewsSection || data?.newsSection;
  let mappedNewsSection = null;
  if (newsSection) {
    const items = Array.isArray(newsSection?.items) ? newsSection.items : [];
    mappedNewsSection = {
      title: newsSection?.titile || newsSection?.title || null, // Note: typo in API field name "titile"
      items: items.map(item => {
        const circleInner = item?.circleInner?.data?.attributes || item?.circleInner || item?.CircleInner;
        const cta = item?.cta || item?.Cta || {};
        const imageUrl = circleInner ? getStrapiMedia(circleInner) : null;
        
        // Only include image if it exists
        const image = imageUrl ? {
          url: imageUrl,
          alt: circleInner?.alternativeText || circleInner?.caption || item?.headline || item?.Headline || '',
          width: circleInner?.width || 627,
          height: circleInner?.height || 627
        } : null;
        
        return {
          id: item?.id || null,
          date: item?.date || item?.Date || '',
          headline: item?.headline || item?.Headline || null,
          image: image,
          href: cta?.href || cta?.Href || '#'
        };
      }).filter(item => item.id) // Only include items with valid IDs
    };
  }

  // Map ReportsFilingSection
  const reportsFilingSection = data?.ReportsFilingSection || data?.reportsFilingSection;
  let mappedReportsFiling = null;
  if (reportsFilingSection) {
    const financialHighlightCard = reportsFilingSection?.FinancialHighLightCard || reportsFilingSection?.financialHighLightCard;
    const integratedReport = reportsFilingSection?.IntegratedReport || reportsFilingSection?.integratedReport;
    const nseExchangeSection = reportsFilingSection?.NseExchangeSection || reportsFilingSection?.nseExchangeSection;
    
    let mappedFinancialHighlight = null;
    if (financialHighlightCard && financialHighlightCard?.isActive !== false && financialHighlightCard?.IsActive !== false) {
      const documentFile = financialHighlightCard?.DocumentFile?.data?.attributes || financialHighlightCard?.DocumentFile || financialHighlightCard?.documentFile;
      const cta = financialHighlightCard?.cta || financialHighlightCard?.Cta || {};
      const pdfUrl = documentFile ? getStrapiMedia(documentFile) : null;
      
      mappedFinancialHighlight = {
        financialYear: financialHighlightCard?.FinancialYear || financialHighlightCard?.financialYear || '',
        grossProfit: financialHighlightCard?.GrossProfit || financialHighlightCard?.grossProfit || '',
        grossProfitMargin: financialHighlightCard?.GrossProfitMargin || financialHighlightCard?.grossProfitMargin || '',
        rndInvestment: financialHighlightCard?.RndInvestment || financialHighlightCard?.rndInvestment || '',
        documentFile: pdfUrl,
        viewAllUrl: financialHighlightCard?.ViewAllUrl || financialHighlightCard?.viewAllUrl || '#',
        cta: {
          text: cta?.text || cta?.Text || '',
          href: cta?.href || cta?.Href || cta?.href || '#'
        }
      };
    }

    let mappedIntegratedReport = null;
    if (integratedReport && integratedReport?.isActive !== false && integratedReport?.IsActive !== false) {
      const coverImage = integratedReport?.CoverImage?.data?.attributes || integratedReport?.CoverImage || integratedReport?.coverImage;
      const reportFile = integratedReport?.ReportFile?.data?.attributes || integratedReport?.ReportFile || integratedReport?.reportFile;
      const coverImageUrl = coverImage ? getStrapiMedia(coverImage) : null;
      const reportFileUrl = reportFile ? getStrapiMedia(reportFile) : null;
      
      mappedIntegratedReport = {
        reportTitle: integratedReport?.ReportTitle || integratedReport?.reportTitle || '',
        reportYear: integratedReport?.ReportYear || integratedReport?.reportYear || '',
        coverImage: coverImageUrl ? {
          url: coverImageUrl,
          alt: integratedReport?.ReportTitle || integratedReport?.reportTitle || ''
        } : null,
        reportFile: reportFileUrl,
        downloadLabel: integratedReport?.DownloadLabel || integratedReport?.downloadLabel || '',
        viewAllLabel: integratedReport?.ViewAllLabel || integratedReport?.viewAllLabel || '',
        viewAllUrl: integratedReport?.ViewAllUrl || integratedReport?.viewAllUrl || '#'
      };
    }

    // Map NseExchangeSection (nested inside ReportsFilingSection)
    let mappedNseExchange = null;
    if (nseExchangeSection) {
      const pdfDocuments = Array.isArray(nseExchangeSection?.PdfDocument)
        ? nseExchangeSection.PdfDocument
        : (Array.isArray(nseExchangeSection?.pdfDocument) ? nseExchangeSection.pdfDocument : []);

      // Filter by isActive and sort by PublishedDate
      const filteredPdfs = pdfDocuments
        .filter(item => item?.isActive !== false && item?.IsActive !== false)
        .sort((a, b) => {
          const dateA = a?.PublishedDate || a?.publishedDate || '';
          const dateB = b?.PublishedDate || b?.publishedDate || '';
          return new Date(dateB) - new Date(dateA); // Descending order (newest first)
        })
        .map(item => {
          const pdf = item?.Pdf?.data?.attributes || item?.Pdf || item?.pdf;
          const pdfUrl = pdf ? getStrapiMedia(pdf) : null;
          
          return {
            title: item?.Title || item?.title || '',
            publishedDate: item?.PublishedDate || item?.publishedDate || null,
            pdf: pdfUrl
          };
        });

      // Map CTA if available
      const cta = nseExchangeSection?.cta || nseExchangeSection?.CTA || null;
      const mappedCta = cta ? {
        text: cta?.text || cta?.Text || '',
        href: cta?.href || cta?.Href || '#'
      } : null;

      mappedNseExchange = {
        sectionTitle: nseExchangeSection?.SectionTitle || nseExchangeSection?.sectionTitle || null,
        pdfDocuments: filteredPdfs,
        cta: mappedCta
      };
    }

    mappedReportsFiling = {
      financialHighlightCard: mappedFinancialHighlight,
      integratedReport: mappedIntegratedReport,
      nseExchangeSection: mappedNseExchange
    };
  }

  return {
    introductionSection: introductionSection,
    corporateGovernanceSection: mappedCorporateGovernance,
    shareholderInformationSection: mappedShareholderInformation,
    newsSection: mappedNewsSection,
    reportsFilingSection: mappedReportsFiling
  };
}

