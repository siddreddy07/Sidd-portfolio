// Build-time SEO: injects each route's meta tags, schema.org data and a plain-HTML copy of its content into
// static files, so search engines and AI crawlers that don't run JavaScript still see the real page.
// Also writes sitemap.xml, robots.txt and llms.txt. Page data comes from src/lib/seo.ts.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { SITE } from "../src/config/site";
import { experience, projects } from "../src/data";
import { PROFILE } from "../src/data/profile";
import { stack } from "../src/data/stack";
import { absUrl, allRoutes, FAQ, homeMeta, OG_IMAGE, type PageMeta } from "../src/lib/seo";
import type { Project } from "../src/types";

const HEAD = /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/;
const BODY = /<!--seo:body-->[\s\S]*?<!--\/seo:body-->/;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

interface Verification {
  google?: string;
  bing?: string;
}

function headTags(meta: PageMeta, verify: Verification) {
  const url = absUrl(meta.path);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    `<meta name="author" content="${esc(SITE.name)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type ?? "website"}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${SITE.name} — ${SITE.role}`)}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:creator" content="@${SITE.x.split("/").pop()}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ];
  if (verify.google) tags.push(`<meta name="google-site-verification" content="${esc(verify.google)}" />`);
  if (verify.bing) tags.push(`<meta name="msvalidate.01" content="${esc(verify.bing)}" />`);
  if (meta.jsonLd) tags.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`);
  return tags.map((t) => `    ${t}`).join("\n");
}

// --- Plain-HTML page bodies. React replaces these on load; crawlers without JavaScript read them as-is. ---

const links = (items: { label: string; url: string }[]) =>
  items.map((l) => `<a href="${esc(l.url)}">${esc(l.label)}</a>`).join(" · ");

const contactLinks = () =>
  links([
    { label: "Resume", url: `${SITE.url}/resume` },
    { label: "LinkedIn", url: SITE.linkedin },
    { label: "GitHub", url: SITE.github },
    { label: "Email", url: `mailto:${SITE.email}` },
  ]);

const projectItem = (p: Project) =>
  `<li><h3><a href="/projects/${p.slug}">${esc(p.name)}</a> (${p.year})</h3><p>${esc(p.desc)}</p><p>${esc(p.tags.join(" · "))}</p></li>`;

function homeBody() {
  return `<header><h1>${esc(SITE.name)}</h1><p>${esc(SITE.role)} · ${esc(PROFILE.city)}, India · ${esc(SITE.availability)}</p><p>${contactLinks()}</p></header>
<section><h2>About</h2><p>${esc(PROFILE.summary)}</p></section>
<section><h2>Experience</h2><ul>${experience
    .filter((e) => e.type === "INTERNSHIP")
    .map((e) => `<li><h3>${esc(e.role)} · ${esc(e.company)} (${esc(e.years)})</h3><ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></li>`)
    .join("")}</ul></section>
<section><h2>Projects</h2><ul>${projects.map(projectItem).join("")}${PROFILE.extraProjects
    .map((x) => `<li><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p><p>${esc(x.tags.join(" · "))}</p></li>`)
    .join("")}</ul><p><a href="/projects">All projects</a></p></section>
