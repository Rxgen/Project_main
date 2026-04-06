'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '../scss/components/Overview.scss';

export default function Overview({ data }) {
  const [hoveredStat, setHoveredStat] = useState(0); // Default to index 0 (15+ Global Facilities)
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const autoCycleIntervalRef = useRef(null);
  const isUserHoveringRef = useRef(false);

  // NO FALLBACK - data must come from Strapi API
  if (!data) {
    throw new Error('Overview component requires data prop from Strapi API');
  }

  const overviewData = data;

  // Animated counting effect
  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate each number
            overviewData.stats.forEach((stat, index) => {
              const targetNumber = parseInt(stat.number.replace(/,/g, ''));
              const duration = 2000; // 2 seconds
              const steps = 60;
              const increment = targetNumber / steps;
              const stepDuration = duration / steps;
              
              let currentStep = 0;
              
              const timer = setInterval(() => {
                currentStep++;
                const currentValue = Math.min(
                  Math.floor(increment * currentStep),
                  targetNumber
                );
                
                setAnimatedNumbers((prev) => {
                  const newNumbers = [...prev];
                  newNumbers[index] = currentValue;
                  return newNumbers;
                });
                
                if (currentStep >= steps) {
                  clearInterval(timer);
                }
              }, stepDuration);
            });
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    observer.observe(sectionElement);

    return () => {
      observer.unobserve(sectionElement);
    };
  }, [hasAnimated, overviewData.stats]);

  // Auto-cycle through stats 0 -> 1 -> 3 -> 2 -> 0 -> ...
  // Order: Facilities (0) -> Employees (1) -> Products (3) -> Countries (2) -> Facilities (0) -> ...
  useEffect(() => {
    // Only start auto-cycling after the section is visible and numbers have animated
    if (!hasAnimated) return;

    const cycleStats = () => {
      if (isUserHoveringRef.current) return; // Pause if user is hovering

      setHoveredStat((prev) => {
        // Explicit cycle: 0 -> 1 -> 3 -> 2 -> 0
        if (prev === 0) return 1; // Facilities -> Employees
        if (prev === 1) return 3; // Employees -> Products
        if (prev === 3) return 2; // Products -> Countries
        if (prev === 2) return 0; // Countries -> Facilities
        return 0; // Default fallback
      });
    };

    // Start cycling after a short delay
    const startDelay = setTimeout(() => {
      autoCycleIntervalRef.current = setInterval(cycleStats, 2500); // Change stat every 2.5 seconds
    }, 1000); // Wait 1 second before starting

    return () => {
      clearTimeout(startDelay);
      if (autoCycleIntervalRef.current) {
        clearInterval(autoCycleIntervalRef.current);
      }
    };
  }, [hasAnimated]);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <section className="overview" ref={sectionRef}>
      {/* Background with Gradients */}
      <div className="overview__bg">
        <div className="overview__bg-gradient"></div>
        <div className="overview__bg-overlay"></div>
      </div>

      {/* Container */}
      <div className="overview__container">
        {/* Headline */}
        <div className="overview__headline">
          <h2 className="overview__eyebrow">{overviewData.eyebrow}</h2>
          <div className="overview__heading">
            {overviewData.heading.map((line, index) => (
              <span key={index} className="overview__heading-line">
                {line}
                {index < overviewData.heading.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="overview__stats-wrapper">
          {/* Decorative Petals - Interactive */}
          <div className="overview__petals">
            <svg 
              className="overview__petals-svg"
              viewBox="0 0 465.129 476.546" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_61_699)">
                {/* Stat 0 (15+ Global Facilities) */}
                <path 
                  id="petal-top-facilities"
                  className={`overview__petal-path ${hoveredStat === 0 ? 'overview__petal-path--active' : ''}`}
                  d="M231.224 0.467858C256.151 0.467925 277.247 5.77154 292.465 16.2823C307.486 26.6618 315.003 40.7824 315.003 58.7325C315.003 70.097 311.794 82.6096 305.335 96.4659C299.008 110.046 277.563 148.497 240.591 211.881V211.882C239.318 214.072 237.035 215.484 234.522 215.658L234.513 215.649L234.307 215.659C231.504 215.781 228.868 214.363 227.428 211.959V211.958L176.468 127.287L176.467 127.286L174.924 124.72C159.232 98.3603 151.384 76.8021 151.384 60.0489C151.384 41.6719 158.503 27.1733 172.691 16.4708L172.692 16.4698C186.74 5.8404 206.3 0.467858 231.224 0.467858Z" 
                  stroke="white" 
                  strokeWidth="0.936183"
                />
                    {/*  - Stat 1 (24000+ Employees) */}
                    <path 
                  id="petal-top-right-employees"
                  className={`overview__petal-path ${hoveredStat === 1 ? 'overview__petal-path--active' : ''}`}
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M243.852 226.874C245.099 229.014 247.38 230.354 249.861 230.389C320.433 231.565 393.298 231.459 407.349 230.319C421.624 229.166 433.241 225.839 442.377 220.277C456.769 211.529 464.376 198.031 465.082 179.865C465.787 161.557 459.685 141.31 446.739 119.146C434.205 97.6046 421.377 87.2692 405.727 80.2613C389.912 73.1359 374.65 74.0413 359.917 83.048C320.68 106.917 277.175 179.183 244.499 218.819C242.618 221.1 242.359 224.322 243.852 226.885V226.874Z" 
                  stroke="white" 
                  strokeWidth="0.936183"
                />
                
            

                {/* Stat 2 (1000+ Products) */}
                <path 
                  id="petal-bottom-products"
                  className={`overview__petal-path ${hoveredStat === 2 ? 'overview__petal-path--active' : ''}`}
                  d="M233.793 260.688H233.987C236.632 260.688 239.087 262.093 240.414 264.382V264.383C277.492 327.955 298.997 366.5 305.335 380.104C311.794 393.96 315.003 406.473 315.003 417.838C315.003 435.729 307.485 449.896 292.465 460.275C277.247 470.786 256.151 476.09 231.224 476.09C206.3 476.09 186.74 470.717 172.692 460.088L172.691 460.087C158.503 449.385 151.384 434.839 151.384 416.509C151.384 399.204 159.747 376.802 176.467 349.272L176.468 349.271L227.602 264.282L227.603 264.283C228.921 262.102 231.248 260.744 233.784 260.679L233.793 260.688Z" 
                  stroke="white" 
                  strokeWidth="0.936183"
                />
                

                    {/* Stat 3 (100+ Countries) */}
                    <path 
                  id=""
                  className={`overview__petal-path ${hoveredStat === 3 ? 'overview__petal-path--active' : ''}`}
                  d="M251.091 245.332C319.103 244.216 388.868 244.281 405.836 245.31L407.312 245.412C421.537 246.572 433.089 249.875 442.133 255.387L442.134 255.388C456.391 264.047 463.914 277.383 464.614 295.418C465.315 313.608 459.241 333.767 446.335 355.883V355.884C433.836 377.345 421.091 387.599 405.535 394.576L405.534 394.577C389.859 401.651 374.761 400.743 360.161 391.818L360.16 391.817C340.779 380.028 320.312 356.349 300.587 330.577C280.895 304.85 261.929 277.014 245.638 257.102L245.637 257.101L245.487 256.912C243.979 254.948 243.59 252.33 244.463 250L244.467 250.001C245.472 247.317 247.97 245.492 250.814 245.341L251.091 245.332Z" 
                  stroke="white" 
                  strokeWidth="0.936183"
                />
              
           
                
            
                
               
                <path 
                  id=""
                  className={`overview__petal-path ${hoveredStat === 4 ? 'overview__petal-path--active' : ''}`}
                  d="M57.876 245.4C71.8515 244.262 144.195 244.156 214.555 245.32C217.158 245.363 219.514 246.863 220.671 249.191L220.779 249.419C221.836 251.756 221.517 254.486 219.964 256.518L219.81 256.713C203.5 276.591 184.487 304.501 164.737 330.325C144.955 356.192 124.42 379.986 104.981 391.816L104.979 391.817C90.4264 400.742 75.3166 401.651 59.6417 394.577L59.6407 394.576L58.1915 393.913C43.5396 387.07 31.348 377.005 19.4044 356.881L18.8174 355.883C5.88791 333.766 -0.174523 313.608 0.526428 295.418C1.22644 277.383 8.74913 264.047 23.0186 255.376L23.0196 255.375C32.0633 249.863 43.615 246.561 57.876 245.4Z" 
                  stroke="white" 
                  strokeWidth="0.936183"
                />
                
                {/* Top-left petal - Stat 0 (15+ Global Facilities) */}
                <path 
                  id=""
                  className={`overview__petal-path ${hoveredStat === 5 ? 'overview__petal-path--active' : ''}`}
                  d="M59.6299 80.688C75.3051 73.6255 90.415 74.5224 104.967 83.4468L104.969 83.4478C124.35 95.2367 144.82 118.92 164.548 144.694C184.242 170.424 203.212 198.263 219.503 218.175H219.504C221.396 220.485 221.652 223.718 220.19 226.297L220.044 226.533C218.833 228.478 216.768 229.726 214.494 229.911L214.037 229.933C143.842 231.086 71.8048 230.979 57.8643 229.852C43.6037 228.704 32.0519 225.39 23.0079 219.877H23.0069C8.74916 211.218 1.22638 197.882 0.526428 179.846C-0.152524 162.225 5.5154 142.756 17.6143 121.45L18.8057 119.381C31.3287 97.9202 44.0844 87.6655 59.629 80.688H59.6299Z" 
                  stroke="white" 
                  strokeWidth="0.936183"
                />
              </g>
              <defs>
                <clipPath id="clip0_61_699">
                  <rect width="465.129" height="476.546" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Stats Grid */}
          <div className="overview__stats">
            {/* Column 1 */}
            <div className="overview__stats-col overview__stats-col--1">
              <div 
                className={`overview__stat overview__stat--0 ${hoveredStat === 0 ? '' : 'overview__stat--dim'}`}
                onMouseEnter={() => {
                  isUserHoveringRef.current = true;
                  setHoveredStat(0);
                }}
                onMouseLeave={() => {
                  isUserHoveringRef.current = false;
                }}
              >
                <div className="overview__stat-number">
                  <span className="overview__stat-value">{formatNumber(animatedNumbers[0])}</span>
                  <span className="overview__stat-suffix">{overviewData.stats[0].suffix}</span>
                </div>
                <div className="overview__stat-label-wrapper">
                  <p className="overview__stat-label">{overviewData.stats[0].label}</p>
                  <Link href="/about-us/our-manufacturing-sites" className="overview__stat-cta 1">
                    {overviewData.stats[0].cta?.text || 'Know More'}
                  </Link>
                </div>
              </div>

              <div 
                className={`overview__stat overview__stat--2 ${hoveredStat === 2 ? '' : 'overview__stat--dim'}`}
                onMouseEnter={() => {
                  isUserHoveringRef.current = true;
                  setHoveredStat(2);
                }}
                onMouseLeave={() => {
                  isUserHoveringRef.current = false;
                }}
              >
                <div className="overview__stat-number">
                  <span className="overview__stat-value">{formatNumber(animatedNumbers[3])}</span>
                  <span className="overview__stat-suffix">{overviewData.stats[3].suffix}</span>
                </div>
                <div className="overview__stat-label-wrapper">
                  <p className="overview__stat-label">{overviewData.stats[3].label}</p>
                  <Link href="/about-us/global-presence" className="overview__stat-cta">
                    {overviewData.stats[3].cta?.text || 'Know More'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="overview__stats-col overview__stats-col--2">
              <div 
                className={`overview__stat overview__stat--1 ${hoveredStat === 1 ? '' : 'overview__stat--dim'}`}
                onMouseEnter={() => {
                  isUserHoveringRef.current = true;
                  setHoveredStat(1);
                }}
                onMouseLeave={() => {
                  isUserHoveringRef.current = false;
                }}
              >
                <div className="overview__stat-number">
                  <span className="overview__stat-value">{formatNumber(animatedNumbers[1])}</span>
                  <span className="overview__stat-suffix">{overviewData.stats[1].suffix}</span>
                </div>
                <div className="overview__stat-label-wrapper">
                  <p className="overview__stat-label">{overviewData.stats[1].label}</p>
                  <Link href="https://careers.lupin.com/" className="overview__stat-cta" target="_blank">
                    {overviewData.stats[1].cta?.text || 'Know More'}
                  </Link>
                </div>
              </div>

              <div 
                className={`overview__stat overview__stat--3 ${hoveredStat === 3 ? '' : 'overview__stat--dim'}`}
                onMouseEnter={() => {
                  isUserHoveringRef.current = true;
                  setHoveredStat(3);
                }}
                onMouseLeave={() => {
                  isUserHoveringRef.current = false;
                }}
              >
                <div className="overview__stat-number">
                  <span className="overview__stat-value">{formatNumber(animatedNumbers[2])}</span>
                  <span className="overview__stat-suffix">{overviewData.stats[2].suffix}</span>
                </div>
                <div className="overview__stat-label-wrapper">
                  <p className="overview__stat-label">{overviewData.stats[2].label}</p>
                  <Link href="/product-finder" className="overview__stat-cta">
                    {overviewData.stats[2].cta?.text || 'Know More'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

