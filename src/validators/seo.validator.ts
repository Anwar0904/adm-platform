import { z } from "zod";

export const SeoSchema = z.object({
    metaTitle: z.string().min(1).max(70),

    metaDescription: z.string().min(1).max(170),

    keywords: z.array(z.string()).default([]),

    canonicalUrl: z.string().url().optional(),

    noIndex: z.boolean().optional(),

    noFollow: z.boolean().optional(),
});