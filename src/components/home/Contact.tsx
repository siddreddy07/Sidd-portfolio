import type { FormEvent } from "react";
import { SiGmail } from "react-icons/si";
import { SITE } from "../../config/site";
import Section from "../ui/Section";

const link = "underline underline-offset-4 hover:text-accent-text";
const field = "w-full border border-border-studio bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-text-secondary focus:border-accent-lime";

export default function Contact() {
  // Opens the visitor's mail app with a draft; nothing is sent from the site.
  function draft(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const from = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const subject = `Hello from ${name || "your portfolio"}`;
    const body = `${message}\n\n${name}${from ? `\n${from}` : ""}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Section id="contact" index="06" label="Contact">
      <div className="mx-auto flex max-w-xl flex-col items-start gap-8 text-left md:gap-10 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="font-display text-3xl leading-tight md:text-5xl">Looking for a backend or full-stack engineer?</h3>
          <p className="mt-4 text-text-secondary">I'm open to full-time roles. Email is the fastest way to reach me.</p>
          <a href={`mailto:${SITE.email}`} className="group mt-6 inline-flex items-center gap-3 break-all font-mono text-sm hover:text-accent-text">
            <SiGmail size={20} aria-hidden className="shrink-0 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
            <span className="underline underline-offset-4">{SITE.email}</span>
          </a>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm md:mt-8 md:gap-x-6">
            <li><a className={link} href={SITE.github} target="_blank" rel="noreferrer">GitHub ↗</a></li>
            <li><a className={link} href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
            <li><a className={link} href={SITE.x} target="_blank" rel="noreferrer">X ↗</a></li>
            <li><a className={link} href={SITE.resume} target="_blank" rel="noreferrer">Resume ↗</a></li>
          </ul>
        </div>

        <form onSubmit={draft} className="w-full space-y-3 text-left md:space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-secondary">Send a note · opens your email app</p>
          <label className="block">
            <span className="sr-only">Your name</span>
            <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
          </label>
          <label className="block">
            <span className="sr-only">Your email</span>
            <input name="email" type="email" required autoComplete="email" placeholder="Your email" className={field} />
          </label>
          <label className="block">
            <span className="sr-only">Message</span>
            <textarea name="message" required rows={4} placeholder="What would you like to talk about?" className={field} />
          </label>
          <button type="submit" className="w-full rounded-full bg-accent-lime px-5 py-3 text-sm font-medium text-on-accent transition-transform hover:-translate-y-0.5 active:scale-95">
            Prepare email draft ↗
          </button>
          <p className="hidden text-xs text-text-secondary md:block">Nothing is sent from this page. Your email app opens with the draft.</p>
        </form>
      </div>
    </Section>
  );
}
