import assert from "node:assert/strict";
import test from "node:test";
import { PortfolioApprovalSchema } from "./portfolio-approval.validator";

test("approval requires traceable evidence, a classification and required public fields", () => {
  const result = PortfolioApprovalSchema.safeParse({
    approvalStatus: "approved",
    classification: "concept-prototype",
    referenceId: "owner-review-2026-11",
    permittedElements: ["title", "shortDescription", "classification", "capabilities"],
    capabilities: ["AI", "Data"],
  });
  assert.equal(result.success, true);
});

test("approval rejects incomplete disclosure and unknown fields; revocation is supported", () => {
  assert.equal(PortfolioApprovalSchema.safeParse({
    approvalStatus: "approved", classification: "client-project", referenceId: "review-1", permittedElements: ["title"],
  }).success, false);
  assert.equal(PortfolioApprovalSchema.safeParse({
    approvalStatus: "approved", classification: "client-project", referenceId: "review-1", permittedElements: ["title", "shortDescription"], clientName: "unexpected",
  }).success, false);
  assert.equal(PortfolioApprovalSchema.safeParse({ approvalStatus: "revoked", referenceId: "consent-withdrawal-1" }).success, true);
});
