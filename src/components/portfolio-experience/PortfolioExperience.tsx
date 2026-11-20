import type { PublicPortfolioProject } from "./types";
import PortfolioHero from "./PortfolioHero";
import ApprovedWorkShowcase from "./ApprovedWorkShowcase";
import CapabilityStories from "./CapabilityStories";
import WorkApproach from "./WorkApproach";
import PortfolioQuestions from "./PortfolioQuestions";
import PortfolioClosing from "./PortfolioClosing";

export default function PortfolioExperience({
  projects,
  unavailable,
}: {
  projects: PublicPortfolioProject[];
  unavailable: boolean;
}) {
  const hasApprovedWork = projects.length > 0;

  return (
    <div className="overflow-hidden bg-[#050d1a] text-white">
      <PortfolioHero hasApprovedWork={hasApprovedWork} />
      {hasApprovedWork ? (
        <ApprovedWorkShowcase projects={projects} />
      ) : (
        <CapabilityStories unavailable={unavailable} />
      )}
      <WorkApproach />
      <PortfolioQuestions />
      <PortfolioClosing />
    </div>
  );
}
