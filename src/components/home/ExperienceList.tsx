import { useState } from "react";
import { experience } from "../../data";
import Section from "../ui/Section";

export default function ExperienceList() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const jobs = experience.filter((e) => e.type === "INTERNSHIP");
  const education = experience.filter((e) => e.type === "EDUCATION");

  return (
    <Section id="experience" index="04" label="Experience">
      <ol className="mx-auto max-w-3xl">
        {jobs.map((e) => (
          <li key={e.role + e.company} className="grid gap-3 border-t border-border-studio py-8 first:border-t-0 first:pt-0 md:grid-cols-[11rem_1fr] md:gap-10">
            <div className="flex items-center gap-3 md:block">
              <p className="font-mono text-xs text-text-secondary">{e.years}</p>
              <p className="inline-block rounded-md border border-border-studio bg-surface-studio px-2.5 py-1 font-mono text-xs md:mt-3">{e.company}</p>
            </div>
            <div className="min-w-0">
            <h3 className="font-display text-2xl sm:text-3xl">{e.role}</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-text-secondary">
              {e.bullets.map((b, bi) => (
                <li key={b} className={`${bi >= 2 && expanded !== e.company ? "hidden lg:block " : ""}relative pl-5 before:absolute before:left-0 before:text-text-secondary before:content-['–']`}>
                  {b}
                </li>
              ))}
            </ul>
            {e.bullets.length > 2 && (
              <button
                type="button"
                onClick={() => setExpanded(expanded === e.company ? null : e.company)}
                className="mt-3 font-mono text-xs text-accent-text underline-offset-4 hover:underline lg:hidden"
              >
                {expanded === e.company ? "Show less ↑" : `Show ${e.bullets.length - 2} more ↓`}
              </button>
            )}
            </div>
          </li>
        ))}
        {education.map((e) => (
          <li key={e.role} className="grid gap-3 border-t border-border-studio py-8 pb-0 md:grid-cols-[11rem_1fr] md:gap-10">
            <p className="font-mono text-xs text-text-secondary">Education</p>
            <div className="min-w-0">
              <h3 className="font-display text-2xl sm:text-3xl">{e.company}</h3>
              <p className="mt-1 text-text-secondary">{e.role}</p>
              <p className="mt-2 font-mono text-xs text-text-secondary">{e.bullets.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
