import type { ReactNode } from "react";
import Container from "./Container";
import Reveal from "./Reveal";

export default function Section({
  id,
  index,
  label,
  title,
  aside,
  children,
}: {
  id?: string;
  index: string;
  label: string;
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border-studio py-10 md:py-20">
      <Container>
        <Reveal>
          <p className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-text-secondary">
            <span className="text-accent-text">{index}</span>
            <span aria-hidden className="h-px w-8 bg-border-studio" />
            {label}
          </p>
          {title && (
            <div className="mt-3 flex flex-col items-center gap-3 text-center md:mt-5">
              <h2 className="mx-auto max-w-3xl font-display text-[1.75rem] leading-[1.1] sm:text-4xl md:text-5xl">{title}</h2>
              {aside && <div>{aside}</div>}
            </div>
          )}
          <div className="mt-6 md:mt-10">{children}</div>
        </Reveal>
      </Container>
    </section>
  );
}
