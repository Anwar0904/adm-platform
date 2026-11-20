export type PortfolioChoice = { _id?: string; name?: string; title?: string; slug?: string } | string;

export type PublicPortfolioProject = {
  id: string;
  slug: string;
  title?: string;
  clientName?: string;
  shortDescription?: string;
  classification?: string;
  capabilities?: Array<"Technology" | "Marketing" | "AI" | "Data">;
  category?: PortfolioChoice | null;
  industries?: PortfolioChoice[];
  technologies?: string[];
  projectUrl?: string;
  featuredImage?: { url?: string; alt?: string } | null;
};
