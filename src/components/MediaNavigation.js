'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MediaSearch from './MediaSearch';
import '../scss/components/MediaNavigation.scss';

export default function MediaNavigation({ onSearch, onYearChange, hideSearch = false, years = [] }) {
  const pathname = usePathname();

  // Media navigation links
  const mediaLinks = [
    { 
      id: 'press-releases', 
      label: 'Press Releases', 
      href: '/media/press-releases' 
    },
    { 
      id: 'media-coverage', 
      label: 'Media Coverage', 
      href: '/media/media-coverage' 
    },
    { 
      id: 'perspectives', 
      label: 'Perspectives', 
      href: '/media/perspectives' 
    },
    { 
      id: 'media-kit', 
      label: 'Media Kit', 
      href: '/media/media-kit' 
    }
    
  ];

  // Check if current path matches the link
  const isActive = (link) => {
    // For hash links, check if we're on the base /media page
    // (Note: hash links won't change pathname, so we consider them active when on /media)
    if (link.href.startsWith('/media#')) {
      return pathname === '/media';
    }
    // Exact match for all other paths
    return pathname === link.href;
  };

  return (
    <section className="media-navigation">
      {/* Decorative Petals */}
      <div className="media-navigation__petals media-navigation__petals--left">
        <Image
          src="/assets/media/small-petals.svg"
          alt=""
          width={218}
          height={413}
          className="media-navigation__petals-img"
          quality={100}
          unoptimized
        />
      </div>
      <div className="media-navigation__petals media-navigation__petals--right">
        <Image
          src="/assets/media/small-petals.svg"
          alt=""
          width={218}
          height={413}
          className="media-navigation__petals-img media-navigation__petals-img--flipped"
          quality={100}
          unoptimized
        />
      </div>
      
      <h2 className="media-navigation__heading">In this section</h2>
      <div className="media-navigation__tabs">
        {mediaLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={`media-navigation__tab ${isActive(link) ? 'media-navigation__tab--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      {/* Media Search - Only show if hideSearch is false */}
      {!hideSearch && (
        <div className="media-navigation__search">
          <MediaSearch 
            onSearch={onSearch}
            onYearChange={onYearChange}
            years={years}
          />
        </div>
      )}
    </section>
  );
}

