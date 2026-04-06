import InnerBanner from '@/components/InnerBanner';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import '@/scss/pages/lupin-for-suppliers.scss';

// Generate metadata for the Lupin for Suppliers page
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'lupin-for-suppliers',
    'https://www.lupin.com/lupin-for-suppliers',
    {
      title: 'Lupin for Suppliers - Partner with Lupin',
      description: 'Partner with Lupin through SAP Ariba Network. Discover, collaborate and grow by becoming a registered supplier. Join the world\'s largest B2B marketplace.',
      keywords: 'Lupin suppliers, SAP Ariba, supplier registration, vendor onboarding, B2B marketplace',
    }
  );
}

const benefits = [
  {
    title: 'Supplier Self-Service',
    description: 'Suppliers can directly enter and manage their own information, ensuring improved accuracy and faster updates. The portal allows easy modification of business details, documents, and certifications at any time.',
  },
  {
    title: 'Automated Compliance Validation',
    description: 'The system automatically validates essential compliance requirements such as PAN, GST, bank details, business identifiers, and other statutory information. This helps reduce manual checks and enhances accuracy.',
  },
  {
    title: 'Notifications on Your Supplier Status',
    description: 'Suppliers receive alerts at every milestone of the onboarding process - submission, clarification, approval, or rejection. This enables them to stay updated without follow‑ups.',
  },
  {
    title: 'Faster Collaboration and Reduced Cycle Time',
    description: 'The digital workflow eliminates email dependency and paperwork, enabling quicker response cycles, faster onboarding, and improved collaboration between Lupin and suppliers.',
  },
];

const trainingManuals = [
  {
    title: 'Lupin SLP Training Manual for India Suppliers',
    href: '/suppliers/sob-supplier-india.pdf',
    region: 'India',
  },
  {
    title: 'Lupin SLP Training Manual for US and CA Suppliers',
    href: '/suppliers/sob-supplier-usa-canada.pdf',
    region: 'USA and Canada',
  },
];

export default function LupinForSuppliersPage() {
  const bannerData = {
    title: {
      line1: 'Lupin for',
      line2: 'Suppliers',
    },
    subHeading: {
      enabled: false,
      text: '',
    },
    images: {
      banner: {
        url: '/assets/inner-banner/supplier.png',
        alt: 'Lupin for Suppliers - Partner with Lupin',
      },
      bannerMobile: {
        url: '/assets/inner-banner/supplier-mobile.png',
        alt: 'Lupin for Suppliers - Partner with Lupin',
      },
      petal: {
        url: '/assets/inner-banner/petal-2.svg',
        alt: 'Decorative petal',
      },
    },
  };

  return (
    <div className="lupin-for-suppliers" style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />

      {/* <section className="suppliers-intro">
        <div className="suppliers-intro__container">
          <p className="suppliers-intro__tagline">
            Partnering with us has never been so easy – Come Discover, Collaborate and Grow by becoming a registered Supplier with Lupin
          </p>
        </div>
      </section> */}

      <section className="suppliers-ariba">
        <div className="suppliers-ariba__container">
          <h2 className="suppliers-ariba__heading">
          Partnering With Lupin Just Got Simpler – Through Our Supplier Onboarding (SOB) Portal
          </h2>
          <div className="suppliers-ariba__content">
            <p>
            With Lupin’s continuous focus on digital transformation, we have built a fully modernized and integrated Supplier Onboarding (SOB) Portal, our in‑house platform designed to streamline and standardize vendor registration.
            </p>
            <p>
            Supplier Onboarding Portal is an end-to-end solution portfolio that lets Lupin easily manage supplier information, lifecycle and performance - all under one umbrella.
            </p>
          </div>
        </div>
      </section>

      <section className="suppliers-benefits">
        <div className="suppliers-benefits__container">
          <h2 className="suppliers-benefits__heading">
          What It Means for You as a Supplier?
          </h2>
          <p className="suppliers-benefits__subtext">
          The SOB Portal is our digital gateway for establishing trusted and compliant supplier relationships. Through this portal, suppliers can seamlessly submit details, upload documents, complete validations, and collaborate with Lupin. This ensures a faster and more transparent onboarding experience.
          </p>
          <h3 className="suppliers-benefits__subheading">
          Key Benefits of Registering via the SOB Portal
          </h3>
          <div className="suppliers-benefits__grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="suppliers-benefits__card">
                <h4 className="suppliers-benefits__card-title">{benefit.title}</h4>
                <p className="suppliers-benefits__card-text">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="suppliers-onboarding">
        <div className="suppliers-onboarding__container">
          <h2 className="suppliers-onboarding__heading">
          Start Your Vendor Onboarding Journey With Lupin Through the SOB Portal
          </h2>
          <p className="suppliers-onboarding__text">
          All suppliers invited by Lupin will receive an onboarding link to the SOB Portal, where they can complete their registration, upload documents, and track approval status. This online platform captures all mandatory information required to become a registered and compliant supplier with Lupin.
          </p>
        </div>
      </section>

      {/* <section className="suppliers-video">
        <div className="suppliers-video__container">
          <p className="suppliers-video__heading">
            Let us walk you through a small demo video on how to get registered with Ariba Network and manage your information you provide to Lupin.
          </p>
          <div className="suppliers-video__wrapper">
            <video
              className="suppliers-video__player"
              controls
              src="/suppliers/sap-ariba-slp-demo-for-suppliers.mp4"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section> */}

      <section className="suppliers-training">
        <div className="suppliers-training__container">
          <h2 className="suppliers-training__heading">
          Training Manuals – Become a Registered Supplier with Lupin
          </h2>
          <div className="suppliers-training__grid">
            {trainingManuals.map((manual, index) => (
              <a
                key={index}
                href={manual.href}
                target="_blank"
                rel="noopener noreferrer"
                className="suppliers-training__card"
              >
                <span className="suppliers-training__card-label">
                  For Suppliers getting registered for LUPIN {manual.region}
                </span>
                <span className="suppliers-training__card-title">{manual.title}</span>
                <span className="suppliers-training__card-cta">Download PDF</span>
              </a>
            ))}
          </div>
          {/* <p className="suppliers-training__link">
            To know more on Ariba Network and how it can help you grow your business digitally{' '}
            <a
              href="https://www.ariba.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>
          </p> */}
        </div>
      </section>
    </div>
  );
}
