'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/ContactUsLocationSlider.scss';

export default function ContactUsLocationSlider({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const labelsTopRef = useRef(null);
  const labelRefs = useRef([]);

  // Default data structure
  const sliderData = data || {
    locations: [
      {
        id: 'india',
        name: 'INDIA',
        label: 'India',
        image: '/assets/images/contact/india.png',
        addresses: [
          {
            title: 'Corporate Office',
            address: [
              'Lupin Limited, 3rd Floor, Kalpataru Inspire,',
              'Off. Western Expressway Highway,',
              'Santacruz (East), Mumbai, India. 400 055',
              'Phone: +91 22 6640 2323 Email: info@lupin.com'
            ]
          },
          {
            title: 'Registered Office',
            address: [
              'Lupin Limited, 3rd Floor, Kalpataru Inspire,',
              'Off. Western Expressway Highway,',
              'Santacruz (East), Mumbai, India. 400 055',
              'Phone: +91 22 6640 2323 Email: info@lupin.com'
            ]
          },
          {
            title: 'Corporate Identity Number (CIN):',
            address: ['L24100MH1983PLC029442']
          },
          {
            title: 'DRUG SAFETY CONTACT INFORMATION:',
            address: [
              'Patients and other consumers should contact their physician with questions about prescription products and their indications. To obtain medical information or to report an adverse event or product complaint, please call on the toll-free numbers 1800-209-2505 / 1800-266-7400 or email us at dsrm@lupin.com'
            ]
          }
        ]
      },
      {
        id: 'us',
        name: 'U.S.',
        label: 'U.S.',
        image: '/assets/images/contact/india.png', // Placeholder - use actual US image when available
        addresses: [
          {
            title: 'Head Office',
            address: [
              'Lupin Pharmaceuticals Inc.',
              '3 Parkway North, Suite 400',
              'Deerfield, IL 60015, USA',
              'Phone: +1 847-948-3300 Email: info@lupin.com'
            ]
          }
        ]
      },
      {
        id: 'latam',
        name: 'LATAM',
        label: 'LATAM',
        image: '/assets/images/contact/india.png', // Placeholder
        addresses: [
          {
            title: 'Regional Office',
            address: [
              'Lupin Latin America',
              'Address details to be added',
              'Phone: Email:'
            ]
          }
        ]
      },
      {
        id: 'apac',
        name: 'APAC',
        label: 'APAC',
        image: '/assets/images/contact/india.png', // Placeholder
        addresses: [
          {
            title: 'Regional Office',
            address: [
              'Lupin Asia Pacific',
              'Address details to be added',
              'Phone: Email:'
            ]
          }
        ]
      },
      {
        id: 'emea',
        name: 'EMEA',
        label: 'EMEA',
        image: '/assets/images/contact/india.png', // Placeholder
        addresses: [
          {
            title: 'Regional Office',
            address: [
              'Lupin Europe, Middle East & Africa',
              'Address details to be added',
              'Phone: Email:'
            ]
          }
        ]
      }
    ]
  };

  const locations = sliderData.locations;
  const currentLocation = locations[currentIndex];

  // Auto-slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
    }, 5000); // Change every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [locations.length]);

  const handleLocationClick = (index) => {
    setCurrentIndex(index);
    // Reset auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
    }, 5000);
  };

  // Scroll to active label - first position on mobile
  useEffect(() => {
    if (!labelsTopRef.current || !labelRefs.current[currentIndex]) {
      return;
    }
    
    const activeLabel = labelRefs.current[currentIndex];
    const scrollContainer = labelsTopRef.current; // This is the element with overflow-x: auto
    
    // Check if device is mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    const scrollToLabel = () => {
      try {
        // Get the label's position relative to the scroll container
        const labelRect = activeLabel.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        let targetScroll;
        
        if (isMobile) {
          // On mobile: position label at the start (first position)
          // Calculate scroll position to bring label to the left edge
          targetScroll = scrollContainer.scrollLeft + (labelRect.left - containerRect.left);
        } else {
          // On desktop: center the label
          const labelLeft = activeLabel.offsetLeft;
          const labelWidth = activeLabel.offsetWidth;
          const containerWidth = scrollContainer.offsetWidth;
          targetScroll = labelLeft - (containerWidth / 2) + (labelWidth / 2);
        }
        
        // Ensure targetScroll is not negative
        targetScroll = Math.max(0, targetScroll);
        
        // Scroll to position
        if (scrollContainer.scrollTo) {
          scrollContainer.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        } else {
          // Fallback
          scrollContainer.scrollLeft = targetScroll;
        }
      } catch (error) {
        console.error('Error scrolling to label:', error);
      }
    };
    
    // Use multiple attempts to ensure scrolling works on mobile
    setTimeout(scrollToLabel, 100);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToLabel();
      });
    });
  }, [currentIndex]);

  return (
    <section className="contact-us-location-slider" data-node-id="2947:6310">
      <div className="contact-us-location-slider__container">
        {/* Background Image (Flipped) */}
        <div className="contact-us-location-slider__bg-image">
          <Image
            src="/assets/images/product-finder/bg.png"
            alt="Background"
            fill
            className="contact-us-location-slider__bg-img"
            quality={100}
          />
        </div>

        {/* Content */}
        <div className="contact-us-location-slider__content">
          <p className="contact-us-location-slider__find-us">Find Us</p>
          {/* Country Labels - Top Horizontal Scroll */}
          <div 
            ref={labelsTopRef}
            className="contact-us-location-slider__labels-top" 
            data-node-id="2947:6391"
          >
            <div className="contact-us-location-slider__labels-scroll">
              {locations.map((location, index) => {
                const isActive = index === currentIndex;
                
                return (
                  <button
                    key={location.id}
                    ref={(el) => (labelRefs.current[index] = el)}
                    type="button"
                    className={`contact-us-location-slider__label-top ${isActive ? 'contact-us-location-slider__label-top--active' : ''}`}
                    onClick={() => handleLocationClick(index)}
                    data-node-id={`2947:${6392 + index}`}
                  >
                    <span className="contact-us-location-slider__label-text" data-node-id={`2947:${6393 + index * 2}`}>
                      {location.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Side - Map with Country Labels */}
          <div className="contact-us-location-slider__left" data-node-id="2947:6319">
            <div className="contact-us-location-slider__map-wrapper" data-node-id="2947:6320">
              {/* Central Image */}
              <div className="contact-us-location-slider__central-image" data-node-id="2947:6321">
                <div className="contact-us-location-slider__image-mask">
                  <Image
                    src={currentLocation.image}
                    alt={currentLocation.name}
                    fill
                    className="contact-us-location-slider__image"
                    quality={100}
                  />
                </div>
                {/* Border SVG - Left Half */}
                <div className="contact-us-location-slider__border">
                  <Image
                    src="/assets/images/contact/border.svg"
                    alt="Border"
                    fill
                    className="contact-us-location-slider__border-img"
                    quality={100}
                  />
                </div>
              </div>

              {/* Country Labels with Pointers - Desktop Only */}
              <div className="contact-us-location-slider__labels" data-node-id="2947:6391">
                {locations.map((location, index) => {
                  const isActive = index === currentIndex;
                  const labelClasses = [
                    'contact-us-location-slider__label--us', // U.S.
                    'contact-us-location-slider__label--india', // India
                    'contact-us-location-slider__label--latam', // LATAM
                    'contact-us-location-slider__label--apac', // APAC
                    'contact-us-location-slider__label--emea' // EMEA
                  ];
                  
                  return (
                    <div
                      key={location.id}
                      className={`contact-us-location-slider__label ${labelClasses[index]} ${isActive ? 'contact-us-location-slider__label--active' : ''}`}
                      onClick={() => handleLocationClick(index)}
                      data-node-id={`2947:${6392 + index}`}
                    >
                      <span className="contact-us-location-slider__label-text" data-node-id={`2947:${6393 + index * 2}`}>
                        {location.label}
                      </span>
                      {/* Pointer SVG */}
                      {isActive && (
                        <div className="contact-us-location-slider__pointer">
                         
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Address Information */}
          <div className="contact-us-location-slider__right" data-node-id="2947:6404">
            <h2 className="contact-us-location-slider__country-name" data-node-id="2947:6405">
              {currentLocation.name}
            </h2>
            
            <div className="contact-us-location-slider__addresses" data-node-id="2947:6406">
              {currentLocation.addressDetail ? (
                <div className="contact-us-location-slider__address-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {currentLocation.addressDetail}
                  </ReactMarkdown>
                </div>
              ) : currentLocation.addresses ? (
                currentLocation.addresses.map((addressItem, index) => (
                  <div key={index} className="contact-us-location-slider__address-item" data-node-id={`2947:${6407 + index * 3}`}>
                    <h3 className="contact-us-location-slider__address-title" data-node-id={`2947:${6408 + index * 3}`}>
                      {addressItem.title}
                    </h3>
                    <div className="contact-us-location-slider__address-content" data-node-id={`2947:${6409 + index * 3}`}>
                      {addressItem.address.map((line, lineIndex) => {
                        // Check if line contains email or phone
                        const hasEmail = line.includes('@');
                        const hasPhone = line.includes('Phone:');
                        
                        if (hasEmail || hasPhone) {
                          // Split line to handle email links
                          const parts = line.split(/(info@lupin\.com|dsrm@lupin\.com)/);
                          return (
                            <p key={lineIndex} className="contact-us-location-slider__address-line">
                              {parts.map((part, partIndex) => {
                                if (part.includes('@')) {
                                  return (
                                    <a
                                      key={partIndex}
                                      href={`mailto:${part}`}
                                      className="contact-us-location-slider__email-link"
                                    >
                                      {part}
                                    </a>
                                  );
                                }
                                return <span key={partIndex}>{part}</span>;
                              })}
                            </p>
                          );
                        }
                        
                        return (
                          <p key={lineIndex} className="contact-us-location-slider__address-line">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

