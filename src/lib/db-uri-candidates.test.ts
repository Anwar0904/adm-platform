import test from "node:test";
import assert from "node:assert/strict";

import { getMongoUriCandidates } from "./db-uri-candidates";

test("keeps the configured URI before the local fallback outside production", () => {
  assert.deepEqual(
    getMongoUriCandidates(
      "mongodb+srv://cluster.example.mongodb.net/adm-platform",
      "mongodb://127.0.0.1:27017/adm-platform",
      true
    ),
    [
      "mongodb+srv://cluster.example.mongodb.net/adm-platform",
      "mongodb://127.0.0.1:27017/adm-platform",
    ]
  );
});

test("deduplicates identical configured and fallback URIs", () => {
  assert.deepEqual(
    getMongoUriCandidates(
      "mongodb://127.0.0.1:27017/adm-platform",
      "mongodb://127.0.0.1:27017/adm-platform",
      true
    ),
    ["mongodb://127.0.0.1:27017/adm-platform"]
  );
});

test("does not add the local fallback in production", () => {
  assert.deepEqual(
    getMongoUriCandidates(
      "mongodb+srv://cluster.example.mongodb.net/adm-platform",
      "mongodb://127.0.0.1:27017/adm-platform",
      false
    ),
    ["mongodb+srv://cluster.example.mongodb.net/adm-platform"]
  );
});
