import '../../scss/components/specialty/SpecialtyIntro.scss';

export default function SpecialtyIntro({ data }) {
  if (!data) {
    return null;
  }

  // Handle different data structures
  let text = '';
  
  if (data.text) {
    text = data.text;
  } else if (Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
    text = data.paragraphs.join(' ');
  } else if (typeof data === 'string') {
    text = data;
  }

  if (!text) {
    return null;
  }

  return (
    <section className="specialty-intro" data-node-id="2957:1373">
      <div className="specialty-intro__container">
        <div className="specialty-intro__box" data-node-id="2957:1373">
          <p className="specialty-intro__text" data-node-id="2957:1374">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

