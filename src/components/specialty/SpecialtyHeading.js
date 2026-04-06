import '../../scss/components/specialty/SpecialtyHeading.scss';

export default function SpecialtyHeading({ data }) {
  if (!data) {
    return null;
  }

  // Handle different data structures
  let text = '';
  
  if (data.text) {
    text = data.text;
  } else if (typeof data === 'string') {
    text = data;
  }

  if (!text) {
    return null;
  }

  return (
    <section className="specialty-heading" data-node-id="3152:4">
      <div className="specialty-heading__container">
        <p className="specialty-heading__text" data-node-id="2957:1509">
          {text}
        </p>
      </div>
    </section>
  );
}

