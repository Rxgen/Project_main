import InnerBanner from "@/components/InnerBanner";
import NavigationLinks from "@/components/NavigationLinks";
import React from "react";
import "@/scss/pages/news-and-events-v2.scss";
import Image from "next/image";

const BANNER_DATA = {
  title: { line1: "News and", line2: "Events" },
  subheading: { enabled: false, text: "" },
  images: {
    banner: {
      url: "/assets/inner-banner/share-price-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/share-price-banner.png",
      alt: "Integrated Annual Report - Lupin",
    },
  },
};

const NewsAndEventsV2 = () => {
  return (
    <div className="news-events__container">
      <InnerBanner data={BANNER_DATA} />
      <div className="news-events__content">
        <div
          className="news-events__petals news-events__petals--left"
          aria-hidden
        >
          <Image
            src="/assets/images/investors/shapes/light-petal-inverted.png"
            alt=""
            width={484}
            height={232}
            className="news-events__petals-img"
            quality={100}
            unoptimized
          />
        </div>
        <div
          className="news-events__petals news-events__petals--right"
          aria-hidden
        >
          <Image
            src="/assets/images/investors/shapes/light-petal-inverted.png"
            alt=""
            width={484}
            height={232}
            className="news-events__petals-img"
            quality={100}
            unoptimized
          />
        </div>
        <div className="news-events__tabs">
          <NavigationLinks
            links={[
              {
                id: "press-releases",
                label: "Press Releases",
                href: "/investors/press-releases-v2",
              },
              {
                id: "presentations",
                label: "Presentations",
                href: "/investors/presentations-v2",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsAndEventsV2;
