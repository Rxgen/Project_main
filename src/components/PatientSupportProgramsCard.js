import Image from 'next/image';
import '../scss/components/PatientSupportProgramsCard.scss';

export default function PatientSupportProgramsCard({ data, isEven = false }) {
  // Default data structure
  const cardData = data || {
    logo: {
      url: "/assets/images/patient-support-programs/logo1.png",
      alt: "Program Logo"
    },
    content: "",
    image: {
      url: "/assets/images/patient-support-programs/human-heart-hologram-hand-cardiogram-line 1.png",
      alt: "Program Image"
    }
  };

  // Render content as plain text
  const renderContent = () => {
    if (!cardData.content) return null;
    return cardData.content;
  };

  // Don't render if no content
  if (!cardData.content || cardData.content.trim() === '') {
    return null;
  }

  const hasImage = cardData.image?.url && cardData.image.url.trim() !== '';
  const hasLogo = cardData.logo?.url && cardData.logo.url.trim() !== '';

  return (
    <section className={`patient-support-programs-card ${isEven ? 'patient-support-programs-card--even' : ''}`}>
      <div className="patient-support-programs-card__container">
        {/* Image Section */}
        {hasImage && (
          <div className="patient-support-programs-card__image-wrapper">
            <div className="patient-support-programs-card__image-mask">
              <Image
                src={cardData.image.url}
                alt={cardData.image.alt || "Program Image"}
                fill
                className="patient-support-programs-card__image"
                quality={100}
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="patient-support-programs-card__content">
          {/* Logo */}
          {hasLogo && (
            <div className="patient-support-programs-card__logo-wrapper">
              <Image
                src={cardData.logo.url}
                alt={cardData.logo.alt || "Program Logo"}
                width={208}
                height={64}
                className="patient-support-programs-card__logo"
                quality={100}
              />
            </div>
          )}

          {/* Text Content */}
          <p className="patient-support-programs-card__text">
            {renderContent() || cardData.content}
          </p>
        </div>
      </div>
    </section>
  );
}

