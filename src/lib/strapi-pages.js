// Strapi API helper functions for Page-level endpoints
// This file contains API functions for individual pages (about-us, etc.)

import { fetchAPI, getStrapiMedia, mapTopBannerData } from './strapi';

/**
 * Fetch about-us data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - PageIntroSection (Component - IntroSection)
 *   - Heading (Rich text), Image, Description (Rich text)
 * - AboutOverviewSection (Repeatable Component - AboutOverviewCard)
 *   - Title, Image, Icon, Description (Rich text), cta, Image_Position, isActive
 * - RedirectSection (Component - RedirectCard)
 *   - cta (Component - CTA with text, href)
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getAboutUs() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[PageIntroSection][populate][Image][populate]=*',
    'populate[AboutOverviewSection][populate][Image][populate]=*',
    'populate[AboutOverviewSection][populate][Icon][populate]=*',
    'populate[AboutOverviewSection][populate][cta][populate]=*',
    'populate[RedirectSection][populate][cta][populate]=*'
  ].join('&');

  return fetchAPI(`about-us?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map about-us data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped about-us data for component
 */
export function mapAboutUsData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      banner: null,
      pageIntro: null,
      overviewSections: [],
      redirectSection: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner || data?.topBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map PageIntroSection
  const pageIntroSection = data?.PageIntroSection || data?.pageIntroSection;
  let pageIntro = null;
  if (pageIntroSection) {
    const introImage = pageIntroSection?.Image?.data?.attributes || pageIntroSection?.Image || pageIntroSection?.image?.data?.attributes || pageIntroSection?.image;
    const imageUrl = introImage ? getStrapiMedia(introImage) : null;

    // Heading is Rich text (Markdown) - extract as string, then split into array for line-by-line rendering
    const heading = pageIntroSection?.Heading || pageIntroSection?.heading || '';
    let headingText = typeof heading === 'string' ? heading : '';
    // Strip markdown syntax
    headingText = headingText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '');
    // Split by newlines or spaces to create array of lines/words
    const headingArray = headingText.includes('\n')
      ? headingText.split('\n').filter(line => line.trim())
      : headingText.split(/\s+/).filter(word => word.trim());

    // Description is Rich text (Markdown) - extract as string
    const description = pageIntroSection?.Description || pageIntroSection?.description || '';
    const descriptionText = typeof description === 'string' ? description : '';
    // Strip markdown syntax for plain text rendering
    const descriptionPlain = descriptionText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '');

    pageIntro = {
      heading: heading, // Return as array for line-by-line rendering
      description: descriptionPlain, // Return as plain text
      image: imageUrl ? {
        url: imageUrl,
        alt: introImage?.alternativeText || introImage?.caption || 'About Us'
      } : null
    };
  }

  // Map AboutOverviewSection (Repeatable Component)
  const overviewSectionsArray = data?.AboutOverviewSection || data?.aboutOverviewSection || [];
  const overviewSections = overviewSectionsArray
    .filter(section => section?.isActive !== false)
    .map((section, index) => {
      const sectionImage = section?.Image?.data?.attributes || section?.Image || section?.image?.data?.attributes || section?.image;
      const imageUrl = sectionImage ? getStrapiMedia(sectionImage) : null;

      const sectionIcon = section?.Icon?.data?.attributes || section?.Icon || section?.icon?.data?.attributes || section?.icon;
      const iconUrl = sectionIcon ? getStrapiMedia(sectionIcon) : null;

      const cta = section?.cta || section?.CTA;
      const ctaData = cta ? {
        text: cta?.text || '',
        href: cta?.href || '#'
      } : null;

      const imagePosition = section?.Image_Position || section?.image_Position || section?.imagePosition || 'right';

      // Description is Rich text (Markdown) - extract as string
      const description = section?.Description || section?.description || '';
      const descriptionText = typeof description === 'string' ? description : '';

      return {
        id: section?.id || index + 1,
        title: section?.Title || section?.title || '',
        description: descriptionText,
        image: imageUrl ? {
          url: imageUrl,
          alt: sectionImage?.alternativeText || sectionImage?.caption || section?.Title || section?.title || 'About Us'
        } : null,
        icon: iconUrl ? {
          url: iconUrl,
          alt: sectionIcon?.alternativeText || sectionIcon?.caption || 'Icon'
        } : null,
        cta: ctaData,
        color: index % 2 === 0 ? 'green' : 'teal',
        svg: index % 2 === 0 ? 'svg2' : 'svg1',
        svgPosition: imagePosition.toLowerCase() === 'left' ? 'right' : 'left',
        imagePosition: imagePosition.toLowerCase(), // 'left' or 'right'
        displayOrder: section?.DisplayOrder || section?.displayOrder || String(index + 1)
      };
    })
    .sort((a, b) => {
      const orderA = a.displayOrder || '999';
      const orderB = b.displayOrder || '999';
      return orderA.localeCompare(orderB);
    });

  // Map RedirectSection
  const redirectSection = data?.RedirectSection || data?.redirectSection;
  let redirectData = null;
  if (redirectSection) {
    const redirectCta = redirectSection?.cta || redirectSection?.CTA;
    if (redirectCta) {
      redirectData = {
        text: redirectCta?.text || 'View All',
        href: redirectCta?.href || '#'
      };
    }
  }

  return {
    banner: banner,
    pageIntro: pageIntro,
    overviewSections: overviewSections,
    redirectSection: redirectData
  };
}

/**
 * Fetch ethics-and-compliance data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - PageIntroSection (Component - IntroSection)
 *   - SectionTitle, IntroDetail (Rich text Markdown), DetailDescription (Rich text Markdown)
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getEthicsAndCompliance() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[PageIntroSection][populate]=*'
  ].join('&');

  return fetchAPI(`ethics-and-compliance?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map ethics-and-compliance data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped ethics and compliance data for component
 */
export function mapEthicsAndComplianceData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      banner: null,
      pageIntro: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner || data?.topBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map PageIntroSection
  const pageIntroSection = data?.PageIntroSection || data?.pageIntroSection;
  let pageIntro = null;
  if (pageIntroSection) {
    pageIntro = {
      sectionTitle: pageIntroSection?.SectionTitle || pageIntroSection?.sectionTitle || '',
      introDetail: pageIntroSection?.IntroDetail || pageIntroSection?.introDetail || '',
      detailDescription: pageIntroSection?.DetailDescription || pageIntroSection?.detailDescription || ''
    };
  }

  return {
    banner: banner,
    pageIntro: pageIntro
  };
}

/**
 * Fetch our-value data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - OurValueIntroSection (Component - IntroOurValue)
 *   - Heading, DetailDescription (Rich text Markdown)
 * - ValuesOverviewSection (Repeatable Component - CoreValueCard)
 *   - Heading, Description (Rich text Markdown), Image, isActive
 * - CulturePrinciplesVideoSection (Component - CulturePrinciples)
 *   - SectionTitle, DesktopPosterImage, MobilePosterImage, YoutubeLink
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurValue() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[OurValueIntroSection][populate]=*',
    'populate[ValuesOverviewSection][populate][Image][populate]=*',
    'populate[CulturePrinciplesVideoSection][populate][DesktopPosterImage][populate]=*',
    'populate[CulturePrinciplesVideoSection][populate][MobilePosterImage][populate]=*'
  ].join('&');

  return fetchAPI(`our-value?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map our-value data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped our-value data for component
 */
