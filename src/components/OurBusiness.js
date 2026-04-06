import Link from 'next/link';
import Image from 'next/image';
import '../scss/components/OurBusiness.scss';

export default function OurBusiness({ data }) {
  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('OurBusiness component requires data prop from Strapi API');
  }

  const businessData = data;

  return (
    <section className="our-business">
      {/* Background Layers */}
      <div className="our-business__bg">
        <div className="our-business__bg-base"></div>
        <div className="our-business__bg-texture-1">
          <Image
            src="/assets/0fea0c59905d023ea9715484186332479a18c065.png"
            alt=""
            fill
            quality={100}
          />
        </div>
        <div className="our-business__bg-texture-2">
          <Image
            src="/assets/5e3a6a4572297329400cef2d9c947031ad98359d.png"
            alt=""
            fill
            quality={100}
          />
        </div>
        <div className="our-business__bg-texture-3">
          <Image
            src="/assets/08b3e84f633ab405a9e8e5bdb8176f182fcbac3d.png"
            alt=""
            fill
            quality={100}
          />
        </div>
        <div className="our-business__bg-texture-4">
          <Image
            src="/assets/e713dfaf3a4062b185df9318a3cb34c49da339d7.png"
            alt=""
            fill
            quality={100}
          />
        </div>
        <div className="our-business__bg-texture-5">
          <Image
            src="/assets/2126f721e2a5d22fb8c82c636d19e2076f6a00b2.png"
            alt=""
            fill
            quality={100}
          />
        </div>
      </div>

      {/* Container */}
      <div className="our-business__container">
        {/* Left Content */}
        <div className="our-business__content">
          <h2 className="our-business__heading">
            {businessData.heading.map((line, index) => (
              <span key={index}>
                {line}
                {index < businessData.heading.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="our-business__description">
            {businessData.description.map((line, index) => (
              <span key={index} className="our-business__description-line">
                {line}
                {line && <br />}
              </span>
            ))}
          </p>
          <Link href={businessData.cta.href} className="our-business__cta">
            <div className="our-business__cta-inner">
              <span className="our-business__cta-text">{businessData.cta.text}</span>
            </div>
          </Link>
        </div>

        {/* Right Image Circle */}
        <div className="our-business__image-wrapper">
          <div className="our-business__image-circle-border">
            <Image
              src="/assets/circle-border.svg"
              alt=""
              width={832}
              height={832}
              quality={100}
            />
          </div>
          <div className="our-business__image-circle">
            <Image
              src={businessData.image}
              alt={businessData.imageAlt || 'Healthcare Professional with Patient'}
              width={832}
              height={832}
              className="our-business__image"
              quality={100}
              unoptimized={process.env.NODE_ENV === 'development' && businessData.image?.includes('localhost')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

