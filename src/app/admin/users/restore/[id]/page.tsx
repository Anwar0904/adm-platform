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

import {
    PERMISSIONS,
} from "@/constants/permissions";

import UserService from "@/services/user/user.service";

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
            PERMISSIONS.USER_UPDATE
        );

        const { id } = await params;

        const user =
            await UserService.restoreUser(
                id
            );

        return ApiResponse.success(
            user,
            "User restored successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}