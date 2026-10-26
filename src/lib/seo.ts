// Page titles, descriptions and schema.org data for every route. Used in two places:
// at build time (seo/plugin.ts writes them into static HTML for crawlers) and in the app (useSeo on navigation).
import { SITE } from "../config/site";
import { experience, projects } from "../data";
import { PROFILE } from "../data/profile";
import { stack } from "../data/stack";
import type { Project } from "../types";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  type?: "website" | "profile" | "article";
  noindex?: boolean;
  jsonLd?: object;
}

export const absUrl = (path: string) => (path === "/" ? SITE.url : `${SITE.url}${path}`);
export const OG_IMAGE = `${SITE.url}/og-image.png`;

// Cut at a word boundary so search snippets don't end mid-word.
const clip = (s: string, n = 158) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n - 1))}…`);

const PERSON_ID = `${SITE.url}/#person`;
const personRef = { "@id": PERSON_ID };
const skills = stack.flatMap((g) => g.items);
const internships = experience.filter((e) => e.type === "INTERNSHIP");
const linkOf = (p: Project, label: string) => p.links.find((l) => l.label === label)?.url;

export const HOME_DESCRIPTION =
  "N Siddharth Reddy (siddreddy07) is a full stack developer from Visakhapatnam, India, building backend systems and AI apps with Node.js, React, RAG and AI agents.";

function person() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    alternateName: PROFILE.alternateNames,
    url: SITE.url,
    image: `${SITE.url}/profile-bw.jpg`,
    email: `mailto:${SITE.email}`,
    jobTitle: "Full Stack Developer",
    description: PROFILE.summary,
    address: { "@type": "PostalAddress", addressLocality: PROFILE.city, addressRegion: PROFILE.region, addressCountry: PROFILE.country },
    nationality: { "@type": "Country", name: "India" },
    knowsAbout: [...PROFILE.focus, ...skills],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: { "@type": "Country", name: "India" },
      skills: skills.join(", "),
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: PROFILE.education.school,
        url: PROFILE.education.schoolUrl,
        address: { "@type": "PostalAddress", addressLocality: PROFILE.city, addressCountry: PROFILE.country },
      },
      // Past internships, as schema.org roles so the dates and titles travel with the company.
      ...internships.map((e) => ({
        "@type": "OrganizationRole",
        roleName: e.role,
        startDate: PROFILE.roleDates[e.company]?.start,
        endDate: PROFILE.roleDates[e.company]?.end,
        alumniOf: { "@type": "Organization", name: e.company },
      })),
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: PROFILE.education.degree,
      recognizedBy: { "@type": "CollegeOrUniversity", name: PROFILE.education.school },
    },
    subjectOf: { "@type": "DigitalDocument", name: `Resume of ${SITE.name}`, url: SITE.resume },
    sameAs: [SITE.linkedin, SITE.github, SITE.x, `${SITE.url}/resume`],
  };
}

function projectSchema(p: Project) {
  const url = absUrl(`/projects/${p.slug}`);
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${url}#project`,
    name: p.name,
    description: p.desc,
    url,
    codeRepository: linkOf(p, "GitHub"),
    sameAs: [linkOf(p, "Live Site"), linkOf(p, "npm")].filter(Boolean),
    keywords: p.tags.join(", "),
    dateCreated: p.year,
    author: personRef,
  };
}

const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absUrl(it.path) })),
});

// Plain question/answer pairs: shown to answer engines as FAQPage data and in llms.txt.
export const FAQ: { q: string; a: string }[] = [
  {
    q: `Who is ${SITE.name}?`,
    a: `${SITE.name} is a full stack developer from ${PROFILE.city}, India, focused on backend systems and AI applications. ${SITE.name} studied ${PROFILE.education.degree} at ${PROFILE.education.school} (2021–2025). Portfolio: ${SITE.url}. LinkedIn: ${SITE.linkedin}. GitHub: ${SITE.github}.`,
  },
  {
    q: `What does ${SITE.name} build?`,
    a: `${PROFILE.summary} Projects include ${projects.map((p) => p.name).join(", ")} and SIFT.`,
  },
  {
    q: "What is BSDK?",
    a: `BSDK is an embeddable AI chat SDK built by ${SITE.name}. Developers add a branded chat widget (@bsdk/ui) to a website and run the AI flow server-side (@bsdk/server), with document-grounded answers from Cohere embeddings and Pinecone retrieval, and streamed responses through the Vercel AI SDK.`,
  },
  {
    q: `Where has ${SITE.name} worked?`,
    a: internships.map((e) => `${e.role} at ${e.company} (${e.years}): ${e.bullets[0]}`).join(" "),
  },
  {
    q: `What are ${SITE.name}'s technical skills?`,
    a: stack.map((g) => `${g.group}: ${g.items.join(", ")}.`).join(" "),
  },
  {
    q: `How can I contact or hire ${SITE.name}?`,
    a: `${SITE.name} is open to full-time roles. Email ${SITE.email}, connect on LinkedIn at ${SITE.linkedin}, or read the resume at ${SITE.url}/resume.`,
  },
];

export function homeMeta(): PageMeta {
  return {
    path: "/",
    title: `${SITE.name} · Full Stack Developer, Backend & AI`,
    description: HOME_DESCRIPTION,
    type: "profile",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, publisher: personRef, inLanguage: "en" },
        {
          "@type": "ProfilePage",
          "@id": `${SITE.url}/#profile`,
          url: SITE.url,
          name: `${SITE.name} — Portfolio`,
          isPartOf: { "@id": `${SITE.url}/#website` },
          mainEntity: personRef,
          about: personRef,
        },
        person(),
        {
          "@type": "ItemList",
          name: `Projects by ${SITE.name}`,
          itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absUrl(`/projects/${p.slug}`), name: p.name })),
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    },
  };
}

export function projectsMeta(): PageMeta {
  return {
    path: "/projects",
    title: `Projects · ${SITE.name}`,
    description: clip(`Projects by ${SITE.name}, full stack developer: ${projects.map((p) => p.name).join(", ")}. AI SDKs, AI agents, browser automation and developer tools.`),
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          url: absUrl("/projects"),
          name: `Projects by ${SITE.name}`,
          author: personRef,
          mainEntity: { "@type": "ItemList", itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: projectSchema(p) })) },
        },
        breadcrumb([{ name: SITE.name, path: "/" }, { name: "Projects", path: "/projects" }]),
        { "@type": "Person", "@id": PERSON_ID, name: SITE.name, url: SITE.url },
      ],
    },
  };
}

export function projectMeta(p: Project): PageMeta {
  const path = `/projects/${p.slug}`;
  return {
    path,
    title: `${p.name} · ${SITE.name}`,
    description: clip(`${p.name} by ${SITE.name}: ${p.desc}`),
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        projectSchema(p),
        breadcrumb([{ name: SITE.name, path: "/" }, { name: "Projects", path: "/projects" }, { name: p.name, path }]),
        { "@type": "Person", "@id": PERSON_ID, name: SITE.name, url: SITE.url },
      ],
    },
  };
}

export function notFoundMeta(path: string): PageMeta {
  return { path, title: `Page not found · ${SITE.name}`, description: HOME_DESCRIPTION, noindex: true };
}

/** Every indexable route, for prerendering and the sitemap. */
export function allRoutes(): PageMeta[] {
  return [homeMeta(), projectsMeta(), ...projects.map(projectMeta)];
}
