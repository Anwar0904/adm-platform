import { connectDB } from "@/lib/db";
import { createDynamicSitemapEntries, renderSitemapXml } from "@/lib/seo/sitemap-content";
import { collectSitemapPages } from "@/lib/seo/sitemap-pagination";
import CareerService from "@/services/career.service";
import PublicContentService from "@/services/public-content.service";

export const runtime = "nodejs";

const PAGE_SIZE = 1_000;
const MAX_URLS = 50_000;
const PAGE_BATCH_SIZE = 4;

export async function GET(): Promise<Response> {
  try {
    await connectDB();
    const [blogsFirst, servicesFirst, careers] = await Promise.all([
      PublicContentService.getBlogs({ page: 1, limit: PAGE_SIZE }),
      PublicContentService.getServices({ page: 1, limit: PAGE_SIZE }),
      CareerService.getPublicCareers({ limit: MAX_URLS + 1 }),
    ]);
    if (blogsFirst.pagination.total + servicesFirst.pagination.total + careers.length > MAX_URLS) {
      throw new Error("CMS sitemap exceeds the 50,000 URL protocol limit.");
    }
    const [blogs, services] = await Promise.all([
      collectSitemapPages(
        async (page, limit) => {
          const result = await PublicContentService.getBlogs({ page, limit });
          return { pagination: result.pagination, records: result.blogs };
        },
        { pagination: blogsFirst.pagination, records: blogsFirst.blogs },
        { pageSize: PAGE_SIZE, maxRecords: MAX_URLS }
      ),
      collectSitemapPages(
        async (page, limit) => {
          const result = await PublicContentService.getServices({ page, limit });
          return { pagination: result.pagination, records: result.services };
        },
        { pagination: servicesFirst.pagination, records: servicesFirst.services },
        { pageSize: PAGE_SIZE, maxRecords: MAX_URLS }
      ),
    ]);

    return new Response(
      renderSitemapXml(
        createDynamicSitemapEntries(blogs, services, careers)
      ),
      {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    // The core /sitemap.xml remains available. Do not cache a partial or stale
    // CMS sitemap when the database cannot confirm current publication state.
    console.error("CMS sitemap generation failed; database unavailable.");
    return Response.json(
      { error: "CMS sitemap temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } }
    );
  }
}
