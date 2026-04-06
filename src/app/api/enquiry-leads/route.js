import { NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';

// Set SendGrid API key
if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

// Subject to email mapping
const SUBJECT_EMAIL_MAP = {
  'Active Pharmaceutical Ingredients (API) Related Enquiry': ['info@lupin.com','ravi.chauhan@webmaffia'],
  'Medicine Availability Related Enquiry': ['info@lupin.com'],
  'Drug Adverse Effect/Adverse Event Related/Product Complaint/Medical Information Enquiry': ['dsrm@lupin.com'],
  'Careers': ['hr@lupin.com'],
  'Other Enquiry': ['info@lupin.com'],
  'For Suppliers': ['purchase@lupin.com'],
  'Biotech-CDMO related queries': ['davemonson@lupin.com', 'AnneshaBhattacharya2@lupin.com']
};

/**
 * Generate plain text version of email
 */
function generateEmailText(formData) {
  return `
Name: ${formData.name || 'N/A'}
Organization: ${formData.organization || 'N/A'}
Email: ${formData.email || 'N/A'}
Contact Number: ${formData.phone || formData.telNo || 'N/A'}
Subject: ${formData.subject || 'N/A'}
Query: ${formData.message || formData.query || 'N/A'}
  `.trim();
}

/**
 * Generate email HTML template
 */
function generateEmailTemplate(formData) {
  // Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const name = escapeHtml(formData.name || 'N/A');
  const organization = escapeHtml(formData.organization || 'N/A');
  const email = escapeHtml(formData.email || 'N/A');
  const number = escapeHtml(formData.phone || formData.telNo || 'N/A');
  const subject = escapeHtml(formData.subject || 'N/A');
  // Escape HTML first for security, then replace newlines with <br> for proper line breaks
  const query = escapeHtml(formData.message || formData.query || 'N/A').replace(/\n/g, '<br>');

  return `
    <table style="width: 650px; margin: 0 auto; font-size: 16px; background: #f6fcf8; color: #000; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td>
          <table style="margin: 15px;">
            <tr>
              <td><a href="" target="blank"><img src="https://www.lupin.com/images/contact/icons/pharma.webp" alt="" width="95" height="35" style="margin-bottom: 30px;"></a></td>
            </tr>
            <tr>
              <td>
                <table style="border-collapse: collapse;">
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Name :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">${name}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Organization :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">${organization}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Email :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">
                        <a href="mailto:${email}" style="color: #000;">${email}</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Tel No :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">
                        <a href="tel:+${number}" style="color: #000">${number}</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Select Subject Lines :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">${subject}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Post your query :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">${query}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">I agree and accept the <a href="https://www.lupin.com/privacy-policy/" target="_blank" style="color: #000;">Privacy Policy</a> and the <a href="" target="_blank" style="color: #000;">Terms of use</a> of this website :</div>
                    </td>
                    <td style="border: 1px solid #d2d2d2;">
                      <div style="margin: 10px 15px; line-height: 1.5; letter-spacing: .5px;">Checked</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export async function POST(request) {
  
  
  try {
   
    const body = await request.json();
    
    
    const { name, organization, email, phone, telNo, country, subject, message, query, captchaToken } = body;

    // Validate required fields
   
    if (!name || !organization || !email || !subject || (!message && !query)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, organization, email, subject, and message are required' },
        { status: 400 }
      );
    }
    // Limit email length to prevent ReDoS attacks (RFC 5321 max is 320, but we use 254 for safety)
    // This prevents catastrophic backtracking by limiting input size
    const MAX_EMAIL_LENGTH = 254;
    if (typeof email !== 'string' || email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use a simple, efficient regex pattern that avoids nested quantifiers
    // Pattern ensures: non-whitespace chars before @, non-whitespace chars after @, and at least one dot
    // Length limit above prevents ReDoS, so this simple pattern is safe
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
   

    // Verify reCAPTCHA
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification is required' },
        { status: 400 }
      );
    }

    try {
      const recaptchaSecret = '6LdHcWEsAAAAALiZW0q6ECpXLuk9EA_IFQRtyW-5';
      const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`;
      
      const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
        method: 'POST',
      });
      
      const recaptchaData = await recaptchaResponse.json();
      
      if (!recaptchaData.success) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
      
    } catch (recaptchaError) {
      return NextResponse.json(
        { error: 'Failed to verify reCAPTCHA. Please try again.' },
        { status: 500 }
      );
    }

  
    const recipientEmails = SUBJECT_EMAIL_MAP[subject];
   
    
    if (!recipientEmails || recipientEmails.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `No email mapping configured for subject: ${subject}`,
        },
        { status: 400 }
      );
    }

    // Generate email HTML and text
    
    const formDataForEmail = {
      name,
      organization,
      email,
      phone: phone || telNo,
      telNo: phone || telNo,
      country,
      subject,
      message: message || query,
      query: message || query,
    };
    

    const emailHtml = generateEmailTemplate(formDataForEmail);
    const emailText = generateEmailText(formDataForEmail);
    

    // Send email via SendGrid
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY is not configured');
      }

      // SendGrid message object with proper headers for deliverability
      const msg = {
        to: recipientEmails,
        from: {
          email: 'info@lupin.in',
          name: 'Lupin Contact Form'
        },
        replyTo: email, // Reply to the form submitter
        subject: subject,
        text: emailText,
        html: emailHtml,
        // Add headers to improve deliverability
        headers: {
          'X-Mailer': 'Lupin Contact Form',
          'X-Priority': '1',
          'Importance': 'high',
          'List-Unsubscribe': '<mailto:info@lupin.in>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        },
        // Add categories for tracking
        categories: ['contact-form', 'enquiry']
      };
      
      const sendResponse = await sendgrid.send(msg);
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: {
          email: { sent: true, recipients: recipientEmails },
          sendGridStatus: sendResponse[0]?.statusCode,
        },
      }, { status: 200 });

    } catch (emailErr) {
      return NextResponse.json({
        success: false,
        error: 'Failed to send email',
        message: emailErr.message,
        details: {
          recipients: recipientEmails,
          sendGridError: emailErr.response?.body || emailErr.message,
        },
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process email request',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