export function mapOurValueData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      banner: null,
      introSection: null,
      valuesOverview: [],
      videoSection: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner || data?.topBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map OurValueIntroSection
  const introSection = data?.OurValueIntroSection || data?.ourValueIntroSection;
  let introData = null;
  if (introSection) {
    introData = {
      heading: introSection?.Heading || introSection?.heading || '',
      detailDescription: introSection?.DetailDescription || introSection?.detailDescription || ''
    };
  }

  // Map ValuesOverviewSection (Repeatable Component)
  const valuesOverviewArray = data?.ValuesOverviewSection || data?.valuesOverviewSection || [];
  const valuesOverview = valuesOverviewArray
    .filter(value => value?.isActive !== false)
    .map((value, index) => {
      const valueImage = value?.Image?.data?.attributes || value?.Image || value?.image?.data?.attributes || value?.image;
      const imageUrl = valueImage ? getStrapiMedia(valueImage) : null;

      return {
        id: value?.id || index + 1,
        heading: value?.Heading || value?.heading || '',
        description: value?.Description || value?.description || '', // Markdown
        image: imageUrl ? {
          url: imageUrl,
          alt: valueImage?.alternativeText || valueImage?.caption || value?.Heading || value?.heading || 'Value'
        } : null,
        isActive: value?.isActive !== false
      };
    });

  // Map CulturePrinciplesVideoSection
  const videoSection = data?.CulturePrinciplesVideoSection || data?.culturePrinciplesVideoSection;
  let videoData = null;
  if (videoSection) {
    const desktopPoster = videoSection?.DesktopPosterImage?.data?.attributes || videoSection?.DesktopPosterImage || videoSection?.desktopPosterImage?.data?.attributes || videoSection?.desktopPosterImage;
    const desktopPosterUrl = desktopPoster ? getStrapiMedia(desktopPoster) : null;

    const mobilePoster = videoSection?.MobilePosterImage?.data?.attributes || videoSection?.MobilePosterImage || videoSection?.mobilePosterImage?.data?.attributes || videoSection?.mobilePosterImage;
    const mobilePosterUrl = mobilePoster ? getStrapiMedia(mobilePoster) : null;

    videoData = {
      sectionTitle: videoSection?.SectionTitle || videoSection?.sectionTitle || '',
      desktopPosterImage: desktopPosterUrl ? {
        url: desktopPosterUrl,
        alt: desktopPoster?.alternativeText || desktopPoster?.caption || 'Video poster'
      } : null,
      mobilePosterImage: mobilePosterUrl ? {
        url: mobilePosterUrl,
        alt: mobilePoster?.alternativeText || mobilePoster?.caption || 'Video poster'
      } : null,
      youtubeLink: videoSection?.YoutubeLink || videoSection?.youtubeLink || ''
    };
  }

  return {
    banner: banner,
    introSection: introData,
    valuesOverview: valuesOverview,
    videoSection: videoData
  };
}

/**
 * Fetch global-presence data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - PageIntroSection (Component - IntroSection)
 *   - Heading, IntroDescription (Rich text Markdown)
 * - GlobalPresenceSection (Repeatable Component - PresenceCard)
 *   - CountryName, Description (Rich text Markdown), Image, ImagePosition, cta, isActive, DisplayOrder
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getGlobalPresence() {
  const populateQuery = [
    'populate[PageIntroSection][populate]=*',
    'populate[GlobalPresenceSection][populate][Image][populate]=*',
    'populate[GlobalPresenceSection][populate][cta][populate]=*'
  ].join('&');

  return fetchAPI(`global-presence?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map global-presence data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped global-presence data for component
 */
export function mapGlobalPresenceData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      pageIntro: null,
      globalPresenceSections: []
    };
  }

  // Map PageIntroSection
  const pageIntroSection = data?.PageIntroSection || data?.pageIntroSection;
  let pageIntro = null;
  if (pageIntroSection) {
    pageIntro = {
      heading: pageIntroSection?.Heading || pageIntroSection?.heading || '',
      introDescription: pageIntroSection?.IntroDescription || pageIntroSection?.introDescription || ''
    };
  }

  // Map GlobalPresenceSection (Repeatable Component)
  const globalPresenceArray = data?.GlobalPresenceSection || data?.globalPresenceSection || [];
  const globalPresenceSections = globalPresenceArray
    .filter(section => section?.isActive !== false)
    .map((section, index) => {
      const sectionImage = section?.Image?.data?.attributes || section?.Image || section?.image?.data?.attributes || section?.image;
      const imageUrl = sectionImage ? getStrapiMedia(sectionImage) : null;

      const cta = section?.cta || section?.CTA;
      const ctaData = cta ? {
        text: cta?.text || '',
        href: cta?.href || '#'
      } : null;

      const imagePosition = section?.ImagePosition || section?.imagePosition || 'left';

      const orderVal = section?.order ?? section?.Order ?? section?.DisplayOrder ?? section?.displayOrder ?? (index + 1);
      return {
        id: section?.id || index + 1,
        countryName: section?.CountryName || section?.countryName || '',
        description: section?.Description || section?.description || '', // Markdown
        image: imageUrl ? {
          url: imageUrl,
          alt: sectionImage?.alternativeText || sectionImage?.caption || section?.CountryName || section?.countryName || 'Country'
        } : null,
        imagePosition: imagePosition.toLowerCase(), // 'left' or 'right'
        cta: ctaData,
        isActive: section?.isActive !== false,
        order: typeof orderVal === 'number' ? orderVal : Number(orderVal),
        displayOrder: orderVal
      };
    })
    .sort((a, b) => {
      const numA = Number(a.order ?? a.displayOrder ?? 999);
      const numB = Number(b.order ?? b.displayOrder ?? 999);
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB;
      }
      return String(a.displayOrder ?? '').localeCompare(String(b.displayOrder ?? ''));
    });

  return {
    pageIntro: pageIntro,
    globalPresenceSections: globalPresenceSections
  };
}

/**
 * Fetch our-purpose data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - PageIntroSection (Component - IntroCard)
 *   - SectionTitle, Heading (Rich text Markdown), ParagraphDescription (Rich text Markdown), image, YoutubeLink
 * - TreatmentSection (Component - TreatmentCard)
 *   - Heading (Rich text Markdown), ParaGraphDescription (Rich text Markdown), image (GlobalImage with DesktopImage, MobileImage)
 * - CommitmentSection (Component - Commitments)
 *   - SectionTitle (Rich text Markdown), CommitmentCard (repeatable ImageTextCards)
 *     - TitleLine1, TitleLine2, Description (Rich text Markdown), Image, isActive, DisplayOrder
 * - GuidedFrameWorkSection (Component - GuidedFrameWork)
 *   - SectionTitle (Rich text Markdown), FrameWorkCard (repeatable ImageTextCards)
 *     - TitleLine1, TitleLine2, Description (Rich text Markdown), Image, isActive, DisplayOrder
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurPurpose() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[PageIntroSection][populate][image][populate]=*',
    'populate[TreatmentSection][populate][image][populate][DesktopImage][populate]=*',
    'populate[TreatmentSection][populate][image][populate][MobileImage][populate]=*',
    'populate[CommitmentSection][populate][CommitmentCard][populate][Image][populate]=*',
    'populate[GuidedFrameWorkSection][populate][FrameWorkCard][populate][Image][populate]=*'
  ].join('&');

  return fetchAPI(`our-purpose?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map our-purpose data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped our-purpose data for component
 */
