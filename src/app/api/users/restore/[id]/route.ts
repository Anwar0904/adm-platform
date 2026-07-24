import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import UserService from "@/services/user/user.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

export async function PATCH(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {

    try {

        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_WRITE
        );

        const { id } =
            await params;

        const user =
            await UserService.restoreUser(
                id
            );

        return ApiResponse.success(
            user,
            "User restored successfully."
        );

    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}