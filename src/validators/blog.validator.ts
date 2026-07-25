import { z } from "zod";

import {
    CONTENT_STATUS,
} from "@/enums";

export const CreateBlogSchema =
    z.object({
        title: z
            .string()
            .min(5)
            .max(200),

        slug: z
            .string()
            .optional(),

        excerpt: z
            .string()
            .max(500)
            .optional(),

        content: z
            .string()
            .min(20),

        featuredImage: z
            .string()
            .optional(),

        gallery: z
            .array(z.string())
            .optional()
            .default([]),

        category: z.string(),

        tags: z
            .array(z.string())
            .default([]),

        author: z.string(),

        seo: z.object({
            metaTitle: z.string(),
            metaDescription: z.string(),
            keywords: z
                .array(z.string())
                .default([]),

            canonicalUrl: z
                .string()
                .optional(),

            robots: z
                .string()
                .optional(),
        }),

        faqs: z
            .array(
                z.object({
                    question: z.string(),

                    answer: z.string(),
                })
            )
            .default([]),

        featured: z
            .boolean()
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [string, ...string[]]
            )
            .optional(),

        publishedAt: z
            .string()
            .datetime()
            .optional(),
    });

export const UpdateBlogSchema =
    CreateBlogSchema.partial();

export const BlogQuerySchema =
    z.object({
        page: z.coerce
            .number()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .min(1)
            .max(100)
            .default(10),

        search: z
            .string()
            .optional(),

        category: z
            .string()
            .optional(),

        author: z
            .string()
            .optional(),

        tag: z
            .string()
            .optional(),

        featured: z.coerce
            .boolean()
            .optional(),

        status: z
            .enum(
                Object.values(
                    CONTENT_STATUS
                ) as [string, ...string[]]
            )
            .optional(),

        sort: z
            .string()
            .optional(),
    });