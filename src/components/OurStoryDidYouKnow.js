'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/OurStoryDidYouKnow.scss';

export default function OurStoryDidYouKnow() {
  const facts = [
    {
      title: "Lupin was named after a flower",
      content: "The Lupin flower grows even in harsh conditions and enriches the soil around it. Inspired by its resilience and selfless nature, Dr. Gupta envisioned a company catering to others, addressing unmet medical needs despite on-ground challenges."
    },
    {
      title: "An auspicious beginning",
      content: "DBG founded Lupin in 1968 with the help of INR 5,000 borrowed from his wife, Manju Gupta, who is currently the chairperson."
    },
    {
      title: "Our first breakthrough",
      content: "The Government of India entrusted Lupin with supplying iron and folic acid tablets for its mother and child healthcare program. This was Lupin’s first major order and a foundation for the future."
    },
    {
      title: "A team of two",
      content: "Lupin started with only two employees: a peon-cum-packer and a part-time typist. This is a powerful reminder of how great things grow from the simplest beginnings."
    }
  ];

  return (
    <section className="our-story-did-you-know" data-node-id="2888:733">
      {/* Decorative Petal */}
      <div className="our-story-did-you-know__petal">
        <Image
          src="/assets/inner-banner/petal-2.svg"
          alt="Decorative petal"
          width={801}
          height={382}
          className="our-story-did-you-know__petal-img"
          quality={100}
        />
      </div>

      {/* Title */}
      <div className="our-story-did-you-know__container">
        <h2 className="our-story-did-you-know__title">Did You Know?</h2>

        {/* Facts Cards */}
        <div className="our-story-did-you-know__facts">
          {facts.map((fact, index) => (
            <div
              key={index}
              className="our-story-did-you-know__card"
            >
              <h3 className="our-story-did-you-know__card-title">
                {fact.title}
              </h3>
              <p className="our-story-did-you-know__card-content">
                {fact.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

