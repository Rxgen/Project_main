import InnerBanner from "@/components/InnerBanner";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "@/scss/pages/research-and-development.scss";

const bannerData = {
  title: {
    line1: "Research and",
    line2: "Development",
  },
  subheading: {
    enabled: false,
    text: "",
  },
  images: {
    banner: {
      url: "/assets/inner-banner/research-and-dev-banner.png",
      alt: "Investors Listing- Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/research-and-dev-banner.png",
      alt: "Investors Listing - Lupin",
    },
  },
};

const wayForwardParagraphs = [
  "Lupin remains firmly committed to transparency in clinical research and responsible data sharing. We publish trial outcomes and anonymized datasets through platforms such as ClinicalTrials.gov and other recognized research registries, enabling access for researchers, regulators, healthcare professionals, and patient communities. Through this open exchange of knowledge, we support scientific advancement and contribute to improved healthcare outcomes. ",
  "Looking ahead, we continue to strengthen collaborations with global research organizations, technology partners, and healthcare institutions to drive innovation. Our successful partnerships, deep scientific expertise, and sustained investment in research enable the development of impactful treatments and complex therapies expanding access to high-quality medicines and helping shape the future of healthcare.",
];

const chemicalEntitiesParagraphs = [
  "Despite significant advances in the global healthcare ecosystem, many diseases remain without effective treatment. Our New Chemical Entity (NCE) research programs are dedicated to addressing these unmet needs through the discovery and development of novel therapies.",
  "With a strategic focus on oncology, immunology, and metabolic disorders, our teams advance high-potential molecules from early discovery through clinical development, with the aim of delivering transformative therapies that significantly improve patient outcomes.",
];

const patentsParagraphs = [
  "Protecting innovation is central to Lupin's R&D ecosystem. Our Intellectual Property Management Group plays a critical role in safeguarding scientific discoveries and strengthening our portfolio of patents and product pipelines.",
  "Through robust governance frameworks, strong pipelines in place, and with strict data protection practices, we ensure that our intellectual assets remain secure and protected from infringement.",
  "Currently, Lupin's IP portfolio includes 450+ active patents. These patents span multiple domains, including APIs, formulations, biologics, and novel chemical entities.",
  "Aligned with our mission to expand treatment access, Lupin has adopted a policy of not filing or enforcing patents for medicines addressing diseases listed under the Access to Medicine Index (ATMI) in least developed and low-income countries. This approach helps remove barriers and ensures life-saving medicines reach underserved populations.",
];

const bottomHeroParagraphs = [
  "At Lupin, research and development form the cornerstone of our commitment to delivering high-quality healthcare solutions to patients worldwide. Our R&D efforts integrate deep scientific expertise, advanced technologies, and global regulatory capabilities to develop differentiated medicines that address evolving healthcare needs.",
  "With seven research centers and a multidisciplinary team of over 1,400 scientists, operating across complex generics, specialty formulations, active pharmaceutical ingredients (API), and novel therapies, we are accelerating access to quality care from scientific discovery to scalable manufacturing and global commercialization.",
  "We continue to strengthen our biosimilar research capabilities to increase access to high-quality biologic therapies across global markets.",
];

