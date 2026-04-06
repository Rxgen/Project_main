'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '@/scss/components/sustainability/OurPeople.scss';

// Small circular progress (pie fill animation) - like OurPlanet circular-progress
function InitiativePieProgress({ progress, isVisible }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (isVisible) {
      setAnimatedProgress(0);
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);
        setAnimatedProgress(progress * easeOut);
        if (t < 1) animationRef.current = requestAnimationFrame(animate);
        else animationRef.current = null;
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setAnimatedProgress(0);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isVisible, progress]);

  const size = 84;
  const center = size / 2;
  const radius = size / 2;
  const progressAngle = (animatedProgress / 100) * 360;
  const startAngle = -90;
  const endAngle = startAngle + progressAngle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = center + radius * Math.cos(startRad);
  const y1 = center + radius * Math.sin(startRad);
  const x2 = center + radius * Math.cos(endRad);
  const y2 = center + radius * Math.sin(endRad);
  const largeArc = progressAngle > 180 ? 1 : 0;
  let pathData = '';
  if (animatedProgress <= 0) pathData = '';
  else if (animatedProgress >= 100) pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
  else pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

  // return (
  //   <div className="our-people__initiative-pie-small">
  //     <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="our-people__initiative-pie-small__svg">
  //       <circle cx={center} cy={center} r={radius} fill="rgba(255, 255, 255, 0.3)" className="our-people__initiative-pie-small__bg" />
  //       {pathData && <path d={pathData} fill="#ffffff" className="our-people__initiative-pie-small__fill" />}
  //     </svg>
  //   </div>
  // );
}

// Large circular progress (goal pie) - same fill animation
function InitiativePieProgressLarge({ progress, isVisible }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (isVisible) {
      setAnimatedProgress(0);
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);
        setAnimatedProgress(progress * easeOut);
        if (t < 1) animationRef.current = requestAnimationFrame(animate);
        else animationRef.current = null;
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setAnimatedProgress(0);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isVisible, progress]);

  const size = 136;
  const center = size / 2;
  const radius = size / 2;
  const progressAngle = (animatedProgress / 100) * 360;
  const startAngle = -90;
  const endAngle = startAngle + progressAngle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = center + radius * Math.cos(startRad);
  const y1 = center + radius * Math.sin(startRad);
  const x2 = center + radius * Math.cos(endRad);
  const y2 = center + radius * Math.sin(endRad);
  const largeArc = progressAngle > 180 ? 1 : 0;
  let pathData = '';
  if (animatedProgress <= 0) pathData = '';
  else if (animatedProgress >= 100) pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
  else pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

  return (
    <div className="our-people__initiative-pie">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="our-people__initiative-pie__svg">
        <circle cx={center} cy={center} r={radius} fill="rgba(255, 255, 255, 0.3)" className="our-people__initiative-pie__bg" />
        {pathData && <path d={pathData} fill="#ffffff" className="our-people__initiative-pie__fill" />}
      </svg>
    </div>
  );
}

// Pie for hours circle (48% or from initiative)
function InitiativeHoursCirclePie({ progress = 48, isVisible }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (isVisible) {
      setAnimatedProgress(0);
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);
        setAnimatedProgress(progress * easeOut);
        if (t < 1) animationRef.current = requestAnimationFrame(animate);
        else animationRef.current = null;
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setAnimatedProgress(0);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isVisible, progress]);

  const size = 130;
  const center = size / 2;
  const radius = size / 2;
  const progressAngle = (animatedProgress / 100) * 360;
  const startAngle = -90;
  const endAngle = startAngle + progressAngle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = center + radius * Math.cos(startRad);
  const y1 = center + radius * Math.sin(startRad);
  const x2 = center + radius * Math.cos(endRad);
  const y2 = center + radius * Math.sin(endRad);
  const largeArc = progressAngle > 180 ? 1 : 0;
  let pathData = '';
  if (animatedProgress <= 0) pathData = '';
  else if (animatedProgress >= 100) pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
  else pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

  return (
    <div className="our-people__initiative-hours-circle-pie">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="our-people__initiative-hours-circle-pie__svg">
        <circle cx={center} cy={center} r={radius} fill="rgba(255, 255, 255, 0.2)" className="our-people__initiative-hours-circle-pie__bg" />
        {pathData && <path d={pathData} fill="#ffffff" className="our-people__initiative-hours-circle-pie__fill" />}
      </svg>
    </div>
  );
}

