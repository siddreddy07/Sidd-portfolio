import { getIcon } from "../../data/iconMap";
import { stack } from "../../data/stack";
import { toolColors, toolIcons } from "../../data/toolIcons";
import Section from "../ui/Section";
import { TextAnimate } from "../ui/TextAnimate";
import { PopItem, PopList } from "../ui/PopList";

export default function Stack() {
  return (
    <Section
      id="stack"
      index="05"
      label="Stack"
      reveal={false}
      title={
        <TextAnimate as="span" by="word" animation="blurInUp" duration={0.4}>
          What I work with
        </TextAnimate>
      }
    >
      <dl className="mx-auto max-w-3xl">
        {stack.map((g) => (
          <div key={g.group} className="group/row grid gap-x-8 gap-y-2 border-t border-border-studio py-4 last:border-b md:py-6 md:grid-cols-[11rem_1fr]">
            <TextAnimate
              as="dt"
              by="text"
              animation="slideRight"
              className="pt-1.5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors group-hover/row:text-text-primary"
            >
              {g.group}
            </TextAnimate>
            <dd>
              <PopList className="flex flex-wrap gap-1.5 sm:gap-2">
                {g.items.map((item) => {
                  const Icon = toolIcons[item] ? getIcon(toolIcons[item]) : null;
                  return (
                    <PopItem
                      key={item}
                      style={toolColors[item] ? ({ "--c": toolColors[item] } as React.CSSProperties) : undefined}
                      className="group flex cursor-default items-center gap-2 border border-border-studio bg-surface-studio px-2.5 py-1 text-xs transition-[translate,border-color,box-shadow] sm:px-3 sm:py-1.5 sm:text-sm-all hover:-translate-y-0.5 hover:border-text-secondary hover:shadow-[0_8px_18px_-12px_rgba(0,0,0,0.4)]"
                    >
                      {Icon && <Icon size={15} aria-hidden className="text-text-secondary transition-all duration-200 group-hover:scale-125 group-hover:text-[var(--c,var(--text))]" />}
                      {item}
                    </PopItem>
                  );
                })}
              </PopList>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
