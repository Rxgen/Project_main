// Test comment
import Link from 'next/link';
import '@/scss/components/sustainability/ESGInfographicSection.scss';

export default function ESGInfographicSection() {
  return (
    <section className="esg-infographic">
      <div className="esg-infographic__container">
       
          <picture className="esg-infographic__picture">
            <source 
              media="(max-width: 768px)" 
              srcSet="/assets/images/sustainability/infomobile.png" 
            />
            <img
              src="/assets/sustainability/infography.png"
              alt="ESG Governance Framework Infographic"
              className="esg-infographic__image"
            />
          </picture>
      </div>
    </section>
  );
}


