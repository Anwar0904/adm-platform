import type { MetadataRoute } from "next";

export type SitemapContentRecord = {
  slug: string;
  status: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const publicStaticPaths = [
  "/",
  "/about",
  "/about/leadership-governance",
  "/about/leadership-governance/leadership-board",
  "/about/leadership-governance/executive-committee",
  "/about/leadership-governance/management-committee",
  "/about/sustainability",
  "/careers",
  "/services",
  "/services/technology",
  "/services/marketing",
  "/services/ai",
  "/services/data",
  "/portfolio",
  "/industries",
  "/blogs",
  "/testimonials",
  "/contact",
  "/consultation",
  "/faqs",
  "/privacy-policy",
  "/terms",
  "/cookies",
] as const;

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function createStaticSitemapEntries(
  baseUrl: string
): MetadataRoute.Sitemap {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return publicStaticPaths.map((path) => ({
    url: `${normalizedBaseUrl}${path}`,
  }));
}

function parseDate(value: Date | string | undefined): Date | undefined {
  if (value === undefined) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function createPublishedContentSitemapEntries(
  baseUrl: string,
  routePrefix: string,
  records: SitemapContentRecord[],
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
  priority: number
): MetadataRoute.Sitemap {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedPrefix = `/${routePrefix.replace(/^\/+|\/+$/g, "")}`;
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const record of records) {
    const slug = record.slug.trim();
    if (
      record.status !== "published" ||
      !slug ||
      slug.includes("/") ||
      slug.includes("?") ||
      slug.includes("#")
    ) {
      continue;
    }

    const url = `${normalizedBaseUrl}${normalizedPrefix}/${encodeURIComponent(slug)}`;
    if (entries.has(url)) continue;

    // `createdAt` describes publication/creation, not the last content edit.
    const lastModified = parseDate(record.updatedAt);
    entries.set(url, {
      url,
      changeFrequency,
      priority,
      ...(lastModified ? { lastModified } : {}),
    });
  }

  return [...entries.values()];
}

export function uniqueSitemapEntries(
  entries: MetadataRoute.Sitemap
): MetadataRoute.Sitemap {
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    if (!unique.has(entry.url)) unique.set(entry.url, entry);
  }
  return [...unique.values()];
}
