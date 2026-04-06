'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import '@/scss/components/OurStoryTimeline.scss';

// Milestones data for each year
const milestonesData = {
  2023: [
    "Acquisition of Five Brands from Menarini",
    "Launch of the world's first fixed-dose triple combination drug, Vilfuro-G®, for COPD in India",
    "Launch of Luforbec® 100/6 in Germany — Lupin's first inhalation product in that market",
    "Acquisition of ONDERO® and ONDERO MET®",
    "Launch of Spiriva (Tiotropium DPI) in the United States",
    "Launch of DIFIZMA® DPI, a triple drug combination for uncontrolled asthma",
    "Launch of Atharv Ability — a multi-disciplinary neuro-rehabilitation center in Mumbai",
    "Acquisition of French company Medisol",
    "Key milestone achieved for the Phase 1 MALT1 inhibitor program with AbbVie Inc.",
    "Launch of LYFE, Lupin Digital Health; for holistic cardiac care business"
  ],
  2022: [
    "Milestone achievement for 2022",
    "Another significant milestone in 2022"
  ],
  2021: [
    "Milestone achievement for 2021",
    "Another significant milestone in 2021"
  ],
  2020: [
    "Milestone achievement for 2020",
    "Another significant milestone in 2020"
  ],
  2019: [
    "Milestone achievement for 2019",
    "Another significant milestone in 2019"
  ],
  2018: [
    "Milestone achievement for 2018",
    "Another significant milestone in 2018"
  ],
  2017: [
    "Milestone achievement for 2017",
    "Another significant milestone in 2017"
  ]
};

export default function OurStoryTimeline() {
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
  const [activeYear, setActiveYear] = useState(2023);
  const [swiper, setSwiper] = useState(null);
  const activeIndex = years.indexOf(activeYear);

  // Initialize Swiper to center on active year
  useEffect(() => {
    if (swiper && activeIndex !== -1) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        swiper.slideTo(activeIndex, 0);
      }, 100);
    }
  }, [swiper, activeIndex]);

  // Handle slide change
  const handleSlideChange = (swiperInstance) => {
    const currentIndex = swiperInstance.activeIndex;
    if (years[currentIndex] !== activeYear) {
      setActiveYear(years[currentIndex]);
    }
  };

  const handleYearClick = (year) => {
    const yearIndex = years.indexOf(year);
    if (swiper && yearIndex !== -1) {
      swiper.slideTo(yearIndex);
      setActiveYear(year);
    }
  };

  const milestones = milestonesData[activeYear] || [];
  const yearPrefix = Math.floor(activeYear / 100); // "20" for 2023

  // Determine opacity for each year based on position relative to active year
  const getYearOpacity = (year, index) => {
    const activeIndex = years.indexOf(activeYear);
    if (year === activeYear) return 1;
    if (index === activeIndex - 1 || index === activeIndex + 1) return 0.3;
    return 0.1;
  };

  return (
    <section className="our-story-timeline" data-node-id="2936:181">
      <div className="our-story-timeline__container" data-node-id="2936:182">
        {/* Content Box - Dark Green Rounded */}
        <div className="our-story-timeline__content-box" data-node-id="2936:183">
          <div className="our-story-timeline__content-inner" data-node-id="2936:184">
            {/* Year Prefix "20" - Hidden (opacity 0) */}
            <p className="our-story-timeline__year-prefix" data-node-id="2936:185">
              {yearPrefix}
            </p>

            {/* Milestones List */}
            <div className="our-story-timeline__milestones-list" data-node-id="2936:186">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="our-story-timeline__milestone-item"
                  data-node-id={`2936:${316 + index}`}
                >
                  <div className="our-story-timeline__milestone-icon">
                    <Image
                      src="/assets/images/our-story/pointer.svg"
                      alt=""
                      width={20}
                      height={19}
                      className="our-story-timeline__pointer-icon"
                    />
                  </div>
                  <p className="our-story-timeline__milestone-text">
                    {milestone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Year Slider - Left Side */}
        <div className="our-story-timeline__year-slider-wrapper" data-node-id="2936:330">
          <Swiper
            modules={[Mousewheel]}
            direction="vertical"
            spaceBetween={0}
            slidesPerView="auto"
            centeredSlides={true}
            freeMode={false}
            mousewheel={{
              enabled: true,
              sensitivity: 1,
              releaseOnEdges: false,
            }}
            onSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            className="our-story-timeline__year-slider"
            initialSlide={activeIndex}
          >
            {years.map((year, index) => {
              const yearDisplay = year.toString().slice(-2); // Last 2 digits
              const isActive = activeYear === year;
              const opacity = getYearOpacity(year, index);
              
              return (
                <SwiperSlide key={year} className="our-story-timeline__year-slide">
                  <button
                    className={`our-story-timeline__year ${isActive ? 'our-story-timeline__year--active' : ''}`}
                    onClick={() => handleYearClick(year)}
                    style={{ opacity }}
                    data-node-id={`2936:${331 + index}`}
                  >
                    {yearDisplay}
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

