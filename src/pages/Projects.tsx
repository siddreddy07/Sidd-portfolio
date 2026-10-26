import { projectsMeta } from "../lib/seo";
import { useSeo } from "../lib/useSeo";
import ProjectGrid from "../components/projects/ProjectGrid";
import Container from "../components/ui/Container";

export default function Projects() {
  useSeo(projectsMeta());
  return (
    <section className="py-16 md:py-24">
      <Container>
        <h1 className="text-center font-display text-5xl md:text-6xl">Projects</h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">Newest first. Each card links to the live site, the repo, or the package where one exists.</p>
        <div className="mt-10">
          <ProjectGrid />
        </div>
      </Container>
    </section>
  );
}