export default function OurPeople() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const initiatives = [
    {
      id: 1,
      title: "Diversity and Inclusion",
      status: "15%",
      statusType: "Status:",
      goal: "15% women at work in India operations",
      targetYear: "2030",
      percentage: "9%",
      goalPercentage: 60,
      statusPercentage: 15,
      showPieChart: true,
    },
    {
      id: 2,
      title: "Employee Volunteering",
      // status: "24,000+ hours",
      statusType: "Status:",
      goal: "50,000 hours of employee volunteering",
      // goalHighlight: "50,000 hrs",
      targetYear: "2030",
      percentage: "24,000+",
      hoursPercentage: 48,
      showPieChart: true,
      showHours: true
    },
    {
      id: 3,
      title: "Employee Well-Being",
      status: "80%",
      statusType: "Status:",
      goal: "Employee satisfaction score of 80%",
      targetYear: "Every Year",
      percentage: "80%",
      goalPercentage: 100,
      statusPercentage: 80,
      showPieChart: true
    },
    {
      id: 4,
      title: "Supplier Sustainability",
      status: "Ongoing",
      statusType: "Status",
      goal: "100% coverage of critical suppliers",
      targetYear: "Every 3 Years",
      percentage: "100%",
      showPieChart: false,
      showIcon: true
    },
    {
      id: 5,
      title: "Social Impact",
      status: "248,256",
      statusType: "Status",
      goal: "Support 2.5 million beneficiaries with livelihood programs",
      targetYear: "2030",
      statusPercentage: 10,
      showPieChart: true
    }
  ];

  return (
    <section className="our-people" ref={sectionRef}>
      {/* Background Image with Picture Tag */}
      <div className="our-people__bg">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="/assets/sustainability/bg3-mobile.png" 
          />
          <img
            src="/assets/sustainability/bg3.png"
            alt="Our People background"
            className="our-people__bg-image"
          />
        </picture>
      </div>
      {/* Header */}
      <div className="our-people__header">
        <div className="our-people__header-box">
          <div className="our-people__header-content">
            
            <h2 className="our-people__header-title">Our People</h2>
            <p className="our-people__header-subtitle">Transforming our people through</p>
          </div>
          <div className="our-people__header-icon">
            <Image 
              src="/assets/sustainability/peatals.svg" 
              alt="Petals decoration" 
              width={110}
              height={109}
              className="our-people__header-icon-img"
            />
          </div>
        </div>
      </div>

      {/* Initiatives List */}
      <div className="our-people__initiatives">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="our-people__initiative-card">
            {/* Left Box - Goal Content with Small Graph */}
            <div className="our-people__initiative-left-box">
              <div className="our-people__initiative-left-content">
                <h3 className="our-people__initiative-title">{initiative.title}</h3>
                <div className="our-people__initiative-goal">
                  <p className="our-people__initiative-goal-label">Our Goal</p>
                  <p className="our-people__initiative-goal-text">{initiative.goal}</p>
                  {initiative.goalHighlight && (
                    <p className="our-people__initiative-goal-highlight">{initiative.goalHighlight}</p>
                  )}
                  <p className="our-people__initiative-target">Target Year: {initiative.targetYear}</p>
                </div>
              </div>
              {/* Percentage on right side middle of left box (e.g. id 4) */}
              {/* {initiative.showIcon && initiative.percentage && (
                <div className="our-people__initiative-percentage-left">
                  <p className="our-people__initiative-percentage-large">{initiative.percentage}</p>
                </div>
              )} */}
              {/* Small pie chart for status - on right side of left box (not for id 5) */}
              {initiative.showPieChart && !initiative.showHours && initiative.id !== 5 && (
                <div className="our-people__initiative-status-info-left">
                  <InitiativePieProgress
                    progress={initiative.statusPercentage ?? 10}
                    isVisible={isVisible}
                  />
                  {/* <p className="our-people__initiative-status-text">
                    {initiative.status}
                  </p> */}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="our-people__initiative-divider"></div>

            {/* Right Box - Large Graph/Status */}
            <div className="our-people__initiative-right-box">
              {initiative.showHours && (
                <div className="our-people__initiative-hours">
                  <div className="our-people__initiative-hours-circle">
                    <InitiativeHoursCirclePie
                      progress={initiative.hoursPercentage ?? 48}
                      isVisible={isVisible}
                    />
                    <p className="our-people__initiative-hours-value">{initiative.status}</p>
                    {/* <p className="our-people__initiative-hours-label">hours</p> */}
                  </div>
                  <p className="our-people__initiative-status-label">{initiative.statusType} {initiative.percentage}</p>
                </div>
              )}
              {initiative.showPieChart && !initiative.showHours && (
                <div className="our-people__initiative-chart">
                  {/* Large pie chart for goal percentage */}
                  <div className="our-people__initiative-pie-wrapper">
                    <InitiativePieProgressLarge
                      progress={initiative.goalPercentage ?? 10}
                      isVisible={isVisible}
                    />
                    {initiative.percentage && initiative.statusType && initiative.id !== 5 && (
                      <>
                        <p className="our-people__initiative-percentage-status">{initiative.statusType} {initiative.percentage}</p>
                      </>
                    )}
                    {initiative.id === 5 && (
                      <p className="our-people__initiative-status-text">{initiative.statusType}: {initiative.status}</p>
                    )}
                  </div>
                </div>
              )}
              {initiative.showIcon && (
                <div className="our-people__initiative-icon-wrapper">
                  <div className="our-people__initiative-icon"></div>
                  <p className="our-people__initiative-status-text">
                    {initiative.statusType}: {initiative.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

