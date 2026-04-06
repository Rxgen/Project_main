import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download.pdf';

    if (!urlParam) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Define allowed hostnames (exact match only, no subdomains)
    const allowedHostnames = [
      'cmsuatlupin.blob.core.windows.net',
      'cmslupin.blob.core.windows.net',
    ];

    // Add Strapi URL hostname if available
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (strapiUrl) {
      try {
        const strapiHostname = new URL(strapiUrl).hostname;
        if (strapiHostname && !allowedHostnames.includes(strapiHostname)) {
          allowedHostnames.push(strapiHostname);
        }
      } catch (e) {
        // Invalid Strapi URL, skip it
      }
    }

    // Parse and validate the URL
    let urlObj;
    try {
      urlObj = new URL(urlParam);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // SECURITY: Validate hostname against allow-list (exact match only)
    // This prevents SSRF attacks by ensuring only whitelisted hosts are accessed
    const hostname = urlObj.hostname.toLowerCase();
    if (!allowedHostnames.includes(hostname)) {
      return NextResponse.json(
        { error: 'URL hostname not allowed' },
        { status: 403 }
      );
    }

    // SECURITY: Prevent path traversal attacks in pathname
    // Check for path traversal sequences like "../", "..\\", etc.
    let pathname = urlObj.pathname;
    if (pathname.includes('..') || pathname.includes('//') || pathname.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid path in URL' },
        { status: 400 }
      );
    }

    // SECURITY: Sanitize pathname - remove any encoded path traversal attempts
    // Normalize the pathname to prevent encoded attacks
    try {
      const decodedPath = decodeURIComponent(pathname);
      if (decodedPath.includes('..') || decodedPath.includes('//') || decodedPath.includes('\\')) {
        return NextResponse.json(
          { error: 'Invalid path in URL' },
          { status: 400 }
        );
      }
      // Normalize path - ensure it starts with / and doesn't have double slashes
      pathname = '/' + pathname.replace(/^\/+/, '').replace(/\/+/g, '/');
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid path encoding in URL' },
        { status: 400 }
      );
    }

    // SECURITY: Sanitize search parameters - only allow safe characters
    let safeSearchString = '';
    if (urlObj.search) {
      // Remove any potentially dangerous characters from search string
      const sanitizedSearch = urlObj.search.replace(/[<>'"\\]/g, '');
      if (sanitizedSearch !== urlObj.search) {
        return NextResponse.json(
          { error: 'Invalid characters in URL parameters' },
          { status: 400 }
        );
      }
      safeSearchString = sanitizedSearch;
    }

    // SECURITY: Only allow HTTPS protocol (prevent SSRF to internal services)
    if (urlObj.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Only HTTPS URLs are allowed' },
        { status: 400 }
      );
    }

    // SECURITY: Construct URL using ONLY validated hostname from allow-list
    // Do NOT use urlObj.hostname directly - use the validated hostname from allow-list
    const validatedHostname = allowedHostnames.find(h => h.toLowerCase() === hostname);
    if (!validatedHostname) {
      return NextResponse.json(
        { error: 'URL hostname validation failed' },
        { status: 403 }
      );
    }

    // Construct safe URL using ONLY validated components (no user input in hostname)
    const safeUrl = `https://${validatedHostname}${pathname}${safeSearchString}`;

    // SECURITY: Final validation - ensure constructed URL is safe
    let finalUrlObj;
    try {
      finalUrlObj = new URL(safeUrl);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to construct valid URL' },
        { status: 400 }
      );
    }

    // SECURITY: Verify final URL matches our validation
    if (finalUrlObj.hostname.toLowerCase() !== validatedHostname.toLowerCase() ||
        finalUrlObj.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'URL validation failed' },
        { status: 403 }
      );
    }

    // Fetch the file from the validated URL
    const response = await fetch(safeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file' },
        { status: response.status }
      );
    }

    // Get the file as a blob
    const blob = await response.blob();

    // Return the file with proper headers to force download
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': blob.size.toString(),
      },
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

