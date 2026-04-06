import Link from 'next/link';
import Image from 'next/image';
import CookieSettingsLink from '@/components/CookieSettingsLink';
import '../scss/components/Footer.scss';

// Helper function to map link labels to URLs
function getLinkUrl(label, category) {
  const linkMap = {
    aboutUs: {
      "The Lupin Story": "/about-us/our-story",
      "Lupin Story": "/about-us/our-story",
      "Our Story": "/about-us/our-story",
      "Our Purpose": "/about-us/our-purpose",
      "Our Values": "/about-us/our-values",
      "Compliance, Ethics and Governance": "/about-us/compliance-ethics-governance",
      "Global Presence": "/about-us/global-presence",
      "Our Manufacturing Approach": "/about-us/global-technical-operations",
      "Quality in Action": "/about-us/quality-in-action",
      "Our Science": "/about-us/our-science",
      "Our Leadership": "/about-us/leadership",
      "Awards and Recognitions": "/about-us/awards-and-recognition"
    },
    ourBusiness: {
      "Global Generics": "/our-business/global-generics",
      "Emerging Markets": "/our-business/emerging-markets",
      "India": "/our-business/india",
      "Specialty and Innovation": "/our-business/specialty",
      "Biosimilars": "/our-business/biosimilars",
      "Our Adjacencies": "/our-business/our-adjacencies"
    },
    investors: {
      "Financials": "/investors/financials",
      "Reports and Filings": "/investors/reports-filings",
      "Committees of the Board": "/investors/committees-of-the-board",
      "Code of Conduct": "/investors/code-of-conduct",
      "Policies": "/investors/policies",
      "Shareholder Information": "/investors#shareholding-information",
      "Memorandum and Articles of Association": "/assets/share-price/Lupin-Revised-MOA-AOA-Lupin-Limited.pdf",
      "Employee Stock Option Schemes": "/investors/employee-stock-option-schemes",
      "News and Events": "/investors/news-events",
      "Business Responsibility": "/assets/share-price/business-responsiblity-report.pdf",
      "Analyst Coverage": "/investors/analyst-coverage",
      "Investor FAQs": "/investors/investor-faqs",
      "Disclosure under Regulation 46 of SEBI (LODR) Regulations, 2015": "/investors/disclosure-under-regulation-46-of-sebi-regulations-2015",
      "Online Dispute Resolution by SEBI": "https://smartodr.in/login",
      "Investor Contacts": "/investors#subscriber-updated"
    },
    media: {
      "Media Listing": "/media",
      "Media Coverage": "/media/media-coverage",
      "Media Kit": "/media/media-kit",
      "Perspectives": "/media/perspectives",
      "Press Releases": "/media/press-releases"
    }
  };

  return linkMap[category]?.[label] || "#";
}

// Column title to URL map for footer section headings
const columnTitleUrls = {
  "About Us": "/about-us",
  "Our Business": "/our-business",
  "Investors": "/investors",
  "Media": "/media",
  "Community": "/community",
  "Sustainability": "/sustainability",
  "Contact Us": "/contact-us",
  "Careers": "https://careers.lupin.com/",
  "Lupin For Suppliers": "/lupin-for-suppliers"
};

