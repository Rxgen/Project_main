'use client';

import { useEffect, useRef } from 'react';

/**
 * WaveAnimation Component
 * 
 * Animates SVG path elements by deforming them into wave shapes.
 * Original path data is preserved and restored on cleanup.
 * 
 * @param {Object} props
 * @param {string|HTMLElement} props.target - CSS selector string or SVG element reference
 * @param {number} props.speed - Animation speed multiplier (default: 1)
 * @param {number} props.amplitude - Wave amplitude in pixels (default: 3)
 * @param {string} props.pathSelector - CSS selector for paths within SVG (default: 'path')
 * @param {number} props.waveLength - Wavelength for wave effect (default: 200)
 */
export default function WaveAnimation({ 
  target, 
  speed = 1, 
  amplitude = 25,
  pathSelector = 'path',
  waveLength = 300
}) {
  const animationFrameRef = useRef(null);
  const pathsRef = useRef([]);
  const timeRef = useRef(0);
  const pathConfigsRef = useRef([]);

  // Helper function to get point at length along path
  function getPointAtLength(path, length) {
    try {
      return path.getPointAtLength(length);
    } catch (e) {
      return null;
    }
  }

  // Helper function to create smooth path from points
  function createSmoothPath(points) {
    if (points.length < 2) return '';
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    
    let pathData = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === 1) {
        // First segment - use quadratic
        const cpX = prev.x + (curr.x - prev.x) * 0.5;
        const cpY = prev.y + (curr.y - prev.y) * 0.5;
        pathData += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`;
      } else if (next) {
        // Middle segments - use cubic bezier for smoothness
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y + (curr.y - prev.y) * 0.3;
        const cp2x = curr.x + (next.x - curr.x) * 0.3;
        const cp2y = curr.y + (next.y - curr.y) * 0.3;
        pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Last segment
        const cpX = prev.x + (curr.x - prev.x) * 0.5;
        const cpY = prev.y + (curr.y - prev.y) * 0.5;
        pathData += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`;
      }
    }
    
    return pathData;
  }

  useEffect(() => {
    if (!target) return;

    // Small delay to ensure SVG is fully rendered
    const initAnimation = () => {
      // Get SVG element
      let svgElement;
      if (typeof target === 'string') {
        svgElement = document.querySelector(target);
      } else if (target?.current) {
        svgElement = target.current;
      } else {
        svgElement = target;
      }

      if (!svgElement || svgElement.tagName !== 'svg') {
        console.warn('WaveAnimation: Target must be an SVG element');
        return;
      }

      // Get all path elements
      const paths = Array.from(svgElement.querySelectorAll(pathSelector));
      
      if (paths.length === 0) {
        console.warn('WaveAnimation: No path elements found');
        return;
      }

      pathsRef.current = paths;

      // Initialize configurations and store original path data
      pathConfigsRef.current = paths.map((path, index) => {
        // Store original path data (preserved for restoration)
        const originalPathData = path.getAttribute('d');
        const pathLength = path.getTotalLength();
        
        // Sample points along the path (more points = smoother wave)
        const sampleCount = Math.max(60, Math.floor(pathLength / 8));
        const originalPoints = [];
        
        for (let i = 0; i <= sampleCount; i++) {
          const length = (i / sampleCount) * pathLength;
          const point = getPointAtLength(path, length);
          if (point) {
            originalPoints.push({ x: point.x, y: point.y });
          }
        }

        // Get path bounding box for reference
        const bbox = path.getBBox();
        const minX = bbox.x;
        const maxX = bbox.x + bbox.width;

        // Base phase offset (0 to 2π) - spreads waves across paths
        const basePhase = (index / paths.length) * Math.PI * 2;
        
        // Random phase variation for more organic feel
        const phaseVariation = (Math.random() - 0.5) * Math.PI;
        
        // Frequency variation (how fast each wave oscillates)
        const frequency = 0.4 + (Math.random() * 0.4); // 0.4 to 0.8
        
        // Wavelength variation
        const wavelengthVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        
        // Amplitude variation (wave height)
        const amplitudeVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        
        return {
          originalPathData, // Preserved original - restored on cleanup
          originalPoints,
          basePhase: basePhase + phaseVariation,
          frequency: frequency,
          wavelength: waveLength * wavelengthVariation,
          amplitudeMultiplier: amplitudeVariation,
          pathLength,
          minX,
          maxX
        };
      });

      // Animation function
      const animate = () => {
        timeRef.current += 0.016 * speed; // ~60fps, adjusted by speed

        pathsRef.current.forEach((path, index) => {
          const config = pathConfigsRef.current[index];
          if (!config) return;

          // Create deformed points with wave effect
          const deformedPoints = config.originalPoints.map((point) => {
            // Normalize X position relative to path width for consistent wave pattern
            const normalizedX = (point.x - config.minX) / (config.maxX - config.minX || 1);
            
            // Calculate wave offset based on X position (horizontal wave)
            const wave1 = Math.sin((normalizedX * Math.PI * 4) + timeRef.current * config.frequency + config.basePhase);
            const wave2 = Math.sin((normalizedX * Math.PI * 6) + timeRef.current * config.frequency * 1.3 + config.basePhase * 1.7) * 0.5;
            const wave3 = Math.sin((normalizedX * Math.PI * 2) + timeRef.current * config.frequency * 0.7 + config.basePhase * 0.5) * 0.3;
            
            // Combine waves for more natural motion
            const combinedWave = (wave1 + wave2 + wave3) / 1.8;
            
            // Calculate vertical offset
            const offsetY = combinedWave * amplitude * config.amplitudeMultiplier;
            
            // Apply wave deformation (bends the path)
            return {
              x: point.x,
              y: point.y + offsetY
            };
          });

          // Reconstruct path with deformed points (creates wave shape)
          const newPathData = createSmoothPath(deformedPoints);
          path.setAttribute('d', newPathData);
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animate();
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initAnimation();
    }, 0);

    // Cleanup function - restores original path data
    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Restore paths to original state (preserves original shape)
      if (pathsRef.current.length > 0 && pathConfigsRef.current.length > 0) {
        pathsRef.current.forEach((path, index) => {
          const config = pathConfigsRef.current[index];
          if (config && path && config.originalPathData) {
            path.setAttribute('d', config.originalPathData);
          }
        });
      }
    };
  }, [target, speed, amplitude, pathSelector, waveLength]);

  // This component doesn't render anything itself
  // It just animates the target SVG
  return null;
}
