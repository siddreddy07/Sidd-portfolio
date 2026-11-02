import { lazy, Suspense, useCallback, useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { SITE } from "../../config/site";
import { useVisits } from "../../lib/visits";

// The globe (WebGL + flags) only loads once someone shows interest in it.
const loadDialog = () => import("../visitors/VisitorsDialog");
const VisitorsDialog = lazy(loadDialog);

export default function Footer() {
  const visits = useVisits();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <footer className="mt-8 md:mt-12 border-t border-border-studio">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-6 font-mono text-xs text-text-secondary items-center text-center md:px-8">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        {visits !== null && (
          <p aria-live="polite">
            <button
              type="button"
              onPointerEnter={loadDialog}
              onFocus={loadDialog}
              onClick={() => {
                setMounted(true);
                setOpen(true);
              }}
              aria-haspopup="dialog"
              className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-text-primary/[0.06] hover:text-text-primary"
            >
              <FiGlobe className="size-3.5 transition-transform duration-500 group-hover:rotate-[160deg]" aria-hidden />
              <span>
                <span className="text-text-primary">{visits.toLocaleString("en-IN")}</span> {visits === 1 ? "visitor" : "visitors"}
              </span>
              <span className="text-text-secondary/70 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </button>
          </p>
        )}
      </div>
      {mounted && (
        <Suspense fallback={null}>
          <VisitorsDialog open={open} onClose={close} />
        </Suspense>
      )}
    </footer>
  );
}
