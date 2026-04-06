'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '@/scss/components/sustainability/OurPatients.scss';

// Circular progress (pie fill animation) - like OurPeople / OurPlanet
function PatientsPieProgress({ progress, isVisible }) {
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

  const size = 144;
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
    <div className="our-patients__initiative-pie">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="our-patients__initiative-pie__svg">
        <circle cx={center} cy={center} r={radius} fill="rgba(255, 255, 255, 0.3)" className="our-patients__initiative-pie__bg" />
        {pathData && <path d={pathData} fill="#ffffff" className="our-patients__initiative-pie__fill" />}
      </svg>
    </div>
  );
}

export default function OurPatients() {
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
      title: "Product Launches",
      goal: "20 launches + 3 filings",
      targetYear: "2028",
      status: "8",
      statusDetails: "( 7 launches + 1 filing )",
      showChart: true
    },
    {
      id: 2,
      title: "Patient Assistance Programs",
      goal: "Benefitting 300,000 patients",
      targetYear: "2030",
      status: "100,000+",
      statusPercentage: 33,
      showPieChart: true
    },
    {
      id: 3,
      title: "Education and Awareness Initiatives",
      goal: "3 Mn patients",
      goalSecondary: "50,000 Healthcare professionals",
      targetYear: "2030",
      status: "140,000+",
      statusLabel: "Patients",
      statusSecondary: "38,000+",
      statusSecondaryLabel: "Healthcare professionals",
      showIcons: true,
      iconType: "education"
    },
    {
      id: 4,
      title: "Early Diagnosis and Rehabilitation",
      goal: "Diagnose 2 Mn+ patients for lung disease", 
      goalSecondary: "5,000 women for breast cancer",
      targetYear: "2030",
      status: "990,000+",
      statusLabel: "lung disease",
      statusSecondary: "2,400+",
      statusSecondaryLabel: "women",
      showIcons: true,
      iconType: "diagnosis"
    }
  ];

  return (
    <section className="our-patients" ref={sectionRef}>
      {/* Background Image with Picture Tag */}
      <div className="our-patients__bg">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="/assets/sustainability/bg4.png" 
          />
          <img
            src="/assets/sustainability/bg4.png"
            alt="Our Patients background"
            className="our-patients__bg-image"
          />
        </picture>
      </div>
      {/* Header */}
      <div className="our-patients__header">
        <div className="our-patients__header-box">
          <div className="our-patients__header-content">
            
            <h2 className="our-patients__header-title">Our Patients</h2>
            <p className="our-patients__header-subtitle">Healing patients through</p>
          </div>
          <div className="our-patients__header-icon">
            <Image 
              src="/assets/sustainability/peatals.svg" 
              alt="Petals decoration" 
              width={110}
              height={109}
              className="our-patients__header-icon-img"
            />
          </div>
        </div>
      </div>

      {/* Initiatives List */}
      <div className="our-patients__initiatives">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="our-patients__initiative-card">
            {/* Left Box - Goal Content */}
            <div className="our-patients__initiative-left-box">
              <div className="our-patients__initiative-left-content">
                <h3 className="our-patients__initiative-title">{initiative.title}</h3>
                <div className="our-patients__initiative-goal">
                  <p className="our-patients__initiative-goal-label">Our Goal</p>
                  <p className="our-patients__initiative-goal-text">{initiative.goal}</p>
                  {initiative.goalSecondary && (
                    <p className="our-patients__initiative-goal-text">{initiative.goalSecondary}</p>
                  )}
                  <p className="our-patients__initiative-target">Target Year: {initiative.targetYear}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="our-patients__initiative-divider"></div>

            {/* Right Box - Status/Graph */}
            <div className="our-patients__initiative-right-box">
              {initiative.showChart && (
                <div className="our-patients__initiative-chart-wrapper">
                  <p className="our-patients__initiative-status-label">Status</p>
                  <div className="our-patients__initiative-chart-content">
                    <p className="our-patients__initiative-status-value">{initiative.status}</p>
                    <div className="our-patients__initiative-chart-icon">
                      <Image 
                        src="/assets/sustainability/icon1.svg" 
                        alt="Chart icon" 
                        width={50}
                        height={50}
                        className="our-patients__chart-icon-img"
                      />
                    </div>
                  </div>
                  {initiative.statusDetails && (
                    <p className="our-patients__initiative-status-details">{initiative.statusDetails}</p>
                  )}
                </div>
              )}
              {initiative.showPieChart && (
                <div className="our-patients__initiative-pie-wrapper">
                  <p className="our-patients__initiative-status-label">Status</p>
                  <div className="our-patients__initiative-pie-content">
                    <p className="our-patients__initiative-status-value">{initiative.status}</p>
                    <PatientsPieProgress
                      progress={initiative.statusPercentage ?? 33}
                      isVisible={isVisible}
                    />
                  </div>
                </div>
              )}
              {initiative.showIcons && (
                <div className="our-patients__initiative-icons-wrapper">
                  <p className="our-patients__initiative-status-label">Status</p>
                  <div className="our-patients__initiative-icons-content">
                    <div className="our-patients__initiative-icon-item">
                      <p className="our-patients__initiative-status-value">{initiative.status}</p>
                      {initiative.statusLabel && (
                        <p className="our-patients__initiative-status-label-text">{initiative.statusLabel}</p>
                      )}
                      <div className={`our-patients__initiative-icon our-patients__initiative-icon--${initiative.iconType}-1`}>
                        {initiative.iconType === 'education' ? (
                          <Image 
                            src="/assets/sustainability/icon2.svg" 
                            alt="Heart icon" 
                            width={50}
                            height={50}
                            className="our-patients__icon-img"
                          />
                        ) : (
                          <Image 
                            src="/assets/sustainability/icon4.svg" 
                            alt="Lungs icon" 
                            width={50}
                            height={50}
                            className="our-patients__icon-img"
                          />
                        )}
                      </div>
                    </div>
                    {initiative.statusSecondary && (
                      <div className="our-patients__initiative-icon-item">
                        <p className="our-patients__initiative-status-value">{initiative.statusSecondary}</p>
                        {initiative.statusSecondaryLabel && (
                          <p className="our-patients__initiative-status-label-text">{initiative.statusSecondaryLabel}</p>
                        )}
                        <div className={`our-patients__initiative-icon our-patients__initiative-icon--${initiative.iconType}-2`}>
                          {initiative.iconType === 'education' ? (
                            <Image 
                              src="/assets/sustainability/icon3.svg" 
                              alt="Hand icon" 
                              width={50}
                              height={50}
                              className="our-patients__icon-img"
                            />
                          ) : (
                            <Image 
                              src="/assets/sustainability/icon5.svg" 
                              alt="Female symbol icon" 
                              width={50}
                              height={50}
                              className="our-patients__icon-img"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

