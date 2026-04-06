import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/LeaderDetails.scss';

/**
 * LeaderDetails - Component for displaying detailed leader information
 * 
 * @param {object} data - Leader data object
 * @param {string} data.name - Leader's name
 * @param {string} data.title - Leader's title/position
 * @param {object} data.image - Image object with url and alt
 * @param {string} data.biography - Biography text
 * @param {array} data.education - Array of education items
 * @param {object} data.personalDetails - Personal details object
 * @param {string} data.personalDetails.age - Age
 * @param {string} data.personalDetails.nationality - Nationality
 * @param {string} data.personalDetails.appointed - Appointment date
 * @param {string} data.personalDetails.tenure - Tenure
 * @param {string} data.committeeMembership - Committee membership text
 * @param {string} data.appointmentResolutionUrl - URL for appointment resolution PDF
 * @param {string} data.otherDirectorshipsUrl - URL for other directorships
 */
export default function LeaderDetails({ data }) {
  const leaderData = data || {
    name: "Vinita Gupta",
    title: "Chief Executive Officer",
    image: {
      url: "/assets/committees-board/vinita-gupta.png",
      alt: "Vinita Gupta"
    },
    biography: "Ms. Gupta joined Lupin in 1992 and has been instrumental in shaping and executing the company's growth strategy that resulted in Lupin becoming a global pharmaceutical powerhouse. Ms. Gupta has led the company's global expansion through a combination of organic growth and strategic acquisitions. She also serves on the Global Advisory Board at Northwestern University's Kellogg School of Management. In recognition of her contribution to the pharmaceutical industry, Ms. Vinita has received several coveted global awards.",
    education: [
      "Pharmacy Graduate, University of Mumbai",
      "MBA, Kellogg School of Management at Northwestern University, Illinois"
    ],
    personalDetails: {
      age: "56 years",
      nationality: "Indian",
      appointed: "August 17, 2001",
      tenure: "23 years"
    },
    committeeMembership: "Member of the Sustainability and Corporate Social Responsibility Committee, Risk Management Committee and Strategy Committee.",
    appointmentResolutionUrl: "#",
    otherDirectorshipsUrl: "#"
  };

  return (
    <section className="leader-details">
      <div className="leader-details__container">
        {/* Header Section */}
        <div className="leader-details__header">
          <div className="leader-details__info">
            <h1 className="leader-details__name">{leaderData.name}</h1>
            <p className="leader-details__title">{leaderData.title}</p>
            <p className="leader-details__biography">{leaderData.biography}</p>
          </div>
          <div className="leader-details__image-wrapper">
            <div className="leader-details__image-circle">
              <Image
                src={leaderData.image.url}
                alt={leaderData.image.alt || leaderData.name}
                width={595}
                height={595}
                className="leader-details__image"
                quality={100}
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="leader-details__section">
          <div className="leader-details__section-header">
            <svg className="leader-details__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 0L16.5 9L26 9L18 14.5L21 23.5L13.5 18L6 23.5L9 14.5L1 9L10.5 9L13.5 0Z" fill="#08A03F"/>
            </svg>
            <h2 className="leader-details__section-title">Education</h2>
          </div>
          <div className="leader-details__section-content">
            {leaderData.education.map((item, index) => (
              <p key={index} className="leader-details__text">{item}</p>
            ))}
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="leader-details__personal-details">
          <div className="leader-details__detail-card">
            <div className="leader-details__section-header">
              <svg className="leader-details__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0L16.5 9L26 9L18 14.5L21 23.5L13.5 18L6 23.5L9 14.5L1 9L10.5 9L13.5 0Z" fill="#08A03F"/>
              </svg>
              <h3 className="leader-details__section-title">Age</h3>
            </div>
            <p className="leader-details__text">{leaderData.personalDetails.age}</p>
          </div>

          <div className="leader-details__detail-card">
            <div className="leader-details__section-header">
              <svg className="leader-details__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0L16.5 9L26 9L18 14.5L21 23.5L13.5 18L6 23.5L9 14.5L1 9L10.5 9L13.5 0Z" fill="#08A03F"/>
              </svg>
              <h3 className="leader-details__section-title">Nationality</h3>
            </div>
            <p className="leader-details__text">{leaderData.personalDetails.nationality}</p>
          </div>

          <div className="leader-details__detail-card">
            <div className="leader-details__section-header">
              <svg className="leader-details__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0L16.5 9L26 9L18 14.5L21 23.5L13.5 18L6 23.5L9 14.5L1 9L10.5 9L13.5 0Z" fill="#08A03F"/>
              </svg>
              <h3 className="leader-details__section-title">Appointed</h3>
            </div>
            <p className="leader-details__text">{leaderData.personalDetails.appointed}</p>
          </div>

          <div className="leader-details__detail-card">
            <div className="leader-details__section-header">
              <svg className="leader-details__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 0L16.5 9L26 9L18 14.5L21 23.5L13.5 18L6 23.5L9 14.5L1 9L10.5 9L13.5 0Z" fill="#08A03F"/>
              </svg>
              <h3 className="leader-details__section-title">Tenure</h3>
            </div>
            <p className="leader-details__text">{leaderData.personalDetails.tenure}</p>
          </div>
        </div>

        {/* Committee Membership Section */}
        <div className="leader-details__section">
          <div className="leader-details__section-header">
            <svg className="leader-details__icon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 0L16.5 9L26 9L18 14.5L21 23.5L13.5 18L6 23.5L9 14.5L1 9L10.5 9L13.5 0Z" fill="#08A03F"/>
            </svg>
            <h2 className="leader-details__section-title">Committee Membership</h2>
          </div>
          <div className="leader-details__section-content">
            <p className="leader-details__text">{leaderData.committeeMembership}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="leader-details__actions">
          <Link href={leaderData.appointmentResolutionUrl} className="leader-details__button leader-details__button--download">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L4 7H7V2H11V7H14L9 12Z" fill="white"/>
              <path d="M2 14V16H16V14H2Z" fill="white"/>
            </svg>
            <span>Appointment Resolution</span>
          </Link>
          <Link href={leaderData.otherDirectorshipsUrl} className="leader-details__button leader-details__button--external">
            <span>Other Directorships</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3V9H13V5.41L7.41 11L6 9.59L11.59 4H8V2H15Z" fill="white"/>
              <path d="M3 3H9V5H5V13H13V9H15V15H3V3Z" fill="white"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}











