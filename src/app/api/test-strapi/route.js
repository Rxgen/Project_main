import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/strapi';

/**
 * Test Strapi connectivity endpoint
 * 
 * Usage: GET /api/test-strapi?endpoint=homepage
 * 
 * This endpoint directly tests Strapi API connectivity and returns
 * detailed error information to help diagnose issues.
 */

// SECURITY: Allow-list of valid Strapi API endpoints
// This prevents SSRF attacks by restricting which endpoints can be accessed
const ALLOWED_ENDPOINTS = [
  'homepage',
  'articles',
  'press-releases',
  'perspectives',
  'media-coverage',
  'about-us',
  'investors',
  'our-business',
  'sustainability',
  'careers',
  'contact',
  'redirects',
  'enquiry-leads',
];

/**
 * Validate and sanitize endpoint parameter
 * @param {string} endpoint - User-provided endpoint
 * @returns {string|null} - Validated endpoint or null if invalid
 */
function validateEndpoint(endpoint) {
  if (!endpoint || typeof endpoint !== 'string') {
    return null;
  }

  // Remove any leading/trailing slashes and whitespace
  const sanitized = endpoint.trim().replace(/^\/+|\/+$/g, '');

  // SECURITY: Check for path traversal attempts
  if (sanitized.includes('..') || sanitized.includes('//') || sanitized.includes('\\')) {
    return null;
  }

  // SECURITY: Only allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return null;
  }

  // SECURITY: Check against allow-list
  if (!ALLOWED_ENDPOINTS.includes(sanitized)) {
    return null;
  }

  return sanitized;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpointParam = searchParams.get('endpoint') || 'homepage';

  // SECURITY: Validate endpoint against allow-list
  const endpoint = validateEndpoint(endpointParam);
  if (!endpoint) {
    return NextResponse.json(
      {
        error: 'Invalid endpoint. Endpoint must be from the allowed list and cannot contain path traversal sequences.',
        allowedEndpoints: ALLOWED_ENDPOINTS,
      },
      { status: 400 }
    );
  }

  const testResult = {
    timestamp: new Date().toISOString(),
    endpoint,
    strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'NOT SET',
    hasToken: !!process.env.STRAPI_API_TOKEN,
    test: {
      started: true,
      completed: false,
      success: false,
      error: null,
      responseTime: null,
      statusCode: null,
      hasData: false,
    },
    diagnostics: {},
  };

  const startTime = Date.now();

  try {
    // Test direct fetch first
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (!strapiUrl) {
      throw new Error('NEXT_PUBLIC_STRAPI_URL is not set');
    }

    // SECURITY: Validate Strapi URL from environment variable
    let strapiUrlObj;
    try {
      strapiUrlObj = new URL(strapiUrl);
    } catch (error) {
      throw new Error('Invalid Strapi URL format in environment variable');
    }

    // SECURITY: Only allow HTTPS protocol (prevent SSRF to internal services)
    if (strapiUrlObj.protocol !== 'https:') {
      throw new Error('Strapi URL must use HTTPS protocol');
    }

    if (strapiUrl.includes('localhost')) {
      testResult.diagnostics.warning = 'Strapi URL contains localhost - this will not work on server';
    }

    // SECURITY: Construct URL from validated components only
    // Use validated endpoint and ensure path is safe
    const safePath = `/api/${endpoint}`;
    const testUrl = `${strapiUrlObj.protocol}//${strapiUrlObj.hostname}${safePath}`;
    testResult.diagnostics.testUrl = testUrl;

    // SECURITY: Final validation - ensure constructed URL is safe
    const testUrlObj = new URL(testUrl);
    if (testUrlObj.hostname !== strapiUrlObj.hostname) {
      throw new Error('URL validation failed: hostname mismatch');
    }

    // Test 1: Basic connectivity
    const headers = {
      'Content-Type': 'application/json',
    };

    if (process.env.STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    // Create timeout using AbortController for better compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const fetchStart = Date.now();
    const response = await fetch(testUrl, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const fetchEnd = Date.now();
    testResult.test.responseTime = `${fetchEnd - fetchStart}ms`;
    testResult.test.statusCode = response.status;

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        testResult.diagnostics.errorResponse = errorText.substring(0, 500); // Limit length
      } catch (e) {
        errorText = response.statusText;
      }

      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    testResult.test.hasData = !!data;
    testResult.test.success = true;
    testResult.test.completed = true;
    testResult.diagnostics.dataKeys = data ? Object.keys(data) : [];

    // Test 2: Try using fetchAPI function
    try {
      const apiData = await fetchAPI(endpoint);
      testResult.diagnostics.fetchAPISuccess = !!apiData;
    } catch (apiError) {
      testResult.diagnostics.fetchAPIError = apiError.message;
    }

  } catch (error) {
    testResult.test.completed = true;
    testResult.test.success = false;
    testResult.test.error = {
      message: error.message,
      name: error.name,
      type: error.name,
    };

    // Add specific diagnostics based on error type
    if (error.name === 'AbortError' || error.message.includes('timeout') || error.message.includes('aborted')) {
      testResult.diagnostics.errorType = 'TIMEOUT';
      testResult.diagnostics.suggestion = 'Strapi server is not responding. Check if server is running and accessible.';
    } else if (error.message.includes('ECONNREFUSED')) {
      testResult.diagnostics.errorType = 'CONNECTION_REFUSED';
      testResult.diagnostics.suggestion = 'Cannot connect to Strapi. Check URL, port, and firewall settings.';
    } else if (error.message.includes('ENOTFOUND')) {
      testResult.diagnostics.errorType = 'DNS_ERROR';
      testResult.diagnostics.suggestion = 'DNS resolution failed. Check if Strapi URL hostname is correct.';
    } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
      testResult.diagnostics.errorType = 'SSL_ERROR';
      testResult.diagnostics.suggestion = 'SSL certificate issue. Check Strapi SSL configuration.';
    } else if (error.message.includes('401')) {
      testResult.diagnostics.errorType = 'UNAUTHORIZED';
      testResult.diagnostics.suggestion = 'Invalid or missing API token. Check STRAPI_API_TOKEN.';
    } else if (error.message.includes('403')) {
      testResult.diagnostics.errorType = 'FORBIDDEN';
      testResult.diagnostics.suggestion = 'API token lacks permissions. Check token permissions in Strapi.';
    } else {
      testResult.diagnostics.errorType = 'UNKNOWN';
      testResult.diagnostics.suggestion = 'Unknown error. Check server logs for details.';
    }
  }

  const endTime = Date.now();
  testResult.test.totalTime = `${endTime - startTime}ms`;

  return NextResponse.json(testResult, {
    status: testResult.test.success ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

