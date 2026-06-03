/**
 * Type declarations for N. Siddharth Reddy Portfolio
 */

export interface Project {
  id: string;
  index: string;
  name: string;
  description: string;
  tags: string[];
  year: string;
  url?: string;
  githubUrl?: string;
  npmUrl?: string;
  role?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  date: string;
  title: string;
  bullets: string[];
}

export interface StackSection {
  [category: string]: {
    [subcategory: string]: string[];
  };
}
