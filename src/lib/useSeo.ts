import { useEffect } from "react";
import { absUrl, ogImage, type PageMeta } from "./seo";

function setTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Keeps the title, description, canonical and share tags in step with client-side navigation. */
export function useSeo(meta: PageMeta) {
  useEffect(() => {
    const url = absUrl(meta.path);
    document.title = meta.title;
    setTag("name", "description", meta.description);
    setTag("name", "robots", meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    setTag("property", "og:title", meta.title);
    setTag("property", "og:description", meta.description);
    setTag("property", "og:url", url);
    const image = ogImage(meta);
    setTag("property", "og:image", image);
    setTag("property", "og:image:secure_url", image);
    setTag("property", "og:image:alt", `${meta.title} — preview`);
    setTag("property", "og:type", meta.type ?? "website");
    setTag("name", "twitter:image", image);
    setTag("name", "twitter:image:alt", `${meta.title} — preview`);
    setTag("name", "twitter:title", meta.title);
    setTag("name", "twitter:description", meta.description);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;
  }, [meta.path, meta.title, meta.description, meta.noindex, meta.image, meta.type]);
}
