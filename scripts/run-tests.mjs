import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve("src");
const testFiles = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile() && entry.name.endsWith(".test.ts")) testFiles.push(path);
  }
}

await collect(root);
testFiles.sort();

if (testFiles.length === 0) {
  console.error("No *.test.ts files found under src; refusing to report an empty test pass.");
  process.exit(1);
}

console.log(`Discovered ${testFiles.length} test file(s):`);
for (const path of testFiles) console.log(`- ${path}`);

const result = spawnSync(
  process.execPath,
  ["--import=tsx", "--test", ...testFiles],
  { stdio: "inherit", env: process.env }
);

if (result.error) {
  console.error("Unable to start Node test runner:", result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
