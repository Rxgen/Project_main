// Test comment
'use client';

import { useState, useEffect, useRef } from 'react';
import '../../scss/components/sustainability/OurPlanet.scss';

// Small Circular Progress Component - For percentage display
function SmallCircularProgress({ progress, size = 47, isVisible = false }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (isVisible) {
      setAnimatedProgress(0);
      
      setTimeout(() => {
        const duration = 2000;
        const startTime = Date.now();
        const targetProgress = progress;
        
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progressRatio = Math.min(elapsed / duration, 1);
          
          const easeOut = 1 - Math.pow(1 - progressRatio, 3);
          const currentProgress = targetProgress * easeOut;
          
          setAnimatedProgress(currentProgress);
          
          if (progressRatio < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setAnimatedProgress(targetProgress);
            animationRef.current = null;
          }
        };
        
        animationRef.current = requestAnimationFrame(animate);
      }, 100);
    } else {
      setAnimatedProgress(0);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, progress]);
  
  const center = size / 2;
  const radius = size / 2;
  const progressAngle = (animatedProgress / 100) * 360;
  
  const startAngle = -90;
  const endAngle = startAngle + progressAngle;
  
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  const x1 = center + radius * Math.cos(startAngleRad);
  const y1 = center + radius * Math.sin(startAngleRad);
  const x2 = center + radius * Math.cos(endAngleRad);
  const y2 = center + radius * Math.sin(endAngleRad);
  
  const largeArcFlag = progressAngle > 180 ? 1 : 0;
  
  let pathData = '';
  if (animatedProgress <= 0) {
    pathData = '';
  } else if (animatedProgress >= 100) {
    pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
  } else {
    pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }
  
  return (
    <div className="small-circular-progress">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="small-circular-progress__svg"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#a0dab5"
          className="small-circular-progress__bg"
        />
        {pathData && (
          <path
            d={pathData}
            fill="#ffffff"
            className="small-circular-progress__fill"
          />
        )}
      </svg>
    </div>
  );
}

