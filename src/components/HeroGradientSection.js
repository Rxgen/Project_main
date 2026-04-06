'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/HeroGradientSection.scss';

export default function HeroGradientSection() {
  return (
    <section className="hero-gradient-section" data-node-id="2888:836">
      <div className="hero-gradient-section__container">
        {/* Text Box */}
        <div className="hero-gradient-section__text-box" data-node-id="2888:842">
          <div className="hero-gradient-section__text-content" data-node-id="2888:843">
            <p className="hero-gradient-section__paragraph">
              <span>Our Founder, </span>
              <strong>Dr. Desh Bandhu Gupta</strong>
              <span>, aspired to build quality healthcare as a right for all. He believed that scientific excellence is imperative to expand access to affordable healthcare. This relentless drive to pursue  a single dream led to the formation of a company that would go on to impact several lives through affordable, accessible healthcare.</span>
            </p>
         
          </div>
        </div>

        {/* Founder Image */}
        <div className="hero-gradient-section__image-wrapper" data-node-id="2888:856">
          <div className="hero-gradient-section__image-container">
            <Image
              src="/assets/images/our-story/founder.png"
              alt="Dr. Desh Bandhu Gupta"
              fill
              className="hero-gradient-section__image"
              quality={100}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

