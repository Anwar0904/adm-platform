import assert from "node:assert/strict";
import test from "node:test";
import { isPortfolioStatus, portfolioStatusLabel } from "./portfolio-admin-status";

test("portfolio CMS uses lowercase API statuses and separate display labels", () => {
  for (const status of ["published", "draft", "archived"] as const) {
    assert.equal(isPortfolioStatus(status), true);
    assert.equal(portfolioStatusLabel(status), status[0].toUpperCase() + status.slice(1));
  }
  assert.equal(isPortfolioStatus("Published"), false);
  assert.equal(isPortfolioStatus("Draft"), false);
});
