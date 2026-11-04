import { useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Project } from "../../types";
import { posterFor, videoFor } from "../../lib/media";

/**
 * The project's video or screenshot, nothing else. Falls back step by step: video → screenshot → nothing.
 * A video that fails to load shows the screenshot; a screenshot that fails hides the block, so there is never
 * an empty frame or broken-image icon. Reduced motion shows the screenshot instead of playing the video.
 */
export default function ProjectMedia({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const poster = posterFor(project);
  const video = videoFor(project);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const playVideo = video && !videoFailed && !(reduce && poster);
  const showPoster = !playVideo && poster && !posterFailed;
  if (!playVideo && !showPoster) return null;

  return (
    <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border-studio bg-surface-studio">
      {playVideo ? (
        <video
          key={video}
          src={video}
          poster={poster && !posterFailed ? poster : undefined}
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          aria-label={`${project.name} demo video`}
          className="absolute inset-0 size-full object-cover object-top"
        />
      ) : (
        <img
          src={poster!}
          alt={`${project.name} screenshot`}
          decoding="async"
          onError={() => setPosterFailed(true)}
          className="absolute inset-0 size-full object-cover object-top"
        />
      )}
    </figure>
  );
}
