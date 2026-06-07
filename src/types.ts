/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  year: string;
  imageUrl: string;
  aspectRatio: "16:9" | "4:3" | "1:1" | "3:4";
  offsetY: string; // Tailwinds offset class or custom shift for asymmetry
  colSpan: string; // Layout column span
}

export type BlockType = "editorial-hero" | "full-bleed-image" | "quote-block" | "technical-metadata" | "asymmetric-text";

export interface SandboxBlock {
  id: string;
  type: BlockType;
  title: string;
  concept: string;
  image?: string;
  quote?: string;
  author?: string;
  metaLeft?: string;
  metaRight?: string;
  alignOffset: "left" | "right" | "center" | "offset-right" | "offset-left";
  colSpan: 12 | 8 | 6 | 4;
}

export interface ColorToken {
  name: string;
  hex: string;
  role: string;
  variable: string;
}

export interface TypographicStyle {
  role: string;
  font: string;
  weight: string;
  sample: string;
  specText: string;
}
