import Link from 'next/link';
import '../scss/components/SitemapContent.scss';

export default function SitemapContent({ data }) {
  // Default sitemap structure
  const sitemapData = data || {
    sections: [
      {
        title: "Home",
        links: [
          { text: "Home", href: "/" }
        ]
      },
      {
        title: "About Us",
        links: [
          { text: "The Lupin Story", href: "/about-us/our-story" },
          { text: "Our Purpose", href: "/about-us/our-purpose" },
          { text: "Our Values", href: "/about-us/our-values" },
          { text: "Our Leadership", href: "/about-us/leadership" },
          { text: "Compliance ,Ethics and Governance", href: "/about-us/compliance-ethics-governance" },
          { text: "Global Presence", href: "/about-us/global-presence" },
          { text: "Our Manufacturing Approach", href: "/about-us/global-technical-operations" },
          { text: "Quality in Action", href: "/about-us/quality-in-action" },
          { text: "Our Science", href: "/about-us/our-science" },
          { text: "Awards and Recognitions", href: "/about-us/awards-and-recognition" }
        ]
      },
      {
        title: "Our Business",
        links: [
          { text: "Global Generics", href: "/our-business/global-generics" },
          { text: "Emerging Markets", href: "/our-business/emerging-markets" },
          { text: "Specialty and Innovation", href: "/our-business/specialty" },
          { text: "Biosimilars", href: "/our-business/biosimilars" },
          { text: "India", href: "/our-business/india" },
          { text: "Our Adjacencies", href: "/our-business/our-adjacencies" }
        ]
      },
      {
        title: "Products",
        links: [
          { text: "Product Finder", href: "/product-finder" }
        ]
      },
      {
        title: "Investors",
        links: [
          // { text: "Financials", href: "/investors/financials" },
          { text: "Reports & Filings", href: "/investors/reports-filings" },
          { text: "Committees of the Board", href: "/investors/committees-of-the-board" },
          { text: "Code of Conduct", href: "/investors/code-of-conduct" },
          { text: "Policies", href: "/investors/policies" },
          { text: "Share Price", href: "/investors/share-price" },
          { text: "Shareholding Pattern", href: "/investors/shareholding-pattern" },
          { text: "Dividend", href: "/investors/dividend" },
          { text: "Unclaimed Dividend and Shares", href: "/investors/unclaimed-dividend" },
          { text: "Memorandum and Articles of Association", href: "/assets/share-price/Lupin-Revised-MOA-AOA-Lupin-Limited.pdf", target: '_blank' },
          { text: "Postal Ballot", href: "/annual-general-meeting-and-postal-ballot" },
          { text: "Investor FAQs", href: "/investors/investor-faqs" },
          { text: "Business Responsibility", href: "/assets/share-price/business-responsiblity-report.pdf", target: '_blank' },
          { text: "Disclosure under Regulation 46 of SEBI (LODR) Regulations, 2015", href: "/investors/disclosure-under-regulation-46-of-sebi-regulations-2015" },
        ]
      },
      {
        title: "Sustainability",
        links: [
          { text: "Sustainability", href: "/sustainability" }
        ]
      },
      {
        title: "Community",
        links: [
          { text: "Community", href: "/community" }
        ]
      },
      {
        title: "Media",
        links: [
          { text: "Press Releases", href: "/media/press-releases" },
          { text: "Media Coverage", href: "/media/media-coverage" },
          { text: "Perspectives", href: "/media/perspectives" },
          { text: "Media Kit", href: "/media/media-kit" },
        ]
      },
      {
        title: "Contact & Legal",
        links: [
          { text: "Contact Us", href: "/contact-us" },
          { text: "Privacy Policy", href: "/privacy-policy" },
          { text: "Terms of Service", href: "/terms-of-service" },
          { text: "Cookie Policy", href: "/cookie-policy" },
          { text: "Sitemap", href: "/sitemap" }
        ]
      }
    ]
  };

  return (
    <section className="sitemap-content">
      <div className="sitemap-content__container">
        <div className="sitemap-content__wrapper">
          {sitemapData.sections && sitemapData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="sitemap-content__section">
              <h2 className="sitemap-content__section-title">{section.title}</h2>
              <ul className="sitemap-content__links">
                {section.links && section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="sitemap-content__link-item">
                    <Link href={link.href} className="sitemap-content__link">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

