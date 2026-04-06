import { NextResponse } from 'next/server';
import { getRedirectForPathname } from './lib/cms-redirects-runtime';

/**
 * Build CSP with strict-dynamic + nonce (VAPT-recommended).
 * - script-src: 'strict-dynamic' + nonce removes host allowlist bypass and 'unsafe-inline'.
 * - Next.js applies the nonce to its scripts when x-nonce is set on the request.
 */
function buildCSP(nonce) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    // 'unsafe-inline' required for Next.js inline hydration scripts; otherwise React never hydrates and click events fail.
    "script-src 'self' 'unsafe-inline' https://googleads.g.doubleclick.net https://www.googletagmanager.com https://analytics.google.com https://www.google-analytics.com https://www.google.com https://www.recaptcha.net https://www.gstatic.com https://iepfqueryservices.dolphininfotek.co.in",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://i.ytimg.com https://yt3.ggpht.com https://www.gstatic.com https://cmsuatlupin.blob.core.windows.net https://www.lupin.com https://cms-lupin-uat-ckhucnecaybdhdhv.centralindia-01.azurewebsites.net https://cms.lupin.com https://www.google.co.in https://www.google.com https://www.googleadservices.com",
    "media-src 'self' blob: https://cmsuatlupin.blob.core.windows.net https://www.lupin.com https://cms-lupin-uat-ckhucnecaybdhdhv.centralindia-01.azurewebsites.net https://cms.lupin.com",
    "connect-src 'self' https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.google.com https://www.google.co.in https://www.googleadservices.com https://www.recaptcha.net https://content.dionglobal.in https://cms-lupin-uat-ckhucnecaybdhdhv.centralindia-01.azurewebsites.net https://cms.lupin.com https://cms-lupin-prd-hth8d7awgya7eme8.centralindia-01.azurewebsites.net https://iepfqueryservices.dolphininfotek.co.in",
    "frame-src https://www.googletagmanager.com https://content.dionglobal.in https://www.youtube.com https://youtube.com https://m.youtube.com https://www.youtube-nocookie.com https://www.google.com https://www.recaptcha.net",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const cmsHit = await getRedirectForPathname(pathname);
  if (cmsHit) {
    const status = cmsHit.permanent ? 301 : 302;
    if (
      cmsHit.destination.startsWith('http://') ||
      cmsHit.destination.startsWith('https://')
    ) {
      return NextResponse.redirect(cmsHit.destination, status);
    }
    return NextResponse.redirect(
      new URL(cmsHit.destination, request.nextUrl.origin),
      status
    );
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = buildCSP(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  if (/^\/video\/how-to-use-semaglutide-pen-injection-video\.mp4\/?$/.test(pathname)) {
    requestHeaders.set('x-lupin-minimal-chrome', '1');
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
