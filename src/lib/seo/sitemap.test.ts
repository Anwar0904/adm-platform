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

test("CMS sitemap XML escapes URL text and emits valid root element", () => {
  const xml = renderSitemapXml([{ url: "https://example.com/blogs/a&b" }]);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?><urlset/);
  assert.match(xml, /a&amp;b/);
  assert.match(xml, /<\/urlset>$/);
});
