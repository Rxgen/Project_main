import Image from 'next/image';
import '../scss/components/PatientSupportProgramsIntro.scss';

export default function PatientSupportProgramsIntro({ data }) {
  // Default data from Figma design
  const introData = data || {
    content: [
      "At Lupin, our commitment to patients goes beyond words, it defines who we are and what we stand for. Our Patient Support Programs (PSPs) reflect our purpose-driven approach by enabling awareness, early diagnosis, treatment adherence, and long-term disease management for healthcare across chronic, acute, and preventive needs in India. Our PSPs encompass the use of technology, AI, and a personal connection to ensure reach and impactful care.",
      "Here are our Patient Support Programs:"
    ],
    image: {
      url: "/assets/images/patient-support-programs/top.png",
      alt: "Patient Support Programs - Healthcare Professional and Patient"
    },
    backgroundSvg: {
      url: "/assets/images/patient-support-programs/lefpetals.svg",
      alt: "Decorative petals"
    }
  };

  return (
    <section className="patient-support-programs-intro" data-node-id="2955:235">
      <div className="patient-support-programs-intro__container" data-node-id="2955:236">
        {/* Banner Background with Gradient */}
        <div className="patient-support-programs-intro__banner" data-node-id="2955:237">
          <div className="patient-support-programs-intro__gradient" data-node-id="2955:238"></div>
          
          {/* Background Decorative SVG (Left Top) */}
          <div className="patient-support-programs-intro__background-svg" data-node-id="2955:245">
            <Image
              src={introData.backgroundSvg.url}
              alt={introData.backgroundSvg.alt || "Decorative petals"}
              fill
              className="patient-support-programs-intro__svg-image"
              quality={100}
            />
          </div>

          {/* Image Section (Right) */}
          <div className="patient-support-programs-intro__image-wrapper" data-node-id="2955:251">
            <Image
              src={introData.image.url}
              alt={introData.image.alt || "Patient Support Programs"}
              fill
              className="patient-support-programs-intro__image"
              quality={100}
            />
          </div>
        </div>

        {/* Text Content (Left) */}
        <div className="patient-support-programs-intro__content" data-node-id="2955:252">
          {introData.content.map((paragraph, index) => (
            <p key={index} className="patient-support-programs-intro__paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

