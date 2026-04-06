'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';
import countryList from 'react-select-country-list';
import '../scss/components/ContactUsForm.scss';

/**
 * Contact Us Form Component
 * 
 * CAPTCHA FUNCTIONALITY: Enabled
 * reCAPTCHA is active and required for form submission
 */
export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    telNo: '',
    country: '',
    subject: '',
    query: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const countries = useMemo(() => countryList().getData(), []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.query.trim()) {
      newErrors.query = 'Query is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Privacy Policy and Terms of use';
    }

    if (!captchaToken) {
      newErrors.captcha = 'Please complete the reCAPTCHA verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSuccessMessage('');

   try {
    const emailResponse = await sendEmail(formData);

    if (emailResponse.success) {
      // Commented out Strapi save functionality
      // await saveToStrapi(formData);

      setSuccessMessage('Thank you for your message. We will get back to you soon!');

      setFormData({
        name: '',
        organization: '',
        email: '',
        telNo: '',
        country: '',
        subject: '',
        query: '',
        agreeToTerms: false
      });

      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } else {
      setSuccessMessage('Failed to send email. Please try again later.');
    }

  } catch (error) {
    console.error('Error submitting the form:', error);
    setSuccessMessage('Failed to submit. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
  };

  const sendEmail = async (formData) => {
    console.log('Form data received:', formData);
    
    try {
      const emailData = {
        name: formData.name.trim(),
        organization: formData.organization.trim(),
        email: formData.email.trim(),
        telNo: formData.telNo.trim() || null,
        phone: formData.telNo.trim() || null,
        country: formData.country.trim() || null,
        subject: formData.subject,
        query: formData.query.trim(),
        message: formData.query.trim(),
        captchaToken: captchaToken,
      };

      console.log('Email data to send:', emailData);
      const response = await fetch('/api/enquiry-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });    
      
      // Parse the JSON response
      const data = await response.json();

      if (response.ok && response.status === 200 && data.success) {
        console.log('Email sent successfully');
        console.log('Recipients:', data.data?.email?.recipients);
        console.log('SendGrid status:', data.data?.sendGridStatus);
        return { success: true, data };
      } else {
        console.error('CLIENT: Email sending failed:', data);
        return { success: false, error: data.error || 'Failed to send email' };
      }
    } catch (error) {
      console.error('CLIENT: Error sending email:', {
        message: error.message,
        fullError: error
      });
      return { success: false, error: error.message || 'Failed to send email' };
    }
  };


// Commented out Strapi save functionality
// const saveToStrapi = async (formData) => {
//   const strapiPayload = {
//     data: {
//       name: formData.name.trim(),
//       organization: formData.organization.trim(),
//       email: formData.email.trim(),
//       phone: Number(formData.telNo) || null,
//       country: formData.country || null,
//       subject: formData.subject,
//       message: formData.query.trim(),
//     }
//   };

//   try {
//     const response = await fetch(
//       //`${process.env.NEXT_PUBLIC_STRAPI_URL}api/enquiry-leads`,
//       "https://lupin-cms.devmaffia.in/api/enquiry-leads",
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           //Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
//         },
//         body: JSON.stringify(strapiPayload),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       console.error('Strapi save failed:', data);
//       return false;
//     }

//     console.log('Saved to Strapi successfully');
//     return true;

//   } catch (error) {
//     console.error('Error saving to Strapi:', error);
//     return false;
//   }
// };


  return (
    <section className="contact-us-form" data-node-id="2947:6285">
      {/* Bottom SVG */}
      <div className="contact-us-form__bottom-svg">
        <Image
          src="/assets/images/contact/bottom.svg"
          alt="Decorative bottom"
          fill
          className="contact-us-form__bottom-svg-img"
          quality={100}
        />
      </div>
      <div className="contact-us-form__container">
        <div className="contact-us-form__header" data-node-id="2947:6286">
          <h2 className="contact-us-form__heading" data-node-id="2947:6288">
            Contact Us
          </h2>
          <p className="contact-us-form__required-text" data-node-id="2947:6287">
            Fields marked with an * are required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-us-form__form" data-node-id="2947:6289">
          <div className="contact-us-form__row">
            <div className="contact-us-form__field-wrapper">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name *"
                className={`contact-us-form__input ${errors.name ? 'contact-us-form__input--error' : ''}`}
                data-node-id="2947:6290"
              />
              {errors.name && (
                <span className="contact-us-form__error">{errors.name}</span>
              )}
            </div>

            <div className="contact-us-form__field-wrapper">
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization *"
                className={`contact-us-form__input ${errors.organization ? 'contact-us-form__input--error' : ''}`}
                data-node-id="2947:6292"
              />
              {errors.organization && (
                <span className="contact-us-form__error">{errors.organization}</span>
              )}
            </div>
          </div>

          <div className="contact-us-form__row">
            <div className="contact-us-form__field-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email *"
                className={`contact-us-form__input ${errors.email ? 'contact-us-form__input--error' : ''}`}
                data-node-id="2947:6294"
              />
              {errors.email && (
                <span className="contact-us-form__error">{errors.email}</span>
              )}
            </div>

            <div className="contact-us-form__field-wrapper">
              <input
                type="tel"
                name="telNo"
                value={formData.telNo}
                onChange={handleChange}
                placeholder="Tel No"
                className="contact-us-form__input"
                data-node-id="2947:6296"
              />
            </div>
          </div>

          <div className="contact-us-form__row">
            <div className="contact-us-form__field-wrapper">
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="contact-us-form__select"
                data-node-id="2947:6298"
              >
                <option value="" disabled hidden>Country</option>
                {countries.map((c) => (
                  <option key={c.value} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="contact-us-form__field-wrapper">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`contact-us-form__select ${errors.subject ? 'contact-us-form__select--error' : ''}`}
                data-node-id="2947:6300"
              >
                <option value="">Select Subject Lines *</option>
                <option value="Active Pharmaceutical Ingredients (API) Related Enquiry">Active Pharmaceutical Ingredients (API) Related Enquiry</option>
                <option value="Medicine Availability Related Enquiry">Medicine Availability Related Enquiry</option>
                <option value="Drug Adverse Effect/Adverse Event Related/Product Complaint/Medical Information Enquiry">Drug Adverse Effect/Adverse Event Related/Product Complaint/Medical Information Enquiry</option>
                <option value="Careers">Careers</option>
                <option value="For Suppliers">For Suppliers</option>
                <option value="Biotech-CDMO related queries">Biotech-CDMO related queries</option>
                <option value="Other Enquiry">Other Enquiry</option>
              </select>
              {errors.subject && (
                <span className="contact-us-form__error">{errors.subject}</span>
              )}
            </div>
          </div>

          <div className="contact-us-form__row contact-us-form__row--full">
            <div className="contact-us-form__field-wrapper">
              <textarea
                name="query"
                value={formData.query}
                onChange={handleChange}
                placeholder="Post your query *"
                rows={8}
                className={`contact-us-form__textarea ${errors.query ? 'contact-us-form__textarea--error' : ''}`}
                data-node-id="2947:6302"
              />
              {errors.query && (
                <span className="contact-us-form__error">{errors.query}</span>
              )}
            </div>
          </div>

          <div className="contact-us-form__checkbox-wrapper" data-node-id="2947:6307">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="contact-us-form__checkbox"
              data-node-id="2947:6308"
            />
            <label htmlFor="agreeToTerms" className="contact-us-form__checkbox-label" data-node-id="2947:6309">
              I agree and accept the Privacy Policy and the Terms of use of this website *
            </label>
            {errors.agreeToTerms && (
              <span className="contact-us-form__error">{errors.agreeToTerms}</span>
            )}
          </div>

          {successMessage && (
            <div className={`contact-us-form__message ${successMessage.includes('Thank you') ? 'contact-us-form__message--success' : 'contact-us-form__message--error'}`}>
              {successMessage}
            </div>
          )}

          <div className="contact-us-form__captcha-wrapper">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdHcWEsAAAAALjQ-bqwfLow-83Lj1WePlwIqbfH"
              onChange={(token) => {
                setCaptchaToken(token);
                // Clear captcha error when token is set
                if (errors.captcha) {
                  setErrors(prev => ({
                    ...prev,
                    captcha: ''
                  }));
                }
              }}
              onExpired={() => {
                setCaptchaToken(null);
              }}
              onError={() => {
                setCaptchaToken(null);
              }}
            />
            {errors.captcha && (
              <span className="contact-us-form__error">{errors.captcha}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="contact-us-form__submit"
            data-node-id="2947:6304"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}
