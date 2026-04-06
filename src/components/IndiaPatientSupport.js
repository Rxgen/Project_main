'use client';

import Image from 'next/image';
import '../scss/components/IndiaPatientSupport.scss';

export default function IndiaPatientSupport({ data }) {
  const defaultData = {
    heading: "Patient Support Programs",
    description: "Lupin is committed to extending care beyond prescriptions through patient-centric programs that empower individuals and improve health outcomes. From setting up 10,000+ health camps to battle diabetes and cardiac conditions to India's 1st digital asthma educator platform, our deep patient engagement and purpose-driven innovation are bringing us one step closer to a healthier world.",
    button: {
      text: "Explore our programs",
      url: "#"
    }
  };

  const supportData = data || defaultData;
  const heading = supportData?.heading || supportData?.title || defaultData.heading;
  const description = supportData?.description || supportData?.text || supportData?.content || defaultData.description;
  const button = supportData?.button || defaultData.button;

  return (
    <section className="india-patient-support" data-node-id="3071:3900">
      <div className="india-patient-support__container">
        <div className="india-patient-support__content">
          <h2 className="india-patient-support__heading">
            {heading}
          </h2>
          <p className="india-patient-support__description">
            {description}
          </p>
        </div>
        {button && button.url && (
          <a 
            href={button.url} 
            className="india-patient-support__button"
          >
            <span className="india-patient-support__button-text">
              {button.text || button.buttonText || "Explore our programs"}
            </span>
            <svg 
              className="india-patient-support__button-arrow" 
              width="18" 
              height="18" 
              viewBox="0 0 18 18" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 17L17 1M17 1H1M17 1V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}

