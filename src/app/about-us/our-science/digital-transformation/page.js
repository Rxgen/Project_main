import InnerBanner from "@/components/InnerBanner";
import Image from "next/image";
import React from "react";
import "@/scss/pages/digital-transformation.scss";

const bannerData = {
  title: {
    line1: "Digital",
    line2: "Transformation",
  },
  subheading: {
    enabled: true,
    text: "Advancing Pharmaceuticals Through Intelligent Technologies",
  },
  images: {
    banner: {
      url: "/assets/inner-banner/digital-transformation-banner.png",
      alt: "Digital transformation - Lupin",
    },
    bannerMobile: {
      url: "/assets/inner-banner/digital-transformation-banner.png",
      alt: "Digital transformation - Lupin",
    },
  },
};

const patentsParagraphs = [
  "Our journey towards digital transformation continues as we scale AI, automation, and advanced analytics across the enterprise. By combining technology with deep scientific expertise, we are building a connected digital ecosystem that enhances productivity, strengthens quality, and accelerates innovation.",
  "As these capabilities expand globally, intelligent technologies will remain central to how we advance operational excellence and deliver better healthcare outcomes for patients worldwide.",
];

const businessImpactMetrics = [
  "INR 400 million in cost savings",
  "12,000 man-days reclaimed through automation and process optimization",
];

const dataDrivenOperations = [
  {
    label: "Manufacturing",
    text: "AI and analytics help optimize processes and enhance operational monitoring.",
  },
  {
    label: "Supply Chain",
    text: " Intelligent digital tools strengthen demand–supply planning and forecasting accuracy.",
  },
  {
    label: "Commercial operations",
    text: "Digital assistants empower medical representatives with faster access to insights and information",
  },
  {
    label: "Quality",
    text: "AI-enabled document creation, investigation support,and knowledge management improve efficiency and decision-making.",
  },
];

const businessImpactOperations = [
  {
    label: "Supply Chain",
    text: "Digital planning and visibility tools strengthened demand–supply alignment and forecasting accuracy.",
  },
  {
    label: "Finance",
    text: "Process automation and analytics improved reporting efficiency and financial controls.",
  },
  {
    label: "Manufacturing",
    text: "AI-enabled monitoring and optimization enhanced production efficiency and oversight.",
  },
  {
    label: "Quality",
    text: "Intelligent document and investigation support accelerated quality workflows and decision-making.",
  },
];

const enterpricePlatform = [
  {
    label:
      "SAP Fiori applications deliver intuitive dashboards and simplified workflows.",
  },
  {
    label:
      "Qlik Sense analytics enables real-time insights across business functions.",
  },
  {
    label:
      "Robotic Process Automation improves speed and accuracy in finance and compliance operations.",
  },
];

const manufacturingIntro =
  "We are strengthening our manufacturing ecosystem through connected technologies and real-time operational visibility. At our Nagpur Unit-1 OSD and Tarapur facilities, Industrial Internet of Things (IIoT) video walls display live operational parameters across critical processes including compression, fluid bed drying, granulation, and coating. These capabilities allow our teams to:";

const manufacturingInitiatives = [
  "Monitor manufacturing operations in real time",
  "Detect deviations or anomalies early",
  "Enable faster analytics-driven interventions",
];

const manufacturingClosing = [
  "At Tarapur, equipment sensors feed directly into the IIoT ecosystem, enabling predictive insights and proactive course correction.",
  "Additionally, PAS-X Manufacturing Execution System (MES) dashboards provide a unified view of batch progress, improving visibility, productivity, and cross-functional coordination across manufacturing teams.",
];

const cybersecurityIntro =
  "As we advance our intelligent enterprise capabilities, digital trust and cybersecurity remain foundational priorities.";

const cybersecurityInitiatives = [
  "Adoption of a Zero Trust cybersecurity architecture",
  "Real-time threat monitoring and response capabilities",
  "Alignment with CERT-IN cybersecurity protocols",
];

const cybersecurityClosing =
  "These efforts resulted in zero major cybersecurity incidents in FY25, while strengthening governance through board-level oversight and predictive risk monitoring frameworks.";

const bottomHeroParagraphs = [
  "Our digital journey is evolving into intelligent transformation - embedding intelligence, data, and advanced technologies across the pharmaceutical value chain. From research and manufacturing to quality, supply chain, and commercial operations, we are integrating AI, advanced analytics, automation, and connected platforms to enhance how we operate and deliver healthcare outcomes.",
  "Guided by a data-first and AI-powered approach, our transformation is focused on improving operational agility, strengthening product quality, and enabling faster, insight-driven decision-making across the enterprise.",
];

