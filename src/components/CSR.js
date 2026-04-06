import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/CSR.scss';

export default function CSR({ data }) {
  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('CSR component requires data prop from Strapi API');
  }

  const csrData = data;

  return (
    <section className="csr" data-node-id="22:3315">
      {/* Background */}
      <div className="csr__bg" data-node-id="22:3316">
        
      </div>

      {/* Content Container */}
      <div className="csr__container">
        {/* Circular Image */}
        <div className="csr__image-wrapper" data-node-id="22:3332">
          <div className="csr__image-circle" data-node-id="22:3333">
            <Image
              src={csrData.image}
              alt={csrData.imageAlt || 'CSR Activities'}
              width={770}
              height={770}
              className="csr__image"
              quality={100}
              unoptimized={process.env.NODE_ENV === 'development' && csrData.image?.includes('localhost')}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="csr__content" data-node-id="22:3334">
          <div className="csr__text" data-node-id="22:3335">
            <div className="csr__header" data-node-id="22:3336">
              <div className="csr__title-group" data-node-id="22:3337">
                <h2 className="csr__eyebrow" data-node-id="22:3338">
                  {csrData.eyebrow}
                </h2>
                <div className="csr__heading" data-node-id="22:3339">
                  {csrData.heading.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
              <p className="csr__subheading" data-node-id="22:3340">
                {csrData.subheading}
              </p>
            </div>
            <p className="csr__description" data-node-id="22:3341">
              {csrData.description.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < csrData.description.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* CTA Button */}
          <Link href={csrData.cta.href} className="our-story__cta" data-node-id="22:3342">
            <div className="csr__cta-inner">
              <span className="csr__cta-text" data-node-id="22:3344">
                {csrData.cta.text}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}



