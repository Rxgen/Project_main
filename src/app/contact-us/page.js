import InnerBanner from '@/components/InnerBanner';
import ContactUsSection from '@/components/ContactUsSection';
import ContactUsLocationSlider from '@/components/ContactUsLocationSlider';
import ContactUsForm from '@/components/ContactUsForm';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getContactUs, mapContactUsData } from '@/lib/strapi-pages';

export const dynamic = 'force-dynamic';

// Generate metadata for the Contact Us page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'contact-us',
    'https://www.lupin.com/contact-us'
  );
}

export default async function ContactUsPage() {
  let contactUsData = {
    banner: null,
    contactInfoSection: null,
    globalPresenceSection: []
  };

  try {
    const strapiData = await getContactUs();
    contactUsData = mapContactUsData(strapiData);
  } catch (error) {
    console.error('Error fetching contact-us data from Strapi:', error);
  }

  // Banner data for InnerBanner
  const bannerData = contactUsData.banner || {
    title: {
      line1: "Contact",
      line2: "Us",
    },
    subheading: {
      enabled: false,
      text: ""
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Contact Us - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Section data for ContactUsSection
  const sectionData = contactUsData.contactInfoSection || {
    heading: "Get In Touch",
    subheading: "Write to us",
    contacts: [
      {
        title: "Enquiries",
        email: "info@lupin.com"
      },
      {
        title: "Investor Relations",
        email: "ravikagrawal@lupin.com"
      },
      {
        title: "Careers",
        email: "careers@lupin.com"
      }
    ]
  };

  // Location slider data
  const locationSliderData = {
    locations: contactUsData.globalPresenceSection.length > 0 
      ? contactUsData.globalPresenceSection 
      : [
          {
            id: 'india',
            name: 'INDIA',
            label: 'India',
            image: '/assets/images/contact/india.png',
            addresses: [
              {
                title: 'Corporate Office',
                address: [
                  'Lupin Limited, 3rd Floor, Kalpataru Inspire,',
                  'Off. Western Expressway Highway,',
                  'Santacruz (East), Mumbai, India. 400 055',
                  'Phone: +91 22 6640 2323 Email: info@lupin.com'
                ]
              }
            ]
          }
        ]
  };

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      {contactUsData.contactInfoSection && (
        <ContactUsSection data={sectionData} />
      )}
      {contactUsData.globalPresenceSection.length > 0 && (
        <ContactUsLocationSlider data={locationSliderData} />
      )}
      <ContactUsForm />
    </div>
  );
}

