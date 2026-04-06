import '../scss/components/SafeHarborStatementContent.scss';

export default function SafeHarborStatementContent({ data }) {
  // Default data structure matching Strapi format
  const contentData = data || {
    title: "Safe Harbor Statement under the U. S. Private Securities Litigation Reform Act of 1995",
    content: "This release contains forward-looking statements that involve known and unknown risks, uncertainties and other factors that may cause actual results to be materially different from any future results, performance or achievements expressed or implied by such statements. Many of these risks, uncertainties and other factors include failure of clinical trials, delays in development, registration and product approvals, changes in the competitive environment, increased government control over pricing, fluctuations in the capital and foreign exchange markets and the ability to maintain patent and other intellectual property protection. The information presented in this release represents management's expectations and intentions as of this date. Lupin expressly disavows any obligation to update the information presented in this release."
  };

  return (
    <section className="safe-harbor-statement-content">
      <div className="safe-harbor-statement-content__container">
        <div className="safe-harbor-statement-content__wrapper">
          {contentData.title && (
            <h2 className="safe-harbor-statement-content__title">
              {contentData.title}
            </h2>
          )}

          {contentData.content && (
            <div className="safe-harbor-statement-content__content">
              <p>{contentData.content}</p>
            </div>
          )}

          {contentData.sections && contentData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="safe-harbor-statement-content__section">
              {section.title && (
                <h2 className="safe-harbor-statement-content__section-title">{section.title}</h2>
              )}
              {section.content && (
                <div className="safe-harbor-statement-content__section-content">
                  {Array.isArray(section.content) ? (
                    section.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





