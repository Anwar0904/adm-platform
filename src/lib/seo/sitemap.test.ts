import assert from "node:assert/strict";
import test from "node:test";

import {
  createPublishedContentSitemapEntries,
  createStaticSitemapEntries,
  uniqueSitemapEntries,
} from "./sitemap";
import {
  createDynamicSitemapEntries,
  renderSitemapXml,
} from "./sitemap-content";
import { collectSitemapPages } from "./sitemap-pagination";

test("static sitemap includes implemented public routes without fabricated dates", () => {
  const entries = createStaticSitemapEntries("https://example.com/");
  const urls = entries.map(({ url }) => url);

  assert.ok(urls.includes("https://example.com/"));
  assert.ok(urls.includes("https://example.com/testimonials"));
  assert.ok(urls.includes("https://example.com/cookies"));
  assert.ok(!urls.includes("https://example.com/team"));
  assert.ok(entries.every(({ lastModified }) => lastModified === undefined));
});

test("content sitemap includes unique published slugs with valid source dates", () => {
  const entries = createPublishedContentSitemapEntries(
    "https://example.com/",
    "/blogs/",
    [
      { slug: "published-article", status: "published", updatedAt: "2026-02-03" },
      { slug: "draft-article", status: "draft", createdAt: "2026-02-01" },
      { slug: "withdrawn-article", status: "withdrawn", updatedAt: "2026-02-02" },
      { slug: "published-article", status: "published", createdAt: "2026-01-01" },
      { slug: "invalid/date", status: "published" },
      { slug: "invalid-date", status: "published", updatedAt: "not a date" },
      { slug: "no-update-date", status: "published", createdAt: "2026-01-02" },
    ],
    "weekly",
    0.7
  );

  assert.equal(entries.length, 3);
  assert.equal(entries[0].url, "https://example.com/blogs/published-article");
  assert.equal(
    new Date(entries[0].lastModified as Date | string).toISOString(),
    "2026-02-03T00:00:00.000Z"
  );
  assert.equal(entries[1].url, "https://example.com/blogs/invalid-date");
  assert.equal(entries[1].lastModified, undefined);
  assert.equal(entries[2].lastModified, undefined);
});

test("duplicate URLs keep only the first sitemap entry", () => {
  const unique = uniqueSitemapEntries([
    { url: "https://example.com/services/ai" },
    { url: "https://example.com/services/ai", priority: 0.8 },
  ]);

  assert.deepEqual(unique, [{ url: "https://example.com/services/ai" }]);
});

test("dynamic sitemap includes published CMS routes and current open careers", () => {
  const entries = createDynamicSitemapEntries(
    [
      { slug: "published-post", status: "published" },
      { slug: "draft-post", status: "draft" },
    ],
    [{ slug: "published-service", status: "published" }],
    [{ slug: "open-role" }]
  );
  const urls = entries.map(({ url }) => url);

  assert.ok(urls.some((url) => url.endsWith("/blogs/published-post")));
  assert.ok(urls.some((url) => url.endsWith("/services/published-service")));
  assert.ok(urls.some((url) => url.endsWith("/careers/open-role")));
  assert.ok(!urls.some((url) => url.endsWith("/blogs/draft-post")));
});

test("career sitemap validates dates and percent-encodes safe slugs", () => {
  const entries = createDynamicSitemapEntries([], [], [
    { slug: "role & growth", updatedAt: "2026-03-04T00:00:00.000Z" },
    { slug: "bad-date", updatedAt: "not a date" },
    { slug: "far-future", updatedAt: "+010000-01-01T00:00:00.000Z" },
    { slug: "nested/role", updatedAt: new Date("2026-01-01") },
  ]);

  assert.equal(entries.length, 3);
  assert.ok(entries.some(({ url }) => url.endsWith("/careers/role%20%26%20growth")));
  assert.equal(entries.find(({ url }) => url.endsWith("/careers/bad-date"))?.lastModified, undefined);
  assert.equal(entries.find(({ url }) => url.endsWith("/careers/far-future"))?.lastModified, undefined);
  assert.ok(!entries.some(({ url }) => url.includes("nested")));
});

