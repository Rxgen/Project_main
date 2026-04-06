import '../../scss/components/specialty/SpecialtyContent.scss';

export default function SpecialtyContent({ data, children }) {
  return (
    <section className="specialty-content">
      <div className="specialty-content__container">
        {children || (
          <div className="specialty-content__placeholder">
            {/* Content will be added here */}
          </div>
        )}
      </div>
    </section>
  );
}

