// Test comment
import '@/scss/components/sustainability/ESGRatingsSection.scss';

export default function ESGRatingsSection() {
  const ratings = [
    {
      id: 1,
      title: "S&P Global",
      logo: "/assets/sustainability/SP-Global.svg",
      rating: "91/100 in 2025 S&P Global ESG Rating",
      previousRating: "(17/100 in 2021)",
      isWhite: false,
      position: "top-left"
    },
    {
      id: 2,
      title: "CDP",
      logo: "/assets/sustainability/CDP.svg",
      rating: "'A' leadership rating in both Climate and Water",
      previousRating: "in 2025 (F in 2021)",
      isWhite: false,
      position: "top-center"
    },
    {
      id: 3,
      title: "Sustainalytics",
      logo: "/assets/sustainability/sustainalytics.svg",
      rating: "22.1 medium risk in 2026, decreasing ESG risk demonstrating progress",
      previousRating: "(42.69 severe risk in 2019)",
      isWhite: false,
      position: "top-right"
    },
    {
      id: 4,
      title: "MSCI",
      logo: "/assets/sustainability/MSCI.svg",
      rating: "'BBB' ESG rating in 2025",
      previousRating: "(BB rating in 2024)",
      isWhite: false,
      position: "middle-left"
    },
    {
      id: 5,
      title: "NSE Sustainability Ratings & Analytics",
      logo: "/assets/sustainability/NSE.svg",
      rating: "71/100 ESG rating score for FY2025",
      isWhite: false,
      position: "middle-center"
    },
    {
      id: 6,
      title: "ESG Risk Assessments & Insights",
      logo: "/assets/sustainability/ESG Risk.svg",
      subtitle: "Strong Category",
      rating: "67/100 ESG score for FY2025",
      isWhite: false,
      position: "bottom-left"
    },
    {
      id: 7,
      title: "Crisil ESG Ratings & Analytics",
      logo: "/assets/sustainability/CRISIL.svg",
      subtitle: "Strong Rating",
      rating: "Crisil ESG 62 and Crisil Core ESG 63 for 2025",
      isWhite: false,
      position: "bottom-center"
    }
  ];

  return (
    <section id="esg-ratings" className="esg-ratings">
      {/* Background Image */}
      <div className="esg-ratings__bg">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="/assets/images/sustainability/mobilegridbg.png" 
          />
          <img
            src="/assets/images/sustainability/c46eacbd7ec5f84e6b27a81fa00dd45ffd6eabfe.png"
            alt="ESG Ratings background"
            className="esg-ratings__bg-image"
          />
        </picture>
      </div>

      {/* Container */}
      <div className="esg-ratings__container">
        {/* Title */}
        <h2 className="esg-ratings__title">
          Our ESG Ratings
        </h2>

        {/* Ratings Grid */}
        <div className="esg-ratings__grid">
          {ratings.map((rating) => (
            <div 
              key={rating.id} 
              className={`esg-ratings__card esg-ratings__card--${rating.position} ${rating.isWhite ? 'esg-ratings__card--white' : ''}`}
            >
              <div className="esg-ratings__card-title-row">
                <h3 className="esg-ratings__card-title">{rating.title}</h3>
                {rating.logo && (
                  <img
                    src={rating.logo}
                    alt=""
                    className="esg-ratings__card-logo"
                  />
                )}
              </div>
              {rating.subtitle && (
                <p className="esg-ratings__card-subtitle">{rating.subtitle}</p>
              )}
              <div className="esg-ratings__card-content">
                <p className="esg-ratings__card-rating">{rating.rating}</p>
                {rating.previousRating && (
                  <p className="esg-ratings__card-previous">{rating.previousRating}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

