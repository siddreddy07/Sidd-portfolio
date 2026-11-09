import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { FiGrid, FiList } from "react-icons/fi";
import { featuredProjects } from "../../data";
import ProjectCard from "../projects/ProjectCard";
import ProjectList from "../projects/ProjectList";
import Section from "../ui/Section";
import { TextAnimate } from "../ui/TextAnimate";
import { cn } from "../../lib/utils";

type View = "grid" | "list";
const KEY = "work-view";
const EASE = [0.22, 1, 0.36, 1] as const;

function readView(): View {
  try {
    return localStorage.getItem(KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

// Grid / List switch, icons only. The pill slides between the two options instead of jumping.
function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const options = [
    { id: "grid", label: "Grid", Icon: FiGrid },
    { id: "list", label: "List", Icon: FiList },
  ] as const;
  return (
    <div role="radiogroup" aria-label="Project layout" className="inline-flex rounded-xl border border-border-studio p-1">
      {options.map(({ id, label, Icon }) => {
        const on = view === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={label}
            title={label}
            onClick={() => onChange(id)}
            className={cn(
              "relative isolate grid size-8 place-items-center rounded-lg transition-colors duration-300",
              on ? "text-on-accent" : "text-text-secondary hover:text-text-primary",
            )}
          >
            {on && <motion.span layoutId="work-view-pill" className="absolute inset-0 -z-10 rounded-lg bg-accent-lime" transition={{ duration: 0.35, ease: EASE }} />}
            <Icon size={15} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

export default function SelectedWork() {
  const [view, setView] = useState<View>(readView);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, view);
    } catch {
      /* storage unavailable */
    }
  }, [view]);

  return (
    <Section
      id="work"
      index="02"
      label="Work"
      reveal={false}
      title={
        <TextAnimate as="span" by="word" animation="blurInUp" duration={0.4}>
          Things I've made
        </TextAnimate>
      }
      action={<ViewToggle view={view} onChange={setView} />}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {view === "grid" ? (
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} noVideo />
              ))}
            </div>
          ) : (
            <ProjectList projects={featuredProjects} noVideo />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex md:mt-12">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 rounded-xl border border-border-studio px-5 py-2.5 text-sm transition-all hover:-translate-y-0.5 hover:border-text-secondary"
        >
          See all projects <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </Section>
  );
}
