import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SITE } from "../../config/site";
import { useActivity, type Day } from "../../lib/github";
import Section from "../ui/Section";
import CountUp from "../ui/CountUp";

const EASE = [0.22, 1, 0.36, 1] as const;

const LEVEL_BG = [
  "var(--border)",
  "color-mix(in srgb, var(--graph) 28%, var(--border))",
  "color-mix(in srgb, var(--graph) 52%, var(--border))",
  "color-mix(in srgb, var(--graph) 76%, var(--border))",
  "var(--graph)",
];

const fmt = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function weeksOf(days: Day[]) {
  const pad = new Date(days[0].date + "T00:00:00").getDay(); // Sunday-first columns, like GitHub
  const cells: (Day | null)[] = [...Array(pad).fill(null), ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function GitHubActivity() {
  const activity = useActivity();
  const [hover, setHover] = useState<Day | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Not `once`: the squares fade back when the graph leaves the screen, so the sprinkle replays on every visit.
  const [inView, setInView] = useState(false);
  const lit = inView || !!reduce;
  const days = activity.data?.days;
  // A random start time per square, so the colour sprinkles in instead of sweeping.
  const delays = useMemo(() => (days ?? []).map(() => Math.round(Math.random() * 1100)), [days]);
  const dayIndex = useMemo(() => new Map((days ?? []).map((d, i) => [d.date, i])), [days]);

  useEffect(() => {
    // Show the most recent weeks first on narrow screens.
    if (activity.status === "ready" && scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [activity.status]);

  return (
    <Section id="activity" index="03" label="GitHub activity" reveal={false}>
      {activity.status === "loading" && <p className="font-mono text-sm text-text-secondary">Loading contribution graph…</p>}
      {activity.status === "error" && (
        <p className="font-mono text-sm text-text-secondary">
          Couldn't load the graph right now.{" "}
          <a className="underline underline-offset-4 hover:text-accent-text" href={SITE.github} target="_blank" rel="noreferrer">
            See it on GitHub ↗
          </a>
        </p>
      )}
      {activity.status === "ready" && activity.data && (
        <>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl">
            <CountUp to={activity.data.total} /> contributions <span className="text-text-secondary">in the last year</span>
          </h3>
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 md:mt-8 md:gap-x-16 md:gap-y-6">
            {[
              ["Active days", activity.data.activeDays, ""],
              // An empty streak says nothing useful, so it is left out.
              ...(activity.data.currentStreak > 0 ? [["Current streak", activity.data.currentStreak, " days"] as const] : []),
              ["Best day", activity.data.bestDay.count, " contributions"],
              ["Longest run", activity.data.longestRun, " days"],
            ].map(([k, v, unit]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-text-secondary">{k}</dt>
                <dd className="mt-1 font-display text-2xl md:text-3xl">
                  <CountUp to={Number(v)} suffix={String(unit)} />
                </dd>
              </div>
            ))}
          </dl>

          <motion.div
            viewport={{ amount: 0.4 }}
            onViewportEnter={() => setInView(true)}
            onViewportLeave={() => setInView(false)}
            initial={false}
            animate={lit ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.35, y: 28, scale: 0.97 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
          <div ref={scroller} className="mt-6 w-fit max-w-full overflow-x-auto pb-2 md:mt-8" tabIndex={0} aria-label="Contribution graph, scrollable">
            <div className="flex w-max gap-[3px]" role="img" aria-label={`${activity.data.total} contributions in the last year`}>
              {weeksOf(activity.data.days).map((week, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {week.map((d, i) =>
                    d ? (
                      <span
                        key={d.date}
                        onMouseEnter={() => setHover(d)}
                        onMouseLeave={() => setHover(null)}
                        className="size-[11px] transition-[background-color,transform] duration-500 ease-out md:size-3"
                        style={{
                          background: LEVEL_BG[lit ? d.level : 0],
                          transform: lit || d.level === 0 ? "scale(1)" : "scale(0.5)",
                          // Light up on a random beat; go dark together, quickly, when leaving.
                          transitionDelay: lit ? `${delays[dayIndex.get(d.date) ?? 0] ?? 0}ms` : "0ms",
                          transitionDuration: lit ? undefined : "250ms",
                        }}
                        title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${fmt(d.date)}`}
                      />
                    ) : (
                      <span key={`pad-${i}`} className="size-[11px] md:size-3" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex min-h-5 flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs text-text-secondary">
            <span aria-live="polite">{hover ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} on ${fmt(hover.date)}` : "Hover a square for the day"}</span>
            <span className="flex items-center gap-1.5" aria-hidden>
              Less
              {LEVEL_BG.map((bg) => (
                <span key={bg} className="size-3" style={{ background: bg }} />
              ))}
              More
            </span>
          </div>
          </motion.div>
        </>
      )}

      <div className="mt-8 border-t border-border-studio pt-6 font-mono text-xs">
        <a className="text-text-secondary underline underline-offset-4 hover:text-accent-text" href={SITE.github} target="_blank" rel="noreferrer">
          View GitHub ↗
        </a>
      </div>
    </Section>
  );
}
