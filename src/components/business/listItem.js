import Image from 'next/image';
import Link from 'next/link';
import '@/scss/components/business/listItem.scss';

/**
 * ListItem - Reusable list item component for business section
 * Features: circular image, navigation indicator, title, separator line, and description
 * 
 * @param {string} id - Unique identifier for the item
 * @param {object} image - Image object with url and alt properties
 * @param {string} title - Item title
 * @param {string} description - Item description text
 * @param {string} link - Optional link URL for navigation (defaults to '#')
 * @param {boolean} isActive - Whether the navigation indicator is active
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <ListItem 
 *   id={1}
 *   image={{ url: "/assets/business/office-team.png", alt: "Office team" }}
 *   title="Branded Emerging Markets"
 *   description="Lupin's purpose finds strong expression in the work it does across emerging markets. From being among the top generic companies in South Africa to ranking #3 in ophthalmology in Mexico."
 *   isActive={true}
 * />
 */
export default function ListItem({ 
  id,
  image,
  title,
  description,
  link = '#',
  isActive = false,
  className = ''
}) {
  return (
    <div className={`list-item ${className}`}>
      {/* Image Section */}
      <div className="list-item__image-section">
        <div className="list-item__image-wrapper">
          <div className="list-item__image-circle">
            <Image
              src={image.url}
              alt={image.alt || title}
              width={308}
              height={311}
              className="list-item__image"
              quality={100}
            />
          </div>
        </div>
        
        {/* Navigation Indicator Button */}
        <Link href={link} className={`list-item__indicator ${isActive ? 'list-item__indicator--active' : ''}`}>
          <div className="list-item__indicator-content">
          <svg width="36" height="8" viewBox="0 0 36 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="3" cy="3.68359" r="3" fill="#09AB3A"/>
<path d="M35.3536 4.03715C35.5488 3.84189 35.5488 3.5253 35.3536 3.33004L32.1716 0.148062C31.9763 -0.0472006 31.6597 -0.0472006 31.4645 0.148062C31.2692 0.343324 31.2692 0.659906 31.4645 0.855168L34.2929 3.6836L31.4645 6.51202C31.2692 6.70728 31.2692 7.02387 31.4645 7.21913C31.6597 7.41439 31.9763 7.41439 32.1716 7.21913L35.3536 4.03715ZM12 3.68359L12 4.18359L35 4.1836L35 3.6836L35 3.1836L12 3.18359L12 3.68359Z" fill="#09AB3A"/>
</svg>

          </div>
        </Link>
      </div>

      {/* Content Section */}
      <div className="list-item__content">
        <h3 className="list-item__title">{title}</h3>
        <div className="list-item__separator"></div>
        <p className="list-item__description">{description}</p>
      </div>
    </div>
  );
}

