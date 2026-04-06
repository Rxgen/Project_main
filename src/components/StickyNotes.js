import Image from 'next/image';
import Link from 'next/link';
import '../scss/components/StickyNotes.scss';

const DEFAULT_PRODUCT_FINDER = {
  href: '/product-finder',
  text: 'Product Finder',
};

export default function StickyNotes({ productFinder = DEFAULT_PRODUCT_FINDER } = {}) {
  const { href, text } = productFinder;

  return (
    <div className="hero__sticky-notes">
      <Link href={href} className="hero__note hero__note--product">
        <div className="hero__note-circle hero__note-circle--rotated">
          <Image
            src="/assets/circle-product-finder.svg"
            alt=""
            fill
            quality={100}
          />
        </div>
        <span className="hero__note-dot"></span>
        <span className="hero__note-text">{text}</span>
      </Link>
    </div>
  );
}
