import Image from 'next/image';
import '../scss/components/ContactUsSection.scss';

export default function ContactUsSection({ data }) {
  // Default data structure
  const sectionData = data || {
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

  return (
    <section className="contact-us-section" data-node-id="2947:6416">
      <div className="contact-us-section__container">
        {/* Background SVG - Left */}
        <div className="contact-us-section__background-svg contact-us-section__background-svg--left">
          <Image
            src="/assets/images/product-finder/bg2.svg"
            alt="Decorative background"
            fill
            className="contact-us-section__svg-image"
            quality={100}
          />
        </div>

        {/* Background SVG - Right (Flipped) */}
        <div className="contact-us-section__background-svg contact-us-section__background-svg--right">
          <Image
            src="/assets/images/product-finder/bg2.svg"
            alt="Decorative background"
            fill
            className="contact-us-section__svg-image contact-us-section__svg-image--flipped"
            quality={100}
          />
        </div>

        {/* Content */}
        <div className="contact-us-section__content">
          {/* Heading */}
          <div className="contact-us-section__heading-wrapper" data-node-id="2947:6417">
            <h2 className="contact-us-section__heading" data-node-id="2947:6418">
              {sectionData.heading}
            </h2>
            <p className="contact-us-section__subheading" data-node-id="2947:6419">
              {sectionData.subheading}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="contact-us-section__cards" data-node-id="2947:6420">
            {sectionData.contacts.map((contact, index) => (
              <div key={index} className="contact-us-section__card" data-node-id={`2947:${6421 + index * 2}`}>
                <div className="contact-us-section__card-content" data-node-id={`2947:${6422 + index * 2}`}>
                  <p className="contact-us-section__card-title">{contact.title}</p>
                  <p className="contact-us-section__card-email">
                    <a href={`mailto:${contact.email}`} className="contact-us-section__email-link">
                      {contact.email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

