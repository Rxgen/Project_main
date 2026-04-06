'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import '@/scss/components/AwardsAndRecognitionYears.scss';

export default function AwardsAndRecognitionYears({ 
  activeYear: externalActiveYear, 
  awardsData = {},
  years = [],
  onYearChange 
}) {
  const activeYear = externalActiveYear || (years.length > 0 ? years[0] : null);
  const awards = activeYear ? (awardsData[activeYear] || []) : [];
  const yearPrefix = activeYear ? Math.floor(activeYear / 100) : '20'; // "20" for 2023
  
  // Track if user has changed year (next/prev) so we show previous year after first interaction
  const prevYearRef = useRef(activeYear);
  const [hasYearChanged, setHasYearChanged] = useState(false);
  useEffect(() => {
    if (prevYearRef.current !== activeYear && prevYearRef.current !== undefined) {
      setHasYearChanged(true);
    }
    prevYearRef.current = activeYear;
  }, [activeYear]);
  
  // Use provided years array or fallback
  const yearsList = years.length > 0 ? years : [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
  const activeIndex = yearsList.indexOf(activeYear);
  
  // Get years to display (previous, active, next) with infinite loop
  const getDisplayYears = () => {
    if (!activeYear || yearsList.length === 0 || activeIndex === -1) {
      return { prevYear: null, activeYear: null, nextYear: null };
    }
    
    // Calculate previous year (loop to end if at start)
    const prevIndex = activeIndex === 0 ? yearsList.length - 1 : activeIndex - 1;
    const prevYear = yearsList[prevIndex];
    
    // Calculate next year (loop to start if at end)
    const nextIndex = activeIndex === yearsList.length - 1 ? 0 : activeIndex + 1;
    const nextYear = yearsList[nextIndex];
    
    return { prevYear, activeYear, nextYear };
  };
  
  const { prevYear, activeYear: currentActiveYear, nextYear } = getDisplayYears();
  
  // Don't render if no active year
  if (!activeYear || !currentActiveYear) {
    return null;
  }

  return (
    <section className="awards-and-recognition-years" data-node-id="2936:181">
      <div className="awards-and-recognition-years__container" data-node-id="2936:182">
        {/* Content Box - Dark Green Rounded */}
        <div className="awards-and-recognition-years__content-box" data-node-id="2936:183">
          <div className="awards-and-recognition-years__content-inner" data-node-id="2936:184">
            {/* Year Prefix "20" */}
            <p className="awards-and-recognition-years__year-prefix" data-node-id="2936:185">
              {yearPrefix}
            </p>

            {/* Vertical Year Slider - Static HTML with Infinite Loop */}
            <div 
              className={`awards-and-recognition-years__year-slider-wrapper${hasYearChanged ? ' awards-and-recognition-years__year-slider-wrapper--has-interacted' : ''}${activeIndex === 0 ? ' awards-and-recognition-years__year-slider-wrapper--first-year' : ''}`}
              data-node-id="2936:330"
              key={activeYear}
            >
              {/* <p 
                className="awards-and-recognition-years__year awards-and-recognition-years__year--inactive"
                data-node-id="2936:331"
                key={`prev-${prevYear}`}
              >
                {prevYear && activeIndex !== 0 ? prevYear.toString().slice(-2) : ''}
              </p> */}
              <p 
                className="awards-and-recognition-years__year awards-and-recognition-years__year--active"
                data-node-id="2936:332"
                key={`active-${currentActiveYear}`}
              >
                {currentActiveYear.toString().slice(-2)}
              </p>
              {/* <p 
                className="awards-and-recognition-years__year awards-and-recognition-years__year--inactive"
                data-node-id="2936:333"
                key={`next-${nextYear}`}
              >
                {nextYear.toString().slice(-2)}
              </p> */}
            </div>

            {/* Awards List */}
            <ul className="awards-and-recognition-years__awards-list" data-node-id="2936:186">
              {awards.length > 0 ? (
                awards.map((award, index) => (
                  <li
                    key={index}
                    className="awards-and-recognition-years__award-item"
                    data-node-id={`2936:${316 + index}`}
                  >
                    <div className="awards-and-recognition-years__award-icon">
                      <Image
                        src="/assets/images/our-story/pointer.svg"
                        alt=""
                        width={20}
                        height={19}
                        className="awards-and-recognition-years__pointer-icon"
                      />
                    </div>
                    <p className="awards-and-recognition-years__award-text">
                      {award}
                    </p>
                  </li>
                ))
              ) : (
                <li className="awards-and-recognition-years__no-awards">
                  <p>No awards available for this year.</p>
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