test("sitemap XML omits invalid and out-of-range lastmod values without failing", () => {
  const xml = renderSitemapXml([
    { url: "https://example.com/a", lastModified: "invalid" },
    { url: "https://example.com/b", lastModified: "+010000-01-01T00:00:00.000Z" },
  ]);

  assert.doesNotMatch(xml, /<lastmod>/);
  assert.match(xml, /<loc>https:\/\/example.com\/a<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example.com\/b<\/loc>/);
});

test("CMS sitemap pagination collects records beyond the first 1,000 in bounded batches", async () => {
  const requested: number[] = [];
  const records = Array.from({ length: 2_501 }, (_, index) => index);
  const all = await collectSitemapPages(
    async (page, limit) => {
      requested.push(page);
      const pageRecords = records.slice((page - 1) * limit, page * limit);
      return {
        pagination: { total: records.length, totalPages: 3 },
        records: pageRecords,
      };
    },
    {
      pagination: { total: records.length, totalPages: 3 },
      records: records.slice(0, 1_000),
    },
    { pageSize: 1_000, maxRecords: 50_000, batchSize: 2 }
  );

  assert.deepEqual(requested, [2, 3]);
  assert.deepEqual(all, records);
});

test("CMS sitemap pagination rejects incomplete query results", async () => {
  await assert.rejects(
    collectSitemapPages(
      async () => ({ pagination: { total: 2, totalPages: 2 }, records: [] }),
      { pagination: { total: 2, totalPages: 2 }, records: [1] },
      { pageSize: 1, maxRecords: 10 }
    ),
    /content page is incomplete/
  );
});

test("CMS sitemap pagination rejects conflicting count metadata and invalid counts", async () => {
  const fetchSecondPage = async () => ({
    pagination: { total: 2, totalPages: 2 },
    records: [2],
  });
  const firstPage = {
    pagination: { total: 2, totalPages: 2 },
    records: [1],
  };

  await assert.rejects(
    collectSitemapPages(fetchSecondPage, {
      pagination: { total: 2, totalPages: 1 },
      records: [1],
    }, { pageSize: 1, maxRecords: 10 }),
    /metadata or limits are invalid/
  );
  await assert.rejects(
    collectSitemapPages(fetchSecondPage, {
      pagination: { total: -1, totalPages: 0 },
      records: [],
    }, { pageSize: 1, maxRecords: 10 }),
    /metadata or limits are invalid/
  );
  await assert.rejects(
    collectSitemapPages(fetchSecondPage, {
      pagination: { total: 2.5, totalPages: 3 },
      records: [1],
    }, { pageSize: 1, maxRecords: 10 }),
    /metadata or limits are invalid/
  );
  await assert.rejects(
    collectSitemapPages(fetchSecondPage, firstPage, { pageSize: 1, maxRecords: 1 }),
    /metadata or limits are invalid/
  );
  await assert.rejects(
    collectSitemapPages(
      async () => ({ pagination: { total: 3, totalPages: 3 }, records: [2] }),
      firstPage,
      { pageSize: 1, maxRecords: 10 }
    ),
    /metadata changed during collection/
  );
  await assert.rejects(
    collectSitemapPages(fetchSecondPage, firstPage, { pageSize: 0, maxRecords: 10 }),
    /metadata or limits are invalid/
  );
});

test("CMS sitemap pagination rejects duplicate records across overlapping pages", async () => {
  await assert.rejects(
    collectSitemapPages(
      async () => ({ pagination: { total: 2, totalPages: 2 }, records: [{ slug: "same" }] }),
      { pagination: { total: 2, totalPages: 2 }, records: [{ slug: "same" }] },
      { pageSize: 1, maxRecords: 10, recordKey: (record) => record.slug }
    ),
    /duplicate records/
  );
});

test("CMS sitemap pagination accepts an empty content set", async () => {
  const records = await collectSitemapPages(
    async () => ({ pagination: { total: 0, totalPages: 0 }, records: [] }),
    { pagination: { total: 0, totalPages: 0 }, records: [] },
    { pageSize: 1_000, maxRecords: 50_000 }
  );

  assert.deepEqual(records, []);
});

test("CMS sitemap XML escapes URL text and emits valid root element", () => {
  const xml = renderSitemapXml([{ url: "https://example.com/blogs/a&b" }]);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?><urlset/);
  assert.match(xml, /a&amp;b/);
  assert.match(xml, /<\/urlset>$/);
});
