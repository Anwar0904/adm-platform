import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import publicContentService from "@/services/public-content.service";
import { SITE_URL } from "@/config/site";
import PortfolioExperience from "@/components/portfolio-experience/PortfolioExperience";
import type { PublicPortfolioProject } from "@/components/portfolio-experience/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Portfolio | Arazi Digital Media" },
  description: "Explore ADM’s connected approach to Technology, Marketing, AI and Data, and view project examples approved for public display.",
  alternates: { canonical: `${SITE_URL}/portfolio` },
  openGraph: {
    type: "website",
    title: "Portfolio | Arazi Digital Media",
    description: "ADM brings Technology, Marketing, AI and Data together around the problems teams need to solve.",
    url: `${SITE_URL}/portfolio`,
  },
};

export default async function PortfolioPage() {
  let projects: PublicPortfolioProject[] = [];
  let unavailable = false;

  try {
    await connectDB();
    const result = await publicContentService.getPortfolio({ page: 1, limit: 50 });
    projects = result.portfolio as unknown as PublicPortfolioProject[];
  } catch {
    // Keep the process overview useful when CMS storage is temporarily offline.
    unavailable = true;
  }

  return <PortfolioExperience projects={projects} unavailable={unavailable} />;
}
