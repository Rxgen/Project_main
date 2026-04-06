// Dynamic robots.txt for Next.js
// This generates a robots.txt automatically

export default function robots() {
  // const baseUrl = 'https://www.lupin.com'; // Update with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
    ],
    sitemap: `https://www.lupin.com/sitemap.xml`,
    // host: baseUrl,
  };
}
