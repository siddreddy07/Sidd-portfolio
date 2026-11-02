// Animated favicon, drawn on a small canvas and swapped into <link rel="icon"> while the tab is visible.
// Works in Chrome, Edge, Firefox and Safari (animated SVG/GIF favicons only move in Firefox).
//
//   Playing now:      three equaliser bars in the album colour.
//   Not playing:      the bar loop (draws in under "NS", a glint runs across, slides out) in the last song's colour.
//   Default:          the same bar loop in lime, when Spotify can't be reached.
//
// Hidden tabs and prefers-reduced-motion get one still frame, and public/favicon.svg stays the default for
// crawlers, bookmarks and no-JS visitors.

const SIZE = 64;
const FPS = 20;
const LOOP_MS = 5200;
const BG = "#080808";
const INK = "#f0ece4";
const LIME = "#c8ff00";
const BAR = { x: 12, y: 49, w: 40, h: 4 };

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let link: HTMLLinkElement | null = null;
let timer: number | undefined;
let started = 0;
let font = "italic bold 34px Georgia, 'Times New Roman', serif";
let weight = 1.4; // extra outline in the ink colour; thicker for Instrument Serif, which has no bold weight
let accent = LIME; // album colour of the current / last played song, lime by default
let playing = false;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const phase = (ms: number, from: number, to: number) => clamp01((ms - from) / (to - from));

interface Glyph {
  dy: number; // vertical offset in px
  alpha: number;
  scale: number;
}

function background(c: CanvasRenderingContext2D) {
  c.clearRect(0, 0, SIZE, SIZE);
  c.fillStyle = BG;
  c.fillRect(0, 0, SIZE, SIZE);
}

function glyph(c: CanvasRenderingContext2D, ch: string, x: number, g: Glyph, color: string) {
  if (g.alpha <= 0.01) return;
  c.save();
  c.globalAlpha *= g.alpha;
  c.translate(x, 43 + g.dy);
  c.scale(g.scale, g.scale);
  c.fillStyle = color;
  c.strokeStyle = color;
  // Fill plus a same-colour stroke makes the letters properly bold at tab size.
  c.lineJoin = "round";
  c.lineWidth = weight;
  c.strokeText(ch, 0, 0);
  c.fillText(ch, 0, 0);
  c.restore();
}

// "N" and "S" drawn separately so they can move. `accentRanges` are [x0, x1] canvas strips painted in `accent`.
function letters(c: CanvasRenderingContext2D, n: Glyph, s: Glyph, accent: string, accentRanges: [number, number][] = []) {
  c.font = font;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  const wn = c.measureText("N").width;
  const ws = c.measureText("S").width;
  const left = 32 - (wn + ws) / 2;
  const xn = left + wn / 2;
  const xs = left + wn + ws / 2;

  glyph(c, "N", xn, n, INK);
  glyph(c, "S", xs, s, INK);
  const ranges = accentRanges.filter(([x0, x1]) => x1 - x0 > 0.2);
  if (!ranges.length) return;

  c.save();
  c.beginPath();
  for (const [x0, x1] of ranges) c.rect(x0, 0, x1 - x0, SIZE);
  c.clip();
  glyph(c, "N", xn, n, accent);
  glyph(c, "S", xs, s, accent);
  c.restore();
}

const STILL: Glyph = { dy: 0, alpha: 1, scale: 1 };

