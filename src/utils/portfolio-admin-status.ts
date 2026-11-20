export const PORTFOLIO_STATUSES = ["published", "draft", "archived"] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];

export function isPortfolioStatus(value: unknown): value is PortfolioStatus {
  return typeof value === "string" && PORTFOLIO_STATUSES.includes(value as PortfolioStatus);
}

export function portfolioStatusLabel(status: PortfolioStatus): string {
  return status[0].toUpperCase() + status.slice(1);
}
