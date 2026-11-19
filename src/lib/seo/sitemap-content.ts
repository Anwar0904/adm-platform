import type { MetadataRoute } from "next";
import { CAREERS_CANONICAL_URL, SITE_URL } from "@/config/site";
import {
  createPublishedContentSitemapEntries,
  type SitemapContentRecord,
  uniqueSitemapEntries,
} from "@/lib/seo/sitemap";

export function getSitemapContentRecords(value: unknown): SitemapContentRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is SitemapContentRecord => {
    if (typeof item !== "object" || item === null) return false;
    const record = item as Record<string, unknown>;
    const validDate = (date: unknown) =>
      date === undefined || date instanceof Date || typeof date === "string";

    return (
      typeof record.slug === "string" &&
      typeof record.status === "string" &&
      validDate(record.createdAt) &&
      validDate(record.updatedAt)
    );
  });
}

export function createDynamicSitemapEntries(
  blogs: unknown,
  services: unknown,
  careers: Array<{ slug: string; updatedAt?: Date | string }>
): MetadataRoute.Sitemap {
  const blogRoutes = createPublishedContentSitemapEntries(
    SITE_URL,
    "blogs",
    getSitemapContentRecords(blogs),
    "weekly",
    0.7
  );
  const serviceRoutes = createPublishedContentSitemapEntries(
    SITE_URL,
    "services",
    getSitemapContentRecords(services),
    "monthly",
    0.8
  );
  const careerRoutes = careers
    .filter((career) => typeof career.slug === "string" && career.slug.trim())
    .map((career) => ({
      url: `${CAREERS_CANONICAL_URL}/${encodeURIComponent(career.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      ...(career.updatedAt ? { lastModified: career.updatedAt } : {}),
    }));

  return uniqueSitemapEntries([...blogRoutes, ...serviceRoutes, ...careerRoutes]);
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '\"': "&quot;",
    };
    return entities[character];
  });
}

export function renderSitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map(({ url, lastModified }) => {
      const lastmod = lastModified
        ? `<lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>`
        : "";
      return `<url><loc>${escapeXml(url)}</loc>${lastmod}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
