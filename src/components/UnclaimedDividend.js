'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import NavigationLinks from './NavigationLinks';
import '../scss/components/UnclaimedDividend.scss';

export default function UnclaimedDividend({ data, error = null }) {
  const [memberId, setMemberId] = useState('');
  const [formType, setFormType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fallback data (kept for reference as requested)
  const fallbackData = {
    title: "Details of Unclaimed Dividend /Equity Shares with reference to IEPF Rules, 2016",
    form: {
      memberIdPlaceholder: "Enter Member ID",
      formTypePlaceholder: "Form Type",
      formTypeOptions: [
        { value: '', label: 'Form Type' },
        { value: '2', label: 'IEPF Form 2 (Dividends TO BE credited to IEPF in next 7 years)' },
        { value: '4', label: 'Equity Shares TO BE credited to IEPF under Section 124 of IEPF Rules' }
      ],
      submitText: "Submit"
    },
    instructions: [
      "If you hold shares in Physical mode, please enter your Folio number as appearing on your certificate.",
      "If you hold shares in demat mode (NSDL), please enter your 16 character DPID and ClientID together.",
      "If you hold shares in demat mode (CDSL), please enter your 16 digit ClientID."
    ],
    nodalOfficer: {
      name: "Amit Kumar Gupta",
      email: "akgupta@lupin.com"
    },
    decorativeImage: {
      url: "/assets/unclaimed-dividend/clover.svg",
      alt: ""
    },
    notice: {
      title: "Notice",
      registrarAppointment: "Appointment of Registrar and Share Transfer Agent of the Company Shareholders, Beneficial Owners, Depository Participants and all other persons concerned dealing in the shares of Lupin Limited ('the Company') are hereby informed that the Company has appointed MUFG Intime India Pvt. Ltd. ('MUFG Intime') as the Registrar and Share Transfer Agent of the Company, with effect from June 15, 2018. All persons concerned are hereby requested to send/deliver all the documents/correspondence relating to the transmission of shares, deletion of name, change of address (physical shares), issue of duplicate share certificates, claim of unpaid dividend/unclaimed shares, dematerialization of shares etc. pertaining to shares of the Company to the MUFG Intime at the following address:",
      address: {
        company: "MUFG Intime India Pvt. Ltd.",
        unit: "Unit: Lupin Limited",
        building: "C-101, 247 Park,",
        street: "LBS Marg, Vikhroli (West),",
        city: "Mumbai – 400 083"
      },
      emails: {
        label: "The dedicated email id for shareholders of the Company for communication with MUFG Intime is",
        list: [
          "rnt.helpdesk@in.mpms.mufg.com",
          "Investor.helpdesk@in.mpms.mufg.com"
        ]
      },
      phones: [
        { label: "Contact Telephone No.:", number: "+91 810 811 6767" },
        { label: "Toll-free No.:", number: "1800 1020 878" }
      ],
      importantNotice: "Important Notice for Shareholders holding shares in physical form",
      iepfLink: {
        text: "Access link to the refund webpage of IEPF authority website to facilitate the easy refund procedure for investors/claimants",
        url: "http://www.iepf.gov.in/iepfa/refund.htmltest"
      },
      unclaimedDividend: {
        label: "Unclaimed Dividend",
        text: "1. In terms of the said IEPF rules, the company has uploaded the information of the unclaimed/unpaid\ndividends as per the records of the company for the financial years 2024-2025",
        linkText: "Click here",
        linkUrl: "#"
      }
    }
  };

  // Use API data if available, otherwise use fallback
  // API provides: sectionTitle, dividendInfoSection, dividendNotice
  // Component expects: title, form, instructions, nodalOfficer, decorativeImage, notice
  const unclaimedData = data?.sectionTitle || data?.dividendInfoSection || data?.dividendNotice ? {
    // Use API title if available, otherwise fallback
    title: data.sectionTitle || fallbackData.title,
    // Keep form, instructions, nodalOfficer, decorativeImage from fallback (not in API)
    form: fallbackData.form,
    instructions: fallbackData.instructions,
    nodalOfficer: fallbackData.nodalOfficer,
    decorativeImage: fallbackData.decorativeImage,
    // Use API notice if available, otherwise fallback
    notice: {
      ...fallbackData.notice,
      // Override notice content with API rich text if available
      dividendNotice: data.dividendNotice || null,
      dividendInfoSection: data.dividendInfoSection || null
    }
  } : fallbackData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!memberId || !memberId.trim()) {
      alert('Please enter Member ID');
      return;
    }

    if (!formType) {
      alert('Please select Form Type');
      return;
    }

    // Validate formType is 2 or 4
    if (formType !== '2' && formType !== '4') {
      alert('Form Type must be either 2 or 4');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    setApiResult(null);

    try {
      // Make API call
      const apiUrl = `https://iepfqueryservices.dolphininfotek.co.in/iepfshares.ashx?clientcode=LUPN&memberid=${encodeURIComponent(memberId.trim())}&formtype=${formType}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const htmlText = await response.text();
      
      // Parse HTML response to extract table data
      // The API returns HTML table, we'll parse it
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const table = doc.querySelector('table');
      
      if (table) {
        // Extract table data
        const rows = Array.from(table.querySelectorAll('tr'));
        const tableData = rows.map(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          return cells.map(cell => cell.textContent.trim());
        });
        
        setApiResult({
          html: htmlText,
          tableData: tableData,
          rawHtml: htmlText
        });
      } else {
        // If no table, store the raw HTML/text
        setApiResult({
          html: htmlText,
          tableData: null,
          rawHtml: htmlText
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiError('An error occurred while fetching data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="unclaimed-dividend">
      {/* Container */}
      <div className="unclaimed-dividend__container">
        {/* Navigation Links */}
        <NavigationLinks />

        {/* Green Box Section */}
        <div className="unclaimed-dividend__box">
          {/* Decorative Clover Pattern */}
          {unclaimedData.decorativeImage && (
            <div className="unclaimed-dividend__decorative">
              <Image
                src={unclaimedData.decorativeImage.url}
                alt={unclaimedData.decorativeImage.alt || ""}
                width={457}
                height={449}
                className="unclaimed-dividend__decorative-img"
                quality={100}
              />
            </div>
          )}

          {/* Box Info Content */}
          <div className="unclaimed-dividend__box-info">
            {/* Title */}
            <h2 className="unclaimed-dividend__title">
              {unclaimedData.title}
            </h2>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="unclaimed-dividend__form">
              <div className="unclaimed-dividend__form-row">
                <div className="unclaimed-dividend__form-group">
                  <input
                    type="text"
                    id="member-id"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="unclaimed-dividend__input"
                    placeholder={unclaimedData.form.memberIdPlaceholder}
                    required
                  />
                </div>

                <div className="unclaimed-dividend__form-group">
                  <div className="unclaimed-dividend__select-wrapper">
                    <select
                      id="form-type"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="unclaimed-dividend__select"
                      required
                    >
                      {unclaimedData.form.formTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.value === ''}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="unclaimed-dividend__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : unclaimedData.form.submitText}
              </button>
            </form>

            {/* API Result Display */}
            {apiError && (
              <div className="unclaimed-dividend__result unclaimed-dividend__result--error">
                <p className="unclaimed-dividend__result-error">{apiError}</p>
              </div>
            )}

            {apiResult && (
              <div className="unclaimed-dividend__result">
                <div 
                  className="unclaimed-dividend__result-content"
                  dangerouslySetInnerHTML={{ __html: apiResult.rawHtml }}
                />
              </div>
            )}

            {/* Instructions and Nodal Officer */}
            <div className="unclaimed-dividend__info-section">
              <div className="unclaimed-dividend__instructions">
                {unclaimedData.instructions.map((instruction, index) => (
                  <p key={index} className="unclaimed-dividend__instruction">
                    {index + 1}. {instruction}
                  </p>
                ))}
              </div>

              <div className="unclaimed-dividend__nodal-officer">
                <p className="unclaimed-dividend__nodal-label">
                  Name of the Nodal Officer : <span className="unclaimed-dividend__nodal-name">{unclaimedData.nodalOfficer.name}</span>
                </p>
                <p className="unclaimed-dividend__nodal-label">
                  e-mail address : <a href={`mailto:${unclaimedData.nodalOfficer.email}`} className="unclaimed-dividend__nodal-email">{unclaimedData.nodalOfficer.email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Section */}
        <div className="unclaimed-dividend__notice">
          <h3 className="unclaimed-dividend__notice-title">{unclaimedData.notice.title}</h3>
          
          <div className="unclaimed-dividend__notice-content">
            {/* Render API rich text if available, otherwise use fallback */}
            {unclaimedData.notice.dividendNotice ? (
              // Render API DividendNotice rich text using ReactMarkdown
              <div className="unclaimed-dividend__notice-rich-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                     a: ({ node, ...props }) => (
                    <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                      ),
                   }}
                >
                  {unclaimedData.notice.dividendNotice}
                </ReactMarkdown>
              </div>
            ) : (
              // Render fallback notice content
              <>
                <p className="unclaimed-dividend__notice-text">
                  <strong>Appointment of Registrar and Share Transfer Agent of the Company</strong>
                </p>
                
                <p className="unclaimed-dividend__notice-text">
                  Shareholders, Beneficial Owners, Depository Participants and all other persons concerned dealing in the shares of Lupin Limited ('the Company') are hereby informed that the Company has appointed <strong>MUFG Intime India Pvt. Ltd.</strong> ('MUFG Intime') as the Registrar and Share Transfer Agent of the Company, with effect from <strong>June 15, 2018</strong>.
                </p>
                
                <p className="unclaimed-dividend__notice-text">
                  All persons concerned are hereby requested to send/deliver all the documents/correspondence relating to the transmission of shares, deletion of name, change of address (physical shares), issue of duplicate share certificates, claim of unpaid dividend/unclaimed shares, dematerialization of shares etc. pertaining to shares of the Company to the MUFG Intime at the following address:
                </p>

                <p className="unclaimed-dividend__notice-address">
                  {unclaimedData.notice.address.company}<br />
                  {unclaimedData.notice.address.unit}<br />
                  {unclaimedData.notice.address.building}<br />
                  {unclaimedData.notice.address.street}<br />
                  {unclaimedData.notice.address.city}
                </p>

                <p className="unclaimed-dividend__notice-text">
                  The dedicated email id for shareholders of the Company for communication with MUFG Intime is{' '}
                  {unclaimedData.notice.emails.list.map((email, index) => (
                    <span key={index}>
                      <a href={`mailto:${email}`} className="unclaimed-dividend__notice-email">
                        {email}
                      </a>
                      {index < unclaimedData.notice.emails.list.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </p>

                {unclaimedData.notice.phones.map((phone, index) => (
                  <p key={index} className="unclaimed-dividend__notice-text">
                    {phone.label}{' '}
                    <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="unclaimed-dividend__notice-phone">
                      {phone.number}
                    </a>
                  </p>
                ))}

                <p className="unclaimed-dividend__notice-important">
                  {unclaimedData.notice.importantNotice}
                </p>

                <p className="unclaimed-dividend__notice-text">
                  {unclaimedData.notice.iepfLink.text}
                </p>
                <p className="unclaimed-dividend__notice-text">
                  <a href={unclaimedData.notice.iepfLink.url} target="_blank" rel="noopener noreferrer" className="unclaimed-dividend__notice-link">
                    {unclaimedData.notice.iepfLink.url}
                  </a>
                </p>

                <div className="unclaimed-dividend__notice-dividend">
                  <p className="unclaimed-dividend__notice-dividend-label">{unclaimedData.notice.unclaimedDividend.label}</p>
                  <p className="unclaimed-dividend__notice-text" style={{ whiteSpace: 'pre-line' }}>
                    {unclaimedData.notice.unclaimedDividend.text}{' '}
                    <Link href={unclaimedData.notice.unclaimedDividend.linkUrl} className="unclaimed-dividend__notice-link">
                      {unclaimedData.notice.unclaimedDividend.linkText}
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Render DividendInfoSection if available (could be additional content) */}
            {unclaimedData.notice.dividendInfoSection && (
              <div className="unclaimed-dividend__notice-info-section">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {unclaimedData.notice.dividendInfoSection}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

