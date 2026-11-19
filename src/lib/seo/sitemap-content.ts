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
  careers: Array<{ slug: string; updatedAt?: Date | string | null }>
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
  const careerRoutes = careers.flatMap((career) => {
    const slug = typeof career.slug === "string" ? career.slug.trim() : "";
    if (!slug || slug.includes("/") || slug.includes("?") || slug.includes("#")) return [];

    const lastModified = parseSitemapDate(career.updatedAt);
    return [{
      url: `${CAREERS_CANONICAL_URL}/${encodeURIComponent(slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      ...(lastModified ? { lastModified } : {}),
    }];
  });

  return uniqueSitemapEntries([...blogRoutes, ...serviceRoutes, ...careerRoutes]);
}

function parseSitemapDate(value: Date | string | null | undefined): Date | undefined {
  if (value === undefined || value === null) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  const timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) return undefined;
  const year = date.getUTCFullYear();
  return year >= 1970 && year <= 9999 ? date : undefined;
}

function formatSitemapDate(value: Date | string | undefined): string | undefined {
  const date = parseSitemapDate(value);
  return date?.toISOString();
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
      const safeLastModified = formatSitemapDate(lastModified);
      const lastmod = safeLastModified
        ? `<lastmod>${escapeXml(safeLastModified)}</lastmod>`
        : "";
      return `<url><loc>${escapeXml(url)}</loc>${lastmod}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
