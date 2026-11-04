import type { ReactNode } from "react";
import Container from "./Container";
import Reveal from "./Reveal";

export default function Section({
  id,
  index,
  label,
  title,
  aside,
  action,
  decor,
  reveal = true,
  children,
}: {
  id?: string;
  index: string;
  label: string;
  /** A string, or an animated node such as <TextAnimate as="span">. */
  title?: ReactNode;
  aside?: ReactNode;
  /** Small control shown on the title's line, at the right edge (e.g. a view switch). */
  action?: ReactNode;
  /** Absolutely positioned extras placed against the section itself (e.g. a corner mascot), outside the reveal. */
  decor?: ReactNode;
  /** Set false when the section animates its own parts. */
  reveal?: boolean;
  children: ReactNode;
}) {
  const Wrap = reveal ? Reveal : "div";
  return (
    <section id={id} className="relative border-t border-border-studio py-16 md:py-24">
      <Container>
        <Wrap>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-text-secondary">
            <span className="text-accent-text">{index}</span>
            <span aria-hidden className="h-px w-8 bg-border-studio" />
            {label}
          </p>
          {title && (
            <div className="mt-4 flex flex-col items-start gap-3 text-left">
              <div className="flex w-full items-center justify-between gap-4">
                <h2 className="max-w-3xl font-display text-[1.75rem] leading-[1.1] sm:text-4xl md:text-5xl">{title}</h2>
                {action && <div className="shrink-0">{action}</div>}
              </div>
              {aside && <div>{aside}</div>}
            </div>
          )}
          <div className="mt-8 md:mt-12">{children}</div>
        </Wrap>
      </Container>
      {decor}
    </section>
  );
}
