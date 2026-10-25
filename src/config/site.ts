export const SITE = {
  url: "https://siddharth-portfolio-delta.vercel.app",
  name: "N Siddharth Reddy",
  shortName: "Siddharth Reddy",
  role: "Full Stack Developer — Backend & AI Applications",
  headline: "I build backend systems, and the AI products that run on them.",
  availability: "Open to full-time roles",
  location: "VSKP, India",
  email: "siddharthreddy627@gmail.com",
  github: "https://github.com/siddreddy07",
  linkedin: "https://www.linkedin.com/in/n-siddharth-reddy/",
  x: "https://x.com/siddreddy007",
  resume:
    "https://drive.google.com/file/d/1xYhDHANWX0kXd4HAZ0KDmCIlOyyVdyKC/view?usp=drivesdk",
} as const;

// Counted per product: BSDK (published as @bsdk/ui, @bsdk/server, @bsdk/cli, counted once) and dbsmash.
// hooklens-node is also on npm but is not counted, per the owner.
export const NPM_PACKAGE_COUNT = 2;

export const SUPPORT_LINE = "Node.js, Express, MongoDB, PostgreSQL, React.";

export const NAV_LINKS = [
  { label: "Work", to: "/#work" },
  { label: "Activity", to: "/#activity" },
  { label: "Experience", to: "/#experience" },
  { label: "Stack", to: "/#stack" },
  { label: "Contact", to: "/#contact" },
] as const;
