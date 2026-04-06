"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import SvgMap from "./SvgMap";

export default function TopBanner() {
  // New company logos from /images/contact/icons/new logos/
  const newLogosBase = "/images/contact/icons/new logos";
  const countries = [
    {
      countryCode: "CA",
      countryClass: "canada",
      companyLogoSrc: `${newLogosBase}/canada.png`,
      companyLogoWidth: 120,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_11.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.lupinpharma.ca/",
    },
    {
      countryCode: "US",
      countryClass: "pharma",
      companyLogoSrc: `${newLogosBase}/pharmaceuticlas.png`,
      companyLogoWidth: 120,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_12.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.lupin.com/US/",
    },
    {
      countryCode: "MX",
      countryClass: "grin",
      companyLogoSrc: `${newLogosBase}/laboratories.png`,
      companyLogoWidth: 184,
      companyLogoHeight: 65,
      flagSrc: "/images/globe/img_9.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://laboratoriosgrin.com/",
    },
    {
      countryCode: "BR",
      countryClass: "med",
      companyLogoSrc: `${newLogosBase}/med.png`,
      companyLogoWidth: 120,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_10.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://medquimica.ind.br/",
    },
    {
      countryCode: "UK",
      countryClass: "healthCare",
      companyLogoSrc: `${newLogosBase}/healthcare.png`,
      companyLogoWidth: 120,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_3.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.lupinhealthcare.co.uk/",
    },
    {
      countryCode: "NL",
      countryClass: "nanomi",
      companyLogoSrc: `${newLogosBase}/nanomi.png`,
      companyLogoWidth: 120,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_8.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.nanomi.com/",
    },
    {
      countryCode: "GE",
      countryClass: "hormosan",
      companyLogoSrc: `${newLogosBase}/hormosan.png`,
      companyLogoWidth: 120,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_7.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.hormosan.com/",
    },
    {
      countryCode: "CH",
      countryClass: "lahsal",
      companyLogoSrc: "/images/contact/icons/lahsal.webp",
      companyLogoWidth: 100,
      companyLogoHeight: 100,
      flagSrc: "/images/globe/img_2_new.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://lupin-neurosciences.com/our-world/",
    },
    {
      countryCode: "FR",
      countryClass: "france",
      companyLogoSrc: `${newLogosBase}/medisol.png`,
      companyLogoWidth: 144,
      companyLogoHeight: 43,
      flagSrc: "/images/globe/img_13.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "#",
    },
    {
      countryCode: "SA",
      countryClass: "dynamic",
      companyLogoSrc: `${newLogosBase}/dynamics.png`,
      companyLogoWidth: 179,
      companyLogoHeight: 38,
      flagSrc: "/images/globe/img_4.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.mydynamics.co.za/",
    },
    {
      countryCode: "IN",
      countryClass: "lupinIn",
      companyLogoSrc: "/images/contact/icons/lupin.webp",
      companyLogoWidth: 120,
      companyLogoHeight: 50,
      flagSrc: "/images/globe/img_1.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "/our-business/india",
    },
    {
      countryCode: "PH",
      countryClass: "multiCare",
      companyLogoSrc: `${newLogosBase}/multicare.png`,
      companyLogoWidth: 151,
      companyLogoHeight: 40,
      flagSrc: "/images/globe/img_6.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://www.multicare.com.ph/",
    },
    {
      countryCode: "AU",
      countryClass: "genericHealth",
      companyLogoSrc: `${newLogosBase}/generic.png`,
      companyLogoWidth: 144,
      companyLogoHeight: 43,
      flagSrc: "/images/globe/img_5.webp",
      pinSrc: "/images/contact/pin_img.webp",
      country_link: "https://generichealth.com.au/",
    },

  ];
  const [activeCountryCode, setActiveCountryCode] = useState(null);

  useEffect(() => {
    const toggleActiveClass = () => {
      setActiveCountryCode((prevCode) => {
        const currentCountryIndex = countries.findIndex(
          (country) => country.countryCode === prevCode
        );
        const nextCountryIndex = (currentCountryIndex + 1) % countries.length;
        const nextCountryCode = countries[nextCountryIndex].countryCode;

        const previousPath = document.querySelector(`#${prevCode}`);
        if (previousPath) {
          previousPath.classList.remove('active');
        }

        const countryPath = document.querySelector(`#${nextCountryCode}`);
        if (countryPath) {
          countryPath.classList.add('active');
        }
        return nextCountryCode;
      });
    };

    const interval = setInterval(toggleActiveClass, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCountryHover = (countryCode) => {
    setActiveCountryCode(countryCode);
    const previousPath = document.querySelector(`#${activeCountryCode}`);
    if (previousPath) {
      previousPath.classList.remove('active');
    }
    const countryPath = document.querySelector(`#${countryCode}`);
    if (countryPath) {
      countryPath.classList.add('active');
    }
  };


  const handleMouseLeave = () => {
    if (activeCountryCode) {
      const countryPath = document.querySelector(`#${activeCountryCode}`);
      if (countryPath) {
        countryPath.classList.remove('active');
      }
      setActiveCountryCode(null);
    }
  };

  return (

    <section
      data-section="contact_banner_section" className="contact_banner inner_banner banner_section"
      style={{ background: '#08a03e' }}>
      <h1 className="contact_banner__title">Global <br />Presence</h1>
      <div className="map_container">
        <SvgMap />
        {countries.map((country, index) => (
          <Link
            key={country.countryCode}
            href={country.country_link}
            data-map=""
            data-country={country.countryCode}
            className={`country ${country.countryClass} ${index === countries.findIndex(c => c.countryCode === activeCountryCode) ? 'active' : ''}`}
            onMouseEnter={() => handleCountryHover(country.countryCode)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="country_company">
              <Image
                src={country.companyLogoSrc}
                alt={country.countryCode}
                width={country.companyLogoWidth}
                height={country.companyLogoHeight}
              />
            </div>
            <div className="country_logo">
              <Image
                src={country.flagSrc}
                alt={`${country.countryCode} flag`}
                width={38}
                height={26}
                className="flag_logo"
              />
              <Image
                src={country.pinSrc}
                alt={`${country.countryCode} pin`}
                width={681}
                height={1213}
                className="pin_logo"
              />
            </div>
          </Link>
        ))}
      </div>

    </section>

  );
}

