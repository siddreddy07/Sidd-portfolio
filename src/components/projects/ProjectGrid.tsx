import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { projects, projectTypes } from "../../data";
import { cn } from "../../lib/utils";
import ProjectCard from "./ProjectCard";

/** Filterable grid for the archive page. Filter lives in the URL (?type=Backend) so it is shareable. */
export default function ProjectGrid() {
  const [params, setParams] = useSearchParams();
  const active = params.get("type");
  const type = projectTypes.includes(active ?? "") ? active : null;

  const shown = useMemo(() => (type ? projects.filter((p) => p.type === type) : projects), [type]);

  const tab = (label: string, value: string | null) => (
    <button
      key={label}
      type="button"
      aria-pressed={type === value}
      onClick={() => setParams(value ? { type: value } : {}, { replace: true })}
      className={cn(
        "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all hover:-translate-y-0.5",
        type === value ? "border-accent-lime bg-accent-lime text-on-accent" : "border-border-studio text-text-secondary hover:border-text-secondary hover:text-text-primary",
      )}
    >
      {label}
      <span className="ml-2 opacity-60">{value ? projects.filter((p) => p.type === value).length : projects.length}</span>
    </button>
  );

  return (
    <>
      <div role="group" aria-label="Filter projects by type" className="flex flex-wrap justify-center gap-2">
        {tab("All", null)}
        {projectTypes.map((t) => tab(t, t))}
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
