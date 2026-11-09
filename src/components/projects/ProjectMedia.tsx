import { useState } from "react";
import type { Project } from "../../types";
import { posterFor, videoFor } from "../../lib/media";

/**
 * The project's screenshot first, always. If the project has a demo video, a liquid-glass "Play demo" button sits
 * on the image; the video only loads and plays after it is clicked. No video (or it fails) means no button.
 */
export default function ProjectMedia({ project }: { project: Project }) {
  const poster = posterFor(project);
  const video = videoFor(project);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const hasVideo = !!video && !videoFailed;
  const showPoster = !!poster && !posterFailed;
  if (!hasVideo && !showPoster) return null;
  const showVideo = hasVideo && (playing || !showPoster);

  return (
    <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border-studio bg-surface-studio">
      {showVideo ? (
        <video
          key={video}
          src={video}
          poster={showPoster ? poster! : undefined}
          autoPlay
          controls
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          aria-label={`${project.name} demo video`}
          className="absolute inset-0 size-full object-cover object-top"
        />
      ) : (
        <>
          <img
            src={poster!}
            alt={`${project.name} screenshot`}
            decoding="async"
            onError={() => setPosterFailed(true)}
            className="absolute inset-0 size-full object-cover object-top"
          />
          {hasVideo && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="live-glossy absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium hover:scale-105"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
              Play demo
            </button>
          )}
        </>
      )}
    </figure>
  );
}
