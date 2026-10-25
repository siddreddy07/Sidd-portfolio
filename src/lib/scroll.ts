import type { NavigateFunction } from "react-router";

/** Scroll to a home-page section without putting #id in the URL. From other pages, go home first. */
export function scrollToSection(id: string, navigate: NavigateFunction, pathname: string) {
  if (pathname !== "/") {
    navigate("/", { state: { section: id } });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}
