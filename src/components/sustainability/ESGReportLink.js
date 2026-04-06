// Test comment
import Image from 'next/image';
import Link from 'next/link';
import '@/scss/components/sustainability/ESGReportLink.scss';

export default function ESGReportLink() {
  return (
    <section className="esg-report-link">
      <div className="esg-report-link__container">
        <Link href="https://www.lupin.com/esg-report/index.html" className="esg-report-link__link" target="_blank">
          <p className="esg-report-link__text">
            Find our complete ESG report here
          </p>
          <div className="esg-report-link__icon">
            <Image 
              src="/assets/sustainability/arrow.svg"
              alt="Arrow icon" 
              width={33}
              height={33}
              className="esg-report-link__icon-img"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}

