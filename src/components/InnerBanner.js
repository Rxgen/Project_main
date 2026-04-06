import Image from 'next/image';
import '../scss/components/InnerBanner.scss';

export default function InnerBanner({ data, titleAsDiv = false }) {
  // Default data (will be replaced by Strapi)
  const bannerData = data || {
    title: {
      line1: "Transfer of Physical",
      line2: "Shares (Re-lodgement)"
    },
    subheading: {
      enabled: false,
      text: "Subheading text here"
    },
    background: {
      color1: "#41b66b",
      color2: "#54bd7a",
      opacity: 0.8
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Financial documents and charts"
      },
      bannerMobile: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Financial documents and charts"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  return (
    <section className="inner-banner">
      {/* Background Layers */}
      <div className="inner-banner__bg">
        {/* Base green background */}
        <div className="inner-banner__bg-base"></div>

        {/* Gradient overlay */}
        <div className="inner-banner__bg-gradient"></div>

        {/* Decorative Petal */}
        {bannerData.images?.petal && (
          <div className="inner-banner__petal">
            <Image
              src={bannerData.images.petal.url}
              alt={bannerData.images.petal.alt}
              width={400}
              height={400}
              className="inner-banner__petal-img"
              quality={100}
            />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="inner-banner__overlay-1"></div>
        <div className="inner-banner__overlay-2"></div>
        <div className="inner-banner__overlay-3"></div>
      </div>

      {/* Banner Image - Desktop */}
      {bannerData.images?.banner && (
        <div className="inner-banner__image inner-banner__image--desktop">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={bannerData.images.banner.url}
              alt={bannerData.images.banner.alt}
              fill
              className="inner-banner__image-img"
              quality={100}
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Banner Image - Mobile */}
      {bannerData.images?.bannerMobile && (
        <div className="inner-banner__image inner-banner__image--mobile">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={bannerData.images.bannerMobile.url}
              alt={bannerData.images.bannerMobile.alt || bannerData.images.banner?.alt}
              fill
              className="inner-banner__image-img"
              quality={100}
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="inner-banner__content">
        <div className="inner-banner__text">
          {titleAsDiv ? (
            <div className="inner-banner__title">
              {bannerData.title?.line1 && (
                <span className="inner-banner__title-line">{bannerData.title.line1}</span>
              )}
              {bannerData.title?.line2 && (
                <span className="inner-banner__title-line">{bannerData.title.line2}</span>
              )}
            </div>
          ) : (
            <h1 className="inner-banner__title">
              {bannerData.title?.line1 && (
                <span className="inner-banner__title-line">{bannerData.title.line1}</span>
              )}
              {bannerData.title?.line2 && (
                <span className="inner-banner__title-line">{bannerData.title.line2}</span>
              )}
            </h1>
          )}
          {bannerData.subHeading?.enabled && bannerData.subHeading?.text && (
            <p className="inner-banner__subheading">{bannerData.subHeading.text}</p>
          )}
        </div>
      </div>
    </section>
  );
}

