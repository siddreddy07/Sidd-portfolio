import { getIcon } from "../../data/iconMap";
import { stack } from "../../data/stack";
import { toolColors, toolIcons } from "../../data/toolIcons";
import Section from "../ui/Section";

export default function Stack() {
  return (
    <Section id="stack" index="05" label="Stack" title="What I work with">
      <dl className="mx-auto max-w-3xl">
        {stack.map((g) => (
          <div key={g.group} className="group/row grid gap-x-8 gap-y-2 border-t border-border-studio py-4 last:border-b md:py-6 md:grid-cols-[11rem_1fr]">
            <dt className="pt-1.5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors group-hover/row:text-text-primary">{g.group}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                {g.items.map((item) => {
                  const Icon = toolIcons[item] ? getIcon(toolIcons[item]) : null;
                  return (
                    <li
                      key={item}
                      style={toolColors[item] ? ({ "--c": toolColors[item] } as React.CSSProperties) : undefined}
                      className="group flex cursor-default items-center gap-2 border border-border-studio bg-surface-studio px-2.5 py-1 text-xs transition sm:px-3 sm:py-1.5 sm:text-sm-all hover:-translate-y-0.5 hover:border-text-secondary hover:shadow-[0_8px_18px_-12px_rgba(0,0,0,0.4)]"
                    >
                      {Icon && <Icon size={15} aria-hidden className="text-text-secondary transition-all duration-200 group-hover:scale-125 group-hover:text-[var(--c,var(--text))]" />}
                      {item}
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
