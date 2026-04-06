/**
 * Secure text sanitization utility using well-tested libraries
 * ✔ he → entity decoding
 * ✔ sanitize-html → HTML removal (NO REGEX)
 * 
 * Security best practices:
 * - Uses he library (well-tested HTML entity decoder) for both browser and server
 * - Uses sanitize-html (enterprise-approved) for HTML tag removal
 * - Works in both browser and Node.js environments
 * - Passes Azure DevOps security scanning
 */

// Import well-tested libraries
import he from 'he';
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize text by decoding HTML entities and removing HTML tags
 * Uses well-tested libraries (he + sanitize-html) for secure sanitization
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  try {
    // Step 1: Decode URI components safely
    let decoded = text;
    try {
      decoded = decodeURIComponent(text);
    } catch {
      decoded = text;
    }

    // Step 2: Decode HTML entities (safe, well-tested)
    const entityDecoded = he.decode(decoded, {
      strict: false,
    });

    // Step 3: Remove ALL HTML using sanitize-html (NOT regex)
    // This passes Azure DevOps security scanning
    const htmlStripped = sanitizeHtml(entityDecoded, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    });

    // Step 4: Normalize whitespace
    return htmlStripped
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

  } catch (error) {
    // Fallback: return empty string on error for security
    return '';
  }
}

/**
 * Encode text for safe use in URIs
 * @param {string} text - Text to encode
 * @returns {string} - URI-encoded text
 */
export function encodeURI(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  try {
    return encodeURIComponent(text);
  } catch (error) {
    return '';
  }
}

/**
 * Decode URI-encoded text
 * @param {string} text - URI-encoded text to decode
 * @returns {string} - Decoded text
 */
export function decodeURI(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  try {
    return decodeURIComponent(text);
  } catch (error) {
    return text; // Return original on error
  }
}

