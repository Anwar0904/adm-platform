import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

import UserService from "@/services/user/user.service";

import { UpdateUserStatusSchema } from "@/validators/user.validator";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_WRITE
        );

        const body =
            await request.json();

        const data =
            UpdateUserStatusSchema.parse(
                body
            );

        const { id } = await params;

        const user =
            await UserService.changeStatus(
                id,
                data.status
            );

        return ApiResponse.success(
            user,
            "Status updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}