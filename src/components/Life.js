import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/Life.scss';

export default function Life({ data }) {
  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('Life component requires data prop from Strapi API');
  }

  const lifeData = data;

  return (
    <section className="life" data-node-id="22:3347">
      {/* Background Gradient and Image */}
      <div className="life__bg" data-node-id="22:3348">
        {/* Gradient Background */}
        <div className="life__bg-gradient" data-node-id="22:3350"></div>
        
        {/* Background Image with Mask */}
        <div className="life__bg-image" data-node-id="22:3352">
          <div className="life__bg-image-mask" data-node-id="22:3354">
            <Image
              src={lifeData.backgroundImage}
              alt={lifeData.imageAlt || 'Life at Lupin'}
              width={2024}
              height={1077}
              quality={100}
              className="life__bg-img"
              unoptimized={process.env.NODE_ENV === 'development' && lifeData.backgroundImage?.includes('localhost')}
            />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="life__container" data-node-id="22:3355">
        {/* Text Content */}
        <div className="life__content" data-node-id="22:3356">
          {/* Heading Section */}
          <div className="life__heading-wrapper" data-node-id="22:3357">
            <div className="life__heading" data-node-id="22:3358">
              {lifeData.heading.map((line, index) => (
                <h2 
                  key={index} 
                  className={index === 0 ? "life__heading-large" : "life__heading-small"}
                  data-node-id={index === 0 ? "22:3359" : "22:3360"}
                >
                  {line}
                </h2>
              ))}
            </div>
            
            {/* Underline */}
            <div className="life__underline" data-node-id="22:3361"></div>
          </div>

          {/* Description */}
          <p className="life__description" data-node-id="22:3362">
            {lifeData.description.map((line, index) => (
              <span key={index}>
                {line}
                {index < lifeData.description.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {/* CTA Button */}
        <Link href={lifeData.cta.href} className="life__cta" data-node-id="22:3363" target="_blank">
          <div className="life__cta-inner" data-node-id="22:3364">
            <div className="life__cta-content" data-node-id="22:3365">
              <span className="life__cta-text" data-node-id="22:3367">
                {lifeData.cta.text}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