// Circular Progress Component - Filled Circle (Pie Chart)
function CircularProgress({ progress, size = 139, isVisible = false }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef(null);
  
  useEffect(() => {
    // Reset animation when visibility changes
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (isVisible) {
      // Reset to 0 first
      setAnimatedProgress(0);
      
      // Small delay to ensure state is reset
      setTimeout(() => {
        // Animate from 0 to target progress
        const duration = 2000; // 2 seconds for smoother animation
        const startTime = Date.now();
        const startProgress = 0;
        const targetProgress = progress;
        
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progressRatio = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progressRatio, 3);
          const currentProgress = startProgress + (targetProgress - startProgress) * easeOut;
          
          setAnimatedProgress(currentProgress);
          
          if (progressRatio < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setAnimatedProgress(targetProgress);
            animationRef.current = null;
          }
        };
        
        animationRef.current = requestAnimationFrame(animate);
      }, 100);
    } else {
      // Reset when not visible
      setAnimatedProgress(0);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, progress]);
  
  const center = size / 2;
  const radius = size / 2;
  const progressAngle = (animatedProgress / 100) * 360;
  
  // Calculate the end point of the arc
  const startAngle = -90; // Start from top
  const endAngle = startAngle + progressAngle;
  
  // Convert angles to radians
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  // Calculate arc coordinates
  const x1 = center + radius * Math.cos(startAngleRad);
  const y1 = center + radius * Math.sin(startAngleRad);
  const x2 = center + radius * Math.cos(endAngleRad);
  const y2 = center + radius * Math.sin(endAngleRad);
  
  // Large arc flag (1 if angle > 180, 0 otherwise)
  const largeArcFlag = progressAngle > 180 ? 1 : 0;
  
  // Create path for the progress arc
  let pathData = '';
  if (animatedProgress <= 0) {
    // No progress - empty path
    pathData = '';
  } else if (animatedProgress >= 100) {
    // Full circle
    pathData = `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
  } else {
    // Partial arc
    pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }
  
  return (
    <div className="circular-progress">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="circular-progress__svg"
      >
        {/* Background circle (light green) - full circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="#a0dab5"
          className="circular-progress__bg"
        />
        {/* Progress arc (white) - filled portion */}
        <path
          d={pathData}
          fill="#ffffff"
          className="circular-progress__fill"
        />
      </svg>
    </div>
  );
}

export default function OurPlanet() {
  const sectionRef = useRef(null);
  const goalsGridRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Observe the goals grid area specifically for better trigger point
    const targetElement = goalsGridRef.current || sectionRef.current;
    if (!targetElement) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px 0px 0px' // No margin offset
      }
    );
    
    observer.observe(targetElement);
    
    return () => {
      observer.disconnect();
    };
  }, [isVisible]);
  
  const goals = [
    {
      id: 'climate',
      title: 'Climate Change',
      goal: '42% reduction in Scope 1 & 2 emissions from FY23',
      targetYear: 'Target Year: 2030',
      status: 'Status: 26%',
      percentage: '41%',
      progress: 62
    },
    {
      id: 'waste',
      title: 'Waste Management',
      goal: 'Ensure over 90% of our hazardous waste is managed sustainably',
      targetYear: 'Target Year: Year over Year',
      status: 'Status: 92%',
      percentage: '90%',
      progress: 100
    },
    {
      id: 'water',
      title: 'Water Management',
      goal: '10% reduction in absolute water withdrawal from FY21',
      targetYear: 'Target Year: 2030',
      status: 'Status: 7%',
      percentage: '10%',
      progress: 70
    },
    {
      id: 'biodiversity',
      title: 'Biodiversity',
      goal: '100% global sites to be covered by biodiversity assessment',
      targetYear: 'Target Year: 2030',
      status: 'Status: 40%',
      percentage: '100%',
      progress: 40
    }
  ];

  return (
    <section className="our-planet" data-node-id="2939:6076" ref={sectionRef}>
      {/* Background Image with Picture Tag */}
      <div className="our-planet__bg">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="/assets/sustainability/bg2-mobile.png" 
          />
          <img
            src="/assets/sustainability/bg2.png"
            alt="Our Planet background"
            className="our-planet__bg-image"
          />
        </picture>
      </div>
      {/* ESG Framework Banner */}
      <div className="our-planet__esg-banner" data-node-id="2939:6031">
        <div className="our-planet__esg-content" data-node-id="2939:6029">
          <h2 className="our-planet__esg-title" data-node-id="2939:3008">ESG Framework</h2>
          <div className="our-planet__esg-description" data-node-id="2939:3007">
            <p>Guided by our purpose of catalyzing treatments</p>
            <p>that transform hope into healing, our sustainability strategy aims to pave a</p>
            <p>sustainable future for Planet, People, and Patients</p>
          </div>
        </div>
      </div>

      {/* ESG Cards - Our Planet, Our People, Our Patients */}
      <div className="our-planet__esg-cards" data-node-id="2939:esg-cards">
        <div className="our-planet__esg-card our-planet__esg-card--planet">
          <div className="our-planet__esg-card-bg our-planet__esg-card-bg--default" aria-hidden="true">
            <img src="/assets/sustainability/planet.svg" alt="" />
          </div>
          <div className="our-planet__esg-card-bg our-planet__esg-card-bg--hover" aria-hidden="true">
            <img src="/assets/sustainability/planet.svg" alt="" />
          </div>
          <div className="our-planet__esg-card-content">
            <h3 className="our-planet__esg-card-title">Our Planet</h3>
            <p className="our-planet__esg-card-subtitle">Catalyzing Planet in Action</p>
            <ul className="our-planet__esg-card-list">
              <li>Climate Change</li>
              <li>Water Management</li>
              <li>Waste Management</li>
              <li>Biodiversity</li>
            </ul>
          </div>
        </div>
        <div className="our-planet__esg-card our-planet__esg-card--people">
          <div className="our-planet__esg-card-bg our-planet__esg-card-bg--default" aria-hidden="true">
            <img src="/assets/sustainability/people.svg" alt="" />
          </div>
          <div className="our-planet__esg-card-bg our-planet__esg-card-bg--hover" aria-hidden="true">
            <img src="/assets/sustainability/people.svg" alt="" />
          </div>
          <div className="our-planet__esg-card-content">
            <h3 className="our-planet__esg-card-title">Our People</h3>
            <p className="our-planet__esg-card-subtitle">Transforming Our People</p>
            <ul className="our-planet__esg-card-list">
              <li>Diversity and Inclusion</li>
              <li>Employee Volunteering</li>
              <li>Employee Well-Being and Safety</li>
              <li>Supplier Sustainability</li>
            </ul>
          </div>
        </div>
        <div className="our-planet__esg-card our-planet__esg-card--patients">
          <div className="our-planet__esg-card-bg our-planet__esg-card-bg--default" aria-hidden="true">
            <img src="/assets/sustainability/patients.svg" alt="" />
          </div>
          <div className="our-planet__esg-card-bg our-planet__esg-card-bg--hover" aria-hidden="true">
            <img src="/assets/sustainability/patients.svg" alt="" />
          </div>
          <div className="our-planet__esg-card-content">
            <h3 className="our-planet__esg-card-title">Our Patients</h3>
            <p className="our-planet__esg-card-subtitle">Healing Patients</p>
            <ul className="our-planet__esg-card-list">
              <li>Product Launches and Quality</li>
              <li>Patient Assistance Program</li>
              <li>Education and Awareness</li>
              <li>Diagnosis and Rehabilitation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Our Planet Circle and Goals */}
      <div className="our-planet__main">
        <div id="esg-goals-progress" className="our-planet__circle-section" data-node-id="2939:6068">
          <div className="our-planet__circle" data-node-id="2939:6038">
            <div className="our-planet__circle-content" data-node-id="2939:6037">
              <h3 className="our-planet__circle-title" data-node-id="2939:3084">Our Planet</h3>
              <p className="our-planet__circle-subtitle" data-node-id="2939:3083">Catalyzing planet action by addressing</p>
            </div>
          </div>
        </div>
        <div className="our-planet__circle-border-line" aria-hidden="true" />

        <div className="our-planet__goals-grid" data-node-id="2939:6070" ref={goalsGridRef}>
          {goals.map((goal) => (
            <div key={goal.id} className="our-planet__goal-card" data-node-id={`2939:${goal.id === 'climate' ? '6046' : goal.id === 'waste' ? '6053' : goal.id === 'water' ? '6060' : '6066'}`}>
              <div className="our-planet__goal-header" data-node-id={`2939:${goal.id === 'climate' ? '6045' : goal.id === 'waste' ? '6052' : goal.id === 'water' ? '6059' : '6065'}`}>
                <h4 className="our-planet__goal-title">{goal.title}</h4>
              </div>
              
              <div className="our-planet__goal-content" data-node-id={`2939:${goal.id === 'climate' ? '6044' : goal.id === 'waste' ? '6051' : goal.id === 'water' ? '6058' : '6064'}`}>
                <div className="our-planet__goal-text" data-node-id={`2939:${goal.id === 'climate' ? '6040' : goal.id === 'waste' ? '6047' : goal.id === 'water' ? '6054' : '6061'}`}>
                  <p className="our-planet__goal-label">Our Goal</p>
                  <p className="our-planet__goal-description">{goal.goal}</p>
                  {/* <div className="our-planet__goal-percentage">
                    <SmallCircularProgress 
                      progress={parseInt(goal.percentage.replace('%', ''))} 
                      size={47} 
                      isVisible={isVisible} 
                    />
                    <div className="our-planet__goal-percentage-divider"></div>
                    <span className="our-planet__goal-percentage-value">{goal.percentage}</span>
                  </div> */}
                  <p className="our-planet__goal-target">{goal.targetYear}</p>
                </div>
                
                <div className="our-planet__goal-divider"></div>
                
                <div className="our-planet__goal-status" data-node-id={`2939:${goal.id === 'climate' ? '6042' : goal.id === 'waste' ? '6049' : goal.id === 'water' ? '6057' : '6063'}`}>
                  <div className="our-planet__goal-status-circle">
                    <CircularProgress progress={goal.progress} size={139} isVisible={isVisible} />
                  </div>
                  <p className="our-planet__goal-status-text">{goal.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

