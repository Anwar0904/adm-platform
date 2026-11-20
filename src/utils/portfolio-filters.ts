export type PortfolioFilterChoice = string | { name?: string; title?: string };

export type PortfolioFilterRecord = {
  title?: string;
  shortDescription?: string;
  category?: PortfolioFilterChoice | null;
  industries?: PortfolioFilterChoice[];
  technologies?: string[];
  capabilities?: string[];
};

export type PortfolioFilters = {
  search?: string;
  category?: string;
  industry?: string;
  technology?: string;
  capability?: string;
};

export function portfolioChoiceText(value?: PortfolioFilterChoice | null): string {
  if (typeof value === "string") return value;
  return value?.name || value?.title || "";
}

export function filterPortfolioProjects<T extends PortfolioFilterRecord>(
  projects: T[],
  filters: PortfolioFilters,
): T[] {
  const query = filters.search?.trim().toLowerCase() ?? "";
  return projects.filter((project) => {
    const matchesSearch = !query || [
      project.title,
      project.shortDescription,
      portfolioChoiceText(project.category),
      ...(project.industries ?? []).map(portfolioChoiceText),
      ...(project.technologies ?? []),
      ...(project.capabilities ?? []),
    ].some((value) => value?.toLowerCase().includes(query));

    return matchesSearch
      && (!filters.category || filters.category === "all" || portfolioChoiceText(project.category) === filters.category)
      && (!filters.industry || filters.industry === "all" || (project.industries ?? []).some((value) => portfolioChoiceText(value) === filters.industry))
      && (!filters.technology || filters.technology === "all" || (project.technologies ?? []).includes(filters.technology))
      && (!filters.capability || filters.capability === "all" || (project.capabilities ?? []).includes(filters.capability));
  });
}
