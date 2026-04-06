// Test comment
import '@/scss/components/sustainability/LookingAheadSection.scss';

export default function LookingAheadSection() {
  return (
    <section className="looking-ahead">
      <div className="looking-ahead__container">
        <div className="looking-ahead__content">
          <h2 className="looking-ahead__title">Way Forward</h2>
          <div className="looking-ahead__text">
            <p>Through continuous innovation, improvement, and accountability,</p>
            <p>Lupin demonstrates a deep commitment to creating sustainable value for</p>
            <p>generations to come. This dedication is anchored in protecting nature, empowering and inspiring people and improving patient lives through responsible and ethical healthcare solutions.</p>
          </div>
        </div>
        <div className="looking-ahead__image-wrapper">
          <picture>
            <source 
              media="(max-width: 768px)" 
              srcSet="/assets/sustainability/bottom.png" 
            />
            <img
              src="/assets/sustainability/bottom.png"
              alt="Looking ahead - Earth and nature"
              className="looking-ahead__image"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

