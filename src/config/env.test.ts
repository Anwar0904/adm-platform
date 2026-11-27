import assert from "node:assert/strict";
import test from "node:test";

import { resolveMongoDbName } from "./env-validation";

test("requires an explicit MongoDB database name in production", () => {
  assert.throws(
    () => resolveMongoDbName(undefined, "production"),
    /Missing required environment variable: MONGODB_DB/,
  );
  assert.throws(
    () => resolveMongoDbName("   ", "production"),
    /Missing required environment variable: MONGODB_DB/,
  );
});

test("keeps a development fallback while trimming explicit database names", () => {
  assert.equal(resolveMongoDbName(undefined, "development"), "adm-website");
  assert.equal(resolveMongoDbName(" staging-adm ", "production"), "staging-adm");
});
