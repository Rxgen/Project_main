'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import '../scss/components/NavigationLinks.scss';

export default function NavigationLinks({ links }) {
  const pathname = usePathname();

  // Default links for investor pages
  const defaultLinks = [
    { id: 'share-price', label: 'Share Price', href: '/investors/share-price' },
    { id: 'analyst-coverage', label: 'Analyst Coverage', href: '/investors/analyst-coverage' },
    { id: 'shareholding-pattern', label: 'Shareholding Pattern', href: '/investors/shareholding-pattern' },
    { id: 'dividend', label: 'Dividend', href: '/investors/dividend' },
    { id: 'unclaimed-dividend', label: 'Unclaimed Dividend and Shares', href: '/investors/unclaimed-dividend' },
    { id: 'subsidiaries', label: 'Subsidiaries', href: '/investors/subsidiaries' },
    { id: 'memorandum', label: 'Memorandum and Articles of Association', href: '/assets/share-price/Lupin-Revised-MOA-AOA-Lupin-Limited.pdf', target: '_blank' },
    { id: 'investor-faqs', label: 'Investor FAQs', href: '/investors/investor-faqs' },
    { id: 'business-responsibility', label: 'Business Responsibility', href: '/assets/share-price/business-responsiblity-report.pdf', target: '_blank' }
  ];

  // Use provided links or default links
  const navigationLinks = links || defaultLinks;

  return (
    <div className="navigation-links">
      <div className="navigation-links__row navigation-links__row--1">
        {navigationLinks.slice(0, 5).map((link) => (
          <Link
            key={link.id}
            href={link.href}
            target={link.target || undefined}
            className={`navigation-links__tab ${pathname === link.href ? 'navigation-links__tab--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {navigationLinks.length > 5 && (
        <div className="navigation-links__row navigation-links__row--2">
          {navigationLinks.slice(5).map((link) => (
            <Link
              key={link.id}
              href={link.href}
              target={link.target || undefined}
              className={`navigation-links__tab ${pathname === link.href ? 'navigation-links__tab--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

