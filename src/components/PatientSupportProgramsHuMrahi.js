import Image from 'next/image';
import '../scss/components/PatientSupportProgramsHuMrahi.scss';

export default function PatientSupportProgramsHuMrahi({ data }) {
  // Default data from Figma design
  const huMrahiData = data || {
    logo: {
      url: "/assets/images/patient-support-programs/logo1.png",
      alt: "HuMrahi Logo"
    },
    content: "HuMrahi is Lupin's patient support program for diabetes and cardiac care, supporting 100,000+ patients in FY25. The program offers personalized counseling, health monitoring tools, free medicines and tests, and access in 12 Indian languages. Through 10,000+ health camps, HuMrahi has screened over 75,000 individuals, advancing chronic disease care across India.",
    image: {
      url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
      alt: "Human Heart Hologram with Hand and Cardiogram Line"
    }
  };

  // Split content to highlight bold parts
  const renderContent = () => {
    const parts = huMrahiData.content.split(/(10,000\+ health camps|screened over 75,000 individuals)/);
    return parts.map((part, index) => {
      if (part === '10,000+ health camps' || part === 'screened over 75,000 individuals') {
        return <strong key={index}>{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section className="patient-support-programs-humrahi" data-node-id="2955:56">
      <div className="patient-support-programs-humrahi__container">
        {/* Image Section (Left) */}
        <div className="patient-support-programs-humrahi__image-wrapper" data-node-id="2955:57">
          <div className="patient-support-programs-humrahi__image-mask" data-node-id="2955:59">
            <Image
              src={huMrahiData.image.url}
              alt={huMrahiData.image.alt || "HuMrahi Program"}
              fill
              className="patient-support-programs-humrahi__image"
              quality={100}
            />
          </div>
        </div>

        {/* Content Section (Right) */}
        <div className="patient-support-programs-humrahi__content" data-node-id="2955:60">
          {/* Logo */}
          <div className="patient-support-programs-humrahi__logo-wrapper" data-node-id="2955:61">
            <Image
              src={huMrahiData.logo.url}
              alt={huMrahiData.logo.alt || "HuMrahi Logo"}
              width={208}
              height={64}
              className="patient-support-programs-humrahi__logo"
              quality={100}
            />
          </div>

          {/* Text Content */}
          <p className="patient-support-programs-humrahi__text" data-node-id="2955:62">
            {renderContent()}
          </p>
        </div>
      </div>
    </section>
  );
}

