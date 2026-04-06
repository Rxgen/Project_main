'use client';

import Image from 'next/image';
import '../scss/components/IndiaDigitalInitiatives.scss';

export default function IndiaDigitalInitiatives({ data }) {
  const defaultData = {
    heading: "Our Digital Initiatives",
    description: [
      "Anya is India's first AI-powered, multilingual health chatbot, offering medically verified answers and a safe space for all users. Accessible 24/7 on WhatsApp, Anya chatbot responds in 20 Indian languages and delivers solutions across 17 therapy areas."
    ],
    link: {
      text: "Visit Askanya website for more information",
      url: "https://www.askanya.in/"
    }
  };

  const digitalData = data || defaultData;
  const heading = digitalData?.heading || digitalData?.title || defaultData.heading;
  const description = digitalData?.description || digitalData?.text || digitalData?.content || defaultData.description;
  const link = digitalData?.link || defaultData.link;

  return (
    <section className="india-digital-initiatives" data-node-id="3071:3099">
      <div className="india-digital-initiatives__container">
        <div className="india-digital-initiatives__image-wrapper">
          <div className="india-digital-initiatives__image-mask">
            <Image
              src="/assets/images/india/Image.png"
              alt="Person using tablet with Anya chatbot"
              width={910}
              height={775}
              className="india-digital-initiatives__image"
            />
          </div>
        </div>
        <div className="india-digital-initiatives__content">
          <div className="india-digital-initiatives__text-content">
            <h2 className="india-digital-initiatives__heading">
              {heading}
            </h2>
            <div className="india-digital-initiatives__description">
              {Array.isArray(description) ? (
                description.map((paragraph, index) => (
                  paragraph && paragraph.trim() ? (
                    <p key={index} className="india-digital-initiatives__paragraph">
                      {paragraph}
                    </p>
                  ) : null
                ))
              ) : (
                <p className="india-digital-initiatives__paragraph">
                  {description}
                </p>
              )}
            </div>
            {link && link.url && (
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="india-digital-initiatives__link"
              >
                <span className="india-digital-initiatives__link-text">
                  {link.text || link.linkText || "Visit Askanya website for more information"}
                </span>
                <svg 
                  className="india-digital-initiatives__link-arrow" 
                  width="13" 
                  height="13" 
                  viewBox="0 0 13 13" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 12L12 1M12 1H1M12 1V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