export default function Footer({ data }) {
  // Default data (will be replaced by Strapi)
  const footerData = data || {
    logo: {
      url: "/assets/logo-lupin.png",
      alt: "Lupin Logo"
    },
    contact: {
      email: "info@lupin.com",
      phone: "+91 22 6640 2323"
    },
    links: {
      aboutUs: [
        "The Lupin Story",
        "Our Purpose",
        "Our Values",
        "Our Leadership",
        "Compliance, Ethics and Governance",
        "Global Presence",
        "Our Manufacturing Approach",
        "Quality in Action",
        "Our Science",
        "Awards and Recognitions"
      ],
      ourBusiness: [
        "Global Generics",
        "Emerging Markets",
        "India",
        "Specialty and Innovation",
        "Biosimilars",
        "Our Adjacencies"
      ],
      investors: [
        "Reports and Filings",
        "Policies",
        "Shareholder Information",
        "Disclosure under Regulation 46 of SEBI (LODR) Regulations, 2015",
        "Online Dispute Resolution by SEBI",
        "Investor Contacts"

      ],
      media: [
        // "Media Listing",
        "Press Releases",
        "Media Coverage",
        "Perspectives",
        "Media Kit",

      ],
      community: [],
      sustainability: [],
      contactUs: [],
      careers: [],
      lupinForSuppliers: []
    },
    copyright: "© 2025 Lupin. All rights reserved",
    legal: [
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Disclaimer", href: "/terms-of-service" },
      { label: "Sitemap", href: "/sitemap" }
    ],
    social: [
      { name: "Twitter", icon: "/assets/social-twitter.svg", href: "https://x.com/LupinGlobal", width: 30, height: 28.221 },
      { name: "Facebook", icon: "/assets/social-facebook.svg", href: "https://www.facebook.com/LupinWorld/ ", width: 15, height: 32.8 },
      { name: "LinkedIn", icon: "/assets/social-linkedin.svg", href: "https://www.linkedin.com/company/lupin/ ", width: 28, height: 26.898 },
      { name: "Instagram", icon: "/assets/social-instagram.svg", href: "https://www.instagram.com/lupinglobal/", width: 28, height: 28 },
      { name: "YouTube", icon: "/assets/social-youtube.svg", href: "https://www.youtube.com/c/LupinGlobal", width: 32, height: 22.241 }
    ]
  };

  return (
    <footer className="footer" data-node-id="2018:2">
      <div className="footer__container" data-node-id="2018:3">
        {/* Left Section - Logo and Contact */}
        <div className="footer__left" data-node-id="2018:4">
          {/* Logo */}
          <div className="footer__logo" data-node-id="2018:5">
            <Image
              src={footerData.logo.url}
              alt={footerData.logo.alt}
              width={142}
              height={173}
              className="footer__logo-img"
              quality={100}
            />
          </div>

          {/* Contact Information */}
          <div className="footer__contact" data-node-id="2018:6">
            <div className="footer__contact-item" data-node-id="2018:7">
              <div className="footer__contact-icon" data-node-id="2018:8">
                <Image
                  src="/assets/icon-email.svg"
                  alt=""
                  width={22}
                  height={16.607}
                  quality={100}
                />
              </div>
              <a href={`mailto:${footerData.contact.email}`} className="footer__contact-text" data-node-id="2018:9">
                {footerData.contact.email}
              </a>
            </div>

            <div className="footer__contact-item" data-node-id="2018:10">
              <div className="footer__contact-icon" data-node-id="2018:11">
                <Image
                  src="/assets/icon-phone.svg"
                  alt=""
                  width={19.431}
                  height={19.474}
                  quality={100}
                />
              </div>
              <a href={`tel:${footerData.contact.phone}`} className="footer__contact-text" data-node-id="2018:13">
                {footerData.contact.phone}
              </a>
            </div>

            <div className="footer__contact-item footer__contact-item--title-style" data-node-id="2018:12">
              <div className="footer__column-title" data-node-id="2018:12b">
                <Link href="/contact-us" className="footer__column-title-link" data-node-id="2018:12a">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="footer__contact-item footer__contact-item--title-style" data-node-id="2018:12">
              <div className="footer__column-title" data-node-id="2018:12b">
                <Link href="https://www.lupin.com/uploads/LUPIN-consumer-advisory.pdf" target='_blank' className="footer__column-title-link" data-node-id="2018:12a">
                  Consumer Advisory Notification
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright and Legal */}
          <div className="footer__legal" data-node-id="2018:14">
            <div className="footer__legal-content" data-node-id="2018:15">
              <p className="footer__copyright" data-node-id="2018:16">
                {footerData.copyright}
              </p>
              <p className="footer__legal-links" data-node-id="2018:17">
                {footerData.legal.map((link, index) => (
                  <span key={index}>
                    <Link href={link.href} className="footer__legal-link">
                      {link.label}
                    </Link>
                    {' | '}
                  </span>
                ))}
                <CookieSettingsLink />
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Links */}
        <div className="footer__right" data-node-id="2018:26">
          {/* About Us */}
          <div className="footer__column" data-node-id="2018:27">
            <div className="footer__column-title" data-node-id="2018:28">
              <Link href={columnTitleUrls["About Us"]} className="footer__column-title-link">About Us</Link>
            </div>
            <ul className="footer__column-links" data-node-id="2018:29">
              {footerData.links.aboutUs.map((link, index) => (
                <li key={index}>
                  <Link href={getLinkUrl(link, 'aboutUs')} className="footer__link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Business */}
          <div className="footer__column" data-node-id="2018:30">
            <div className="footer__column-title" data-node-id="2018:31">
              <Link href={columnTitleUrls["Our Business"]} className="footer__column-title-link">Our Business</Link>
            </div>
            <ul className="footer__column-links" data-node-id="2018:32">
              {footerData.links.ourBusiness.map((link, index) => (
                <li key={index}>
                  <Link href={getLinkUrl(link, 'ourBusiness')} className="footer__link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Investors */}
          <div className="footer__column" data-node-id="2018:33">
            <div className="footer__column-title" data-node-id="2018:34">
              <Link href={columnTitleUrls["Investors"]} className="footer__column-title-link">Investors</Link>
            </div>
            <ul className="footer__column-links" data-node-id="2018:35">
              {footerData.links.investors.map((link, index) => {
                const url = getLinkUrl(link, 'investors');
                const isExternalLink = link === "Online Dispute Resolution by SEBI";

                return (
                  <li key={index}>
                    {isExternalLink ? (
                      <a href={url} className="footer__link" target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    ) : (
                      <Link href={url} className="footer__link">
                        {link}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Media */}
          <div className="footer__column" data-node-id="2018:36">
            <div className="footer__column-title" data-node-id="2018:37">
              <Link href={columnTitleUrls["Media"]} className="footer__column-title-link">Media</Link>
            </div>
            <ul className="footer__column-links" data-node-id="2018:38">
              {footerData.links.media.map((link, index) => (
                <li key={index}>
                  <Link href={getLinkUrl(link, 'media')} className="footer__link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div className="bottomLinks">
            {/* Community */}
            <div className="footer__column" data-node-id="2018:39">
              <div className="footer__column-title" data-node-id="2018:40">
                <Link href={columnTitleUrls["Community"]} className="footer__column-title-link">Community</Link>
              </div>
            </div>

            {/* Sustainability */}
            <div className="footer__column" data-node-id="2018:42">
              <div className="footer__column-title" data-node-id="2018:43">
                <Link href={columnTitleUrls["Sustainability"]} className="footer__column-title-link">Sustainability</Link>
              </div>
            </div>

            {/* Careers and Lupin For Suppliers (stacked: Lupin For Suppliers below Careers) */}
            <div className="footer__column-stack" data-node-id="2018:45">
              <div className="footer__column" data-node-id="2018:46">
                <div className="footer__column-title" data-node-id="2018:46a">
                  <Link href={columnTitleUrls["Careers"]} className="footer__column-title-link" target="_blank">Careers</Link>
                </div>
              </div>
              <div className="footer__column" data-node-id="2018:47">
                <div className="footer__column-title" data-node-id="2018:48">
                  <Link href={columnTitleUrls["Lupin For Suppliers"]} className="footer__column-title-link footer__column-title-link--square">Lupin For Suppliers</Link>
                </div>
              </div>
            </div>
          </div>

        </div>



        {/* Bottom Section - Social Media */}
        <div className="footer__social" data-node-id="2018:18">
          <div className="footer__social-divider" data-node-id="2018:19"></div>
          <div className="footer__social-icons" data-node-id="2018:20">
            {footerData.social.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="footer__social-icon"
                aria-label={social.name}
                data-node-id={`2018:${21 + index}`}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={social.width}
                  height={social.height}
                  quality={100}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