const Research = () => {
  return (
    <div className="research-and-development-page">
      <InnerBanner data={bannerData} />
      <section className="research-and-development-page__bottom-hero">
        <div className="research-and-development-page__bottom-hero-inner">
          <div className="research-and-development-page__bottom-hero-content">
            <div className="research-and-development-page__bottom-hero-text">
              {bottomHeroParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div
              className="research-and-development-page__bottom-hero-ellipse research-and-development-page__bottom-hero-ellipse--small"
              aria-hidden
            />
          </div>
          <div className="research-and-development-page__bottom-hero-media">
            <div className="research-and-development-page__bottom-hero-petal">
              <Image
                src="/assets/images/our-sci/light-petal.png"
                width={1427}
                height={961}
                alt=""
                aria-hidden
              />
            </div>
            <div className="research-and-development-page__bottom-hero-image-wrap">
              <Image
                src="/assets/images/our-sci/research-and-dev/bottom-hero-image.png"
                width={522}
                height={522}
                alt="Scientist in lab"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="research-and-development-page__strategy">
        <div className="research-and-development-page__strategy-inner">
          <div className="research-and-development-page__strategy-top">
            <div className="research-and-development-page__strategy-copy">
              <h2 className="research-and-development-page__strategy-heading">
                Our R&D Strategy
              </h2>
              <p className="research-and-development-page__strategy-intro">
                With a strong focus on complex drug delivery systems and
                differentiated technologies, our R&D strategy cuts across multiple
                therapy areas and advanced treatment approaches.
              </p>
              <div
                className="research-and-development-page__strategy-divider"
                aria-hidden
              />
              <p className="research-and-development-page__strategy-subheading">
                We continue to strengthen our capabilities across key dosage forms,
                including:
              </p>
              <ul className="research-and-development-page__strategy-list">
                <li>
                  <Image
                    src="/assets/images/our-sci/research-and-dev/shapes/petal.png"
                    width={24}
                    height={24}
                    alt=""
                    aria-hidden
                    className="research-and-development-page__strategy-petal"
                  />
                  <span>Inhalation therapies</span>
                </li>
                <li>
                  <Image
                    src="/assets/images/our-sci/research-and-dev/shapes/petal.png"
                    width={24}
                    height={24}
                    alt=""
                    aria-hidden
                    className="research-and-development-page__strategy-petal"
                  />
                  <span>Injectables</span>
                </li>
                <li>
                  <Image
                    src="/assets/images/our-sci/research-and-dev/shapes/petal.png"
                    width={24}
                    height={24}
                    alt=""
                    aria-hidden
                    className="research-and-development-page__strategy-petal"
                  />
                  <span>Ophthalmic products</span>
                </li>
                <li>
                  <Image
                    src="/assets/images/our-sci/research-and-dev/shapes/petal.png"
                    width={24}
                    height={24}
                    alt=""
                    aria-hidden
                    className="research-and-development-page__strategy-petal"
                  />
                  <span>Oral formulations</span>
                </li>
              </ul>
            </div>
            <div
              className="research-and-development-page__strategy-visual"
              aria-hidden
            >
              <Image
                src="/assets/images/our-sci/research-and-dev/shapes/strategy-content.svg"
                width={1123}
                height={1450}
                alt=""
                className="research-and-development-page__strategy-svg"
              />
            </div>
          </div>
          <p className="research-and-development-page__strategy-closing">
            Our research programs are designed to serve global markets,
            including the U.S., Europe, Canada, Australia, India, and other
            emerging markets. Supported by dedicated market intelligence and
            research teams, we systematically identify therapeutic gaps and
            emerging medical needs. This enables us to prioritize the
            development of medicinal products that address critical disease
            burdens worldwide.
          </p>
        </div>
      </section>

      <section className="research-and-development-page__portfolio">
        <div className="research-and-development-page__portfolio-inner">
          <div className="research-and-development-page__portfolio-content">
            <h2 className="research-and-development-page__portfolio-heading">
              Building a Strong Product Portfolio
            </h2>
            <p className="research-and-development-page__portfolio-text">
              Our sustained R&D investments are reinforcing Lupin's product
              pipeline and expanding global regulatory filings. Guided by a
              clear portfolio strategy, we are increasingly focused on complex
              and differentiated products, strengthening our presence across
              both existing and new markets.
            </p>
            <p className="research-and-development-page__portfolio-text">
              In FY25, we received over 50 product approvals, underscoring the
              growing strength of Lupin's global regulatory capabilities and
              the continued expansion of our differentiated product portfolio.
            </p>
          </div>
          <div className="research-and-development-page__portfolio-media">
            <div className="research-and-development-page__portfolio-petal" aria-hidden>
              <Image
                src="/assets/images/our-sci/light-petal.png"
                width={1427}
                height={961}
                alt=""
              />
            </div>
            <div className="research-and-development-page__portfolio-medicines" aria-hidden>
              <Image
                src="/assets/images/our-sci/research-and-dev/shapes/medicines.svg"
                width={400}
                height={280}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <section className="research-and-development-page__patents">
        <div className="research-and-development-page__patents-inner">
          <h2 className="research-and-development-page__patents-heading">
            Intellectual Property and Patents
          </h2>
          <div className="research-and-development-page__patents-row">
            <div className="research-and-development-page__patents-media">
              <Image
                src="/assets/images/our-sci/research-and-dev/patent.png"
                width={694}
                height={758}
                alt="Scientist working with laboratory equipment"
                className="research-and-development-page__patents-image"
              />
            </div>
            <div className="research-and-development-page__patents-content">
              {patentsParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="research-and-development-page__patents-text"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="research-and-development-page__chemical-entities">
        <div className="research-and-development-page__chemical-entities-inner">
          <div className="research-and-development-page__chemical-entities-row">
            <div className="research-and-development-page__chemical-entities-content">
              <h2 className="research-and-development-page__chemical-entities-heading">
                New Chemical Entities (NCE)
              </h2>
              {chemicalEntitiesParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="research-and-development-page__chemical-entities-text"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="research-and-development-page__chemical-entities-media">
              <Image
                src="/assets/images/our-sci/research-and-dev/entities-image.png"
                width={715}
                height={758}
                alt="Scientist working with plant samples in a laboratory"
                className="research-and-development-page__chemical-entities-image"
              />
            </div>
          </div>
          <div
            className="research-and-development-page__chemical-entities-decoration"
            aria-hidden
          >
            <Image
              src="/assets/images/our-sci/research-and-dev/shapes/chemical-entities.svg"
              width={1214}
              height={268}
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="research-and-development-page__technology">
        <div className="research-and-development-page__technology-inner">
          <h2 className="research-and-development-page__technology-heading">
            Leveraging Technology for Innovation
          </h2>
          <p className="research-and-development-page__technology-text">
            Technology is a key enabler in accelerating research and enhancing
            development efficiency at Lupin. We are embedding advanced data
            analytics and artificial intelligence across our drug discovery and
            development lifecycle to drive smarter decisions, shorten timelines,
            and unlock new scientific insights.{" "}
            <Link
            target="_blank"
              href="/about-us/our-science"
              className="research-and-development-page__technology-link"
            >
              Read more about our Digital Transformation initiatives.
            </Link>
          </p>
        </div>
      </section>

      <section className="research-and-development-page__way-forward">
        <div className="research-and-development-page__way-forward-left">
          <div
            className="research-and-development-page__way-forward-petal"
            aria-hidden
          >
            <Image
              src="/assets/images/our-sci/research-and-dev/shapes/light-petal.png"
              width={327}
              height={657}
              alt=""
            />
          </div>
          <div className="research-and-development-page__way-forward-content">
            <h2 className="research-and-development-page__way-forward-heading">
              Way Forward
            </h2>
            {wayForwardParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="research-and-development-page__way-forward-text"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="research-and-development-page__way-forward-right">
          <div className="research-and-development-page__way-forward-image-wrap">
            <Image
              src="/assets/images/our-sci/research-and-dev/way-forward-image.png"
              alt="Scientist using a microscope in a laboratory"
              fill
              className="research-and-development-page__way-forward-image"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;
