// Test comment
'use client';

import Image from 'next/image';
import '@/scss/components/sustainability/GlobalFrameworksSection.scss';

export default function GlobalFrameworksSection() {
  // Logo data - will use extracted logos from Figma
  // For now, using placeholder paths that match the extracted files
  const logos = [
    {
      id: 1,
      name: "Logo 1",
      image: "/assets/sustainability/CDP.png"
    },
    {
      id: 2,
      name: "Logo 2",
      image: "/assets/images/sustainability/logos/2-8.png"
    },
    {
      id: 3,
      name: "Logo 3",
      image: "/assets/images/sustainability/logos/3-8.png"
    },
    {
      id: 4,
      name: "Logo 4",
      image: "/assets/images/sustainability/logos/4-8.png"
    },
    {
      id: 5,
      name: "Logo 5",
      image: "/assets/images/sustainability/logos/5-8.png"
    },
    {
      id: 6,
      name: "Logo 6",
      image: "/assets/images/sustainability/logos/6-8.png"
    },
    {
      id: 7,
      name: "Logo 7",
      image: "/assets/images/sustainability/logos/7-8.png"
    },
    {
      id: 8,
      name: "Logo 8",
      image: "/assets/images/sustainability/logos/8-8.png"
    },
    {
      id: 9,
      name: "Logo 9",
      image: "/assets/images/sustainability/logos/9-8.png"
    },
    {
      id: 10,
      name: "Logo 10",
      image: "/assets/images/sustainability/logos/10-8.png"
    },
    {
      id: 11,
      name: "Logo 11",
      image: "/assets/images/sustainability/logos/11-8.png"
    },
    {
      id: 12,
      name: "Logo 12",
      image: "/assets/images/sustainability/logos/12-8.png"
    },
    {
      id: 13,
      name: "Logo 13",
      image: "/assets/images/sustainability/logos/13-8.png"
    },
    {
      id: 14,
      name: "Logo 14",
      image: "/assets/images/sustainability/logos/14-8.png"
    },
    {
      id: 15,
      name: "Logo 15",
      image: "/assets/images/sustainability/logos/15-8.png"
    },
    {
      id: 16,
      name: "Logo 16",
      image: "/assets/images/sustainability/logos/16-8.png"
    },
    {
      id: 17,
      name: "Logo 17",
      image: "/assets/images/sustainability/logos/17-8.png"
    }
  ];

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="global-frameworks">
      {/* Title Section */}
      <div className="global-frameworks__title-section">
        <h2 className="global-frameworks__title">
          <span>Our sustainability efforts are aligned with global frameworks, standards, and ratings</span>
        </h2>
      </div>

      {/* Logos Marquee Section */}
      <div className="global-frameworks__marquee-section">
        <div className="global-frameworks__marquee">
          <div className="global-frameworks__marquee-track">
            {duplicatedLogos.map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="global-frameworks__logo-item">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={200}
                  height={100}
                  className="global-frameworks__logo-img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


