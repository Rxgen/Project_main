import { NextResponse } from 'next/server';

/**
 * Diagnostic API endpoint to check environment variables and Strapi connectivity
 * 
 * Usage: GET /api/diagnostic
 * 
 * This endpoint helps diagnose server configuration issues by:
 * 1. Checking if required environment variables are set
 * 2. Testing Strapi API connectivity
 * 3. Verifying API token validity
 * 
 * Note: In production, you may want to restrict access to this endpoint
 * or add authentication to prevent exposing sensitive information.
 */
export async function GET(request) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      environmentVariables: {},
      strapiConnectivity: {},
      securityHeaders: {},
    },
    recommendations: [],
  };

  // Check environment variables
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  diagnostics.checks.environmentVariables = {
    NEXT_PUBLIC_STRAPI_URL: {
      set: !!strapiUrl,
      value: strapiUrl ? (strapiUrl.includes('localhost') ? '⚠️ Using localhost (may not work on server)' : '✓ Set') : '❌ Not set',
      isLocalhost: strapiUrl?.includes('localhost') || false,
    },
    STRAPI_API_TOKEN: {
      set: !!strapiToken,
      value: strapiToken ? '✓ Set (hidden)' : '❌ Not set',
      length: strapiToken ? strapiToken.length : 0,
    },
    NEXT_PUBLIC_SITE_URL: {
      set: !!siteUrl,
      value: siteUrl || 'Not set',
    },
  };

  // Test Strapi connectivity
  if (strapiUrl) {
    try {
      const testUrl = `${strapiUrl}/api/homepage?populate=hero`;
      const headers = {
        'Content-Type': 'application/json',
      };

      if (strapiToken) {
        headers['Authorization'] = `Bearer ${strapiToken}`;
      }

      const startTime = Date.now();
      const response = await fetch(testUrl, {
        headers,
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      diagnostics.checks.strapiConnectivity = {
        reachable: true,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        hasData: false,
      };

      if (response.ok) {
        try {
          const data = await response.json();
          diagnostics.checks.strapiConnectivity.hasData = !!data;
          diagnostics.checks.strapiConnectivity.dataStructure = data ? Object.keys(data) : [];
        } catch (e) {
          diagnostics.checks.strapiConnectivity.parseError = 'Could not parse JSON response';
        }
      } else {
        if (response.status === 401) {
          diagnostics.recommendations.push('❌ 401 Unauthorized: Check that STRAPI_API_TOKEN is valid and has proper permissions.');
        } else if (response.status === 403) {
          diagnostics.recommendations.push('❌ 403 Forbidden: Check that STRAPI_API_TOKEN has proper permissions in Strapi.');
        } else if (response.status === 404) {
          diagnostics.recommendations.push('⚠️ 404 Not Found: The homepage endpoint may not exist in Strapi, or the URL structure is different.');
        }
      }
    } catch (error) {
      diagnostics.checks.strapiConnectivity = {
        reachable: false,
        error: error.message,
        errorType: error.name,
      };

      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        diagnostics.recommendations.push('❌ Cannot connect to Strapi server. Check:');
        diagnostics.recommendations.push('   1. Strapi server is running');
        diagnostics.recommendations.push('   2. NEXT_PUBLIC_STRAPI_URL is correct: ' + strapiUrl);
        diagnostics.recommendations.push('   3. Server can reach Strapi (network/firewall)');
      } else if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        diagnostics.recommendations.push('❌ Connection to Strapi timed out. Check network connectivity and Strapi server status.');
      }
    }
  } else {
    diagnostics.checks.strapiConnectivity = {
      reachable: false,
      error: 'NEXT_PUBLIC_STRAPI_URL is not set',
    };
    diagnostics.recommendations.push('❌ NEXT_PUBLIC_STRAPI_URL is not set. Set this environment variable to your Strapi server URL.');
  }

  // Generate recommendations
  if (!strapiUrl) {
    diagnostics.recommendations.push('❌ Set NEXT_PUBLIC_STRAPI_URL in your environment variables.');
  } else if (strapiUrl.includes('localhost')) {
    diagnostics.recommendations.push('⚠️ NEXT_PUBLIC_STRAPI_URL is set to localhost. This will not work on a production server.');
    diagnostics.recommendations.push('   Update it to your production Strapi URL (e.g., https://your-strapi-server.com).');
  }

  if (!strapiToken) {
    diagnostics.recommendations.push('⚠️ STRAPI_API_TOKEN is not set. Some Strapi endpoints may require authentication.');
    diagnostics.recommendations.push('   Generate an API token in Strapi Admin: Settings > API Tokens');
  }

  // Check security headers configuration
  let strapiHostForCSP = '';
  let strapiProtocolForCSP = 'https';
  if (strapiUrl) {
    try {
      const url = new URL(strapiUrl);
      strapiHostForCSP = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
      strapiProtocolForCSP = url.protocol.replace(':', '');
    } catch (e) {
      // Invalid URL
    }
  }

  diagnostics.checks.securityHeaders = {
    strapiUrlInCSP: !!strapiHostForCSP,
    strapiProtocol: strapiProtocolForCSP,
    upgradeInsecureRequests: strapiProtocolForCSP === 'https' || !strapiHostForCSP,
    note: 'CSP headers are set at build time. If NEXT_PUBLIC_STRAPI_URL was not set during build, Strapi host may not be in CSP.',
    recommendation: strapiHostForCSP 
      ? `✓ Strapi host should be included in CSP: ${strapiHostForCSP}`
      : '⚠️ Strapi host not available for CSP check. Ensure NEXT_PUBLIC_STRAPI_URL is set before build.',
  };

  // Add CSP-related recommendations
  if (!strapiHostForCSP) {
    diagnostics.recommendations.push('⚠️ CSP Configuration: NEXT_PUBLIC_STRAPI_URL was not available during build.');
    diagnostics.recommendations.push('   Rebuild your application with NEXT_PUBLIC_STRAPI_URL set to ensure Strapi is allowed in CSP.');
  } else if (strapiProtocolForCSP === 'http') {
    diagnostics.recommendations.push('⚠️ Security: Strapi is using HTTP. Consider using HTTPS for production.');
    diagnostics.recommendations.push('   Note: upgrade-insecure-requests is disabled for HTTP Strapi to allow connections.');
  }

  // Overall status
  const hasCriticalIssues = 
    !strapiUrl || 
    strapiUrl.includes('localhost') ||
    !diagnostics.checks.strapiConnectivity.reachable;

  diagnostics.status = hasCriticalIssues ? '❌ Issues detected' : '✓ Configuration looks good';
  diagnostics.summary = {
    environmentVariablesOk: !!strapiUrl && !strapiUrl.includes('localhost'),
    strapiReachable: diagnostics.checks.strapiConnectivity.reachable === true,
    cspConfigured: !!strapiHostForCSP,
    overall: !hasCriticalIssues,
  };

  // Return response
  // In production, you might want to restrict this or add authentication
  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Add cache control to prevent caching diagnostic results
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

