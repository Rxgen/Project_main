import '../../scss/components/biosimilars/BiosimilarsContent.scss';

export default function BiosimilarsContent({ data, children }) {
  return (
    <section className="biosimilars-content">
      <div className="biosimilars-content__container">
        {children || (
          <div className="biosimilars-content__placeholder">
            {/* Content will be added here */}
          </div>
        )}
      </div>
    </section>
  );
}

