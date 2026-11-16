import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { CAREERS_CANONICAL_URL, SITE_URL } from "@/config/site";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";
import CareerService from "@/services/career.service";
import { CONTENT_STATUS } from "@/enums";

type SitemapContentRecord = {
  slug: string;
  status: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
};

function getSitemapContentRecords(value: unknown): SitemapContentRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is SitemapContentRecord => {
    if (typeof item !== "object" || item === null) return false;
    const record = item as Record<string, unknown>;
    const validDate = (date: unknown) => date instanceof Date || typeof date === "string";

    return (
      typeof record.slug === "string" &&
      typeof record.status === "string" &&
      validDate(record.createdAt) &&
      (record.updatedAt === undefined || validDate(record.updatedAt))
    );
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about/leadership-governance`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about/sustainability`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: CAREERS_CANONICAL_URL,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/industries`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/team`,
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blogs`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/consultation`,
      changeFrequency: "yearly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faqs`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
      lastModified: new Date(),
    },
  ];

  try {
    await connectDB();

    const blogsResult = await PublicContentService.getBlogs({
      page: 1,
      limit: 1000,
    });

    const blogRoutes: MetadataRoute.Sitemap = getSitemapContentRecords(blogsResult.blogs)
      .filter((blog) => blog.status === CONTENT_STATUS.PUBLISHED)
      .map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
      }));

    const servicesResult = await PublicContentService.getServices({
      page: 1,
      limit: 1000,
    });

    const serviceRoutes: MetadataRoute.Sitemap = getSitemapContentRecords(servicesResult.services)
      .filter((service) => service.status === CONTENT_STATUS.PUBLISHED)
      .map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        lastModified: new Date(service.updatedAt || service.createdAt),
      }));

    const portfolioResult = await PublicContentService.getPortfolio({
      page: 1,
      limit: 1000,
    });

    const portfolioRoutes: MetadataRoute.Sitemap = getSitemapContentRecords(portfolioResult.portfolio)
      .filter((item) => item.status === CONTENT_STATUS.PUBLISHED)
      .map((item) => ({
        url: `${baseUrl}/portfolio/${item.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: new Date(item.updatedAt || item.createdAt),
      }));

    const industriesResult = await PublicContentService.getIndustries({
      page: 1,
      limit: 1000,
    });

    const industryRoutes: MetadataRoute.Sitemap = getSitemapContentRecords(industriesResult.industries)
      .filter((industry) => industry.status === CONTENT_STATUS.PUBLISHED)
      .map((industry) => ({
        url: `${baseUrl}/industries/${industry.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        lastModified: new Date(industry.updatedAt || industry.createdAt),
      }));

    let careerRoutes: MetadataRoute.Sitemap = [];
    try {
      const careers = await CareerService.getPublicCareers();
      careerRoutes = careers.map((career) => ({
        url: `${CAREERS_CANONICAL_URL}/${encodeURIComponent(career.slug)}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        lastModified: new Date(career.updatedAt || career.createdAt),
      }));
    } catch (error) {
      console.error("Career sitemap generation error:", error);
    }

    return [
      ...staticRoutes,
      ...blogRoutes,
      ...serviceRoutes,
      ...portfolioRoutes,
      ...industryRoutes,
      ...careerRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
