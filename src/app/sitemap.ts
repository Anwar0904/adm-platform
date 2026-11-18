import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { CAREERS_CANONICAL_URL, SITE_URL } from "@/config/site";
import { connectDB } from "@/lib/db";
import {
  createPublishedContentSitemapEntries,
  createStaticSitemapEntries,
  type SitemapContentRecord,
  uniqueSitemapEntries,
} from "@/lib/seo/sitemap";
import PublicContentService from "@/services/public-content.service";
import CareerService from "@/services/career.service";

function getSitemapContentRecords(value: unknown): SitemapContentRecord[] {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const staticRoutes = createStaticSitemapEntries(SITE_URL);

  try {
    await connectDB();

    const [blogsResult, servicesResult] = await Promise.all([
      PublicContentService.getBlogs({ page: 1, limit: 1000 }),
      PublicContentService.getServices({ page: 1, limit: 1000 }),
    ]);

    const blogRoutes = createPublishedContentSitemapEntries(
      SITE_URL,
      "blogs",
      getSitemapContentRecords(blogsResult.blogs),
      "weekly",
      0.7
    );

    const serviceRoutes = createPublishedContentSitemapEntries(
      SITE_URL,
      "services",
      getSitemapContentRecords(servicesResult.services),
      "monthly",
      0.8
    );

    let careerRoutes: MetadataRoute.Sitemap = [];
    try {
      const careers = await CareerService.getPublicCareers();
      careerRoutes = careers.map((career) => ({
        url: `${CAREERS_CANONICAL_URL}/${encodeURIComponent(career.slug)}`,
        changeFrequency: "weekly",
        priority: 0.6,
        ...(career.updatedAt ? { lastModified: career.updatedAt } : {}),
      }));
    } catch (error) {
      console.error("Career sitemap generation error:", error);
    }

    return uniqueSitemapEntries([
      ...staticRoutes,
      ...blogRoutes,
      ...serviceRoutes,
      ...careerRoutes,
    ]);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
