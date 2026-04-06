import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "../scss/main.scss";
import { generateMetadata as generateSEOMetadata, defaultSEO } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyNotes from "@/components/StickyNotes";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalyticsScripts from "@/components/GoogleAnalyticsScripts";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-inter",
});

// Generate metadata for the root layout
export const metadata = generateSEOMetadata({
  title: defaultSEO.title,
  description: defaultSEO.description,
  canonicalUrl: defaultSEO.siteUrl,
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
});

export default async function RootLayout({ children }) {
  const hdrs = await headers();
  const minimalChrome = hdrs.get('x-lupin-minimal-chrome') === '1';

  return (
    <html lang="en">
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable}`}>
        {!minimalChrome && <Header />}
        {children}
        {!minimalChrome && <Footer />}
        {!minimalChrome && <StickyNotes />}
        <CookieConsent />
        <GoogleAnalyticsScripts />
      </body>
    </html>
  );
}
