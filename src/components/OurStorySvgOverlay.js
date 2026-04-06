'use client';

import React from 'react';
import Image from 'next/image';
import '@/scss/components/OurStorySvgOverlay.scss';

export default function OurStorySvgOverlay() {
  return (
    <div className="our-story-svg-overlay">
      <Image
        src="/assets/images/our-story/ourstory.svg"
        alt=""
        fill
        className="our-story-svg-overlay__svg"
        quality={100}
      />
    </div>
  );
}