const Research = () => {
  return (
    <div className="digital-transformation-page">
      <InnerBanner data={bannerData} />
      <section className="digital-transformation__intro">
        <div className="digital-transformation__intro-inner">
          <div className="digital-transformation__intro-content">
            <div className="digital-transformation__intro-text">
              {bottomHeroParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div
              className="digital-transformation__intro-ellipse digital-transformation__intro-ellipse--small"
              aria-hidden
            />
          </div>
          <div className="digital-transformation__intro-media">
            <div className="digital-transformation__intro-petal">
              <Image
                src="/assets/images/our-sci/light-petal.png"
                width={1427}
                height={961}
                alt=""
                aria-hidden
              />
            </div>
            <div className="digital-transformation__intro-image-wrap">
              <Image
                src="/assets/images/our-sci/digital-transformation/bottom-hero-image.png"
                width={522}
                height={522}
                alt="Scientist in lab"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="digital-transformation__ai">
        <div className="digital-transformation__ai-inner">
          <div className="digital-transformation__ai-top">
            <div className="digital-transformation__ai-copy">
              <h2 className="digital-transformation__ai-heading">
                AI and Data-Driven Operational Excellence
              </h2>
              <p className="digital-transformation__ai-intro">
                AI and advanced analytics are becoming powerful enablers of
                operational efficiency at Lupin. By transforming data into
                actionable insights, these technologies are improving
                productivity and supporting better healthcare outcomes.
              </p>
              <div className="digital-transformation__ai-divider" aria-hidden />
              <p className="digital-transformation__ai-lead">
                The key areas of impact include:
              </p>
              <ul className="digital-transformation__ai-list">
                {dataDrivenOperations.map(({ label, text }) => (
                  <li key={label}>
                    <Image
                      src="/assets/images/our-sci/digital-transformation/shapes/green-petal.png"
                      width={24}
                      height={24}
                      alt=""
                      aria-hidden
                      className="digital-transformation__ai-petal"
                    />
                    <span>
                      {label}:
                      <span className="digital-transformation__ai-list-body">
                        {text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="digital-transformation__manufacturing">
        <div className="digital-transformation__manufacturing-inner">
          <h2 className="digital-transformation__manufacturing-heading">
            Real-Time Intelligent Manufacturing
          </h2>
          <div className="digital-transformation__manufacturing-row">
            <div className="digital-transformation__manufacturing-media">
              <Image
                src="/assets/images/our-sci/digital-transformation/manufacturing-image.png"
                width={694}
                height={758}
                alt="Manufacturing operations and digital monitoring"
                className="digital-transformation__manufacturing-image"
              />
            </div>
            <div className="digital-transformation__manufacturing-content">
              <p className="digital-transformation__manufacturing-text">
                {manufacturingIntro}
              </p>
              <hr
                className="digital-transformation__manufacturing-divider"
                aria-hidden
              />
              <ul className="digital-transformation__manufacturing-list">
                {manufacturingInitiatives.map((item) => (
                  <li key={item}>
                    <Image
                      src="/assets/images/our-sci/digital-transformation/shapes/green-petal.png"
                      width={24}
                      height={24}
                      alt=""
                      aria-hidden
                      className="digital-transformation__manufacturing-petal"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {manufacturingClosing.map((paragraph, index) => (
                <p
                  key={index}
                  className="digital-transformation__manufacturing-closing"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="digital-transformation__enterprise digital-transformation__enterprise--compact-copy">
        <div className="digital-transformation__enterprise-inner">
          <div className="digital-transformation__enterprise-row">
            <div className="digital-transformation__enterprise-copy">
              <h2 className="digital-transformation__enterprise-heading">
                Enterprise Platforms Powering a Connected Organization
              </h2>
              <p className="digital-transformation__enterprise-intro">
                A key enabler of our digital transformation is the global
                deployment of SAP S/4HANA, a next-generation enterprise platform
                that integrates real-time data across supply-chain,
                manufacturing, sales, and workforce operations. The platform now
                supports operations across 100+ countries and 15 major sites,
                creating a unified digital backbone for enterprise
                decision-making. To enhance accessibility and user experience:
              </p>
              <hr
                className="digital-transformation__enterprise-divider"
                aria-hidden
              />
              <ul className="digital-transformation__enterprise-list">
                {enterpricePlatform.map(({ label }) => (
                  <li key={label}>
                    <Image
                      src="/assets/images/our-sci/digital-transformation/shapes/green-petal.png"
                      width={24}
                      height={24}
                      alt=""
                      aria-hidden
                      className="digital-transformation__enterprise-petal"
                    />
                    <span>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="digital-transformation__enterprise-footnote">
                In addition, an integrated global supply planning platform
                strengthens demand forecasting and cross-functional
                coordination, ensuring the timely delivery of medicines
                worldwide.
              </p>
            </div>
            <div className="digital-transformation__enterprise-media">
              <Image
                src="/assets/images/our-sci/digital-transformation/enterprice-image.png"
                width={715}
                height={758}
                alt="Professionals collaborating with large data visualization screens in a modern office"
                className="digital-transformation__enterprise-image"
              />
            </div>
          </div>
          <div
            className="digital-transformation__enterprise-decoration"
            aria-hidden
          >
            <Image
              src="/assets/images/our-sci/digital-transformation/shapes/curly-line-with-petal.svg"
              width={1214}
              height={268}
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="digital-transformation__cybersecurity">
        <div className="digital-transformation__cybersecurity-inner">
          <h2 className="digital-transformation__cybersecurity-heading">
            Digital Trust and Cybersecurity
          </h2>
          <div className="digital-transformation__cybersecurity-row">
            <div className="digital-transformation__cybersecurity-media">
              <Image
                src="/assets/images/our-sci/digital-transformation/cybersecurity-image.png"
                width={694}
                height={758}
                alt="Cybersecurity shield with digital interface"
                className="digital-transformation__cybersecurity-image"
              />
            </div>
            <div className="digital-transformation__cybersecurity-content">
              <p className="digital-transformation__cybersecurity-text">
                {cybersecurityIntro}
              </p>
              <hr
                className="digital-transformation__cybersecurity-divider"
                aria-hidden
              />
              <p className="digital-transformation__cybersecurity-lead">
                Our key initiatives include:
              </p>
              <ul className="digital-transformation__cybersecurity-list">
                {cybersecurityInitiatives.map((item) => (
                  <li key={item}>
                    <Image
                      src="/assets/images/our-sci/digital-transformation/shapes/green-petal.png"
                      width={24}
                      height={24}
                      alt=""
                      aria-hidden
                      className="digital-transformation__cybersecurity-petal"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="digital-transformation__cybersecurity-text">
                {cybersecurityClosing}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="digital-transformation__impact">
        <div className="digital-transformation__impact-inner">
          <div className="digital-transformation__impact-row">
            <div className="digital-transformation__impact-copy">
              <h2 className="digital-transformation__impact-heading">
                Delivering Measurable Business Impact
              </h2>
              <p className="digital-transformation__impact-intro">
                Our investments in intelligent technologies are generating
                measurable operational value. In FY25, digital initiatives
                enabled:
              </p>
              <hr
                className="digital-transformation__impact-divider"
                aria-hidden
              />
              <ul className="digital-transformation__impact-list digital-transformation__impact-list--metrics">
                {businessImpactMetrics.map((line) => (
                  <li key={line}>
                    <Image
                      src="/assets/images/our-sci/digital-transformation/shapes/green-petal.png"
                      width={24}
                      height={24}
                      alt=""
                      aria-hidden
                      className="digital-transformation__impact-petal"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <hr
                className="digital-transformation__impact-divider"
                aria-hidden
              />
              <p className="digital-transformation__impact-sublead">
                Operational improvements were realized across multiple
                functions:
              </p>
              <ul className="digital-transformation__impact-list digital-transformation__impact-list--operations">
                {businessImpactOperations.map(({ label, text }) => (
                  <li key={label}>
                    <Image
                      src="/assets/images/our-sci/digital-transformation/shapes/green-petal.png"
                      width={24}
                      height={24}
                      alt=""
                      aria-hidden
                      className="digital-transformation__impact-petal"
                    />
                    <span>
                      {label}: <span>{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="digital-transformation__impact-media">
              <Image
                src="/assets/images/our-sci/digital-transformation/business-impact-image.png"
                width={715}
                height={758}
                alt="Professionals collaborating with large data visualization screens in a modern office"
                className="digital-transformation__impact-image"
              />
            </div>
          </div>
          <div
            className="digital-transformation__impact-decoration"
            aria-hidden
          >
            <Image
              src="/assets/images/our-sci/digital-transformation/shapes/curly-line-with-petal.svg"
              width={1214}
              height={268}
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="digital-transformation__pharma">
        <div className="digital-transformation__pharma-inner">
          <h2 className="digital-transformation__pharma-heading">
            Building the Intelligent Pharma Enterprise
          </h2>
          <div className="digital-transformation__pharma-row">
            <div className="digital-transformation__pharma-media">
              <Image
                src="/assets/images/our-sci/digital-transformation/pharma-enterprice-image.png"
                width={694}
                height={758}
                alt="Scientist working with laboratory equipment"
                className="digital-transformation__pharma-image"
              />
            </div>
            <div className="digital-transformation__pharma-content">
              {patentsParagraphs.map((paragraph, index) => (
                <p key={index} className="digital-transformation__pharma-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;
