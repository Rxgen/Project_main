'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/OurStoryYearSlideContent.scss';

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

export default function OurStoryYearSlideContent({ year = 2023 }) {
  const milestones = milestonesData[year] || [];
  const yearPrefix = Math.floor(year / 100); // "20" for 2023

  return (
    <div className="our-story-year-slide-content" data-node-id="2936:183">
      <div className="our-story-year-slide-content__inner" data-node-id="2936:184">
        {/* Large Year Number "20" */}
        <p className="our-story-year-slide-content__year-prefix" data-node-id="2936:185">
          {yearPrefix}
        </p>

        {/* Milestones List */}
        <div className="our-story-year-slide-content__milestones-list" data-node-id="2936:186">
          {milestones.length > 0 ? (
            milestones.map((milestone, index) => (
              <div
                key={index}
                className="our-story-year-slide-content__milestone-item"
                data-node-id={`2936:${316 + index}`}
              >
                <div className="our-story-year-slide-content__milestone-icon">
                  <Image
                    src="/assets/images/our-story/pointer.svg"
                    alt=""
                    width={20}
                    height={19}
                    className="our-story-year-slide-content__pointer-icon"
                  />
                </div>
                <p className="our-story-year-slide-content__milestone-text">
                  {milestone}
                </p>
              </div>
            ))
          ) : (
            <p className="our-story-year-slide-content__no-milestones">
              No milestones available for this year.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