// Idle loop, `ms` into it. The colour passes between the bar and the letters: wherever the bar isn't, the letters
// above it carry the colour. So the bar growing drains the colour out of "NS" (left to right), and the bar sliding
// out pours it back in.
//   0-300     "NS" in colour, no bar
//   300-1100  bar draws in, "NS" turns white
//   1300-2100 glint runs along the bar
//   3300-4300 bar slides out to the right, "NS" fills with colour behind it
//   4300-5200 hold, then repeat
function drawSweep(c: CanvasRenderingContext2D, ms: number, color: string) {
  background(c);

  const grow = easeInOut(phase(ms, 300, 1100));
  const leave = easeInOut(phase(ms, 3300, 4300));
  const x0 = BAR.x + BAR.w * leave;
  const x1 = BAR.x + BAR.w * grow;

  // Map the bar's span across the whole icon so the letters' colour lines up with what the bar has given up.
  const toCanvas = (x: number) => ((x - BAR.x) / BAR.w) * SIZE;
  letters(c, STILL, STILL, color, [
    [0, toCanvas(x0)],
    [toCanvas(x1), SIZE],
  ]);

  if (x1 - x0 > 0.5) {
    c.fillStyle = color;
    c.shadowColor = color;
    c.shadowBlur = 8;
    c.fillRect(x0, BAR.y, x1 - x0, BAR.h);
    c.shadowBlur = 0;

    // A soft white glint runs along the bar once it's full.
    const g = phase(ms, 1300, 2100);
    if (g > 0 && g < 1) {
      const gx = BAR.x - 10 + (BAR.w + 20) * easeInOut(g);
      const grad = c.createLinearGradient(gx - 8, 0, gx + 8, 0);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.9)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      c.save();
      c.beginPath();
      c.rect(x0, BAR.y, x1 - x0, BAR.h);
      c.clip();
      c.fillStyle = grad;
      c.fillRect(gx - 8, BAR.y, 16, BAR.h);
      c.restore();
    }
  }
}

// Playing: three bars bouncing on offset sine waves in the album colour; "NS" stays white and bobs to the beat.
function drawMusic(c: CanvasRenderingContext2D, ms: number, color: string) {
  background(c);
  const t = ms / 1000;
  const bars = [
    Math.abs(Math.sin(t * 5.1)) * 0.75 + 0.25,
    Math.abs(Math.sin(t * 3.7 + 1.3)) * 0.75 + 0.25,
    Math.abs(Math.sin(t * 6.3 + 2.1)) * 0.75 + 0.25,
  ];
  const beat = (bars[0] + bars[1] + bars[2]) / 3;
  // N and S bob slightly out of step.
  letters(c, { dy: -2.5 * bars[0], alpha: 1, scale: 0.94 + 0.1 * beat }, { dy: -2.5 * bars[2], alpha: 1, scale: 0.94 + 0.1 * beat }, color);

  const w = 8;
  const gap = 6;
  const maxH = 12;
  const left = 32 - (3 * w + 2 * gap) / 2;
  const bottom = BAR.y + BAR.h + 6;
  c.fillStyle = color;
  c.shadowColor = color;
  c.shadowBlur = 6;
  bars.forEach((v, i) => {
    const h = Math.max(2, v * maxH);
    c.fillRect(left + i * (w + gap), bottom - h, w, h);
  });
  c.shadowBlur = 0;
}

function paint(ms: number) {
  if (!ctx || !canvas || !link) return;
  if (playing) drawMusic(ctx, ms, accent);
  else drawSweep(ctx, ms % LOOP_MS, accent);
  link.href = canvas.toDataURL("image/png");
}

function stop() {
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
}

function play() {
  stop();
  if (document.visibilityState !== "visible" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Background tabs are throttled to ~1 frame a second, so show a clean still frame instead of a stutter.
    paint(2600); // bar full in the accent colour, white "NS"
    return;
  }
  started = performance.now();
  timer = window.setInterval(() => paint(performance.now() - started), 1000 / FPS);
}

/** Starts the animated favicon. Safe to call more than once. */
export function startAnimatedFavicon() {
  if (canvas || typeof document === "undefined") return;
  canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Our own <link>, added last so it wins over the static SVG without removing it.
  link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  document.head.append(link);

  // Use the site's display serif once it has loaded.
  document.fonts?.load("italic 30px 'Instrument Serif'").then((faces) => {
    if (faces.length) {
      font = "italic 40px 'Instrument Serif', Georgia, serif";
      weight = 3;
    }
  });

  document.addEventListener("visibilitychange", play);
  play();
}

/**
 * Follows Spotify: `color` is the current or last played song's album colour (null = lime default) and
 * `isPlaying` switches the bar loop to the equaliser.
 */
export function setFaviconTrack(color: string | null, isPlaying: boolean) {
  const next = color ?? LIME;
  const nowPlaying = isPlaying && !!color;
  if (next === accent && nowPlaying === playing) return;
  accent = next;
  playing = nowPlaying;
  if (canvas) play();
}
