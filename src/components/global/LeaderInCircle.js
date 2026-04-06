import Image from 'next/image';
import Link from 'next/link';
import '@/scss/components/global/LeaderInCircle.scss';

/**
 * LeaderInCircle - Reusable leader profile component with circular image
 * 
 * @param {string} id - Unique identifier for the leader (required)
 * @param {string} name - Leader's name (required)
 * @param {string} title - Leader's title/position (required)
 * @param {object} image - Image object with url and alt properties (required)
 * @param {boolean} isSpecial - Whether this is a special/highlighted leader (optional)
 * @param {string} size - Size variant: 'large' or default (optional)
 * @param {string} link - Optional link URL for the indicator button (optional)
 * @param {string} className - Additional CSS classes (optional)
 * 
 * @example
 * <LeaderInCircle 
 *   id={1}
 *   name="Vinita Gupta"
 *   title="Chief Executive Officer"
 *   image={{ url: "/assets/committees-board/vinita-gupta.png", alt: "Vinita Gupta" }}
 *   isSpecial={true}
 *   size="large"
 * />
 */
export default function LeaderInCircle({ 
  id,
  name,
  title,
  image,
  isSpecial = false,
  size,
  link = '#',
  className = ''
}) {
  return (
    <div
      className={`leader-in-circle ${
        isSpecial ? 'leader-in-circle--special' : ''
      } ${size === 'large' ? 'leader-in-circle--large' : ''} ${className}`}
    >
      <div className="leader-in-circle__image-wrapper">
        <div className={`leader-in-circle__circle ${
          isSpecial ? 'leader-in-circle__circle--special' : ''
        }`}>
          <Image
            src={image.url}
            alt={image.alt || name}
            width={size === 'large' ? 500 : 400}
            height={size === 'large' ? 500 : 400}
            className="leader-in-circle__image"
            quality={100}
          />
        </div>
        
        {/* Special Indicator (Arrow Icon) - Always render, shown on hover for non-special members */}
        <Link href={link} className="leader-in-circle__indicator">
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 12L12 1M12 1H1M12 1V12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Leader Info */}
      <div className={`leader-in-circle__info ${
        isSpecial ? 'leader-in-circle__info--special' : ''
      }`}>
        <h3 className="leader-in-circle__name">{name}</h3>
        <p className="leader-in-circle__title">{title}</p>
      </div>
    </div>
  );
}

