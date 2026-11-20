import assert from "node:assert/strict";
import test from "node:test";

import { isPublicProofEligible, normalizePublicMediaUrl, normalizePublicUrl } from "./portfolio-public-proof";

const approved = {
  approvalStatus: "approved",
  approvedAt: "2026-01-01T00:00:00.000Z",
  approvedByRole: "owner",
  referenceId: "consent-42",
  permittedElements: ["title", "shortDescription", "classification"],
  classification: "client-project",
};

test("public portfolio proof requires published, live approval metadata", () => {
  assert.equal(isPublicProofEligible("published", false, approved), true);
  assert.equal(isPublicProofEligible("draft", false, approved), false);
  assert.equal(isPublicProofEligible("published", true, approved), false);
  assert.equal(isPublicProofEligible("published", false, undefined), false);
  assert.equal(isPublicProofEligible("published", false, { ...approved, referenceId: "" }), false);
});

test("public proof consent expiry is fail-closed", () => {
  assert.equal(isPublicProofEligible("published", false, { ...approved, consentExpiresAt: "2026-01-02" }, new Date("2026-01-01")), true);
  assert.equal(isPublicProofEligible("published", false, { ...approved, consentExpiresAt: "2025-12-31" }, new Date("2026-01-01")), false);
  assert.equal(isPublicProofEligible("published", false, { ...approved, consentExpiresAt: "bad-date" }, new Date("2026-01-01")), false);
});

test("only HTTP(S) project links are eligible for public display", () => {
  assert.equal(normalizePublicUrl("javascript:alert(1)"), undefined);
  assert.equal(normalizePublicUrl("https://example.com/path"), "https://example.com/path");
  assert.equal(normalizePublicUrl("/relative"), undefined);
});

test("public media is limited to local paths and configured HTTPS image hosts", () => {
  assert.equal(normalizePublicMediaUrl("javascript:alert(1)"), undefined);
  assert.equal(normalizePublicMediaUrl("//evil.example/image.png"), undefined);
  assert.equal(normalizePublicMediaUrl("/uploads/approved.png"), "/uploads/approved.png");
  assert.equal(normalizePublicMediaUrl("https://images.unsplash.com/photo.jpg"), "https://images.unsplash.com/photo.jpg");
  assert.equal(normalizePublicMediaUrl("https://unapproved.example/image.png"), undefined);
});
