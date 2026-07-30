import { NextRequest } from "next/server";

import PublicContentService from "@/services/public-content.service";

import { PublicSlugSchema } from "@/validators/public.validator";

import { ApiResponse } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/error-handler";

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    { params }: Params
) {
    try {
        const { slug } =
            PublicSlugSchema.parse(
                await params
            );

        const blog =
            await PublicContentService.getBlogBySlug(
                slug
            );

        return ApiResponse.success(
            blog
        );
    } catch (error) {
        return handleApiError(error);
    }
}