'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';

/**
 * Preview frame without a poster image:
 * - Media fragment (#t=1) nudges many browsers to decode a visible frame.
 * - loadeddata/canplay seeks slightly in if still at the start (handles CDNs that ignore #t).
 * - First play jumps to 0 so the full clip plays from the beginning.
 */
export default function ManualVideoPlayer({ src, poster }) {
  const ref = useRef(null);
  const firstPlayRef = useRef(true);

  const cleanSrc = useMemo(() => src.split('#')[0], [src]);
  // Skip typical black/opening titles (~2s); many hosts ignore #t but it helps when supported
  const videoSrc = poster ? src : `${cleanSrc}#t=2`;

  useEffect(() => {
    firstPlayRef.current = true;
  }, [cleanSrc]);

  useEffect(() => {
    const video = ref.current;
    if (!video || poster) return;

    const seekPreviewIfNeeded = () => {
      const d = video.duration;
      if (!d || !Number.isFinite(d) || d <= 0) return;
      // Fragment or prior logic already showed a later frame
      if (video.currentTime >= 0.5) return;
      const t = Math.min(6, Math.max(1, d * 0.08));
      try {
        video.currentTime = t;
      } catch {
        /* ignore */
      }
    };

    video.addEventListener('loadeddata', seekPreviewIfNeeded);
    video.addEventListener('canplay', seekPreviewIfNeeded);

    if (video.readyState >= 2) {
      seekPreviewIfNeeded();
    }

    return () => {
      video.removeEventListener('loadeddata', seekPreviewIfNeeded);
      video.removeEventListener('canplay', seekPreviewIfNeeded);
    };
  }, [videoSrc, poster]);

  const onPlay = useCallback(
    (e) => {
      if (poster) return;
      if (!firstPlayRef.current) return;
      firstPlayRef.current = false;
      try {
        e.currentTarget.currentTime = 0;
      } catch {
        /* ignore */
      }
    },
    [poster]
  );

  return (
    <video
      key={cleanSrc}
      ref={ref}
      className="user-manual-videos__player"
      controls
      playsInline
      preload="auto"
      src={videoSrc}
      poster={poster || undefined}
      onPlay={onPlay}
    >
      Your browser does not support the video tag.
    </video>
  );
}
