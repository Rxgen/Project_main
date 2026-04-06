import Image from "next/image";
import TherapyMarkdown from "@/components/therapies/TherapyMarkdown";
import "@/scss/components/therapies/ResourceHub.scss";

const DEFAULT_HEADING = "Anti-Diabetes Resource Hub";
const DEFAULT_TEXT =
  "Explore educational resources designed to help patients and healthcare providers better understand diabetes management, treatment options, and lifestyle interventions";
const DEFAULT_POSTER = "/assets/images/india/therapies/resourcehub-banner.png";
const DEFAULT_VIDEO = "/agm/38th-agm.mp4";

export default function ResourceHub({ data }) {
  const heading = data?.heading || DEFAULT_HEADING;
  const description = data?.description || DEFAULT_TEXT;
  const posterSrc = data?.posterSrc || DEFAULT_POSTER;
  const useLegacyDefaults = data == null;
  const videoSrc = useLegacyDefaults ? DEFAULT_VIDEO : data.videoSrc || null;

  return (
    <div className="resource__container">
      <div className="resource-text">
        <h1 className="resource__heading">
          <TherapyMarkdown paragraphClassName="resource__heading-line">
            {heading}
          </TherapyMarkdown>
        </h1>
        <div className="resource__description">
          <TherapyMarkdown>{description}</TherapyMarkdown>
        </div>
      </div>
      <div className="resource-video-wrap">
        {videoSrc ? (
          <video
            className="resource-video"
            poster={posterSrc}
            controls
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="resource-poster-only">
            <Image
              src={posterSrc}
              alt=""
              width={1279}
              height={685}
              className="resource-poster-only__img"
            />
          </div>
        )}
      </div>
    </div>
  );
}
