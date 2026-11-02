import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiX } from "react-icons/fi";
import VisitorGlobe from "./VisitorGlobe";
import { flagUrl, useCountryVisits, type CountryVisits } from "../../lib/visitors";
import { cn } from "../../lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function useIsDesktop() {
  const query = "(min-width: 768px)";
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

export default function VisitorsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const desktop = useIsDesktop();
  const data = useCountryVisits(open);
  const [active, setActive] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Scroll lock, Escape, a simple focus trap, and focus back to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => closeBtn.current?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      setActive(null);
      trigger?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  const countries = data?.countries ?? [];
  const total = data?.total ?? 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center md:items-center md:p-6">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitors-title"
            className="glass-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl md:max-w-4xl md:rounded-3xl"
            initial={{ opacity: 0, y: desktop ? 24 : 80, scale: desktop ? 0.97 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 32, mass: 0.9 } }}
            exit={{ opacity: 0, y: desktop ? 12 : 60, scale: desktop ? 0.98 : 1, transition: { duration: 0.2, ease: EASE } }}
          >
            {/* Grab handle on the mobile sheet */}
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-text-secondary/30 md:hidden" aria-hidden />

            <header className="flex items-start justify-between gap-4 px-5 pt-4 md:px-7 md:pt-6">
              <div>
                <h2 id="visitors-title" className="font-display text-3xl leading-none md:text-4xl">
                  Visitors
                </h2>
                <p className="mt-2 font-mono text-[11px] text-text-secondary">
                  {desktop && data ? (
                    <>
                      <span className="text-text-primary">{total.toLocaleString("en-IN")}</span> {total === 1 ? "visitor" : "visitors"} from{" "}
                      <span className="text-text-primary">{countries.length}</span> {countries.length === 1 ? "country" : "countries"}
                    </>
                  ) : (
                    "Where people open this site from. Drag to spin."
                  )}
                </p>
              </div>
              <button
                ref={closeBtn}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-text-primary/10 hover:text-text-primary"
              >
                <FiX className="size-[18px]" />
              </button>
            </header>

            <div className="grid min-h-0 flex-1 gap-2 px-5 pb-6 pt-2 md:grid-cols-[1.1fr_1fr] md:gap-6 md:px-7 md:pb-7">
              <motion.div
                className="mx-auto w-full max-w-[min(100%,58dvh)] md:max-w-[440px]"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE, delay: 0.05 } }}
              >
                <VisitorGlobe countries={countries} active={active} onActiveChange={setActive} showCounts={desktop} />
              </motion.div>

              {desktop && <CountryList data={data === undefined ? undefined : data === null ? null : countries} total={total} active={active} onActive={setActive} />}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CountryList({
  data,
  total,
  active,
  onActive,
}: {
  data: CountryVisits[] | null | undefined;
  total: number;
  active: string | null;
  onActive: (code: string | null) => void;
}) {
  const max = data?.[0]?.count ?? 1;

  return (
    <div className="flex min-h-0 flex-col md:max-h-[440px]">
      <div className="flex items-center justify-between border-b border-border-studio/70 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary">
        <span>Country</span>
        <span>Visits</span>
      </div>

      {data === undefined && (
        <ul className="mt-1 space-y-1" aria-busy="true" aria-label="Loading">
          {Array.from({ length: 7 }, (_, i) => (
            <li key={i} className="flex items-center gap-3 px-2 py-2.5">
              <span className="h-[14px] w-5 animate-pulse rounded-[3px] bg-text-primary/10" />
              <span className="h-3 animate-pulse rounded bg-text-primary/10" style={{ width: `${60 - i * 5}%` }} />
              <span className="ml-auto h-3 w-8 animate-pulse rounded bg-text-primary/10" />
            </li>
          ))}
        </ul>
      )}

      {data === null && <p className="py-10 text-center font-mono text-xs text-text-secondary">Couldn't load visitors right now.</p>}

      {data && data.length === 0 && <p className="py-10 text-center font-mono text-xs text-text-secondary">No visits counted yet.</p>}

      {data && data.length > 0 && (
        <ul className="-mx-2 mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1" onMouseLeave={() => onActive(null)}>
          {data.map((c, i) => {
            const on = c.code === active;
            return (
              <motion.li
                key={c.code}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE, delay: 0.12 + Math.min(i, 12) * 0.035 } }}
              >
                <button
                  type="button"
                  onMouseEnter={() => onActive(c.location ? c.code : null)}
                  onFocus={() => onActive(c.location ? c.code : null)}
                  onClick={() => onActive(on ? null : c.code)}
                  aria-pressed={on}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-200",
                    on ? "bg-text-primary/[0.07]" : "hover:bg-text-primary/[0.05]",
                  )}
                >
                  <span className="w-5 shrink-0 text-right font-mono text-[10px] tabular-nums text-text-secondary">{i + 1}</span>
                  <img
                    src={flagUrl(c.code)}
                    alt=""
                    loading="lazy"
                    className="h-[14px] w-5 shrink-0 rounded-[3px] object-cover ring-1 ring-black/10"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{c.name}</span>
                    <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-text-primary/[0.07]">
                      <motion.span
                        className="block h-full rounded-full bg-text-primary/45"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max((c.count / max) * 100, 3)}%` }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.2 + Math.min(i, 12) * 0.035 }}
                      />
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-sm tabular-nums">{c.count.toLocaleString("en-IN")}</span>
                    <span className="block font-mono text-[10px] tabular-nums text-text-secondary">
                      {total ? Math.round((c.count / total) * 1000) / 10 : 0}%
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}

      <p className="mt-3 font-mono text-[10px] text-text-secondary/80">Unique visitors, counted once each.</p>
    </div>
  );
}
