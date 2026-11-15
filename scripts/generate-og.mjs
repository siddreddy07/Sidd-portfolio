// Renders the 1200x630 social share images (public/og/*.png): one for home, /projects and every project.
// Uses the Chrome or Edge already on your machine (no extra dependency). Run: node scripts/generate-og.mjs
// Re-run it after changing a project's name/description or the screenshots, then commit public/og.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const outDir = path.join(pub, "og");
mkdirSync(outDir, { recursive: true });

const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const browser = process.env.CHROME_PATH || BROWSERS.find(existsSync);
if (!browser) throw new Error("No Chrome/Edge found. Set CHROME_PATH.");

const { projects } = JSON.parse(readFileSync(path.join(root, "src/data/projects.json"), "utf8"));
const SHOTS = { formly: "Formly.png", bsdk: "bsdk.png", "auto-browse": "autobrowse.png", "hook-lens": "hook-lens.png", "shraddha-media": "shraddha-media.png" };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fileUrl = (p) => pathToFileURL(p).href;
const dataUri = (p) => `data:${p.endsWith(".png") ? "image/png" : "image/jpeg"};base64,${readFileSync(p).toString("base64")}`;

const css = `
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap");
@import url("https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap");
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:630px;background:#080808;overflow:hidden}
body{position:relative;font-family:Satoshi,Inter,"Segoe UI",sans-serif;color:#f0ece4}
.glow{position:absolute;width:760px;height:760px;right:-200px;top:-260px;background:radial-gradient(circle,rgba(200,255,0,.20),transparent 65%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse at 70% 30%,#000,transparent 75%)}
.frame{position:absolute;inset:36px;border:1px solid rgba(255,255,255,.09);border-radius:28px}
.wrap{position:absolute;inset:36px;padding:52px 60px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font:500 22px "JetBrains Mono",monospace;color:#a39e96;letter-spacing:.02em}
.dot{width:12px;height:12px;border-radius:50%;background:#C8FF00;box-shadow:0 0 18px #C8FF00}
.mid{flex:1;display:flex;align-items:center;gap:48px;padding:24px 0}
.copy{flex:1;min-width:0}
.eyebrow{font:500 20px "JetBrains Mono",monospace;color:#C8FF00;text-transform:uppercase;letter-spacing:.14em;margin-bottom:22px}
h1{font:400 84px/1.02 "Instrument Serif",Georgia,serif;letter-spacing:-.01em}
h1 em{font-style:italic}
.sub{margin-top:24px;font-size:28px;line-height:1.35;color:#a39e96;max-width:620px}
.chips{display:flex;gap:10px;margin-right:24px;overflow:hidden}
.chip{white-space:nowrap;font:400 18px "JetBrains Mono",monospace;color:#d8d3ca;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);padding:7px 14px;border-radius:999px}
.foot{display:flex;justify-content:space-between;align-items:center}
.url{white-space:nowrap;flex:none;font:400 20px "JetBrains Mono",monospace;color:#6b6560}
.pill{display:inline-flex;align-items:center;gap:10px;margin-top:22px;font:500 20px Inter,sans-serif;color:#C8FF00;border:1px solid rgba(200,255,0,.35);background:rgba(200,255,0,.08);padding:9px 18px;border-radius:999px}
.pill i{width:9px;height:9px;border-radius:50%;background:#C8FF00;box-shadow:0 0 12px #C8FF00}
.shot{width:470px;height:300px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 90px rgba(200,255,0,.10);flex:none}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top left;display:block}
.pj h1{font-size:72px}
.pj.noshot h1{font-size:96px}
.hero h1.hl{font:400 72px/1.08 "Instrument Serif",Georgia,serif;color:#a39e96;max-width:1000px}
.hero h1.hl em{font-weight:700;font-style:italic;color:#f0ece4;border-bottom:3px solid #f0ece4;padding-bottom:2px}
.hero .who{font:700 34px Satoshi,sans-serif;letter-spacing:-.01em}
.hero .cap{margin-top:10px;font:400 18px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.16em;color:#a39e96}
.hero .intro{margin-top:24px;font-size:25px;line-height:1.45;color:#a39e96;max-width:900px}
.hero .intro b{font-weight:500;color:#f0ece4}
.hero .btn{display:inline-block;margin-top:26px;background:#C8FF00;color:#080808;font:600 24px Satoshi,sans-serif;padding:16px 30px;border-radius:16px}
.bigmark{font:italic 400 320px/1 "Instrument Serif",serif;color:rgba(200,255,0,.12);flex:none;padding-right:20px}
`;

const page = ({ eyebrow, title, sub, chips = [], side, cls = "", pill = "" }) => `<!doctype html><meta charset="utf-8"><style>${css}</style>
<body class="${cls}"><div class="glow"></div><div class="grid"></div><div class="frame"></div>
<div class="wrap">
  <div class="brand"><span class="dot"></span>N Siddharth Reddy</div>
  <div class="mid ${cls}"><div class="copy"><div class="eyebrow">${esc(eyebrow)}</div><h1>${title}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}${pill ? `<div class="pill"><i></i>${esc(pill)}</div>` : ""}</div>${side ?? ""}</div>
  <div class="foot"><div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div><div class="url">siddharth-portfolio-delta.vercel.app</div></div>
</div></body>`;

const jobs = [
  [
    "home",
    `<!doctype html><meta charset="utf-8"><style>${css}</style>
<body class="hero"><div class="glow"></div><div class="grid"></div><div class="frame"></div>
<div class="wrap" style="justify-content:space-between">
  <div><div class="who">N Siddharth Reddy</div><div class="cap">Full stack developer · Backend · AI</div></div>
  <div>
    <h1 class="hl">I build <em>backend systems</em> and the AI products that run on them.</h1>
    <p class="intro">I'm Siddharth, a <b>full-stack developer who likes backend work most</b>. Two internships, <b>BSDK</b> on npm, and I'm looking for my first full-time role.</p>
    <span class="btn">See what I've made →</span>
  </div>
  <div class="foot"><div></div><div class="url">siddharth-portfolio-delta.vercel.app</div></div>
</div></body>`,
  ],
  [
    "projects",
    page({
      eyebrow: "Selected work",
      title: `Projects &amp;<br><em>things I've shipped</em>`,
      sub: `${projects.length} builds: AI SDKs, agents, browser automation and developer tools.`,
      chips: ["BSDK", "Formly", "Auto Browse", "dbsmash"],
    }),
  ],
  ...projects.map((p) => {
    const shot = SHOTS[p.slug] && path.join(pub, "projects", SHOTS[p.slug]);
    const ok = shot && existsSync(shot);
    return [
      p.slug,
      page({
        cls: ok ? "pj" : "pj noshot",
        eyebrow: `${p.type} · ${p.year}`,
        title: esc(p.name),
        sub: p.descriptor.length > 110 ? `${p.descriptor.slice(0, p.descriptor.lastIndexOf(" ", 108))}…` : p.descriptor,
        chips: p.tags.slice(0, 3),
        side: ok ? `<div class="shot"><img src="${dataUri(shot)}"></div>` : "",
      }),
    ];
  }),
];

const tmp = path.join(outDir, ".tmp.html");
for (const [name, html] of jobs) {
  writeFileSync(tmp, html);
  const png = path.join(outDir, `${name}.png`);
  execFileSync(
    browser,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1200,630", "--virtual-time-budget=8000", `--screenshot=${png}`, fileUrl(tmp)],
    { stdio: "ignore" },
  );
  console.log("wrote", path.relative(root, png));
}
rmSync(tmp, { force: true });
