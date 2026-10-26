import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { FaLinkedinIn } from "react-icons/fa";
import { FiFileText, FiMail, FiMapPin, FiRepeat } from "react-icons/fi";
import { SiGithub, SiX } from "react-icons/si";
import { NPM_PACKAGE_COUNT, SITE } from "../../config/site";
import { experience, projects } from "../../data";
import { useActivity } from "../../lib/github";
import { useAlbumAccent, useAlbumColors, useNowPlaying } from "../../lib/spotify";
import Container from "../ui/Container";
import SectionLink from "../ui/SectionLink";
import Tooltip from "../ui/Tooltip";
import NowPlaying, { NowPlayingButton } from "./NowPlaying";

const internships = experience.filter((e) => e.type === "INTERNSHIP").length;

function useIstTime() {
  const read = () => new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(read());
    const id = setInterval(() => setTime(read()), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const socials = [
  { label: "GitHub", href: SITE.github, Icon: SiGithub },
  { label: "LinkedIn", href: SITE.linkedin, Icon: FaLinkedinIn },
  { label: "X", href: SITE.x, Icon: SiX },
  { label: "Resume", href: SITE.resume, Icon: FiFileText },
];

function Socials({ className }: { className?: string }) {
  return (
    <div className={className}>
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="group relative grid size-10 place-items-center rounded-lg text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-studio hover:text-text-primary"
        >
          <Icon size={17} aria-hidden />
          <Tooltip label={label} />
        </a>
      ))}
    </div>
  );
}

// Starts on the current photo; the small button swaps to the black-and-white portrait.
function Avatar() {
  const [now, setNow] = useState(true);
  const [nowFailed, setNowFailed] = useState(false);
  const showNow = now && !nowFailed;

  return (
    <div className="relative shrink-0">
      <div className="size-14 overflow-hidden rounded-xl border border-border-studio bg-surface-studio p-1 transition-transform duration-300 hover:scale-105 sm:size-20">
        <div className="relative size-full overflow-hidden rounded-lg">
          <img
            src="/profile-bw.jpg"
            alt={SITE.name}
            width={80}
            height={80}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${showNow ? "opacity-0" : "opacity-100"}`}
          />
          <img
            src={`${SITE.github}.png?size=160`}
            alt=""
            aria-hidden
            width={80}
            height={80}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${showNow ? "opacity-100" : "opacity-0"}`}
            onError={() => setNowFailed(true)}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setNow((v) => !v)}
        aria-pressed={showNow}
        aria-label={showNow ? "Show the black and white photo" : "Show the current photo"}
        title={showNow ? "Black & white" : "Current photo"}
        className="group absolute -bottom-1.5 -right-1.5 grid size-6 place-items-center rounded-full border border-border-studio bg-bg-studio text-text-secondary shadow-sm transition-all duration-200 hover:scale-110 hover:text-text-primary active:scale-90"
      >
        <FiRepeat size={12} aria-hidden className="transition-transform duration-300 group-hover:rotate-180" />
      </button>
    </div>
  );
}

function Ticker({ items }: { items: { bold: string; rest: string }[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.bold + it.rest} className="flex items-center whitespace-nowrap text-sm text-text-secondary">
          <span className="px-5 text-text-secondary/60" aria-hidden>✦</span>
          <span>
            <b className="font-semibold text-text-primary">{it.bold}</b> {it.rest}
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="w-full overflow-hidden">
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

// Marker-style highlight that sweeps in shortly after load. Colour follows the album art (see useAlbumAccent),
// with a contrasting text colour; the theme accent until then.
function Highlight({ href, children }: { href: string; children: React.ReactNode }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLit(true), 1100);
    return () => clearTimeout(id);
  }, []);
  return (
    <a href={href} target="_blank" rel="noreferrer" data-lit={lit || undefined} className="highlight font-medium">
      {children}
    </a>
  );
}

export default function Hero() {
  const time = useIstTime();
  const reduce = useReducedMotion();
  const activity = useActivity();
  const track = useNowPlaying();
  // The graph only takes the album colour for real Spotify data; it stays green on the demo song.
  useAlbumAccent(useAlbumColors(track && !track.demo ? track.image : null));
  const total = activity.status === "ready" ? activity.data?.total : undefined;

  const facts = [
    { bold: String(projects.length), rest: "projects shipped" },
    { bold: String(internships), rest: "internships" },
    { bold: String(NPM_PACKAGE_COUNT), rest: "packages on npm" },
    ...(total !== undefined ? [{ bold: String(total), rest: "contributions in the last year" }] : []),
    { bold: "50%", rest: "fewer DB round trips at reaidy.io" },
  ];

  return (
    <section className="pb-8 pt-8 md:pb-14 md:pt-12">
      <Container>
        <motion.div className="mx-auto flex max-w-3xl flex-col items-start text-left" initial={reduce ? false : "hidden"} animate="show" transition={{ staggerChildren: 0.08 }}>
          <motion.div variants={item} className="flex w-full items-center gap-4">
            <Avatar />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{SITE.name}</p>
                <NowPlayingButton track={track} className="lg:hidden" />
              </div>
              <p className="mt-1.5 hidden font-mono text-[11px] uppercase tracking-widest text-text-secondary sm:block">Full stack developer · Backend · AI</p>
              <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-text-secondary">
                <FiMapPin aria-hidden /> {SITE.location}
                {time && <> · {time} IST</>}
              </p>
            </div>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <Socials className="hidden items-center gap-1 sm:flex" />
              </div>

              <div className="hidden lg:block">
                <NowPlaying track={track} />
              </div>
            </div>
          </motion.div>

          <motion.h1 variants={item} className="mt-6 max-w-3xl font-display text-[1.9rem] leading-[1.1] text-text-secondary sm:text-5xl md:mt-10 md:text-6xl">
            I build{" "}
            <em className="relative whitespace-nowrap font-semibold italic text-text-primary">
              backend systems
              <motion.span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-text-primary"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              />
            </em>{" "}
            and the AI products that run on them.
          </motion.h1>

          <motion.p variants={item} className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            I'm Siddharth, a <span className="text-text-primary">full-stack developer who likes backend work most</span>. <span className="hidden sm:inline">
              {" "}I've done two internships, built <Highlight href="https://bsdk.siddharthreddy627.workers.dev/">BSDK</Highlight> (a chat SDK you can install from npm), and I'm looking for my first full-time role. Reach me at{" "}
              <a href={`mailto:${SITE.email}`} className="whitespace-nowrap text-text-primary underline underline-offset-4 transition-opacity hover:opacity-70">
                {SITE.email}
              </a>
              .
            </span>
          </motion.p>

          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
            <SectionLink
              id="work"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent-lime px-5 py-3 text-sm font-medium text-on-accent transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <p className="hidden md:block">View selected work</p> 
              <p className="block md:hidden">Work</p> 
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </SectionLink>
            <a
              href={`mailto:${SITE.email}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-border-studio px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-text-secondary active:scale-95"
            >
              <FiMail aria-hidden className="transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
              Get in touch
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 hidden w-full lg:mt-10 lg:flex">
            <Ticker items={facts} />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
