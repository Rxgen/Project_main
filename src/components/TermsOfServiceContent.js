import '../scss/components/TermsOfServiceContent.scss';

export default function TermsOfServiceContent({ data }) {
  // Default data structure matching Strapi format
  const contentData = data || {
    disclaimer: "This Website ('Site') belongs to Lupin and is provided to the User on an 'As Is Where is' basis without any warranty or indemnity whether express, implied, statutory or otherwise of merchantability, fitness for a particular purpose, accuracy, completeness or for non-infringement of third party rights or in any manner be construed as a representation or a recommendation of any particular product or service for the treatment, prevention or mitigation or cure of an ailment.",
    sections: [
      {
        title: "TERMS & CONDITIONS OF USE:",
        subsections: [
          {
            number: "1.",
            title: "ACCEPTANCE:",
            content: "By using the Site, the User acknowledges the Disclaimer given above and agrees to abide by and be bound by these Terms and Conditions of Use and any modification or amendment made thereto by Lupin."
          },
          {
            number: "2.",
            title: "USE OF INFORMATION:",
            content: "This Web Site for the User's personal and non-commercial use. Lupin has made a conscious effort to display and describe information about Lupin, its products and services on the site accurately. All materials on this Site are for the User's general and educational benefit only and should not be construed as medical advice. The User should always rely on the User's health care professional for diagnosis and treatment. The User is not allowed to duplicate, modify, display, alter, perform, reproduce, publish, license, create, transfer, or sell any information, products or services obtained from this Site."
          },
          {
            number: "3.",
            title: "MODIFICATION:",
            content: "Information on this Site may contain technical inaccuracies or typographical errors. Lupin reserves the right to update, change, modify, delete any of the Terms, in whole or part at any time, and or may suspend the operation of this Site for support or maintenance work, without notice. Any changes or updates will be effective immediately upon posting the revised Terms on the Site. The User is expected to review this statement periodically. The User's continued use of this Site constitutes an acceptance of any and all revised Terms."
          },
          {
            number: "4.",
            title: "USER INFORMATION:",
            content: "All information or material posted by the User whether by way of questions, comments, etc. is and will be treated as non-confidential information and shall be deemed the property of Lupin. The User is forbidden from posting information or material containing vulgar, obscene, threatening or otherwise using unlawful language."
          },
          {
            number: "5.",
            title: "INTELLECTUAL PROPERTY:",
            content: "Lupin's names and logos including but not restricted to text and graphic referenced on the Site are trademarks and copyrights of Lupin or its affiliates. Lupin's Trademarks may not be used in connection with any product or service that is not a Lupin product or service or in any manner that disparages or discredits Lupin. No reproduction of any part of this site may be made nor is any part allowed to be modified or incorporated in any other work. Lupin reserves all rights pertaining to this site as also the right to refuse access to any section of the Site in its discretion, including, without limitation, if Lupin believes that user's conduct violates applicable law or is harmful to the interests of Lupin. Lupin reserves the right, in its sole discretion, to terminate the User's access to all or part of this site, with or without notice."
          },
          {
            number: "6.",
            title: "THIRD PARTY LINKS REFERENCES:",
            content: "It is quite likely that the site may contain links or reference to third party websites and may be provided in good faith for user reference and convenience. However, inclusion of any link to the site is not be considered as belonging to Lupin nor imply any endorsement of the material on such third-party websites or any association with their operators. Access by the user of these links or any reliance placed on the information contained therein is solely at the risk and responsibility of the user."
          },
          {
            number: "7.",
            title: "INDEMNITY:",
            content: "The User agree to indemnify and hold harmless Lupin, from any and all claim, cost, expense, judgment or other loss on account of the User prohibited, unlawful and unauthorized use of this Web Site in violation of the terms and conditions and against any applicable law."
          },
          {
            number: "8.",
            title: "LIMITATION OF LIABILITY:",
            content: "Lupin will not be liable to the User for any damages of any kind whatsoever, including but not limited to direct, indirect, incidental, consequential or punitive damages arising from or connected with the user's access, use or inability to use this Site. Certain statements on the Site are forward-looking statements however, these forward-looking statements are subject to risks and uncertainties. Actual future results may differ materially from those expressed in or implied by the statements. Lupin does not undertake any obligation to publicly release any revisions to these forward-looking statements to reflect revised events or circumstances."
          },
          {
            number: "9.",
            title: "SEVERABILITY:",
            content: "If any term or conditions herein is held to be either illegal or unenforceable, in whole or in part, under any enactment or rule of law, such a term or condition may be severed, and such a decision shall not be construed as affecting the other terms and conditions, which shall remain fully enforceable."
          },
          {
            number: "10.",
            title: "APPLICABLE LAW AND JURISDICTION:",
            content: "This site is made and controlled by Lupin in India, as such all the terms and conditions expressed herein are governed by and to be interpreted in accordance with the laws of India, without regard to the choice or conflict of law provisions of any jurisdiction and all disputes arising in relation to these terms whether in contract or tort or otherwise, is to be submitted to the jurisdiction of the courts located in Mumbai, India. Access to this Site by the User from territories where the content is illegal, is strictly prohibited. The User is not allowed to use this Site in violation of any applicable export laws and regulations and the User shall be solely responsible for compliance with all such laws."
          }
        ]
      }
    ]
  };

  return (
    <section className="terms-of-service-content">
      <div className="terms-of-service-content__container">
        <div className="terms-of-service-content__wrapper">
          {contentData.disclaimer && (
            <div className="terms-of-service-content__disclaimer">
              <p>{contentData.disclaimer}</p>
            </div>
          )}

          {contentData.sections && contentData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="terms-of-service-content__section">
              {section.title && (
                <h2 className="terms-of-service-content__section-title">{section.title}</h2>
              )}
              
              {section.subsections && section.subsections.map((subsection, subsectionIndex) => (
                <div key={subsectionIndex} className="terms-of-service-content__subsection">
                  <h3 className="terms-of-service-content__subsection-title">
                    {subsection.number && <span className="terms-of-service-content__subsection-number">{subsection.number}</span>}
                    {subsection.title}
                  </h3>
                  {subsection.content && (
                    <p className="terms-of-service-content__subsection-content">{subsection.content}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

