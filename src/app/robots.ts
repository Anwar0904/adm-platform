import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = SITE_URL.replace(/\/+$/, "");
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: [
                    "/admin",
                    "/api",
                    "/auth",
                    "/checkout",
                    "/*.json$",
                    "/*?*",
                ],
            },
            {
                userAgent: "AdsBot-Google",
                allow: ["/"],
            },
        ],
        sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/cms-sitemap.xml`],
        host: siteUrl,
    };
}
