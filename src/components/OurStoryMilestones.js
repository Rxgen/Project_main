'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/OurStoryMilestones.scss';

export default function OurStoryMilestones() {
  // Milestones data
  const milestones = [
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
  ];

  return (
    <section className="our-story-milestones" data-node-id="2888:549">
      <div className="our-story-milestones__container">
        {/* Milestone Content Card */}
        <div className="our-story-milestones__content-card" data-node-id="2936:183">
          <div className="our-story-milestones__content-inner" data-node-id="2936:184">
            {/* Large Year Number "20" */}
            <p className="our-story-milestones__year-prefix" data-node-id="2936:185">
              20
            </p>

            {/* Milestones List */}
            <div className="our-story-milestones__milestones-list" data-node-id="2936:186">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="our-story-milestones__milestone-item"
                  data-node-id={`2936:${316 + index}`}
                >
                  <div className="our-story-milestones__milestone-icon">
                    <Image
                      src="/assets/images/our-story/pointer.svg"
                      alt=""
                      width={20}
                      height={19}
                      className="our-story-milestones__pointer-icon"
                    />
                  </div>
                  <p className="our-story-milestones__milestone-text">
                    {milestone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

