import type { IconType } from "react-icons/lib";
import { FiExternalLink, FiGlobe } from "react-icons/fi";
import { SiGithub, SiNpm } from "react-icons/si";
import type { Project, ProjectLink } from "../types";

export interface ActionLink extends ProjectLink {
  kind: "live" | "github" | "npm" | "other";
  Icon: IconType;
}

/** Icons come from the link label, because projects.json icons name the host (Vercel, Netlify), not the action. */
export function actionLinks(p: Project): ActionLink[] {
  const order = { live: 0, github: 1, npm: 2, other: 3 } as const;
  return p.links
    .map<ActionLink>((l) => {
      const label = l.label.toLowerCase();
      if (label.includes("live")) return { ...l, kind: "live", Icon: FiGlobe };
      if (label.includes("github")) return { ...l, kind: "github", Icon: SiGithub };
      if (label.includes("npm")) return { ...l, kind: "npm", Icon: SiNpm };
      return { ...l, kind: "other", Icon: FiExternalLink };
    })
    .sort((a, b) => order[a.kind] - order[b.kind]);
}
