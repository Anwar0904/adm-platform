import assert from "node:assert/strict";
import test from "node:test";

import { expectedLoginStatuses, validatePreviewOrigin } from "./preview-security-smoke.local.mjs";

test("accepts the current ADM Vercel Preview origin shape", () => {
  assert.equal(
    validatePreviewOrigin("https://adm-platform-git-security-platform-h-78cfd5-anwar0904s-projects.vercel.app"),
    "https://adm-platform-git-security-platform-h-78cfd5-anwar0904s-projects.vercel.app",
  );
});

test("rejects Production, custom domains, other Vercel projects, and malformed target URLs", () => {
  for (const target of [
    "https://arazidigitalmedia.com",
    "https://adm-platform.vercel.app",
    "http://adm-platform-git-security-x-anwar0904s-projects.vercel.app",
    "https://attacker.vercel.app",
    "https://user:password@adm-platform-git-security-x-anwar0904s-projects.vercel.app",
    "https://adm-platform-git-security-x-anwar0904s-projects.vercel.app/path",
    "https://adm-platform-git-security-x-anwar0904s-projects.vercel.app?redirect=arazidigitalmedia.com",
  ]) {
    assert.throws(() => validatePreviewOrigin(target), /not an approved ADM Preview origin/);
  }
});

test("the login probe is capped at the configured account threshold plus one", () => {
  assert.deepEqual(expectedLoginStatuses(), [401, 401, 401, 401, 401, 401, 401, 401, 429]);
  assert.equal(expectedLoginStatuses().length, 9);
});
