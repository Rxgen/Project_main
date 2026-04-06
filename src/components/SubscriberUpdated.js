'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/SubscriberUpdated.scss';

export default function SubscriberUpdated({ data }) {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  
  // Use ref for timeout to avoid re-renders
  const timeoutRef = useRef(null);

  // Email validation constants - secure validation to prevent ReDoS
  const MAX_EMAIL_LENGTH = 254; // RFC 5321 max is 320, but we use 254 for safety
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email format - secure validation to prevent ReDoS
  const validateEmail = (emailToValidate) => {
    if (!emailToValidate) {
      setEmailInvalid(false);
      return false;
    }

    // Limit email length to prevent ReDoS attacks
    // This prevents catastrophic backtracking by limiting input size
    if (typeof emailToValidate !== 'string' || emailToValidate.length === 0 || emailToValidate.length > MAX_EMAIL_LENGTH) {
      setEmailInvalid(true);
      return false;
    }

    // Use a simple, efficient regex pattern that avoids nested quantifiers
    // Length limit above prevents ReDoS, so this simple pattern is safe
    const isValid = emailRegex.test(emailToValidate);
    setEmailInvalid(!isValid);
    return isValid;
  };

  // Default data (will be replaced by Strapi)
  const subscriberData = data || {
    title: {
      line1: "Investor",
      line2: "Contacts"
    },
    shareholderServices: {
      title: "Shareholder Services",
      emails: [
        "investorservices@lupin.com",
        "investor.helpdesk@in.mpms.mufg.com"
      ]
    },
    investorRelations: {
      title: "Investor Relations",
      email: "InvestorRelations@lupin.com"
    },
    subscription: {
      title: "Subscribe for\nInvestor updates",
      placeholder: "Email",
      checkboxText: "I agree and accept the",
      privacyPolicyText: "Privacy Policy",
      privacyPolicyLink: "/privacy-policy",
      andText: "and the",
      termsText: "Terms of Use",
      termsLink: "/terms-of-service",
      websiteText: "of this website",
      submitText: "Submit"
    },
    backgroundImage: {
      url: "/assets/faqs/bg.png",
      alt: "Office meeting room"
    }
  };

  // Check if email already exists
  const checkEmail = async (emailToCheck) => {
    // Secure validation to prevent ReDoS - check length and type first
    if (!emailToCheck || 
        typeof emailToCheck !== 'string' || 
        emailToCheck.length === 0 || 
        emailToCheck.length > MAX_EMAIL_LENGTH ||
        !emailRegex.test(emailToCheck)) {
      setEmailExists(false);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch(`/api/investors-faqs?email=${encodeURIComponent(emailToCheck)}`);
      const data = await response.json();
      
      if (response.ok) {
        setEmailExists(data.exists || false);
      } else {
        setEmailExists(false);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailExists(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Handle email input change with debounce
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailExists(false);
    
    // Validate email format in real-time
    const isValid = validateEmail(newEmail);
    
    // Only check if email exists if format is valid
    if (isValid) {
      // Debounce email check
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        checkEmail(newEmail);
      }, 500);
    } else {
      // Clear any pending email existence check if format is invalid
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !agreed || emailExists || emailInvalid) return;
    
    // Final validation before submit
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/investors-faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          agreed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setAgreed(false);
        setEmailExists(false);
        setEmailInvalid(false);
        
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        // Handle error - check if it's a duplicate email error
        if (response.status === 409 || data.error?.includes('already subscribed')) {
          setEmailExists(true);
        } else {
          console.error('Subscription error:', data.error);
          alert(data.error || 'Failed to subscribe. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="subscriber-updated" className="subscriber-updated">
      <div className="subscriber-updated__container">
        {/* Left Panel - Contact Information */}
        <div className="subscriber-updated__left">
          <h2 className="subscriber-updated__title">
            <span className="subscriber-updated__title-line">{subscriberData.title.line1}</span>
            <span className="subscriber-updated__title-line">{subscriberData.title.line2}</span>
          </h2>

          {/* Shareholder Services */}
          <div className="subscriber-updated__section">
            <h3 className="subscriber-updated__section-title">
              {subscriberData.shareholderServices.title}
            </h3>
            <div className="subscriber-updated__emails">
              {subscriberData.shareholderServices.emails.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email}`}
                  className="subscriber-updated__email"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>

          {/* Investor Relations */}
          <div className="subscriber-updated__section">
            <h3 className="subscriber-updated__section-title">
              {subscriberData.investorRelations.title}
            </h3>
            <a
              href={`mailto:${subscriberData.investorRelations.email}`}
              className="subscriber-updated__email"
            >
              {subscriberData.investorRelations.email}
            </a>
          </div>
        </div>

        {/* Right Panel - Subscription Form */}
        <div className="subscriber-updated__right">
          {/* Background Image */}
          {subscriberData.backgroundImage?.url && (
            <div className="subscriber-updated__bg-image">
              <Image
                src={subscriberData.backgroundImage.url}
                alt={subscriberData.backgroundImage.alt}
                fill
                className="subscriber-updated__bg-img"
                quality={100}
              />
            </div>
          )}

          {/* Green Circular Overlay with Form */}
          <div className="subscriber-updated__overlay">
            <form onSubmit={handleSubmit} className="subscriber-updated__form">
              <h3 className="subscriber-updated__form-title">
                {subscriberData.subscription.title.split('\n').map((line, index) => (
                  <span key={index} className="subscriber-updated__form-title-line">
                    {line}
                  </span>
                ))}
              </h3>

              <div className="subscriber-updated__input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={subscriberData.subscription.placeholder}
                  className={`subscriber-updated__input ${emailExists || emailInvalid ? 'subscriber-updated__input--error' : ''}`}
                  required
                />
                {emailInvalid && email && (
                  <p className="subscriber-updated__error-message">
                    Please enter a valid email address.
                  </p>
                )}
                {emailExists && !emailInvalid && (
                  <p className="subscriber-updated__error-message">
                    This email is already subscribed to investor updates.
                  </p>
                )}
                {isCheckingEmail && !emailInvalid && (
                  <p className="subscriber-updated__checking-message">
                    Checking...
                  </p>
                )}
              </div>

              <div className="subscriber-updated__checkbox-wrapper">
                <input
                  type="checkbox"
                  id="subscriber-agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="subscriber-updated__checkbox"
                  required
                />
                <label htmlFor="subscriber-agreement" className="subscriber-updated__checkbox-label">
                  {subscriberData.subscription.checkboxText}{' '}
                  <Link href={subscriberData.subscription.privacyPolicyLink} className="subscriber-updated__link" target="_blank" rel="noopener noreferrer">
                    {subscriberData.subscription.privacyPolicyText}
                  </Link>
                  {' '}{subscriberData.subscription.andText}{' '}
                  <Link href={subscriberData.subscription.termsLink} className="subscriber-updated__link" target="_blank" rel="noopener noreferrer">
                    {subscriberData.subscription.termsText}
                  </Link>
                  {' '}{subscriberData.subscription.websiteText}
                </label>
              </div>

              <button
                type="submit"
                className="subscriber-updated__submit"
                disabled={isSubmitting || !email || !agreed || emailExists || emailInvalid}
              >
                {isSubmitting ? 'Submitting...' : submitted ? 'Subscribed!' : subscriberData.subscription.submitText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

