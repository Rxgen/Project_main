import Link from 'next/link';
import '../../scss/components/specialty/SpecialtyCTA.scss';

export default function SpecialtyCTA({ data }) {
  if (!data) {
    return null;
  }

  const ctaData = data;

  const linkProps = ctaData.external ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  return (
    <section className="specialty-cta" data-node-id="3160:49">
      <div className="specialty-cta__container">
        <Link
          href={ctaData.href}
          className="specialty-cta__link"
          {...linkProps}
          data-node-id="2957:1510"
        >
          <span className="specialty-cta__text" data-node-id="2957:1511">
            {ctaData.text}
          </span>
          <svg
            className="specialty-cta__arrow"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-node-id="2957:1512"
          >
            <path
              d="M1 27L27 1M27 1H1M27 1V27"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}







