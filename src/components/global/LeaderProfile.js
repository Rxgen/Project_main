import Image from 'next/image';
import Link from 'next/link';
import '@/scss/components/global/LeaderProfile.scss';

/**
 * LeaderProfile - Reusable leader profile component with circular image
 * 
 * @param {string} id - Unique identifier for the leader (required)
 * @param {string} name - Leader's name (required)
 * @param {string} title - Leader's title/position (required)
 * @param {object} image - Image object with url and alt properties (required)
 * @param {string} link - Link URL for the leader profile (optional, defaults to '#')
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <LeaderProfile 
 *   id={1}
 *   name="Manju D Gupta"
 *   title="Chairperson (Non-Executive)"
 *   image={{ url: "/assets/leaders/manju-gupta 1.png", alt: "Manju D Gupta" }}
 *   link="/about-us/leadership/manju-d-gupta"
 * />
 */
export default function LeaderProfile({ 
  id,
  name,
  title,
  image,
  link = '#',
  className = ''
}) {
  return (
    <Link 
      href={link}
      className={`leader-profile ${className}`}
    >
      <div className="leader-profile__image-wrapper">
        <div className="leader-profile__circle">
          <Image
            src={image.url}
            alt={image.alt || name}
            width={400}
            height={400}
            className="leader-profile__image"
            quality={100}
          />
        </div>
      </div>

      {/* Leader Info */}
      <div className="leader-profile__info">
        <h3 className="leader-profile__name">{name}</h3>
        <p className="leader-profile__title">{title}</p>
      </div>
    </Link>
  );
}

