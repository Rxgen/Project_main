import Image from 'next/image';
import '../scss/components/PatientSupportProgramsSection.scss';

export default function PatientSupportProgramsSection({ data }) {
  // Default data structure
  const sectionData = data || {
    content: [],
    image: {
      url: "/assets/images/patient-support-programs/top.png",
      alt: "Patient Support Programs"
    },
    backgroundSvg: {
      url: "/assets/images/patient-support-programs/lefpetals.svg",
      alt: "Decorative petals"
    }
  };

  return (
    <section className="patient-support-programs-section">
      <div className="patient-support-programs-section__container">
        <div className="patient-support-programs-section__content-wrapper">
          {/* SVG (Left) */}
          <div className="patient-support-programs-section__background-svg">
            <Image
              src={sectionData.backgroundSvg.url}
              alt={sectionData.backgroundSvg.alt || "Decorative petals"}
              fill
              className="patient-support-programs-section__svg-image"
              quality={100}
            />
          </div>

          {/* Content Section (Middle) */}
          <div className="patient-support-programs-section__content" data-node-id="2955:252">
            {sectionData.content && sectionData.content.length > 0 ? (
              sectionData.content.map((paragraph, index) => (
                <p key={index} className="patient-support-programs-section__paragraph">
                  {paragraph}
                </p>
              ))
            ) : (
              <div className="patient-support-programs-section__placeholder">
                {/* Content will be added here */}
              </div>
            )}
          </div>

          {/* Image Section (Right) */}
          {sectionData.image?.url && sectionData.image.url.trim() !== '' && (
            <div className="patient-support-programs-section__image-wrapper">
              <Image
                src={sectionData.image.url}
                alt={sectionData.image.alt || "Patient Support Programs"}
                fill
                className="patient-support-programs-section__image"
                quality={100}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

