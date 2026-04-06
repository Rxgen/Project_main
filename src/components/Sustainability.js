// Test comment
import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/Sustainability.scss';

export default function Sustainability({ data }) {
  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('Sustainability component requires data prop from Strapi API');
  }

  const sustainabilityData = data;

  return (
    <section className="sustainability" data-node-id="22:3301">
      {/* Background Image */}
      <div className="sustainability__bg" data-node-id="22:3302">
        <div className="sustainability__bg-image" data-node-id="22:3303">
          <Image
            src={sustainabilityData.backgroundImage}
            alt={sustainabilityData.imageAlt || 'Sustainability'}
            fill
            quality={100}
            className="sustainability__bg-img"
            unoptimized={process.env.NODE_ENV === 'development' && sustainabilityData.backgroundImage?.includes('localhost')}
          />
        </div>
        <div className="sustainability__overlay"></div>
      </div>

      {/* Content */}
      <div className="sustainability__content" data-node-id="22:3304">
        <div className="sustainability__text" data-node-id="22:3305">
          <div className="sustainability__header" data-node-id="22:3306">
            <h2 className="sustainability__eyebrow" data-node-id="22:3307">
              {sustainabilityData.eyebrow}
            </h2>
            <div className="sustainability__heading" data-node-id="22:3308">
              {sustainabilityData.heading.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
          <div className="sustainability__description" data-node-id="22:3309">
            <p>
              {sustainabilityData.description.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < sustainabilityData.description.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={sustainabilityData.cta.href} className="our-story__cta" data-node-id="22:3310">
          <div className="sustainability__cta-inner">
            <span className="sustainability__cta-text" data-node-id="22:3312">
              {sustainabilityData.cta.text}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

