import { z } from "zod";

import {
    CONTENT_STATUS,
    TEAM_MEMBER_TEMPLATES,
} from "@/enums";

import { ImageSchema } from "./image.validator";
import { SeoSchema } from "./seo.validator";

import { SocialLinkSchema } from "./social-link.validator";
import { SkillSchema } from "./skill.validator";


export const CreateTeamMemberSchema =
    z.object({
        name: z
            .string()
            .min(2)
            .max(120),

        designation: z
            .string()
            .min(2)
            .max(120),

        slug: z
            .string()
            .optional(),

        shortBio: z
            .string()
            .min(10)
            .max(500),

        biography: z
            .string()
            .optional()
            .default(""),

        avatar: z
            .string()
            .nullable()
            .optional(),

        gallery: z
            .array(z.string())
            .default([]),

        email: z
            .string()
            .email()
            .optional(),

        phone: z
            .string()
            .optional(),

        experience: z
            .number()
            .min(0)
            .optional(),

        skills: z
            .array(SkillSchema)
            .default([]),

        socialLinks: SocialLinkSchema
            .default({}),

        seo: SeoSchema,

        template: z
            .enum(TEAM_MEMBER_TEMPLATES)
            .optional(),

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        featured: z
            .boolean()
            .optional(),

        sortOrder: z
            .number()
            .min(0)
            .optional(),
    });

export const UpdateTeamMemberSchema =
    CreateTeamMemberSchema.partial();

export const TeamMemberQuerySchema =
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

        featured: z.coerce
            .boolean()
            .optional(),

        status: z
            .enum(CONTENT_STATUS)
            .optional(),

        author: z
            .string()
            .optional(),

        sort: z
            .string()
            .optional(),
    });