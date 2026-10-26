import { useEffect, useState } from "react";

export interface Track {
  playing: boolean;
  playedAt: string | null;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  url: string;
  /** True for the placeholder song shown when Spotify can't be reached. */
  demo?: boolean;
}

const REFRESH_MS = 30_000;

// Shown whenever Spotify can't be reached (missing keys, API error, nothing played), so the card never disappears.
// The GitHub graph stays green while this is showing, which is the sign that something is wrong live.
const DEMO: Track = {
  demo: true,
  playing: true,
  playedAt: null,
  title: "Blinding Lights",
  artist: "The Weeknd",
  album: "After Hours",
  image: "https://i.scdn.co/image/ab67616d00004851ef017e899c0547766997d874",
  url: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
};

async function load(): Promise<Track | null> {
  try {
    const res = await fetch("/api/now-playing");
    if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
      const track = (await res.json()) as Track | null;
      if (track) return track;
    }
  } catch {
    /* fall through */
  }
  return DEMO;
}

/** The song playing now, or the last one played; the demo song when Spotify isn't reachable. Null until loaded. */
export function useNowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let live = true;
    const read = () => load().then((t) => live && t && setTrack(t));

    read();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") read();
    }, REFRESH_MS);

    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);

  return track;
}

export function timeAgo(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export interface AlbumColors {
  a: string;
  b: string;
  /** Text colour that stays readable on top of `a` (near-black or white, whichever contrasts more). */
  on: string;
}

type Rgb = [number, number, number];


// Covers are often dark or muddy; keep the hue but lift saturation and lightness so the tint actually shows.
// Near-grey colours stay grey (a black-and-white cover should give neutral glass).
function vivid([r, g, b]: Rgb): string {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) {
    if (max === rn) h = ((gn - bn) / d + 6) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
  }
  if (s < 0.12) return `hsl(0 0% ${Math.round(Math.min(Math.max(l, 0.35), 0.7) * 100)}%)`;
  s = Math.max(s, 0.6);
  const light = Math.min(Math.max(l, 0.45), 0.6);
  return `hsl(${Math.round(h * 60)} ${Math.round(s * 100)}% ${Math.round(light * 100)}%)`;
}
const dist = (x: Rgb, y: Rgb) => Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);

// Two most characteristic colours of an image: bucket the pixels, favour vivid buckets over grey/black/white,
// then take the best one and the best one that's clearly different from it.
function palette(img: HTMLImageElement): AlbumColors | null {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map<number, { sum: Rgb; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { sum: [0, 0, 0] as Rgb, n: 0 };
    bucket.sum[0] += r;
    bucket.sum[1] += g;
    bucket.sum[2] += b;
    bucket.n++;
    buckets.set(key, bucket);
  }

  const ranked = [...buckets.values()]
    .map(({ sum, n }) => {
      const rgb = sum.map((v) => Math.round(v / n)) as Rgb;
      const max = Math.max(...rgb), min = Math.min(...rgb);
      const sat = max === 0 ? 0 : (max - min) / max;
      const light = (max + min) / 510;
      const usable = light > 0.12 && light < 0.9 ? 1 : 0.15;
      return { rgb, score: n * (0.25 + sat) * usable };
    })
    .sort((x, y) => y.score - x.score);

  if (!ranked.length) return null;
  const first = ranked[0].rgb;
  const second = ranked.find((c) => dist(c.rgb, first) > 80)?.rgb ?? first;
  const a = vivid(first);
  const b = vivid(second);
  return { a, b, on: readableOn(a, b) };
}

const colorCache = new Map<string, AlbumColors>();

/** Dominant colours of the album cover, for tinting the card. Null until the image has been read. */
export function useAlbumColors(src: string | null) {
  const [colors, setColors] = useState<AlbumColors | null>(() => (src && colorCache.get(src)) || null);

  useEffect(() => {
    if (!src) return setColors(null);
    const hit = colorCache.get(src);
    if (hit) return setColors(hit);

    let live = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const result = palette(img);
        if (!result) return;
        colorCache.set(src, result);
        if (live) setColors(result);
      } catch {
        /* canvas tainted (no CORS): keep the neutral glass */
      }
    };
    img.src = src;
    return () => {
      live = false;
    };
  }, [src]);

  return colors;
}

// WCAG relative luminance of an "hsl(h s% l%)" string.
function luminance(hsl: string): number {
  const [h, sp, lp] = hsl.match(/[\d.]+/g)!.map(Number);
  const s = sp / 100, l = lp / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
}

// Near-black or white, whichever keeps the better worst-case contrast across every colour of the gradient.
function readableOn(...colors: string[]): string {
  const Ls = colors.map(luminance);
  const dark = Math.min(...Ls.map((L) => (L + 0.05) / 0.05));
  const white = Math.min(...Ls.map((L) => 1.05 / (L + 0.05)));
  return dark >= white ? "#0b0b0b" : "#ffffff";
}

const ACCENT_VARS = ["--graph", "--album-hl", "--album-hl2", "--album-on"];

/**
 * Points page-wide accents at the album's main colour: the GitHub activity squares (--graph), the hero highlight
 * and the search palette's selected row (--album-hl, with --album-on for text). Without colours, theme defaults.
 */
export function useAlbumAccent(colors: AlbumColors | null) {
  useEffect(() => {
    const root = document.documentElement;
    if (!colors) return ACCENT_VARS.forEach((v) => root.style.removeProperty(v));
    // Not cleared on unmount, so the search palette keeps the colour on other pages too.
    root.style.setProperty("--graph", colors.a);
    root.style.setProperty("--album-hl", colors.a);
    root.style.setProperty("--album-hl2", colors.b);
    root.style.setProperty("--album-on", colors.on);
  }, [colors]);
}
