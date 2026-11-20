import assert from "node:assert/strict";
import test from "node:test";
import { filterPortfolioProjects } from "./portfolio-filters";

const projects = [
  { title: "Health data platform", shortDescription: "Clinical records", category: { name: "Platform" }, industries: [{ title: "Healthcare" }], technologies: ["Next.js", "MongoDB"], capabilities: ["Technology", "Data"] },
  { title: "Retail campaign", shortDescription: "Audience planning", category: "Campaign", industries: ["Retail"], technologies: ["Analytics"], capabilities: ["Marketing"] },
];

test("portfolio filters intersect search, category, industry, technology and ADM capability", () => {
  assert.deepEqual(filterPortfolioProjects(projects, { search: "clinical", category: "Platform", industry: "Healthcare", technology: "MongoDB", capability: "Data" }).map((p) => p.title), ["Health data platform"]);
  assert.deepEqual(filterPortfolioProjects(projects, { search: "retail", capability: "Technology" }), []);
  assert.deepEqual(filterPortfolioProjects(projects, { category: "all", industry: "Retail" }).map((p) => p.title), ["Retail campaign"]);
});

test("portfolio filters keep records with absent optional facets and empty search", () => {
  const basic = [{ title: "Approved entry", shortDescription: "Summary" }];
  assert.deepEqual(filterPortfolioProjects(basic, { search: "  " }), basic);
  assert.deepEqual(filterPortfolioProjects(basic, { technology: "Next.js" }), []);
});
