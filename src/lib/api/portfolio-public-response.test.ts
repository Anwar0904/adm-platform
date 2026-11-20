import assert from "node:assert/strict";
import test from "node:test";
import { ApiError } from "@/lib/api/api-error";
import { portfolioPublicErrorResponse } from "./portfolio-public-response";

test("unapproved and absent portfolio slugs return a non-cacheable 404", async () => {
  const response = portfolioPublicErrorResponse(new ApiError(404, "Portfolio not found."));
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { success: false, message: "Portfolio not found." });
});

test("public portfolio storage failures return a non-cacheable 503", async () => {
  const response = portfolioPublicErrorResponse(new Error("database unavailable"));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { success: false, message: "Portfolio content is temporarily unavailable." });
});
