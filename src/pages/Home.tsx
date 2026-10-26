import { homeMeta } from "../lib/seo";
import { useSeo } from "../lib/useSeo";
import Hero from "../components/home/Hero";
import Marquee from "../components/home/Marquee";
import Toolkit from "../components/home/Toolkit";
import SelectedWork from "../components/home/SelectedWork";
import GitHubActivity from "../components/home/GitHubActivity";
import ExperienceList from "../components/home/ExperienceList";
import Stack from "../components/home/Stack";
import Contact from "../components/home/Contact";

export default function Home() {
  useSeo(homeMeta());
  return (
    <>
      <Hero />
      <Marquee />
      <Toolkit />
      <SelectedWork />
      <GitHubActivity />
      <ExperienceList />
      <Stack />
      <Contact />
    </>
  );
}