export function mapOurPurposeData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) {
    return {
      banner: null,
      pageIntro: null,
      treatmentSection: null,
      commitmentSection: null,
      guidedFrameworkSection: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map PageIntroSection
  const pageIntroSection = data?.PageIntroSection;
  let pageIntro = null;
  if (pageIntroSection) {
    const introImage = pageIntroSection?.image;
    const imageUrl = introImage ? getStrapiMedia(introImage) : null;

    pageIntro = {
      sectionTitle: pageIntroSection?.SectionTitle || pageIntroSection?.Heading || '',
      heading: pageIntroSection?.Heading || '',
      paragraphDescription: pageIntroSection?.ParagraphDescription || '',
      image: imageUrl ? {
        url: imageUrl,
        alt: introImage?.alternativeText || introImage?.caption || 'Purpose intro'
      } : null,
      youtubeLink: pageIntroSection?.YoutubeLink || ''
    };
  }

  // Map TreatmentSection
  const treatmentSection = data?.TreatmentSection;
  let treatmentData = null;
  if (treatmentSection) {
    const treatmentImage = treatmentSection?.image;
    let desktopImage = null;
    let mobileImage = null;

    if (treatmentImage) {
      const desktopImg = treatmentImage?.DesktopImage;
      const mobileImg = treatmentImage?.MobileImage;

      if (desktopImg) {
        const desktopUrl = getStrapiMedia(desktopImg);
        if (desktopUrl) {
          desktopImage = {
            url: desktopUrl,
            alt: desktopImg?.alternativeText || desktopImg?.caption || 'Treatment desktop'
          };
        }
      }

      if (mobileImg) {
        const mobileUrl = getStrapiMedia(mobileImg);
        if (mobileUrl) {
          mobileImage = {
            url: mobileUrl,
            alt: mobileImg?.alternativeText || mobileImg?.caption || 'Treatment mobile'
          };
        }
      }
    }

    treatmentData = {
      heading: treatmentSection?.Heading || '',
      paragraphDescription: treatmentSection?.ParaGraphDescription || '',
      desktopImage: desktopImage,
      mobileImage: mobileImage
    };

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('mapOurPurposeData - TreatmentSection raw:', treatmentSection);
      console.log('mapOurPurposeData - treatmentImage:', treatmentImage);
      console.log('mapOurPurposeData - treatmentData mapped:', treatmentData);
    }
  }

  // Map CommitmentSection
  const commitmentSection = data?.CommitmentSection;
  let commitmentData = null;
  if (commitmentSection) {
    const commitmentCardsArray = commitmentSection?.CommitmentCard || [];
    const commitmentCards = commitmentCardsArray
      .filter(card => card?.isActive !== false)
      .map((card, index) => {
        const cardImage = card?.Image;
        const imageUrl = cardImage ? getStrapiMedia(cardImage) : null;

        return {
          id: card?.id || index + 1,
          titleLine1: card?.TitleLine1 || '',
          titleLine2: card?.TitleLine2 || '',
          description: card?.Description || '',
          image: imageUrl ? {
            url: imageUrl,
            alt: cardImage?.alternativeText || cardImage?.caption || `${card?.TitleLine1} ${card?.TitleLine2}` || 'Commitment'
          } : null,
          isActive: card?.isActive !== false,
          displayOrder: card?.DisplayOrder || String(index + 1)
        };
      })
      .sort((a, b) => {
        const orderA = a.displayOrder || '999';
        const orderB = b.displayOrder || '999';
        return orderA.localeCompare(orderB);
      });

    commitmentData = {
      sectionTitle: commitmentSection?.SectionTitle || '',
      cards: commitmentCards
    };
  }

  // Map GuidedFrameWorkSection
  const guidedFrameworkSection = data?.GuidedFrameWorkSection;
  let frameworkData = null;
  if (guidedFrameworkSection) {
    const frameworkCardsArray = guidedFrameworkSection?.FrameWorkCard || [];
    const frameworkCards = frameworkCardsArray
      .filter(card => card?.isActive !== false)
      .map((card, index) => {
        const cardImage = card?.Image;
        const imageUrl = cardImage ? getStrapiMedia(cardImage) : null;

        return {
          id: card?.id || index + 1,
          titleLine1: card?.TitleLine1 || '',
          titleLine2: card?.TitleLine2 || '',
          description: card?.Description || '',
          image: imageUrl ? {
            url: imageUrl,
            alt: cardImage?.alternativeText || cardImage?.caption || `${card?.TitleLine1} ${card?.TitleLine2}` || 'Framework'
          } : null,
          isActive: card?.isActive !== false,
          displayOrder: card?.DisplayOrder || String(index + 1)
        };
      })
      .sort((a, b) => {
        const orderA = a.displayOrder || '999';
        const orderB = b.displayOrder || '999';
        return orderA.localeCompare(orderB);
      });

    frameworkData = {
      sectionTitle: (guidedFrameworkSection?.SectionTitle || '').trim(),
      cards: frameworkCards
    };
  }

  return {
    banner: banner,
    pageIntro: pageIntro,
    treatmentSection: treatmentData,
    commitmentSection: commitmentData,
    guidedFrameworkSection: frameworkData
  };
}

/**
 * Fetch contact-us data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - ContactInfoSection (Component - ContactDetailCard)
 *   - Heading, SubHeading, ContactCard (repeatable ContactInfoCard)
 *     - Title, Email, isActive
 * - GlobalPresenceSection (Repeatable Component - CountrySelectorCard)
 *   - CountryName, Image, AddressDetail (Rich text Markdown), isActive
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getContactUs() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[ContactInfoSection][populate][ContactCard][populate]=*',
    'populate[GlobalPresenceSection][populate][Image][populate]=*'
  ].join('&');

  return fetchAPI(`contact-us?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map contact-us data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped contact-us data for component
 */
