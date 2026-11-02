import { Link } from "react-router";
import { featuredProjects } from "../../data";
import ProjectCard from "../projects/ProjectCard";
import Section from "../ui/Section";
import { TextAnimate } from "../ui/TextAnimate";

export default function SelectedWork() {
  return (
    <Section
      id="work"
      index="02"
      label="Work"
      reveal={false}
      title={
        <TextAnimate as="span" by="word" animation="blurInUp" duration={0.4}>
          Selected work
        </TextAnimate>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <div className="mt-8 flex justify-center md:mt-10">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 rounded-full border border-border-studio px-5 py-2.5 text-sm transition-all hover:-translate-y-0.5 hover:border-text-secondary"
        >
          See all projects <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </Section>
  );
}
