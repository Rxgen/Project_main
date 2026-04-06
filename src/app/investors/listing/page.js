import InnerBanner from "@/components/InnerBanner";
import InvestorsListingCard from "@/components/investors/InvestorsListingCard";
import React from "react";
import "@/scss/pages/investors-listing.scss";

const CONTENT_LISTING_CARDS = [
  {
    heading: "Financial Reporting",
    description:
      "Stay informed about our latest financial reports, annual results, key disclosures and more. Our financial updates provide a clear view of our company progress and long-term growth strategy.",
    buttonText: "View Financials",
    buttonHref: "/investors/financials",
    imageOnRight: true,
    image: "/assets/images/investors/person-carrying-laptop.png",
    imageAlt: "Financial reporting",
  },
  {
    heading: "Corporate Governance",
    description:
      "Our governance framework supports transparency, accountability, and responsible leadership across the organization. Strong policies and oversight help ensure ethical conduct and sustainable business practices.",
    buttonText: "Learn More",
    buttonHref: "/investors/policies",
    imageOnRight: false,
    image: "/assets/images/investors/person-sitting-in-conference.png",
    imageAlt: "Corporate governance",
  },
  {
    heading: "Shareholder Information",
    description:
      "Find important updates and resources for shareholders, including stock details, latest shareholder communication, announcements and more. We remain committed to clear and consistent dialogue with our investor and shareholder community.",
    buttonText: "View More",
    buttonHref: "/investors/shareholder-information",
    imageOnRight: true,
    image: "/assets/images/investors/team-meeting.png",
    imageAlt: "Shareholder information",
  },
  {
    heading: "News and Events",
    description:
      "Keep up with the latest company announcements, press releases, and investor-related events. Stay connected with developments that highlight our progress and milestones.",
    buttonText: "Discover More",
    buttonHref: "/investors/news-and-events",
    imageOnRight: false,
    image: "/assets/images/investors/person-with-tab.png",
    imageAlt: "News and events",
  },
];

const page = () => {
  const bannerData = {
    title: {
      line1: "",
      line2: "",
    },
    subheading: {
      enabled: false,
      text: "",
    },
    images: {
      banner: {
        url: "/assets/inner-banner/Investors-listing-banner.png",
        alt: "Investors Listing- Lupin",
      },
      bannerMobile: {
        url: "/assets/inner-banner/Investors-listing-banner.png",
        alt: "Investors Listing - Lupin",
      },
    },
  };
  return (
    <div className="investor__container">
      <InnerBanner data={bannerData} />
      <section className="investor__bottom-banner">
        <div className="investor__bottom-banner-card">
          <div className="investor__bottom-banner-text">
            <p>
              We maintain a strong presence in key markets with a sharp focus on
              long-term, sustainable growth. Transparency and accountability
              through comprehensive reporting and disclosures remains a top
              priority for us. Our corporate governance framework and policies
              are designed to protect and enhance shareholder value while
              reinforcing trust and integrity.
            </p>
          </div>
          <div className="investor__bottom-banner-image-wrap">
            <img
              src="/assets/images/investors/globe-person.png"
              alt="Global presence"
              className="investor__bottom-banner-image"
            />
          </div>
        </div>
      </section>

      <section className="investor__content-listing">
        {CONTENT_LISTING_CARDS.map((card, index) => (
          <InvestorsListingCard
            key={index}
            heading={card.heading}
            description={card.description}
            buttonText={card.buttonText}
            buttonHref={card.buttonHref}
            imageSrc={card.image}
            imageAlt={card.imageAlt}
            imageOnRight={card.imageOnRight}
          />
        ))}
      </section>
    </div>
  );
};

export default page;
