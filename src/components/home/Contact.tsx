import { useEffect, useState } from "react";
import { FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";
import { SITE } from "../../config/site";
import Section from "../ui/Section";
import { AnimatedShinyText } from "../ui/AnimatedShinyText";

const links = [
  { label: "LinkedIn", href: SITE.linkedin },
  { label: "GitHub", href: SITE.github },
  { label: "X", href: SITE.x },
  { label: "Resume", href: SITE.resume },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(SITE.email).then(() => setCopied(true), () => {})}
      aria-label="Copy email address"
      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <FiCheck aria-hidden /> : <FiCopy aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

// Animated mascot sitting on the section's bottom edge, at the right of the content column. The image has ~8.5%
// empty space under the feet, so it is shifted down by that much. Still frame for reduced motion.
function Mascot() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 select-none">
      <div className="mx-auto flex max-w-3xl justify-end px-5 md:px-8">
        <picture className="block w-14 translate-y-[8.5%] sm:w-20 md:w-24">
          <source srcSet="/mascot-still.webp" media="(prefers-reduced-motion: reduce)" />
          <img src="/mascot.webp" alt="" width={224} height={318} loading="lazy" decoding="async" className="h-auto w-full" />
        </picture>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <Section
      id="contact"
      index="06"
      label="Contact"
      decor={<Mascot />}
      title="Let's work together."
      aside={
        <div className="max-w-xl space-y-2">
          <p className="text-text-secondary">
            Open to projects and collaborations, and to full-time backend or full-stack roles. Email is the fastest way to reach me.
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">Based in India · IST, UTC+5:30</p>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={`mailto:${SITE.email}`}
          className="group inline-flex min-w-0 items-center gap-2 break-all font-display text-2xl leading-tight sm:text-3xl md:text-4xl"
        >
          <span className="underline decoration-border-studio decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-text-primary">
            {SITE.email}
          </span>
          <FiArrowUpRight aria-hidden className="size-5 shrink-0 text-text-secondary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-6" />
        </a>
        <CopyEmail />
      </div>

      <ul className="mb-8 mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border-studio pt-6 font-mono text-xs uppercase tracking-widest md:mb-0 md:mt-10">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-text-secondary transition-colors hover:text-text-primary">
              {label === "Resume" ? <AnimatedShinyText shimmerWidth={60}>Resume</AnimatedShinyText> : label}
              <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
