import Image from 'next/image';
import Link from 'next/link';
import '@/scss/components/global/SquareLeaderProfile.scss';

/**
 * SquareLeaderProfile - Reusable square leader profile component
 * 
 * @param {string} id - Unique identifier for the leader (required)
 * @param {string} name - Leader's name (required)
 * @param {string} title - Leader's title/position (required)
 * @param {object} image - Image object with url and alt properties (required)
 * @param {string} link - Link URL for the leader profile (optional, defaults to '#')
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <SquareLeaderProfile 
 *   id={1}
 *   name="Dr. Abdelaziz Toumi"
 *   title="CEO - Lupin Manufacturing\nSolutions"
 *   image={{ url: "/assets/leaders/leader.png", alt: "Dr. Abdelaziz Toumi" }}
 *   link="/about-us/leadership/abdelaziz-toumi"
 * />
 */
export default function SquareLeaderProfile({ 
  id,
  name,
  title,
  image,
  link = '#',
  className = ''
}) {
  // Split title by newline if it contains line breaks
  const titleLines = title ? title.split('\n') : [];

  return (
    <Link 
      href={link}
      className={`square-leader-profile ${className}`}
    >
      <div className="square-leader-profile__image-container">
        <div className="square-leader-profile__image-wrapper">
          <Image
            src={image.url}
            alt={image.alt || name}
            width={399}
            height={483}
            className="square-leader-profile__image"
            quality={100}
          />
        </div>
      </div>

      <div className="square-leader-profile__info">
        <h3 className="square-leader-profile__name">{name}</h3>
        <div className="square-leader-profile__title">
          {titleLines.map((line, index) => (
            <p key={index} className="square-leader-profile__title-line">
              {line}
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
}

