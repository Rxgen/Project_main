import React from "react";
import Link from "next/link";
import "@/scss/components/investors/InvestorsListingCard.scss";

const InvestorsListingCard = ({
  heading,
  description,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt,
  imageOnRight,
}) => {
  const contentBlock = (
    <div className="investor-listing-card__content">
      <p className="investor-listing-card__text">{description}</p>
      {buttonHref && (
        <Link href={buttonHref} className="investor-listing-card__btn">
          {buttonText}
        </Link>
      )}
    </div>
  );

  const imageBlock = (
    <div className="investor-listing-card__image-wrap">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="investor-listing-card__image"
      />
    </div>
  );

  return (
    <article
      className={`investor-listing-card ${imageOnRight ? "investor-listing-card--image-right" : "investor-listing-card--image-left"}`}
    >
      <h2 className="investor-listing-card__heading">
        <img
          src="/assets/images/investors/shapes/petal.png"
          alt=""
          className="investor-listing-card__petal"
          aria-hidden
        />
        <span>{heading}</span>
      </h2>
      <div
        className={`investor-listing-card__body ${imageOnRight ? "investor-listing-card__body--image-right" : "investor-listing-card__body--image-left"}`}
      >
        {imageOnRight ? (
          <>
            {contentBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {contentBlock}
          </>
        )}
      </div>
    </article>
  );
};

export default InvestorsListingCard;
