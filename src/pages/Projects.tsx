import { projectsMeta } from "../lib/seo";
import { useSeo } from "../lib/useSeo";
import ProjectGrid from "../components/projects/ProjectGrid";
import Container from "../components/ui/Container";
import { TextAnimate } from "../components/ui/TextAnimate";

export default function Projects() {
  useSeo(projectsMeta());
  return (
    <section className="py-16 md:py-24">
      <Container>
        <TextAnimate as="h1" by="character" animation="blurInUp" duration={0.5} once className="font-display text-5xl md:text-6xl">
          Projects
        </TextAnimate>
        <TextAnimate
          as="p"
          by="word"
          animation="blurIn"
          duration={0.6}
          delay={0.25}
          once
          className="mt-4 max-w-xl text-text-secondary"
        >
          Newest first. Each card links to the live site, the repo, or the package where one exists.
        </TextAnimate>
        <div className="mt-8 md:mt-12">
          <ProjectGrid />
        </div>
      </Container>
    </section>
  );
}
