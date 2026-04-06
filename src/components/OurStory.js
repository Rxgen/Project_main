import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/OurStory.scss';

export default function OurStory({ data }) {
  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('OurStory component requires data prop from Strapi API');
  }

  const storyData = data;

  return (
    <section className="our-story">
      {/* Background */}
      <div className="our-story__bg">
        {/* Gradient base */}
        <div className="our-story__bg-gradient"></div>
        
        {/* Green blur ellipse - CSS only */}
        <div className="our-story__bg-ellipse"></div>
        
        {/* Texture overlay */}
        <div className="our-story__bg-texture">
          <Image
            src="/assets/gradient-texture.png"
            alt=""
            width={1920}
            height={971}
            quality={100}
          />
        </div>
        
        {/* Pattern decoration */}
        <div className="our-story__bg-pattern">
          <Image
            src="/assets/e287bd148edd9892715405681c54ad67f24da1c0.svg"
            alt=""
            width={646}
            height={716}
            quality={100}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="our-story__container">
        {/* Founder Image */}
        <div className="our-story__image-wrapper">
          <Image
            src={storyData.image.url}
            alt={storyData.image.alt || ''}
            width={storyData.image.width}
            height={storyData.image.height}
            className="our-story__image"
            quality={100}
            unoptimized={process.env.NODE_ENV === 'development' && storyData.image.url?.includes('localhost')}
          />
        </div>

        {/* Text Content */}
        <div className="our-story__content">
          {/* Text Section */}
          <div className="our-story__text">
            {/* Heading */}
            <div className="our-story__heading-wrapper">
              <h2 className="our-story__eyebrow">{storyData.eyebrow}</h2>
              <div className="our-story__heading">
                {storyData.heading.map((line, index) => (
                  <span key={index} className="our-story__heading-line">
                    {line}
                    {index < storyData.heading.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="our-story__description">
              <p className="our-story__paragraph">
                {storyData.paragraphs.map((paragraph, index) => (
                  <span key={index}>
                    {paragraph}
                    {index < storyData.paragraphs.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={storyData.cta.href} className="our-story__cta">
            <div className="our-story__cta-inner">
              <span className="our-story__cta-text">{storyData.cta.text}</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
