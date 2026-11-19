import assert from "node:assert/strict";
import test from "node:test";
import { getMongoUriCandidates } from "./db-uri-candidates";

test("production URI selection never includes the local fallback", () => {
  assert.deepEqual(
    getMongoUriCandidates("mongodb+srv://configured.example/db", "mongodb://127.0.0.1/db", false),
    ["mongodb+srv://configured.example/db"]
  );
});

test("local fallback remains available only when explicitly allowed", () => {
  assert.deepEqual(
    getMongoUriCandidates("mongodb://configured/db", "mongodb://127.0.0.1/db", true),
    ["mongodb://configured/db", "mongodb://127.0.0.1/db"]
  );
});

test("duplicate URI candidates are removed", () => {
  assert.deepEqual(
    getMongoUriCandidates("mongodb://same/db", "mongodb://same/db", true),
    ["mongodb://same/db"]
  );
});
