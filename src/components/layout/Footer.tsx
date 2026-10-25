import { SITE } from "../../config/site";
import { useVisits } from "../../lib/visits";

export default function Footer() {
  const visits = useVisits();

  return (
    <footer className="mt-8 md:mt-12 border-t border-border-studio">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-6 font-mono text-xs text-text-secondary items-center text-center md:px-8">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        {visits !== null && (
          <p aria-live="polite">
            <span className="text-text-primary">{visits.toLocaleString("en-IN")}</span> profile {visits === 1 ? "visit" : "visits"}
          </p>
        )}
      </div>
    </footer>
  );
}
