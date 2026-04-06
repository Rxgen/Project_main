import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/ProductFinderSection.scss';

export default function ProductFinderSection({ data }) {
  // Default data structure
  const sectionData = data || {
    button: {
      text: "View Our API Product List",
      href: "#",
      target: "_blank"
    }
  };

  return (
    <section className="product-finder-section" data-node-id="2953:3804">
      <div className="product-finder-section__container">
        {/* Background SVG - Left Top */}
        <div className="product-finder-section__background-svg product-finder-section__background-svg--left">
          <Image
            src="/assets/images/product-finder/bg2.svg"
            alt="Decorative background"
            fill
            className="product-finder-section__svg-image"
            quality={100}
          />
        </div>

        {/* Background SVG - Right Top (Flipped) */}
        <div className="product-finder-section__background-svg product-finder-section__background-svg--right">
          <Image
            src="/assets/images/product-finder/bg2.svg"
            alt="Decorative background"
            fill
            className="product-finder-section__svg-image product-finder-section__svg-image--flipped"
            quality={100}
          />
        </div>

        {/* Content Wrapper */}
        <div className="product-finder-section__content-wrapper">
          {/* Button/Link */}
          <div className="product-finder-section__button-wrapper">
            <Link
              href={sectionData.button?.href || "#"}
              target={sectionData.button?.target || "_self"}
              rel={sectionData.button?.target === "_blank" ? "noopener noreferrer" : undefined}
              className="product-finder-section__button"
              data-node-id="2953:3810"
            >
              <span className="product-finder-section__button-text">
                {sectionData.button?.text || "View Our API Product List"}
              </span>
              <Image
                src="/assets/images/product-finder/arrow.svg"
                alt="Arrow icon"
                width={26}
                height={26}
                className="product-finder-section__button-arrow"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

