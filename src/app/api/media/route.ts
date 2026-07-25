import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";



import {
    requirePermission,
    requireAuth,
} from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

import {
    CreateMediaSchema,
} from "@/validators/media.validator";
import mediaService from "@/services/media/media.service";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_READ
        );

        const searchParams =
            request.nextUrl.searchParams;

        const result =
            await mediaService.getMedia({
                page: Number(searchParams.get("page") ?? 1),
                limit: Number(searchParams.get("limit") ?? 10),
                search: searchParams.get("search") ?? undefined,
                mediaType: searchParams.get("mediaType") ?? undefined,
                status: searchParams.get("status") ?? undefined,
                folder: searchParams.get("folder") ?? undefined,
                sort: searchParams.get("sort") ?? undefined,
            });

        return ApiResponse.success(result);

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.SERVICE_CREATE
            );

        const body =
            await request.json();

        const data =
            CreateMediaSchema.parse(body);

        const media =
            await mediaService.createMedia(
                data,
                currentUser._id.toString()
            );

        return ApiResponse.success(
            media,
            "Media created successfully."
        );

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}