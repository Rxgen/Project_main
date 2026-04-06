'use client';

import React from 'react';
import InnerBanner from '@/components/InnerBanner';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '@/scss/pages/our-story.scss';

export default function OurStoryContent({ data, error }) {
  // Default banner data
  const defaultBannerData = {
    title: {
      line1: "Our Story",
    },
    subheading: {
      enabled: true,
      text: "Five Decades of Transforming Healthcare"
    },
    images: {
      banner: {
        url: "/assets/inner-banner/freepik-enhance-42835.jpg",
        alt: "Our Story - Lupin"
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  };

  // Default story data if Strapi data is not available
  const defaultStoryData = {
    intro: {
      heading: "From Humble Beginnings to Global Leadership",
      description: "Founded in 1968, Lupin began as a small pharmaceutical company in Mumbai, India, with a vision to make quality healthcare accessible to all. Over five decades, we have grown into one of the world's leading pharmaceutical companies, with a presence in over 100 countries and a commitment to transforming lives through innovative medicines."
    },
    timeline: [
      {
        year: "1968",
        title: "The Beginning",
        description: "Lupin was founded by Dr. Desh Bandhu Gupta with a mission to make quality medicines accessible. The company started with a focus on anti-tuberculosis drugs, addressing a critical healthcare need in India."
      },
      {
        year: "1980s",
        title: "Expansion and Innovation",
        description: "Lupin expanded its portfolio and manufacturing capabilities, establishing itself as a trusted name in the Indian pharmaceutical market. The company began exporting to international markets."
      },
      {
        year: "1990s",
        title: "Global Reach",
        description: "Lupin entered the US market and other developed markets, establishing a strong presence in generics. The company invested heavily in R&D and manufacturing infrastructure."
      },
      {
        year: "2000s",
        title: "Strategic Growth",
        description: "Lupin made strategic acquisitions and partnerships, expanding its global footprint. The company became one of the top generic pharmaceutical companies in the US by prescription volume."
      },
      {
        year: "2010s",
        title: "Diversification",
        description: "Lupin diversified into specialty pharmaceuticals, biosimilars, and consumer healthcare. The company strengthened its presence in emerging markets and continued to invest in innovation."
      },
      {
        year: "2020s",
        title: "Future Forward",
        description: "Today, Lupin is a global pharmaceutical leader with a strong focus on innovation, quality, and patient-centricity. We continue to expand our portfolio and reach, making healthcare more accessible worldwide."
      }
    ],
    milestones: [
      {
        title: "Global Presence",
        value: "100+",
        description: "Countries where Lupin products are available"
      },
      {
        title: "Manufacturing Sites",
        value: "15+",
        description: "State-of-the-art manufacturing facilities worldwide"
      },
      {
        title: "R&D Centers",
        value: "7",
        description: "Research and development centers driving innovation"
      },
      {
        title: "Employees",
        value: "20,000+",
        description: "Dedicated professionals committed to our mission"
      }
    ]
  };

  const bannerData = data?.banner || defaultBannerData;
  const intro = data?.intro || defaultStoryData.intro;
  const timeline = data?.timeline || defaultStoryData.timeline;
  const milestones = data?.milestones || defaultStoryData.milestones;

  if (error) {
    console.error('Our Story error:', error);
  }

  return (
    <div style={{ position: 'relative' }}>
      <InnerBanner data={bannerData} />
      <main className="wrapper">
        {/* Introduction Section */}
        <section className="our-story-intro">
          <div className="our-story-intro__container">
            <div className="our-story-intro__content">
              {intro.heading && (
                <h2 className="our-story-intro__heading">
                  {intro.heading}
                </h2>
              )}
              {intro.description && (
                <div className="our-story-intro__description">
                  {typeof intro.description === 'string' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {intro.description}
                    </ReactMarkdown>
                  ) : (
                    <p>{intro.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        {timeline && timeline.length > 0 && (
          <section className="our-story-timeline">
            <div className="our-story-timeline__container">
              <h2 className="our-story-timeline__title">Our Journey</h2>
              <div className="our-story-timeline__list">
                {timeline.map((item, index) => (
                  <div key={index} className="our-story-timeline__item">
                    <div className="our-story-timeline__year">{item.year}</div>
                    <div className="our-story-timeline__content">
                      <h3 className="our-story-timeline__item-title">{item.title}</h3>
                      <p className="our-story-timeline__item-description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Milestones Section */}
        {milestones && milestones.length > 0 && (
          <section className="our-story-milestones">
            <div className="our-story-milestones__container">
              <h2 className="our-story-milestones__title">Key Milestones</h2>
              <div className="our-story-milestones__grid">
                {milestones.map((milestone, index) => (
                  <div key={index} className="our-story-milestones__card">
                    <div className="our-story-milestones__value">{milestone.value}</div>
                    <h3 className="our-story-milestones__card-title">{milestone.title}</h3>
                    <p className="our-story-milestones__card-description">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}




