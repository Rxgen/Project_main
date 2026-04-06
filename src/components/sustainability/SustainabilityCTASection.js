// Test comment
import Image from 'next/image';
import Link from 'next/link';
import '@/scss/components/sustainability/SustainabilityCTASection.scss';

export default function SustainabilityCTASection() {
  const ctaItems = [
    {
      id: 1,
      title: "Sustainability Policies",
      href: "https://www.lupin.com/investors/policies",
      icon: "imgGroup97"
    },
    {
      id: 2,
      title: "Carbon Reduction Pathway – Net Zero",
      href: "/esg-report/img/reports/lupin-carbon-reduction-pathway.pdf",
      icon: "imgGroup97"
    },
    {
      id: 3,
      title: "Human Rights Report",
      href: "https://www.lupin.com/wp-content/uploads/2025/08/human-rights-assessments-declaration.pdf",
      icon: "imgGroup97"
    },
    {
      id: 4,
      title: "TCFD Report",
      href: "https://www.lupin.com/esg-report/img/reports/tcfd-report.pdf",
      icon: "imgGroup97"
    },
    {
      id: 5,
      title: "ESG Goals",
      //href: "https://www.lupin.com/wp-content/uploads/2025/09/lupin-esg-supplementary-report-fy-2024-25.pdf",
      href:"https://www.lupin.com/esg-report/esg.html#esg-our-goals",
      icon: "imgGroup97"
    },
    {
      id: 6,
      title: "Read our entire Integrated report here",
      href: "/investors/reports-filings#integrated-report-annual-report",
      icon: "imgGroup97"
    }
  ];

  return (
    <section className="sustainability-cta">
      <div className="sustainability-cta__container">
        <div className="sustainability-cta__grid">
          {ctaItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="sustainability-cta__card"
              target="_blank"
            >
              <span className="sustainability-cta__card-text">{item.title}</span>
              <div className="sustainability-cta__card-icon">
                <Image
                  src="/assets/images/sustainability/b9ccf46e480fff21e8efd04012ad80a27776b5e8.svg"
                  alt="Arrow icon"
                  width={24}
                  height={24}
                  className="sustainability-cta__icon-img"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

