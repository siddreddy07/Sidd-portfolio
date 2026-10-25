import { useEffect } from "react";
import { SITE } from "../config/site";

// In production /resume is a server redirect (vercel.json). This covers dev and any miss.
export default function Resume() {
  useEffect(() => {
    window.location.replace(SITE.resume);
  }, []);

  return (
    <p className="mx-auto max-w-5xl px-5 py-24 font-mono text-sm text-text-secondary md:px-8">
      Redirecting to the resume…{" "}
      <a className="text-text-primary underline" href={SITE.resume}>
        open it directly
      </a>
    </p>
  );
}
