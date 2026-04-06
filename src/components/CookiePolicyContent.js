import '../scss/components/CookiePolicyContent.scss';

export default function CookiePolicyContent({ data }) {
  // Default data structure matching Strapi format
  const contentData = data || {
    introduction: {
      title: "About this cookie policy.",
      content: [
        "This Cookie Policy explains what cookies and other similar technologies are and how we use them. You should read this policy to understand what cookies and other similar tracking technologies are, how we use them, the types of cookies we use i.e., the information we collect using cookies and how that information is used and how to control the cookie preferences. For further information on how we use, store and keep your personal data secure, see our Privacy Policy.",
        "You can at any time change or withdraw your consent from the Cookie Declaration on our website. Learn more about who we are, how you can contact us and how we process personal data in our Privacy Policy. Your consent applies to the following domains: lupin.com",
        "Manage your consent here"
      ]
    },
    sections: [
      {
        title: "What are cookies ?",
        content: "Cookies are small text files that are used to store small pieces of information. The cookies are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make the website more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement."
      },
      {
        title: "How do we use cookies ?",
        content: [
          "As most of the online services, our website uses cookies first-party and third-party cookies for a number of purposes.",
          "The first-party cookies are mostly necessary for the website to function the right way.",
          "The third-party cookies used on our websites are used mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing advertisements that are relevant to you, and all in all providing you with a better and improved user experience and help speed up your future interactions with our website."
        ]
      },
      {
        title: "What types of cookies do we use ?",
        content: "The cookies used on our website are grouped into the following categories.",
        cookieCategories: [
          {
            name: "Necessary",
            description: "Necessary cookies are absolutely essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously.",
            cookies: [
              { name: "ARRAffinity", duration: "6 months", description: "This cookie is set by websites that run on Windows Azure cloud platform. The cookie is used to affinitize a client to an instance of an Azure Web App." },
              { name: "ASP.NET_SessionId", duration: "", description: "This cookie is used in sites developed with Microsoft.Net. When a user start browsing a unique session ID is created, which keeps track of all the information regarding that session.This information is stored in the web server and it is identified via a GUID.The GUID is essential for any ASP.NET site to function properly." },
              { name: "cookielawinfo-checkbox-advertisement", duration: "6 months", description: "The cookie is set by GDPR cookie consent to record the user consent for the cookies in the category \"Advertisement\"." },
              { name: "cookielawinfo-checkbox-analytics", duration: "6 months", description: "These cookies are set by GDPR Cookie Consent WordPress Plugin. The cookie is used to remember the user consent for the cookies under the category \"Analytics\"." },
              { name: "cookielawinfo-checkbox-functional", duration: "6 months", description: "The cookie is set by GDPR cookie consent to record the user consent for the cookies in the category \"Functional\"." },
              { name: "cookielawinfo-checkbox-necessary", duration: "6 months", description: "This cookie is set by GDPR Cookie Consent plugin. The cookies is used to store the user consent for the cookies in the category \"Necessary\"." },
              { name: "cookielawinfo-checkbox-others", duration: "6 months", description: "The cookie is set by GDPR cookie consent to record the user consent for the cookies in the category \"Other\"." },
              { name: "cookielawinfo-checkbox-performance", duration: "6 months", description: "This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category \"Performance\"." },
              { name: "viewed_cookie_policy", duration: "6 months", description: "The cookie is set by the GDPR Cookie Consent plugin and is used to store whether or not user has consented to the use of cookies. It does not store any personal data." }
            ]
          },
          {
            name: "Functional",
            description: "Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.",
            cookies: [
              { name: "lang", duration: "1 year", description: "This cookie is used to store the language preferences of a user to serve up content in that stored language the next time user visit the website." }
            ]
          },
          {
            name: "Performance",
            description: "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.",
            cookies: [
              { name: "YSC", duration: "1 session", description: "This cookies is set by YouTube and is used to track the views of embedded videos and captures the number of views and is relevant to only one session" }
            ]
          },
          {
            name: "Analytics",
            description: "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc.",
            cookies: [
              { name: "_ga", duration: "1 years", description: "This cookie is installed by Google Analytics. The cookie is used to calculate visitor, session, campaign data and keep track of site usage for the site's analytics report. The cookies store information anonymously and assign a randomly generated number to identify unique visitors." },
              { name: "_gat_gtag_UA_139647988_1", duration: "1 minute", description: "These cookies are set by Google Analytics which is a simple tool that helps us measure how users interact with our website. As a user navigates between web pages, Google Analytics records information about the page a user has visited, for example the URL of the page. The cookies themselves are used to 'remember' what a user has done on previous pages and interactions with our website." },
              { name: "_gid", duration: "1 day", description: "This cookie is installed by Google Analytics. The cookie is used to store information of how visitors use a website and helps in creating an analytics report of how the website is doing. The data collected including the number visitors, the source where they have come from, and the pages visited in an anonymous form." }
            ]
          },
          {
            name: "Advertisement",
            description: "Advertisement cookies are used to provide visitors with relevant ads and marketing campaigns. These cookies track visitors across websites and collect information to provide customized ads.",
            cookies: [
              { name: "_fbp", duration: "3 months", description: "_fbp. Used by Facebook to deliver advertising. The cookie contains an encrypted Facebook user ID and browser ID. It will receive information from this website to better target and optimise advertising." },
              { name: "IDE", duration: "1 year", description: "Used by Google DoubleClick and stores information about how the user uses the website and any other advertisement before visiting the website. This is used to present users with ads that are relevant to them according to the user profile." },
              { name: "test_cookie", duration: "15 minutes", description: "This cookie is set by doubleclick.net. The purpose of the cookie is to determine if the user's browser supports cookies." },
              { name: "VISITOR_INFO1_LIVE", duration: "5 months 27 days", description: "This cookie is set by Youtube. Used to track the information of the embedded YouTube videos on a website." }
            ]
          },
          {
            name: "Others",
            description: "Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet.",
            cookies: [
              { name: "ARRAffinitySameSite", duration: "session", description: "No description" },
              { name: "CONSENT", duration: "6 months", description: "No description" }
            ]
          }
        ]
      },
      {
        title: "Other tracking technologies",
        content: "In addition to cookies, we may also collect data about your interaction with the services through web server logs and/or tracking pixels. A web server log is a file where website activity is stored. Tracking pixels (sometimes referred to as web beacons or clear GIFs) are tiny electronic tags with a unique identifier embedded in websites, online ads and/or email. These technologies designed to provide usage information for purposes of analyzing and improving the performance of the services we provide to you."
      },
      {
        title: "Third-party plug-ins",
        content: "All information about the role of third-parties in processing the data collected via cookies or other tracking technologies is included in our Privacy Policy. The cookies may allow us or our partner to collect the following information about you:",
        list: [
          "data relating to your device (including device ID, MAC address, IP address, operating system, device settings, in particular the language set, screen resolution, type of web browser),",
          "data relating to your visits to our websites (e.g. time and length of your visit, date, sub-pages visited on our websites, search data),",
          "your location (if you have given your separate consent),",
          "information about advertising you have viewed, including information about links you have clicked,",
          "information about your activities on other websites (if you have given your separate consent), including information on which websites you visit and how often."
        ]
      },
      {
        title: "What is the legal basis for processing?",
        content: [
          "The processing of your personal data within the Website is based either on:",
          {
            type: "list",
            items: [
              "your consent (in line with Article 6 (1) (a) GDPR) with respect to cookies which require a consent, or",
              "under our legitimate interest (in line with Article 6 (1) (f) GDPR) with respect to cookies which are necessary to operate the Website."
            ]
          },
          "You have the right to withdraw your consent at any time or object to processing of your personal data made under our legitimate interest, by contacting us in accordance with our Privacy Policy. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.",
          "For more details on legal basis of processing please read our Privacy Policy."
        ]
      },
      {
        title: "How can I control the cookie preferences?",
        content: [
          "You can manage your cookies preferences by clicking on the \"Settings\" button and enabling or disabling the cookie categories on the popup according to your preferences.",
          "Should you decide to change your preferences later through your browsing session, you can click on the \"Privacy & Cookie Policy\" tab on your screen. This will display the consent notice again enabling you to change your preferences or withdraw your consent entirely.",
          "In addition to this, different browsers provide different methods to block and delete cookies used by websites. You can change the settings of your browser to block/delete the cookies. To find out more out more on how to manage and delete cookies, visit wikipedia.org, www.allaboutcookies.org."
        ]
      }
    ]
  };

  const renderContent = (contentItem) => {
    if (typeof contentItem === 'string') {
      return <p key={Math.random()}>{contentItem}</p>;
    }

    if (contentItem.type === 'list') {
      return (
        <ul key={Math.random()}>
          {contentItem.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    return null;
  };

  return (
    <section className="cookie-policy-content">
      <div className="cookie-policy-content__container">
        <div className="cookie-policy-content__wrapper">
          {contentData.introduction && (
            <div className="cookie-policy-content__intro">
              <h2 className="cookie-policy-content__intro-title">{contentData.introduction.title}</h2>
              {contentData.introduction.content && contentData.introduction.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {contentData.sections && contentData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="cookie-policy-content__section">
              <h2 className="cookie-policy-content__section-title">{section.title}</h2>
              
              {Array.isArray(section.content) ? (
                section.content.map((contentItem, contentIndex) => renderContent(contentItem))
              ) : (
                <p>{section.content}</p>
              )}

              {section.list && (
                <ul>
                  {section.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}

              {section.cookieCategories && section.cookieCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="cookie-policy-content__category">
                  <h3 className="cookie-policy-content__category-title">{category.name}</h3>
                  {category.description && (
                    <p className="cookie-policy-content__category-description">{category.description}</p>
                  )}
                  
                  {category.cookies && category.cookies.length > 0 && (
                    <div className="cookie-policy-content__table-wrapper">
                      <table className="cookie-policy-content__table">
                        <thead>
                          <tr>
                            <th>Cookie</th>
                            <th>Duration</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.cookies.map((cookie, cookieIndex) => (
                            <tr key={cookieIndex}>
                              <td className="cookie-policy-content__table-cell cookie-policy-content__table-cell--cookie">
                                {cookie.name}
                              </td>
                              <td className="cookie-policy-content__table-cell cookie-policy-content__table-cell--duration">
                                {cookie.duration || '-'}
                              </td>
                              <td className="cookie-policy-content__table-cell cookie-policy-content__table-cell--description">
                                {cookie.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

