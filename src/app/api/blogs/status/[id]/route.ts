import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import blogService from "@/services/blog.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

import { CONTENT_STATUS } from "@/enums";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.BLOG_UPDATE
        );

        const body = await request.json();

        const { id } = await params;

        const blog =
            await blogService.changeStatus(
                id,
                body.status as (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS]
            );

        return ApiResponse.success(
            blog,
            "Blog status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}