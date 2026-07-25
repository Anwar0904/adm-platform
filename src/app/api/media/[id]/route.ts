import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import {
    ApiResponse,
} from "@/lib/api/api-response";

import {
    ApiErrorHandler,
} from "@/lib/api/api-error";



import {
    requirePermission,
} from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

import {
    UpdateMediaSchema,
} from "@/validators/media.validator";
import mediaService from "@/services/media/media.service";

type Context = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: Context
) {
    try {

        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_READ
        );

        const { id } = await params;

        const media =
            await mediaService.getMediaById(id);

        return ApiResponse.success(media);

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: Context
) {
    try {

        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_UPDATE
        );

        const body =
            await request.json();

        const data =
            UpdateMediaSchema.parse(body);

        const { id } = await params;

        const media =
            await mediaService.updateMedia(
                id,
                data
            );

        return ApiResponse.success(
            media,
            "Media updated successfully."
        );

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Context
) {
    try {

        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.SERVICE_DELETE
        );

        const { id } = await params;

        await mediaService.deleteMedia(id);

        return ApiResponse.success(
            null,
            "Media deleted successfully."
        );

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}