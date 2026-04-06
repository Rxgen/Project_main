// Test comment
import '../../scss/components/sustainability/SustainabilityIntro.scss';

export default function SustainabilityIntro() {
  return (
    <section id="esg-framework" className="sustainability-intro" data-node-id="2939:2977">
      {/* Background Image with Picture Tag */}
      <div className="sustainability-intro__bg">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="/assets/sustainability/bg1-mobile.png" 
          />
          <img
            src="/assets/sustainability/bg1.png"
            alt="Sustainability background"
            className="sustainability-intro__bg-image"
          />
        </picture>
      </div>
      <div className="sustainability-intro__container" data-node-id="2939:6027">
        {/* <div className="sustainability-intro__title" data-node-id="2939:2983">
          <span className="sustainability-intro__title-line">For our Planet</span>
          <span className="sustainability-intro__title-line">For our People</span>
          <span className="sustainability-intro__title-line">For our Patients</span>
        </div> */}
        <div className="sustainability-intro__description" data-node-id="2939:2987">
          <p>Sustainability is rooted in how we operate, innovate, and grow responsibly. From greener </p>
          <p>manufacturing and responsible sourcing to water stewardship and community well-being, </p>
          <p>we integrate sustainability into every aspect of our business. </p>
          <p>&nbsp;</p>
          <p>As a global pharmaceutical company, we operate in an environment shaped by climate </p>
          <p>change, resource intensity, regulatory expectations, and growing healthcare needs. At Lupin, </p>
          <p>we understand this deeply and respond by reducing emissions, conserving water, minimizing </p>
          <p>waste, and strengthening ethical governance, ensuring resilient operations while delivering </p>
          <p>long-term value for not just people but also the environment. </p>
          <p>&nbsp;</p>
          <p>This commitment is driven by a clear ESG framework that guides action and accountability, </p>
          <p>aligned with Lupin&apos;s purpose. It shapes how we create impact for our planet, our people,</p>
          <p>and our patients.</p>
        </div>
      </div>
    </section>
  );
}

