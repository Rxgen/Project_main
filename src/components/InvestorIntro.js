'use client';

import '../scss/components/InvestorIntro.scss';

export default function InvestorIntro({ data }) {
  // Default data with exact line breaks as per Figma design (will be replaced by Strapi)
  const introData = data || {
    paragraphs: [
      "Lupin has maintained a strong presence across key markets and a razor-sharp focus","on long term sustainable growth. This section provides access to key investor information, that includes financial reports,", "regulatory filings, and disclosures. The section also highlights corporate governance framework and practices that reflect",
      "and support accountability and transparency. Shareholders can find relevant information on ownership and policies ",
      "that are designed to protect and enhance shareholder value."
    ]
  };

  // Handle different Strapi data structures
  let paragraphs = [];
  
  if (introData) {
    // If paragraphs array is provided directly
    if (Array.isArray(introData.paragraphs)) {
      paragraphs = introData.paragraphs;
    }
    // If content array is provided
    else if (Array.isArray(introData.content)) {
      paragraphs = introData.content;
    }
    // If text string is provided, split by newlines or preserve as single paragraph
    else if (introData.text) {
      // Split by newlines if present, otherwise use as single paragraph
      paragraphs = introData.text.includes('\n') 
        ? introData.text.split('\n').filter(p => p.trim())
        : [introData.text];
    }
  }

  // If no paragraphs, use default
  if (paragraphs.length === 0) {
    paragraphs = introData.paragraphs || [];
  }

  return (
    <section className="investor-intro" data-node-id="2216:740">
      <div className="investor-intro__container">
        <div className="investor-intro__box" data-node-id="2216:741">
          <div className="investor-intro__text" data-node-id="2216:742">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="investor-intro__paragraph">
                {/* Capitalize first letter of first paragraph */}
                {/* {index === 0 && paragraph ? (
                  <>
                    <span>
                      {paragraph.charAt(0).toUpperCase()}
                    </span>
                    {paragraph.slice(1)}
                  </>
                ) : (
                  // For other paragraphs, capitalize first letter if it's lowercase
                  paragraph.charAt(0).toUpperCase() === paragraph.charAt(0) 
                    ? paragraph 
                    : paragraph.charAt(0).toUpperCase() + paragraph.slice(1)
                )} */}
                {/* Print paragraphs as they are */}
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

