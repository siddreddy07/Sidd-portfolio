import projectsJson from "./projects.json";
import experienceJson from "./experience.json";
import type { ExperienceEntry, Project } from "../types";

// Newest year first; within a year keep the order from projects.json (num).
export const projects: Project[] = [...(projectsJson.projects as Project[])].sort(
  (a, b) => Number(b.year) - Number(a.year) || a.num.localeCompare(b.num),
);

export const featuredProjects: Project[] = projectsJson.projects
  .slice(0, 4) as Project[];

export const projectTypes: string[] = Array.from(new Set(projects.map((p) => p.type)));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const experience = experienceJson.entries as ExperienceEntry[];