<section><h2>Skills</h2><ul>${stack.map((g) => `<li><strong>${esc(g.group)}:</strong> ${esc(g.items.join(", "))}</li>`).join("")}</ul></section>
<section><h2>Education</h2><p>${esc(PROFILE.education.degree)}, ${esc(PROFILE.education.school)} (Dec 2021 – Apr 2025) · ${esc(PROFILE.education.grade)}</p></section>
<section><h2>Questions</h2>${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>`;
}

const projectsBody = () =>
  `<h1>Projects by ${esc(SITE.name)}</h1><ul>${projects.map(projectItem).join("")}</ul><p><a href="/">${esc(SITE.name)} — home</a> · ${contactLinks()}</p>`;

function projectBody(p: Project) {
  return `<p><a href="/">${esc(SITE.name)}</a> / <a href="/projects">Projects</a></p>
<h1>${esc(p.name)}</h1><p>${esc(p.descriptor)}</p><p>Built by ${esc(SITE.name)} · ${esc(p.type)} · ${p.year}</p>
<p>${esc(p.overview)}</p>
<ul>${p.specs.map((s) => `<li><strong>${esc(s.label)}:</strong> ${esc(s.value)}</li>`).join("")}</ul>
<p>${esc(p.tags.join(" · "))}</p><p>${links(p.links)}</p>`;
}

function bodyFor(meta: PageMeta) {
  const inner =
    meta.path === "/" ? homeBody() : meta.path === "/projects" ? projectsBody() : projectBody(projects.find((p) => meta.path === `/projects/${p.slug}`)!);
  return `<main style="max-width:720px;margin:0 auto;padding:48px 20px;line-height:1.6">${inner}</main>`;
}

// --- Crawler files ---

function sitemap(routes: PageMeta[]) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((r) => `  <url>\n    <loc>${absUrl(r.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.path === "/" ? "1.0" : r.path === "/projects" ? "0.8" : "0.7"}</priority>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// Search engines and AI answer engines are all welcome; only the serverless API is off limits.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];
const robots = () =>
  `User-agent: *\n${AI_BOTS.map((b) => `User-agent: ${b}`).join("\n")}\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`;

// https://llmstxt.org: a plain summary for AI assistants answering questions about the site's owner.
function llmsTxt() {
  return `# ${SITE.name}

> ${SITE.name} (${PROFILE.alternateNames.join(", ")}) is a full stack developer focused on backend systems and AI applications, from ${PROFILE.city}, ${PROFILE.region}, India. ${SITE.availability}.

${PROFILE.summary}

## Links

- [Portfolio](${SITE.url}): projects, experience and contact
- [Resume](${SITE.url}/resume): full resume (Google Drive)
- [LinkedIn](${SITE.linkedin})
- [GitHub](${SITE.github})
- [X](${SITE.x})
- Email: ${SITE.email}

## Experience

${experience
  .filter((e) => e.type === "INTERNSHIP")
  .map((e) => `- **${e.role}, ${e.company}** (${e.years})\n${e.bullets.map((b) => `  - ${b}`).join("\n")}`)
  .join("\n")}

## Projects

${projects.map((p) => `- [${p.name}](${absUrl(`/projects/${p.slug}`)}) (${p.year}): ${p.desc} Links: ${p.links.map((l) => `[${l.label}](${l.url})`).join(", ")}`).join("\n")}
${PROFILE.extraProjects.map((x) => `- ${x.name}: ${x.desc}`).join("\n")}

## Skills

${stack.map((g) => `- ${g.group}: ${g.items.join(", ")}`).join("\n")}

## Education

- ${PROFILE.education.degree}, ${PROFILE.education.school} (Dec 2021 – Apr 2025), ${PROFILE.education.grade}

## FAQ

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}
`;
}

// "/" -> index.html, "/projects" -> projects.html, "/projects/bsdk" -> projects/bsdk.html (served via vercel.json rewrites).
const fileFor = (route: string) => (route === "/" ? "index.html" : `${route.slice(1)}.html`);

export default function seo(verify: Verification): Plugin {
  let outDir = "dist";
  let isBuild = false;

  return {
    name: "seo",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === "build";
    },
    transformIndexHtml(html) {
      const home = homeMeta();
      return html
        .replace("<!--seo:head-->", `<!--seo:head-->\n${headTags(home, verify)}\n    <!--/seo:head-->`)
        .replace("<!--seo:body-->", `<!--seo:body-->${bodyFor(home)}<!--/seo:body-->`);
    },
    closeBundle() {
      if (!isBuild) return;
      const template = readFileSync(path.join(outDir, "index.html"), "utf8");
      const routes = allRoutes();
      for (const meta of routes) {
        if (meta.path === "/") continue;
        const html = template
          .replace(HEAD, `<!--seo:head-->\n${headTags(meta, verify)}\n    <!--/seo:head-->`)
          .replace(BODY, `<!--seo:body-->${bodyFor(meta)}<!--/seo:body-->`);
        const file = path.join(outDir, fileFor(meta.path));
        mkdirSync(path.dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      writeFileSync(path.join(outDir, "sitemap.xml"), sitemap(routes));
      writeFileSync(path.join(outDir, "robots.txt"), robots());
      writeFileSync(path.join(outDir, "llms.txt"), llmsTxt());
    },
  };
}
