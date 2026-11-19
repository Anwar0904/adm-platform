import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { createStaticSitemapEntries } from "@/lib/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep the core sitemap independent of MongoDB availability. CMS URLs are
  // listed in the separate, short-lived sitemap route referenced by robots.txt.
  return createStaticSitemapEntries(SITE_URL);
}
