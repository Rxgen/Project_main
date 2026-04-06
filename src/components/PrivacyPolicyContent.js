import '../scss/components/PrivacyPolicyContent.scss';

export default function PrivacyPolicyContent({ data }) {
  // Default data structure matching Strapi format
  const contentData = data || {
    title: "Privacy policy",
    introduction: "Lupin Limited (\"Lupin\") pledges to comply with internationally recognized standards of privacy protection, including General Data Protection Regulation (\"GDPR\"). We, at Lupin endeavour to ensure and maintain the privacy and security of all personal information. This Privacy Policy provides specific information about the processing of your personal data required by the GDPR (to the extent it applies to you). We urge you to carefully read this Privacy Policy before accessing or using Lupin's website (\"Website\"). If you proceed to access or use this website, you are agreeing to abide by this Privacy Policy, without any exceptions. You may not access or use this Website if you do not agree to this Privacy Policy.",
    sections: [
      {
        title: "INTENDED USE OF PERSONAL DATA",
        content: [
          "Most of the sections of our Website do not require any form of registration and/or creation of account. However, if some sections of our Website require registration, such registration shall be at your discretion and you may choose to not to register with us, however in such event you will not be able to access such section. In the event you choose to register, you may need to fill in certain fields to gain full access to such section of the site by choosing a user name and password and/or for us to respond to your query.",
          "Lupin may collect and use personal data to provide information to you about us, to market products and services, to process your orders or applications submitted by you through the careers.lupin.com, or to communicate with you when you join our Talent Community, to create products or services to meet your needs, to seek your feedback or to contact you in relation to those services offered on our Websites, to provide you educative information to help resolve your problem and/or to help build your knowledge as also to allow you to subscribe to our newsletters.",
          "Lupin's legal basis for collecting and using your personal information will depend on the nature and circumstances on the processing. To the extent the processing of your personal data by Lupin falls under the provisions of the GDPR, the processing of your personal data is based either on:",
          {
            type: "list",
            items: [
              { text: "a legitimate interest", bold: true, content: " (Art. 6 (1) (f) GDPR) in creating, developing and improving our Website and services, recruitment process and activities, in communicating with you, in responding to your requests, resolving your problems with our Website or services, in seeking feedback, as well as protecting our legitimate business interests and legal rights, including in connection with legal claims" },
              { text: "your consent", bold: true, content: " (Art. 6 (1) (a) GDPR) for carrying out direct marketing and providing the newsletter, as well as information about upcoming events and job opportunities when you join our Talent Community" },
              { text: "the necessity to perform the contract with you and taking steps prior to entering into the contract at your request", bold: true, content: " (Art. 6 (1) (b) GDPR) for processing your order, to make informed decisions on recruitment and assess your suitability for the role, to communicate with you about your application, to respond to your inquiries and schedule interviews;" },
              { text: "the necessity to perform a legal obligation", bold: true, content: " (Art. 6 (1) (c) GDPR), when we are required to do so by law, e.g., by virtue of our obligation to keep books or where obliged to respond to a legal enforcement request, warrant, search order or subpoena." }
            ]
          },
          "Unless required by law, providing personal data is voluntary; however, a failure to provide it may prevent you from taking part in the recruitment, conclude an agreement with us or receive marketing communications.",
          "Your personal data is stored for as long as it is necessary to achieve the specific purposes for which the data was collected:",
          {
            type: "list",
            items: [
              "When we process your personal data for the purposes of direct marketing, including information provided to you when you subscribe to our Talent Community, we will store the data until you withdraw your consent or object to such processing.",
              "When we process the data collected as a part of communications with you or/and during customer service, we will keep the data for the period necessary to respond to the inquiry, complaint or request.",
              "When we process the data to perform the contract with you, we will keep the data for the period necessary to perform our obligations under the contract and, if applicable, for the period specified in relevant provisions of law.",
              "When you apply for a specific position, we will keep your data for the period necessary to carry out the recruitment process or repeat the process where needed, but not longer than three months from the end of the recruitment process.",
              "When we process the data to comply with our legal obligations and enforcement requests, we will keep your personal data for a period specified in applicable laws.",
              "When we process the data based on our legitimate interest we will keep your personal data until you object to the processing of your data for these purposes, and we consider such objection effective or for the period specified for particular processing operation we perform."
            ]
          },
          "Lupin is not obliged to store your data for a period which is beyond the intended purpose for which such data was collected or submitted, after considering any applicable regulatory requirements and shall be governed by the data disposal policy followed at Lupin.",
          "This website is not intended nor aimed for the use or access by children below 18 years of age. Lupin does not knowingly collect, use or disclose personal data from a minor under the age of 18. We are not processing your personal data by implementing automated decision-making and we do not perform profiling operations on your personal data."
        ]
      },
      {
        title: "NON-DISCLOSURE OF INFORMATION",
        content: [
          "Lupin will not sell, share, or otherwise distribute your personal data to third parties without implementing appropriate safeguards, and if required to provide the same to a third party, for further processing or connection to its business, it will in accordance with applicable law for the purpose for which the data were originally collected.",
          "Lupin will, wherever possible, endeavour to ensure that the disclosure and intended use of the data are clearly indicated and that such third parties provide the same level of protection as Lupin.",
          "Lupin may also share your personal data with third party entities placing their cookie files or plug-ins on our Website, allowing them to collect specific information about your use of the Website and services (more information available in our Cookie Policy.",
          "Our Website may also display content from a third-party website or service (e.g. social media plug-ins). We may process statistical data about your activity on our social media profiles. In this respect, when we have a social media profile, as well as when we place social media plug-ins (i.e. Plug-in, Like button or Pixel) on our Website we are joint controllers of your data with the social media provider (e.g. LinkedIn, Facebook) for the purpose of aggregate statistics of websites. Aggregate statistics for the websites are created on the basis of certain activities recorded by social media provider's servers when users access our Website and related content. Joint data controllership includes the creation of such activities and their aggregate analysis in the Website's statistics provided to us by social media providers.",
          "We do not have access to your personal data processed as part of the activities; only aggregate statistics of the websites are available to us. We use this information, based on our legitimate interest, to learn how users use our Website and related content, and based on this information to tailor content to users' needs and interests, to optimize the performance of the Website, and to promote our products or conduct other marketing activities.",
          {
            type: "link",
            text: "You can find the agreement defining the scope of co-management, including the principles of responsibility for the processing of your personal data by Facebook at: ",
            links: [
              { text: "https://www.facebook.com/legal/terms/page_controller_addendum", url: "https://www.facebook.com/legal/terms/page_controller_addendum" },
              { text: " and by LinkedIn ", url: null },
              { text: "https://legal.linkedin.com/pages-joint-controller-addendum", url: "https://legal.linkedin.com/pages-joint-controller-addendum" }
            ]
          }
        ]
      },
      {
        title: "YOUR RIGHTS",
        content: [
          "If Lupin has collected your personal data, you have the right to update your personal data. In certain circumstances, you have the right to ask us to remove or erase your personal data from our records. You have also the right to request access or erasure of your personal data, restriction of processing, and the right to object to the processing of your data, as well as the right to ask us to pass data that you provided to us (for the processing of which you consented, or which you provided in order to conclude an agreement) to another organisation. You also have the right to withdraw your consent at any time. Withdrawal of the consent does not affect the lawfulness of processing based on consent before its withdrawal.",
          {
            type: "link",
            text: "If you wish to exercise your right, please contact ",
            links: [
              { text: "dpo@lupin.com", url: "mailto:dpo@lupin.com" },
              { text: " however such review will be available only in accordance with our data retention policy.", url: null }
            ]
          },
          "If you would like to opt out of future communications from Lupin's program, you may also contact us by clicking on the \"Contact Us\" link on the Web site you are visiting.",
          "To the extent the processing of your personal data falls under the scope of the GDPR, and if you believe that the processing of your personal data is not carried out in compliance with the data protection laws and regulations in force, you also have the right to file a complaint with the supervisory authority, in particular in the Member State of your habitual residence or place of work."
        ]
      },
      {
        title: "SECURITY AND CONFIDENTIALITY",
        content: [
          "To ensure the security and confidentiality of personal data that Lupin collects on-line, Lupin uses data networks protected, inter alia, by industry standard firewall and password protection. Access to personal data is restricted to only those employees on a need to know basis for the sole purpose of preserving the data and who are otherwise authorized and trained to handle such data properly. Staff compliance with our policies and procedures is regularly reviewed. While we cannot guarantee against any loss, misuse or alteration to data, we strive to prevent any such unfortunate occurrences."
        ]
      },
      {
        title: "DATA TRANSFER ABROAD",
        content: [
          {
            type: "link",
            text: "Lupin is a global enterprise and may have databases in different jurisdictions. Lupin, if required, may transfer your data to one of its databases outside the European Economic Area, e.g. India in such event if the level of privacy protection in such country of database does not comply with recognized international standards and the country is not subject to a decision of the European Commission regarding the adequacy of the level of data protection, we will ensure that data transfers to such databases in that country are adequately protected by other appropriate safeguards in place, such as contractual safeguards, including standard contractual clauses approved by the decision of the European Commission and that the transfer of data to third parties in such countries will not occur unless Lupin implements the standards it generally follows to maintain the personal data. More information and a copy of applied safeguards can be obtained by writing to us on the e-mail address ",
            links: [
              { text: "dpo@lupin.com", url: "mailto:dpo@lupin.com" }
            ]
          }
        ]
      },
      {
        title: "\"COOKIES\"",
        content: [
          {
            type: "link",
            text: "Lupin collects information from its Website(s), such as the pages you visit and the searches you perform. In doing so, Lupin may install \"cookies\". You can set your browser to notify you when you receive a \"cookie\", this will enable you to decide if you want to accept it or not. For further information on Cookies, do refer to the ",
            links: [
              { text: "Cookie Policy", url: "/cookie-policy" },
              { text: ".", url: null }
            ]
          }
        ]
      },
      {
        title: "SPAMMING",
        content: [
          "Lupin does not condone \"spamming\". Spamming is defined as sending unsolicited e-mails, usually of a commercial nature, in large numbers and repeatedly to individuals with whom the sender has had no previous contact or who have declined to receive such communications. In contrast, Lupin may inform Lupin's investors of its products, health, or other related information by e-mail, whilst giving you the choice of opting out of such service."
        ]
      },
      {
        title: "LINKS TO OTHER SITES",
        content: [
          "This Privacy Policy applies only to Lupin's Website(s). Lupin may provide links to other websites, which we believe, may be of interest to our visitors. We try to ensure that such websites are of the highest standard. However, Lupin does not guarantee the standards of every website link it provides or be responsible for the contents of non-Lupin sites. The risk of accessing such websites is solely yours."
        ]
      },
      {
        title: "NO PAID SERVICES OFFERED",
        content: [
          "Unless otherwise stated, this website does not offer you to access any content on payment basis. The access to the content of the website is only on \"read-only\" basis."
        ]
      },
      {
        title: "CONTACT",
        content: [
          "Lupin has appointed Bird & Bird DPO Services SRL as a Data Protection Officer (\"DPO\").",
          {
            type: "link",
            text: "If you have any queries or complaints about our compliance with this Privacy Policy or you believe that any Personal Data we have about you is incorrect, has been, or might be used inappropriately, please contact our Data Protection Officer via email at ",
            links: [
              { text: "dpo@lupin.com", url: "mailto:dpo@lupin.com" }
            ]
          },
          "Our DPO may be also reached at the following address: Bird & Bird DPO Services SRL, Avenue Louise 235 b 1, 1050 Brussels, Belgium",
          "If you would like to delete or amend your personal information, please mention \"Deletion Request\" or \"Amendment Request\", as applicable, in the subject line of your e-mail. Lupin will do our best to respond to all reasonable requests in a timely manner."
        ]
      },
      {
        title: "UPDATES TO THIS PRIVACY POLICY",
        content: [
          "Lupin aims to constantly improve the tools available to you to manage the data that you provide to us. Please refer to this page from time to time to review these and other new features or updates.",
          "Lupin may modify this Privacy policy from time to time, and will post the most current version on our website and indicate at the bottom of the policy when it was most recently updated"
        ]
      }
    ],
    updateDate: "Privacy Policy – Updated September 2021"
  };

  const renderContent = (contentItem) => {
    if (typeof contentItem === 'string') {
      return <p key={Math.random()}>{contentItem}</p>;
    }

    if (contentItem.type === 'list') {
      return (
        <ul key={Math.random()}>
          {contentItem.items.map((item, index) => {
            if (typeof item === 'string') {
              return <li key={index}>{item}</li>;
            }
            return (
              <li key={index}>
                {item.bold ? <strong>{item.text}</strong> : item.text}
                {item.content}
              </li>
            );
          })}
        </ul>
      );
    }

    if (contentItem.type === 'link') {
      return (
        <p key={Math.random()}>
          {contentItem.text}
          {contentItem.links.map((link, index) => {
            if (link.url) {
              return (
                <a key={index} href={link.url} target={link.url.startsWith('http') ? '_blank' : '_self'} rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  {link.text}
                </a>
              );
            }
            return <span key={index}>{link.text}</span>;
          })}
        </p>
      );
    }

    return null;
  };

  return (
    <section className="privacy-policy-content">
      <div className="privacy-policy-content__container">
        <div className="privacy-policy-content__wrapper">
          <div className="privacy-policy-content__intro">
            <p>{contentData.introduction}</p>
          </div>

          {contentData.sections && contentData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="privacy-policy-content__section">
              <h2 className="privacy-policy-content__section-title">{section.title}</h2>
              {section.content && section.content.map((contentItem, contentIndex) => (
                renderContent(contentItem)
              ))}
            </div>
          ))}

          {contentData.updateDate && (
            <p className="privacy-policy-content__update-date">
              {contentData.updateDate}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
