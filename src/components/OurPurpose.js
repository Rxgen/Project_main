// Test comment
import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/OurPurpose.scss';

export default function OurPurpose({ data }) {
  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('OurPurpose component requires data prop from Strapi API');
  }

  const purposeData = data;

  return (
    <section className="our-purpose">
      {/* Background */}
      <div className="our-purpose__bg"></div>

      {/* Container */}
      <div className="our-purpose__container">
        {/* Headline Section */}
        <div className="our-purpose__headline">
          <h2 className="our-purpose__eyebrow">{purposeData.eyebrow}</h2>
          <div className="our-purpose__text">
            <div className="our-purpose__heading">
              {purposeData.heading.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < purposeData.heading.length - 1 && <br />}
                </span>
              ))}
            </div>
            <p className="our-purpose__description">
              {purposeData.description.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < purposeData.description.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="our-purpose__cards">
          {/* Card 1 - Relief from disease */}
          <div className="our-purpose__card our-purpose__card--1">
            <Image
              src="/assets/7606e79d191062e8404f7fa4cfa8518ef1408bc9.svg"
              alt=""
              width={679}
              height={477}
              className="our-purpose__card-bg"
              quality={100}
            />
            <div className="our-purpose__card-content">
              <div className="our-purpose__card-text">
                <div className="our-purpose__card-title">{purposeData.cards[0].title}</div>
                <p className="our-purpose__card-description">
                  {purposeData.cards[0].description.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < purposeData.cards[0].description.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              {purposeData.cards[0]?.ctaHref != null && purposeData.cards[0]?.ctaText != null ? (
                <Link href={purposeData.cards[0].ctaHref} className="our-purpose__card-cta our-purpose__card-cta--button">
                  <span className="our-purpose__card-cta-text">{purposeData.cards[0].ctaText}</span>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Card 2 - Innovation */}
          <div className="our-purpose__card our-purpose__card--2">
            <Image
              src="/assets/d7267b305d22096f0afba1663701be81b6c29416.svg"
              alt=""
              width={504}
              height={663}
              className="our-purpose__card-bg"
              quality={100}
            />
            <div className="our-purpose__card-content">
              <div className="our-purpose__card-text">
                <div className="our-purpose__card-title">{purposeData.cards[1].title}</div>
                <p className="our-purpose__card-description">
                  {purposeData.cards[1].description.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < purposeData.cards[1].description.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              {purposeData.cards[1]?.ctaHref != null && purposeData.cards[1]?.ctaText != null ? (
                <Link href={purposeData.cards[1].ctaHref} className="our-purpose__card-cta our-purpose__card-cta--button">
                  <span className="our-purpose__card-cta-text">{purposeData.cards[1].ctaText}</span>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Card 3 - Solutions */}
          <div className="our-purpose__card our-purpose__card--3">
            <Image
              src="/assets/862c605a1dc7bafea0492ef5cf325fa8015d70da.svg"
              alt=""
              width={681}
              height={477}
              className="our-purpose__card-bg"
              quality={100}
            />
            <div className="our-purpose__card-content">
              <div className="our-purpose__card-text">
                <div className="our-purpose__card-title">{purposeData.cards[2].title}</div>
                <p className="our-purpose__card-description">
                  {purposeData.cards[2].description.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < purposeData.cards[2].description.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              {purposeData.cards[2]?.ctaHref != null && purposeData.cards[2]?.ctaText != null ? (
                <Link href={purposeData.cards[2].ctaHref} className="our-purpose__card-cta our-purpose__card-cta--button">
                  <span className="our-purpose__card-cta-text">{purposeData.cards[2].ctaText}</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

