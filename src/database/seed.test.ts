import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("legacy role seed is hard-stopped before database access or deletion", () => {
  const source = readFileSync(fileURLToPath(new URL("./seed.ts", import.meta.url)), "utf8");

  assert.match(source, /Role seed disabled/);
  assert.doesNotMatch(source, /mongoose\.connect|Role\.deleteMany|Role\.insertMany/);
});
