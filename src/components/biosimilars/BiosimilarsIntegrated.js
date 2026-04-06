import '../../scss/components/biosimilars/BiosimilarsIntegrated.scss';

export default function BiosimilarsIntegrated({ data }) {
  // Default data from Figma design
  const contentData = data || {
    text: "This integrated model enables Lupin to develop complex biosimilars efficiently while maintaining consistency, quality, and supply reliability."
  };

  return (
    <section className="biosimilars-integrated" data-node-id="3279:116">
      <div className="biosimilars-integrated__container">
        <p className="biosimilars-integrated__text" data-node-id="2875:474">
          {contentData.text}
        </p>
      </div>
    </section>
  );
}

