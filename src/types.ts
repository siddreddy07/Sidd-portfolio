export interface ProjectLink {
  label: string;
  url: string;
  icon: string;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectThumbnail {
  type: "image" | "video" | "iframe";
  url: string;
}

export interface Project {
  num: string;
  slug: string;
  name: string;
  desc: string;
  descriptor: string;
  tags: string[];
  tagIcons: string[];
  typePill: string;
  type: string;
  year: string;
  specs: ProjectSpec[];
  overview: string;
  links: ProjectLink[];
  thumbnail: ProjectThumbnail;
  npmPackage?: string;
  /** ISO date (YYYY-MM-DD). Until the end of this day the card shows a "New" badge. */
  newUntil?: string;
}

export interface ExperienceEntry {
  years: string;
  role: string;
  company: string;
  companyUrl?: string;
  type: "INTERNSHIP" | "EDUCATION";
  bullets: string[];
}
