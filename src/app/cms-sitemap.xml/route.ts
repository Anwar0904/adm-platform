import { connectDB } from "@/lib/db";
import { createDynamicSitemapEntries, renderSitemapXml } from "@/lib/seo/sitemap-content";
import CareerService from "@/services/career.service";
import PublicContentService from "@/services/public-content.service";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    await connectDB();
    const [blogsResult, servicesResult, careers] = await Promise.all([
      PublicContentService.getBlogs({ page: 1, limit: 1000 }),
      PublicContentService.getServices({ page: 1, limit: 1000 }),
      CareerService.getPublicCareers(),
    ]);

    return new Response(
      renderSitemapXml(
        createDynamicSitemapEntries(blogsResult.blogs, servicesResult.services, careers)
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
