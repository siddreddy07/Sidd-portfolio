import type { Project } from "../types";

// Screenshots captured from the live sites, stored in /public/projects/<slug>.png.
const LOCAL_SCREENSHOTS = new Set(["bsdk", "shraddha-media", "hook-lens"]);

const isCloudinaryVideo = (url: string) => url.includes("res.cloudinary.com") && url.includes("/video/upload/");

/** Still image for a card. Cloudinary serves a JPG frame from the same video asset. */
export function posterFor(p: Project): string | null {
  const t = p.thumbnail;
  if (t.type === "video" && isCloudinaryVideo(t.url)) {
    return t.url.replace("/video/upload/", "/video/upload/so_0,w_1000,q_auto,f_jpg/").replace(/\.\w+$/, ".jpg");
  }
  if (LOCAL_SCREENSHOTS.has(p.slug)) return `/projects/${p.slug}.png`;
  return null;
}

/** Lighter video for hover playback (Cloudinary resizes on the fly). */
export function videoFor(p: Project): string | null {
  const t = p.thumbnail;
  if (t.type === "video" && isCloudinaryVideo(t.url)) {
    return t.url.replace("/video/upload/", "/video/upload/w_720,q_auto/");
  }
  return null;
}

// Flat backdrop tints (no gradients). Mixed into the surface colour so they sit right in both themes.
const TINTS = ["#6f9bd1", "#d1a06f", "#6fc1c1", "#b08fd1", "#d18f8f", "#8f9fd1", "#cfc46f"];

/** Backdrop tint behind a project's screenshot, stable per project. */
export function tintFor(p: Project): string {
  return TINTS[(parseInt(p.num, 10) - 1) % TINTS.length] ?? TINTS[0];
}
