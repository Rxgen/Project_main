import Link from 'next/link';
import Image from 'next/image';
import '@/scss/components/global/MediaContact.scss';

/**
 * MediaContact - Media contact information component
 * 
 * @param {Object|Array} contact - Contact information object or array of contacts
 * @param {Array} contacts - Array of contact information objects (alternative to contact)
 * @param {string} contact.name - Contact person's name
 * @param {string} contact.title - Contact person's title/position
 * @param {string} contact.email - Contact email address
 * @param {string} mediaKitLink - Link URL for Media Kit button (optional)
 * @param {string} mediaKitText - Text for Media Kit button (defaults to "Media Kit")
 * @param {string} heading - Custom heading text (optional, defaults to "Media Contacts")
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <MediaContact 
 *   contact={{
 *     name: "Rajalakshmi Azariah",
 *     title: "Vice President & Global Head – Corporate Communications",
 *     email: "rajalakshmiazariah@lupin.com"
 *   }}
 *   mediaKitLink="/media-kit"
 * />
 */
export default function MediaContact({ 
  contact,
  contacts,
  mediaKitLink,
  mediaKitText = "Media Kit",
  heading,
  className = '' 
}) {
  const defaultContact = {
    name: "Rajalakshmi Azariah",
    title: "Vice President and Global Head – Corporate Communications",
    email: "rajalakshmiazariah@lupin.com"
  };

  // Determine if we have multiple contacts
  let contactsList = [];
  if (contacts && Array.isArray(contacts)) {
    contactsList = contacts;
  } else if (contact && Array.isArray(contact)) {
    contactsList = contact;
  } else if (contact) {
    contactsList = [contact];
  } else {
    contactsList = [defaultContact];
  }

  return (
    <section className={`media-contact ${className}`}>
      {/* Background Images */}
      <div className="media-contact__bg">
        <div className="media-contact__bg-image">
          <Image
            src="/assets/3b41fd6f15ca26cfcf07c10414399bc15c9522e5.png"
            alt=""
            width={1352}
            height={838}
            className="media-contact__bg-img"
            quality={100}
            unoptimized
          />
        </div>
      </div>

      {/* Content */}
      <div className="media-contact__content">
        <div className="media-contact__text">
          {/* Heading */}
          <h2 className="media-contact__heading">
            {heading ? (
              heading === "Key Contacts" ? (
                <>
                  <span>Key</span>
                  <span>Contacts</span>
                </>
              ) : (
                <span>{heading}</span>
              )
            ) : (
              <>
                <span>Media</span>
                <span>Contacts</span>
              </>
            )}
          </h2>

          {/* Contact Info */}
          {contactsList.map((contactItem, index) => (
            <div key={index} className="media-contact__info">
              <div className="media-contact__name-group">
                <h3 className="media-contact__name">{contactItem.name}</h3>
                <p className="media-contact__title">{contactItem.title}</p>
              </div>
              <a 
                href={`mailto:${contactItem.email}`}
                className="media-contact__email"
              >
                {contactItem.email}
              </a>
            </div>
          ))}

          {/* Media Kit Button */}
          {mediaKitLink && (
            <Link href={mediaKitLink} className="media-contact__button">
              <span className="media-contact__button-text">{mediaKitText}</span>
              <Image
                src="/assets/29afc80b29ae34b44093d1696e20098e29c1e0b8.svg"
                alt=""
                width={18}
                height={18}
                className="media-contact__button-icon"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

