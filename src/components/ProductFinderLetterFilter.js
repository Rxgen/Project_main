'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '../scss/components/ProductFinderLetterFilter.scss';

export default function ProductFinderLetterFilter({
  data,
  onLetterSelect,
  selectedLetter: externalSelectedLetter = ''
}) {
  const [selectedLetter, setSelectedLetter] = useState(externalSelectedLetter || '');

  // Sync with external prop changes
  useEffect(() => {
    setSelectedLetter(externalSelectedLetter || '');
  }, [externalSelectedLetter]);

  // Generate alphabet A-Z
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Group letters into rows
  const letterRows = [
    alphabet.slice(0, 8),   // A-H
    alphabet.slice(8, 16),  // I-P
    alphabet.slice(16, 24), // Q-X
    alphabet.slice(24, 26)  // Y-Z
  ];

  const handleLetterClick = (letter) => {
    const newLetter = letter === selectedLetter ? '' : letter;
    setSelectedLetter(newLetter);
    if (onLetterSelect) {
      onLetterSelect(newLetter);
    }
  };

  return (
    <div className="product-finder-letter-filter" data-node-id="2953:3844">
      {/* Background Circle */}
      <div className="product-finder-letter-filter__background-circle" data-node-id="2953:3845">
        {/* Flower SVG */}
        <div className="product-finder-letter-filter__flower">
          <Image
            src="/assets/images/product-finder/flower.svg"
            alt="Decorative flower"
            width={534}
            height={256}
            className="product-finder-letter-filter__flower-img"
            quality={100}
          />
        </div>

        {/* Heading */}
        <h2 className="product-finder-letter-filter__heading" data-node-id="2953:3864">
          Filter by Active Ingredient
        </h2>

        {/* Alphabet Grid */}
        <div className="product-finder-letter-filter__alphabet" data-node-id="2953:3865">
          {letterRows.map((row, rowIndex) => (
            <div key={rowIndex} className="product-finder-letter-filter__row">
              {row.map((letter, letterIndex) => {
                const isSelected = selectedLetter === letter;

                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleLetterClick(letter)}
                    className={`product-finder-letter-filter__letter ${isSelected ? 'product-finder-letter-filter__letter--selected' : ''
                      }`}
                    data-node-id={`2953:${3866 + rowIndex * 8 + letterIndex}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

