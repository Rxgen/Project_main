import '../scss/components/PatientSupportProgramsLookingAhead.scss';

export default function PatientSupportProgramsLookingAhead({ data }) {
  // Default data from Figma design
  const lookingAheadData = data || {
    heading: "Looking Ahead",
    content: "Through our Patient Support Programs, we aim to continue empowering patients and strengthening healthcare access at the grassroots level in India. We are committed to improving outcomes through efficient diagnosis and intervention, driven by our steadfast innovation, collaboration, and compassion."
  };

  return (
    <section className="patient-support-programs-looking-ahead" data-node-id="2955:50">
      <div className="patient-support-programs-looking-ahead__background" data-node-id="2955:51"></div>
      <div className="patient-support-programs-looking-ahead__container" data-node-id="2955:52">
        <h2 className="patient-support-programs-looking-ahead__heading" data-node-id="2955:53">
          {lookingAheadData.heading}
        </h2>
        <p className="patient-support-programs-looking-ahead__content" data-node-id="2955:54">
          {lookingAheadData.content}
        </p>
      </div>
    </section>
  );
}