export function mapContactUsData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) {
    return {
      banner: null,
      contactInfoSection: null,
      globalPresenceSection: []
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map ContactInfoSection
  const contactInfoSection = data?.ContactInfoSection;
  let contactInfoData = null;
  if (contactInfoSection) {
    const contactCardsArray = contactInfoSection?.ContactCard || [];
    const contacts = contactCardsArray
      .filter(card => card?.isActive !== false)
      .map((card) => ({
        title: card?.Title || '',
        email: card?.Email || ''
      }));

    contactInfoData = {
      heading: contactInfoSection?.Heading || '',
      subheading: contactInfoSection?.SubHeading || '',
      contacts: contacts
    };
  }

  // Map GlobalPresenceSection
  const globalPresenceSectionsArray = data?.GlobalPresenceSection || [];
  const locations = globalPresenceSectionsArray
    .filter(section => section?.isActive !== false)
    .map((section, index) => {
      const sectionImage = section?.Image;
      const imageUrl = sectionImage ? getStrapiMedia(sectionImage) : null;
      const countryName = section?.CountryName || '';

      // Convert markdown AddressDetail to addresses array
      // For now, we'll pass the markdown and let the component handle it
      const addressDetail = section?.AddressDetail || '';

      return {
        id: section?.id || `location-${index}`,
        name: countryName.toUpperCase(),
        label: countryName,
        image: imageUrl || '/assets/images/contact/india.png',
        addressDetail: addressDetail // Markdown content
      };
    });

  return {
    banner: banner,
    contactInfoSection: contactInfoData,
    globalPresenceSection: locations
  };
}

/**
 * Fetch community data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - PageIntroSection (Component - IntroSection)
 *   - Image, PageIntroContent (Rich text Markdown)
 * - ImpactSection (Component - ImpactGlanceSection)
 *   - SectionTitle, ImpactHeadingSection (repeatable), Map, MetricSection (repeatable)
 * - LivelihoodSection (Component - ProgramData)
 *   - SectionTitle, Heading, Description (Rich text Markdown), Image (GlobalImage)
 * - TabSectionDetails (Repeatable Component - TabCard)
 *   - TabTitle, isActive, TabSectionData (TabContent with nested components)
 * - LiveProgramSection (Component - LiveProgramSectionData)
 *   - Heading, SubHeading, Description (Rich text Markdown), Image, KeyHighlitesSection, SectionData
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getCommunity() {
  // Use populate=deep for complex nested structures
  // The structure is: TabSectionDetails (repeatable) -> TabSectionData -> KeyHighlites (repeatable) -> Icon
  // Note: KeyHighlites is a repeatable component, so we need to populate it correctly
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[PageIntroSection][populate][Image][populate]=*',
    'populate[ImpactSection][populate][ImpactHeadingSection][populate]=*',
    'populate[ImpactSection][populate][Map][populate]=*',
    'populate[ImpactSection][populate][MetricSection][populate][Icon][populate]=*',
    'populate[LivelihoodSection][populate][Image][populate][DesktopImage][populate]=*',
    'populate[LivelihoodSection][populate][Image][populate][MobileImage][populate]=*',
    'populate[TabSectionDetails][populate][TabSectionData][populate][SectionHeading][populate][Image][populate]=*',
    'populate[TabSectionDetails][populate][TabSectionData][populate][KeyHighlites][populate]=*',
    'populate[TabSectionDetails][populate][TabSectionData][populate][SectionData][populate][Image][populate]=*',
    'populate[LiveProgramSection][populate][Image][populate]=*',
    'populate[LiveProgramSection][populate][KeyHighlitesSection][populate][KeyHighlites][populate]=*'
  ].join('&');

  return fetchAPI(`community?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map community data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped community data for components
 */
export function mapCommunityData(strapiData) {
  const data = strapiData?.data || strapiData;
  if (!data) {
    return {
      banner: null,
      pageIntroSection: null,
      impactSection: null,
      livelihoodSection: null,
      tabSectionDetails: [],
      liveProgramSection: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map PageIntroSection
  const pageIntroSection = data?.PageIntroSection;
  let pageIntroData = null;
  if (pageIntroSection) {
    const introImage = pageIntroSection?.Image;
    const imageUrl = introImage ? getStrapiMedia(introImage) : null;

    pageIntroData = {
      image: imageUrl ? {
        url: imageUrl,
        alt: introImage?.alternativeText || 'Community Intro',
        width: introImage?.width || 600,
        height: introImage?.height || 600
      } : null,
      content: pageIntroSection?.PageIntroContent || ''
    };
  }

  // Map ImpactSection
  const impactSection = data?.ImpactSection;
  let impactData = null;
  if (impactSection) {
    const impactHeadingSection = impactSection?.ImpactHeadingSection || [];
    const headings = impactHeadingSection
      .filter(item => item?.isActive !== false)
      .map((item) => ({
        value: item?.Value || 0,
        description: item?.Description || ''
      }));

    const metricSection = impactSection?.MetricSection || [];
    const metrics = metricSection.map((metric) => {
      const icon = metric?.Icon;
      const iconUrl = icon ? getStrapiMedia(icon) : null;
      return {
        id: metric?.id || Math.random(),
        icon: iconUrl || '/assets/community/key1.svg',
        value: metric?.Value || 0,
        description: metric?.Description || ''
      };
    });

    const mapImage = impactSection?.Map;
    const mapUrl = mapImage ? getStrapiMedia(mapImage) : null;

    impactData = {
      sectionTitle: impactSection?.SectionTitle || 'Impact at a Glance',
      headings: headings,
      map: mapUrl || '/assets/community/map.png',
      metrics: metrics
    };
  }

  // Map LivelihoodSection
  const livelihoodSection = data?.LivelihoodSection;
  let livelihoodData = null;
  if (livelihoodSection) {
    const livelihoodImage = livelihoodSection?.Image;
    const desktopImage = livelihoodImage?.DesktopImage;
    const mobileImage = livelihoodImage?.MobileImage;
    const desktopUrl = desktopImage ? getStrapiMedia(desktopImage) : null;
    const mobileUrl = mobileImage ? getStrapiMedia(mobileImage) : null;

    livelihoodData = {
      sectionTitle: livelihoodSection?.SectionTitle || '',
      heading: livelihoodSection?.Heading || '',
      description: livelihoodSection?.Description || '',
      image: desktopUrl ? {
        url: desktopUrl,
        alt: desktopImage?.alternativeText || 'Livelihood',
        mobileUrl: mobileUrl || desktopUrl
      } : null
    };
  }

  // Map TabSectionDetails
  const tabSectionDetails = data?.TabSectionDetails || [];

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('mapCommunityData - tabSectionDetails:', tabSectionDetails);
  }

  const tabs = tabSectionDetails
    .filter(tab => tab?.isActive !== false)
    .map((tab) => {
      const tabSectionData = tab?.TabSectionData;

      // Debug logging for each tab
      if (process.env.NODE_ENV === 'development') {
        console.log(`mapCommunityData - Tab ${tab?.id || 'unknown'}:`, {
          tabTitle: tab?.TabTitle,
          tabSectionData: tabSectionData,
          keyHighlites: tabSectionData?.KeyHighlites || tabSectionData?.keyHighlites
        });
      }

      // Handle SectionHeading
      const sectionHeading = tabSectionData?.SectionHeading;
      let headingImage = null;
      let headingImageUrl = null;

      if (sectionHeading) {
        // Handle both direct Image and nested data.attributes structure
        headingImage = sectionHeading?.Image?.data?.attributes
          || sectionHeading?.Image?.data
          || sectionHeading?.Image
          || sectionHeading?.image?.data?.attributes
          || sectionHeading?.image;

        headingImageUrl = headingImage ? getStrapiMedia(headingImage) : null;
      }

      // Handle KeyHighlites (repeatable component)
      // The structure is: KeyHighlites is an array of objects, each containing a nested KeyHighlites array
      // Example: [{ id: 80, SectionTitle: "Key Highlights", KeyHighlites: [{ id: 458, Value: "910481", Description: "trees planted" }] }]
      const keyHighlightsRaw = tabSectionData?.KeyHighlites
        || tabSectionData?.keyHighlites
        || tabSectionData?.KeyHighlights
        || tabSectionData?.keyHighlights
        || [];

      // Debug logging for key highlights
      if (process.env.NODE_ENV === 'development') {
        console.log(`mapCommunityData - Tab ${tab?.id} KeyHighlites raw:`, keyHighlightsRaw);
      }

      // Extract the nested KeyHighlites array from the structure
      let keyHighlights = [];
      if (Array.isArray(keyHighlightsRaw) && keyHighlightsRaw.length > 0) {
        // Check if it's the nested structure (array of objects with KeyHighlites property)
        if (keyHighlightsRaw[0]?.KeyHighlites && Array.isArray(keyHighlightsRaw[0].KeyHighlites)) {
          // Flatten the nested structure - get all KeyHighlites from all sections
          keyHighlights = keyHighlightsRaw.flatMap(section => section.KeyHighlites || []);
        } else {
          // Direct array structure
          keyHighlights = keyHighlightsRaw;
        }
      }

      // Format number with commas
      const formatNumber = (num) => {
        // Handle null, undefined, or empty string
        if (num === null || num === undefined || num === '') {
          return '';
        }
        // Handle string values
        if (typeof num === 'string') {
          const cleanNum = num.replace(/,/g, '').trim();
          if (!cleanNum) return '';
          // Check if it's a valid number
          if (isNaN(parseFloat(cleanNum))) return cleanNum; // Return as-is if not a number
          return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        // Handle numeric values (including 0)
        if (typeof num === 'number') {
          return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return num.toString();
      };

      const highlights = keyHighlights
        .filter((highlight) => {
          // Only include highlights that have a description (value can be null, which is valid)
          const description = highlight?.Description || highlight?.description;
          const hasDescription = description && description.trim() !== '';

          if (process.env.NODE_ENV === 'development' && !hasDescription) {
            console.log('mapCommunityData - Filtered out highlight (no description):', highlight);
          }

          return hasDescription;
        })
        .map((highlight) => {
          const rawValue = highlight?.Value ?? highlight?.value;
          const formattedValue = formatNumber(rawValue);

          const mappedHighlight = {
            id: highlight?.id || Math.random(),
            icon: '/assets/community/key1.svg', // Use static icon (no Icon field in TabSectionData.KeyHighlites)
            value: formattedValue,
            description: highlight?.Description || highlight?.description || ''
          };

          if (process.env.NODE_ENV === 'development') {
            console.log('mapCommunityData - Mapped highlight:', {
              raw: highlight,
              mapped: mappedHighlight
            });
          }

          return mappedHighlight;
        });

      if (process.env.NODE_ENV === 'development') {
        console.log(`mapCommunityData - Tab ${tab?.id} highlights (after mapping):`, highlights);
      }

      // Handle SectionData
      const sectionData = tabSectionData?.SectionData || tabSectionData?.sectionData;
      let sectionImage = null;
      let sectionImageUrl = null;

      if (sectionData) {
        // Handle both direct Image and nested data.attributes structure
        sectionImage = sectionData?.Image?.data?.attributes
          || sectionData?.Image?.data
          || sectionData?.Image
          || sectionData?.image?.data?.attributes
          || sectionData?.image;

        sectionImageUrl = sectionImage ? getStrapiMedia(sectionImage) : null;
      }

      // Extract quote data from SectionData (for Agriculture tab)
      let quoteData = null;
      if (sectionData && tab?.id === 1) {
        // Parse heading to extract author name and designation
        // Format: "Chotelal Saini Farmer" -> author: "Chotelal Saini", designation: "Farmer"
        const heading = sectionData?.Heading || sectionData?.heading || '';
        const headingParts = heading.trim().split(/\s+/);
        let author = '';
        let designation = '';

        if (headingParts.length > 1) {
          // Last word is usually the designation
          designation = headingParts[headingParts.length - 1];
          author = headingParts.slice(0, -1).join(' ');
        } else {
          author = heading;
        }

        quoteData = {
          quote: sectionData?.Description || sectionData?.description || '',
          author: author,
          designation: designation,
          image: sectionImageUrl ? {
            url: sectionImageUrl,
            alt: sectionImage?.alternativeText || sectionImage?.caption || author || 'Author',
            width: sectionImage?.width || 332,
            height: sectionImage?.height || 330
          } : null
        };
      }

      return {
        id: tab?.id || Math.random(),
        title: tab?.TabTitle || tab?.tabTitle || '',
        isActive: tab?.isActive !== false,
        content: {
          heading: sectionHeading ? {
            heading: sectionHeading?.Heading || sectionHeading?.heading || '',
            description: sectionHeading?.Description || sectionHeading?.description || '',
            image: headingImageUrl ? {
              url: headingImageUrl,
              alt: headingImage?.alternativeText || headingImage?.caption || 'Tab Heading',
              width: headingImage?.width || 600,
              height: headingImage?.height || 600
            } : null,
            imagePosition: (sectionHeading?.Image_Position || sectionHeading?.image_Position || sectionHeading?.imagePosition || 'right').toLowerCase()
          } : null,
          keyHighlights: highlights,
          sectionData: sectionData ? {
            heading: sectionData?.Heading || sectionData?.heading || '',
            description: sectionData?.Description || sectionData?.description || '',
            image: sectionImageUrl ? {
              url: sectionImageUrl,
              alt: sectionImage?.alternativeText || sectionImage?.caption || 'Section Image',
              width: sectionImage?.width || 600,
              height: sectionImage?.height || 600
            } : null,
            imagePosition: (sectionData?.Image_Position || sectionData?.image_Position || sectionData?.imagePosition || 'right').toLowerCase()
          } : null,
          quote: quoteData
        }
      };
    });

  // Map LiveProgramSection
  const liveProgramSection = data?.LiveProgramSection;
  let liveProgramData = null;
  if (liveProgramSection) {
    const programImage = liveProgramSection?.Image;
    const programImageUrl = programImage ? getStrapiMedia(programImage) : null;

    const keyHighlightsSection = liveProgramSection?.KeyHighlitesSection;
    const keyHighlights = keyHighlightsSection?.KeyHighlites || [];
    const highlights = keyHighlights.map((highlight) => {
      const icon = highlight?.Icon;
      const iconUrl = icon ? getStrapiMedia(icon) : null;
      return {
        id: highlight?.id || Math.random(),
        icon: iconUrl || '/assets/community/key1.svg',
        value: highlight?.Value || 0,
        description: highlight?.Description || ''
      };
    });

    const sectionData = liveProgramSection?.SectionData;

    liveProgramData = {
      heading: liveProgramSection?.Heading || '',
      subHeading: liveProgramSection?.SubHeading || '',
      description: liveProgramSection?.Description || '',
      image: programImageUrl ? {
        url: programImageUrl,
        alt: programImage?.alternativeText || 'Lives Program',
        width: programImage?.width || 872,
        height: programImage?.height || 600
      } : null,
      keyHighlights: highlights,
      sectionData: sectionData ? {
        detailDescription: sectionData?.DetailDescription || ''
      } : null
    };
  }

  return {
    banner: banner,
    pageIntroSection: pageIntroData,
    impactSection: impactData,
    livelihoodSection: livelihoodData,
    tabSectionDetails: tabs,
    liveProgramSection: liveProgramData
  };
}

/**
 * Fetch our-science data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - IntroSection (Component - IntroSectionData)
 *   - Heading (Rich text Markdown), Description (Rich text Markdown)
 * - NumberHighLightsSection (Component - NumbersCardData)
 *   - BackGroundImage (Component - GlobalImage with DesktopImage, MobileImage)
 *   - NumbersCardSection (Repeatable Component - NumbersCard)
 *     - SvgImage, Value, Description, Suffix
 * - ResearchDevelopmentSection (Component - ResearchData)
 *   - Heading, Description (Rich text Markdown), Image
 * - DigitalTransformationSection (Component - DigitalTransformationData)
 *   - Heading, Description (Rich text Markdown), Image, LeftSideContent, RightSideContent (Rich text Markdown)
 * - ParaGraphSection (Component - CommentData)
 *   - ParagarphData (Rich text Markdown)
 * - CoreSection (Repeatable Component - CoreCard)
 *   - Title, ImageSvg, Description (Rich text Markdown), Svg_position
 * - ContentSection (Component - CommentData)
 *   - ParagarphData (Rich text Markdown)
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurScience() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[IntroSection][populate]=*',
    'populate[NumberHighLightsSection][populate][BackGroundImage][populate][DesktopImage][populate]=*',
    'populate[NumberHighLightsSection][populate][BackGroundImage][populate][MobileImage][populate]=*',
    'populate[NumberHighLightsSection][populate][NumbersCardSection][populate][SvgImage][populate]=*',
    'populate[ResearchDevelopmentSection][populate][Image][populate]=*',
    'populate[DigitalTransformationSection][populate][Image][populate]=*',
    'populate[ParaGraphSection][populate]=*',
    'populate[CoreSection][populate][ImageSvg][populate]=*',
    'populate[ContentSection][populate]=*'
  ].join('&');

  return fetchAPI(`our-science?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map our-science data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped our-science data for components
 */
export function mapOurScienceData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      banner: null,
      introSection: null,
      numberHighlightsSection: null,
      researchDevelopmentSection: null,
      digitalTransformationSection: null,
      paragraphSection: null,
      coreSection: null,
      contentSection: null
    };
  }

  // Map TopBanner
  const banner = data?.TopBanner ? mapTopBannerData(data.TopBanner) : null;

  // Map IntroSection
  const introSection = data?.IntroSection;
  let introData = null;
  if (introSection) {
    const heading = introSection?.Heading || '';
    const headingLines = heading.split(/\n/).filter(l => l.trim());
    introData = {
      heading: {
        line1: headingLines[0] || '',
        line2: headingLines.slice(1).join('\n') || ''
      },
      description: introSection?.Description || ''
    };
  }

  // Map NumberHighLightsSection
  const numberHighlightsSection = data?.NumberHighLightsSection;
  let numberHighlightsData = null;
  if (numberHighlightsSection) {
    const backgroundImage = numberHighlightsSection?.BackGroundImage;
    const desktopImage = backgroundImage?.DesktopImage;
    const mobileImage = backgroundImage?.MobileImage;
    const desktopUrl = desktopImage ? getStrapiMedia(desktopImage) : null;
    const mobileUrl = mobileImage ? getStrapiMedia(mobileImage) : null;

    const numbersCards = numberHighlightsSection?.NumbersCardSection || [];
    const items = numbersCards.map((card) => {
      const svgImage = card?.SvgImage;
      const svgUrl = svgImage ? getStrapiMedia(svgImage) : null;

      const value = card?.Value || '';
      const suffix = card?.Suffix || '';
      const fullValue = suffix ? `${value}${suffix}` : value;

      return {
        value: fullValue,
        label: card?.Description || '',
        icon: svgUrl || '/assets/images/our-sci/icon1.svg'
      };
    });

    numberHighlightsData = {
      backgroundImage: {
        desktop: desktopUrl || '/assets/images/Background.png',
        mobile: mobileUrl || desktopUrl || '/assets/images/Background.png'
      },
      items: items
    };
  }

  // Map ResearchDevelopmentSection
  const researchSection = data?.ResearchDevelopmentSection;
  let researchData = null;
  if (researchSection) {
    const researchImage = researchSection?.Image;
    const imageUrl = researchImage ? getStrapiMedia(researchImage) : null;

    // Parse Description (Markdown) into paragraphs
    const description = researchSection?.Description || '';

    researchData = {
      heading: researchSection?.Heading || '',
      content: description,
      image: {
        url: imageUrl || '/assets/images/our-sci/biotechnology-scientist-researching-laboratory-using-microscope-typing-pc-chemist-examining-virus-evolution-using-high-tech-scientific-research-vaccine-development-against-covid19-1 1.png',
        alt: researchImage?.alternativeText || researchImage?.caption || 'Research and Development'
      }
    };
  }

  // Map DigitalTransformationSection
  const digitalSection = data?.DigitalTransformationSection;
  let digitalData = null;
  if (digitalSection) {
    const digitalImage = digitalSection?.Image;
    const imageUrl = digitalImage ? getStrapiMedia(digitalImage) : null;

    // Parse Description (Markdown) for main description
    const description = digitalSection?.Description || '';

    // Parse RightSideContent (Markdown) for section description
    const rightSideContent = digitalSection?.RightSideContent || '';

    // Parse LeftSideContent for section heading (split into two lines if needed)
    const leftSideContent = digitalSection?.LeftSideContent || '';
    const headingLines = leftSideContent.split(/\n/).filter(l => l.trim());

    digitalData = {
      mainHeading: digitalSection?.Heading || '',
      introParagraph: description.split('\n\n')[0] || description,
      sectionHeading: {
        line1: headingLines[0] || '',
        line2: headingLines[1] || ''
      },
      description: rightSideContent || description.split('\n\n').slice(1).join('\n\n'),
      image: {
        url: imageUrl || '/assets/images/our-sci/doctor-from-future-concept (2) 1.png',
        alt: digitalImage?.alternativeText || digitalImage?.caption || 'Digital Transformation'
      }
    };
  }

  // Map ParaGraphSection (just below Digital Transformation - ScienceCapability)
  const paragraphSection = data?.ParaGraphSection;
  let paragraphData = null;
  if (paragraphSection) {
    // Handle field name variations (note: Strapi field is "ParagarphData" with typo)
    const paragraphText = paragraphSection?.ParagarphData
      || paragraphSection?.ParagraphData
      || paragraphSection?.paragraphData
      || paragraphSection?.content
      || paragraphSection?.text
      || '';

    if (paragraphText) {
      paragraphData = {
        text: paragraphText
      };
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('mapOurScienceData - ParaGraphSection:', {
        raw: paragraphSection,
        paragraphText: paragraphText,
        mapped: paragraphData
      });
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log('mapOurScienceData - ParaGraphSection not found in data');
  }

  // Map CoreSection
  const coreSection = data?.CoreSection || [];
  let coreData = null;
  if (coreSection && Array.isArray(coreSection) && coreSection.length > 0) {
    const capabilities = coreSection.map((card) => {
      const svgImage = card?.ImageSvg;
      const svgUrl = svgImage ? getStrapiMedia(svgImage) : null;

      return {
        title: card?.Title || '',
        description: card?.Description || '',
        icon: svgUrl || '/assets/images/our-sci/icon22.svg',
        svgPosition: card?.Svg_position || 'right'
      };
    });

    coreData = {
      capabilities: capabilities
    };
  }

  // Map ContentSection (last section - ScienceArchitecture)
  const contentSection = data?.ContentSection;
  let contentData = null;
  if (contentSection) {
    // Handle field name variations (note: Strapi field is "ParagarphData" with typo)
    const paragraphText = contentSection?.ParagarphData
      || contentSection?.ParagraphData
      || contentSection?.paragraphData
      || contentSection?.content
      || contentSection?.text
      || '';

    if (paragraphText) {
      // Return as string content for ScienceArchitecture component
      contentData = {
        content: paragraphText
      };
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('mapOurScienceData - ContentSection:', {
        raw: contentSection,
        paragraphText: paragraphText,
        mapped: contentData
      });
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log('mapOurScienceData - ContentSection not found in data');
  }

  return {
    banner,
    introSection: introData,
    numberHighlightsSection: numberHighlightsData,
    researchDevelopmentSection: researchData,
    digitalTransformationSection: digitalData,
    paragraphSection: paragraphData,
    coreSection: coreData,
    contentSection: contentData
  };
}

/**
 * Convert Strapi Blocks (Rich text Blocks) to Markdown string
 * Blocks is an array of objects with different types (paragraph, heading, list, etc.)
 * 
 * @param {Array} blocks - Strapi Blocks array
 * @returns {string} Markdown string
 */
function convertBlocksToMarkdown(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return '';
  }

  let markdown = '';

  blocks.forEach((block) => {
    if (!block || !block.type) return;

    switch (block.type) {
      case 'paragraph':
        if (block.children && Array.isArray(block.children)) {
          const paragraphText = block.children
            .map((child) => {
              if (child.type === 'text') {
                let text = child.text || '';
                // Handle formatting
                if (child.bold) text = `**${text}**`;
                if (child.italic) text = `*${text}*`;
                if (child.code) text = `\`${text}\``;
                return text;
              }
              return '';
            })
            .join('');
          markdown += paragraphText + '\n\n';
        }
        break;

      case 'heading':
        if (block.children && Array.isArray(block.children)) {
          const level = block.level || 1;
          const headingText = block.children
            .map((child) => child.text || '')
            .join('');
          const hashes = '#'.repeat(level);
          markdown += `${hashes} ${headingText}\n\n`;
        }
        break;

      case 'list':
        if (block.children && Array.isArray(block.children)) {
          block.children.forEach((item) => {
            if (item.children && Array.isArray(item.children)) {
              const itemText = item.children
                .map((child) => child.text || '')
                .join('');
              const listMarker = block.format === 'ordered' ? '1. ' : '- ';
              markdown += `${listMarker}${itemText}\n`;
            }
          });
          markdown += '\n';
        }
        break;

      case 'quote':
        if (block.children && Array.isArray(block.children)) {
          const quoteText = block.children
            .map((child) => child.text || '')
            .join('');
          markdown += `> ${quoteText}\n\n`;
        }
        break;

      case 'code':
        if (block.children && Array.isArray(block.children)) {
          const codeText = block.children
            .map((child) => child.text || '')
            .join('');
          markdown += `\`\`\`\n${codeText}\n\`\`\`\n\n`;
        }
        break;

      default:
        // For unknown types, try to extract text from children
        if (block.children && Array.isArray(block.children)) {
          const text = block.children
            .map((child) => child.text || '')
            .join('');
          if (text) markdown += text + '\n\n';
        }
        break;
    }
  });

  return markdown.trim();
}

/**
 * Fetch our-manufacturing-approach data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurManufacturingApproach() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[PageIntroSection][populate][PetalImageSvg][populate]=*',
    'populate[CommentSection][populate]=*',
    'populate[StrategicPerformanceAreaSection][populate][Image][populate]=*',
    'populate[StrategicPerformanceAreaSection][populate][PerformanceAreaData][populate][icon][populate]=*',
    'populate[GtoStructureSection][populate][PetalImageSvg][populate]=*',
    'populate[GtoStructureSection][populate][GtoStructureSection][populate][GtoStructureCardData][populate][image][populate]=*',
    'populate[GtoStructureSection][populate][GtoStructureSection][populate][GtoStructureCardData][populate][cta][populate]=*'
  ].join('&');

  return fetchAPI(`our-manufacturing-approach?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map our-manufacturing-approach data from Strapi for global-technical-operations page
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped data for global-technical-operations page
 */
export function mapOurManufacturingApproachData(strapiData) {
  // Handle Strapi v4 response structure (Single Type)
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      banner: null,
      pageIntroSection: null,
      commentSection: null,
      strategicPerformanceAreaSection: null,
      gtoStructureSection: null,
      tabsData: null
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner || data?.topBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map PageIntroSection
  const pageIntroSection = data?.PageIntroSection || data?.pageIntroSection;
  let pageIntroData = null;
  if (pageIntroSection) {
    const petalImage = pageIntroSection?.PetalImageSvg?.data?.attributes || pageIntroSection?.PetalImageSvg;
    const petalImageUrl = petalImage ? getStrapiMedia(petalImage) : null;

    pageIntroData = {
      heading: pageIntroSection?.Heading || pageIntroSection?.heading || '',
      description: pageIntroSection?.Description || pageIntroSection?.description || '',
      petalImage: petalImageUrl ? {
        url: petalImageUrl,
        alt: petalImage?.alternativeText || petalImage?.caption || 'Petal decoration'
      } : null
    };
  }

  // Map CommentSection
  const commentSection = data?.CommentSection || data?.commentSection;
  let commentData = null;
  if (commentSection) {
    commentData = {
      description: commentSection?.Description || commentSection?.description || '',
      paragraphDescription: commentSection?.ParagraphDescription || commentSection?.paragraphDescription || ''
    };
  }

  // Map StrategicPerformanceAreaSection
  const strategicSection = data?.StrategicPerformanceAreaSection || data?.strategicPerformanceAreaSection;
  let strategicData = null;
  if (strategicSection) {
    const sectionImage = strategicSection?.Image?.data?.attributes || strategicSection?.Image;
    const imageUrl = sectionImage ? getStrapiMedia(sectionImage) : null;

    const performanceAreaData = strategicSection?.PerformanceAreaData || strategicSection?.performanceAreaData || [];
    const cards = performanceAreaData.map((card) => {
      const cardIcon = card?.icon?.data?.attributes || card?.icon;
      const iconUrl = cardIcon ? getStrapiMedia(cardIcon) : null;

      // Convert Blocks to Markdown for subheading
      const subheadingBlocks = card?.subheading || card?.SubHeading;
      const subheadingMarkdown = subheadingBlocks ? convertBlocksToMarkdown(subheadingBlocks) : '';

      return {
        heading: card?.heading || card?.Heading || '',
        subheading: subheadingMarkdown,
        icon: iconUrl ? {
          url: iconUrl,
          alt: cardIcon?.alternativeText || cardIcon?.caption || card?.heading || ''
        } : null
      };
    });

    strategicData = {
      sectionTitle: strategicSection?.SectionTitle || strategicSection?.sectionTitle || '',
      description: strategicSection?.Description || strategicSection?.description || '',
      image: imageUrl ? {
        url: imageUrl,
        alt: sectionImage?.alternativeText || sectionImage?.caption || 'Strategic Performance Areas'
      } : null,
      cards: cards
    };
  }

  // Map GtoStructureSection
  const gtoStructureSection = data?.GtoStructureSection || data?.gtoStructureSection;
  let gtoStructureData = null;
  let tabsData = null;
  if (gtoStructureSection) {
    const petalImage = gtoStructureSection?.PetalImageSvg?.data?.attributes || gtoStructureSection?.PetalImageSvg;
    const petalImageUrl = petalImage ? getStrapiMedia(petalImage) : null;

    gtoStructureData = {
      heading: gtoStructureSection?.Heading || gtoStructureSection?.heading || '',
      subHeading: gtoStructureSection?.SubHeading || gtoStructureSection?.subHeading || '',
      description: gtoStructureSection?.Description || gtoStructureSection?.description || '',
      petalImage: petalImageUrl ? {
        url: petalImageUrl,
        alt: petalImage?.alternativeText || petalImage?.caption || 'Petal decoration'
      } : null
    };

    // Map GtoStructureSection tabs (repeatable GTOTab)
    const tabsArray = gtoStructureSection?.GtoStructureSection || gtoStructureSection?.gtoStructureSection || [];
    tabsData = tabsArray.map((tab, tabIndex) => {
      const tabName = tab?.TabName || tab?.tabName || '';

      // Map GtoStructureCardData (repeatable GTOStructureCard)
      const cardsArray = tab?.GtoStructureCardData || tab?.gtoStructureCardData || [];
      const sections = cardsArray.map((card, cardIndex) => {
        const cardImage = card?.image?.data?.attributes || card?.image;
        const imageUrl = cardImage ? getStrapiMedia(cardImage) : null;

        // Convert Blocks to Markdown for SubHeading
        const subheadingBlocks = card?.SubHeading || card?.subheading;
        const subheadingMarkdown = subheadingBlocks ? convertBlocksToMarkdown(subheadingBlocks) : '';

        const cta = card?.cta || card?.CTA;
        const ctaData = cta ? {
          text: cta?.text || '',
          href: cta?.href || '#'
        } : null;

        const imagePosition = card?.Image_Position || card?.image_Position || card?.imagePosition || 'right';

        return {
          heading: card?.Heading || card?.heading || '',
          subheading: subheadingMarkdown,
          paragraphs: subheadingMarkdown ? subheadingMarkdown.split('\n\n').filter(p => p.trim()) : [],
          Description: card?.Description || card?.description || '',
          description: card?.Description || card?.description || '',
          image: imageUrl ? {
            url: imageUrl,
            alt: cardImage?.alternativeText || cardImage?.caption || card?.Heading || ''
          } : null,
          link: ctaData,
          imageFirst: imagePosition === 'left' || imagePosition === 'Left'
        };
      });

      // Generate tab ID from tab name
      const tabId = tabName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `tab-${tabIndex + 1}`;

      return {
        id: tabId,
        label: tabName,
        dataNodeId: `2852:${339 + tabIndex * 3}`, // Approximate data-node-id pattern
        sections: sections
      };
    });
  }

  return {
    banner,
    pageIntroSection: pageIntroData,
    commentSection: commentData,
    strategicPerformanceAreaSection: strategicData,
    gtoStructureSection: gtoStructureData,
    tabsData: tabsData && tabsData.length > 0 ? tabsData : null
  };
}

/**
 * Fetch our-story data from Strapi
 * This is a Single Type, so it returns one entry
 * 
 * Structure:
 * - TopBanner (Component - InnerBanner)
 *   - DesktopImage, MobileImage, Heading, SubHeading, SubHeadingText
 * - IntroSection (Component - IntroSection)
 *   - Heading, Description (Rich text Markdown)
 * - TimelineSection (Repeatable Component - TimelineItem)
 *   - Year, Title, Description (Rich text Markdown), isActive, DisplayOrder
 * - MilestonesSection (Repeatable Component - MilestoneCard)
 *   - Title, Value, Description, isActive, DisplayOrder
 * 
 * @returns {Promise<Object>} Raw Strapi API response
 */
export async function getOurStory() {
  const populateQuery = [
    'populate[TopBanner][populate][DesktopImage][populate]=*',
    'populate[TopBanner][populate][MobileImage][populate]=*',
    'populate[IntroSection][populate]=*',
    'populate[TimelineSection][populate]=*',
    'populate[MilestonesSection][populate]=*'
  ].join('&');

  return fetchAPI(`our-story?${populateQuery}`, {
    cache: 'no-store',
  });
}

/**
 * Map our-story data from Strapi
 * 
 * @param {Object} strapiData - Raw Strapi API response
 * @returns {Object} Mapped our-story data for component
 */
export function mapOurStoryData(strapiData) {
  const data = strapiData?.data || strapiData;

  if (!data) {
    return {
      banner: null,
      intro: null,
      timeline: [],
      milestones: []
    };
  }

  // Map TopBanner
  const topBanner = data?.TopBanner || data?.topBanner;
  const banner = topBanner ? mapTopBannerData(topBanner) : null;

  // Map IntroSection
  const introSection = data?.IntroSection || data?.introSection;
  let intro = null;
  if (introSection) {
    intro = {
      heading: introSection?.Heading || introSection?.heading || '',
      description: introSection?.Description || introSection?.description || ''
    };
  }

  // Map TimelineSection (Repeatable Component)
  const timelineArray = data?.TimelineSection || data?.timelineSection || [];
  const timeline = timelineArray
    .filter(item => item?.isActive !== false)
    .map((item, index) => ({
      year: item?.Year || item?.year || '',
      title: item?.Title || item?.title || '',
      description: item?.Description || item?.description || ''
    }))
    .sort((a, b) => {
      const orderA = a.year || '9999';
      const orderB = b.year || '9999';
      return orderA.localeCompare(orderB);
    });

  // Map MilestonesSection (Repeatable Component)
  const milestonesArray = data?.MilestonesSection || data?.milestonesSection || [];
  const milestones = milestonesArray
    .filter(item => item?.isActive !== false)
    .map((item, index) => ({
      title: item?.Title || item?.title || '',
      value: item?.Value || item?.value || '',
      description: item?.Description || item?.description || '',
      displayOrder: item?.DisplayOrder || item?.displayOrder || String(index + 1)
    }))
    .sort((a, b) => {
      const orderA = a.displayOrder || '999';
      const orderB = b.displayOrder || '999';
      return orderA.localeCompare(orderB);
    })
    .map(({ displayOrder, ...rest }) => rest); // Remove displayOrder from final output

  return {
    banner,
    intro,
    timeline,
    milestones
  };
}

