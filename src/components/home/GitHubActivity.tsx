import { useEffect, useRef, useState } from "react";
import { SITE } from "../../config/site";
import { useActivity, type Day } from "../../lib/github";
import Section from "../ui/Section";

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

  useEffect(() => {
    // Show the most recent weeks first on narrow screens.
    if (activity.status === "ready" && scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [activity.status]);

  return (
    <Section id="activity" index="03" label="GitHub activity">
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
          <h3 className="text-center font-display text-2xl sm:text-3xl md:text-4xl">
            {activity.data.total} contributions <span className="text-text-secondary">in the last year</span>
          </h3>
          <dl className="mt-5 flex flex-wrap justify-center gap-x-10 gap-y-4 text-center md:mt-8 md:gap-x-16 md:gap-y-6">
            {[
              ["Active days", String(activity.data.activeDays)],
              // An empty streak says nothing useful, so it is left out.
              ...(activity.data.currentStreak > 0 ? [["Current streak", `${activity.data.currentStreak} days`]] : []),
              ["Best day", `${activity.data.bestDay.count} contributions`],
              ["Longest run", `${activity.data.longestRun} days`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-text-secondary">{k}</dt>
                <dd className="mt-1 font-display text-2xl md:text-3xl">{v}</dd>
              </div>
            ))}
          </dl>

          <div ref={scroller} className="mx-auto mt-5 w-fit max-w-full overflow-x-auto pb-2 md:mt-8" tabIndex={0} aria-label="Contribution graph, scrollable">
            <div className="flex w-max gap-[3px]" role="img" aria-label={`${activity.data.total} contributions in the last year`}>
              {weeksOf(activity.data.days).map((week, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {week.map((d, i) =>
                    d ? (
                      <span
                        key={d.date}
                        onMouseEnter={() => setHover(d)}
                        onMouseLeave={() => setHover(null)}
                        className="size-[11px] md:size-3"
                        style={{ background: LEVEL_BG[d.level] }}
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

          <div className="mt-3 flex min-h-5 flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center font-mono text-xs text-text-secondary">
            <span aria-live="polite">{hover ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} on ${fmt(hover.date)}` : "Hover a square for the day"}</span>
            <span className="flex items-center gap-1.5" aria-hidden>
              Less
              {LEVEL_BG.map((bg) => (
                <span key={bg} className="size-3" style={{ background: bg }} />
              ))}
              More
            </span>
          </div>
        </>
      )}

      <div className="mt-5 border-t border-border-studio pt-4 text-center font-mono text-xs md:mt-8 md:pt-6">
        <a className="text-text-secondary underline underline-offset-4 hover:text-accent-text" href={SITE.github} target="_blank" rel="noreferrer">
          View GitHub ↗
        </a>
      </div>
    </Section>
  );
}
