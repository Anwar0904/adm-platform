import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import {
    requirePermission,
} from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";

import UserService from "@/services/user/user.service";

import {
    UpdateUserSchema,
} from "@/validators/user.validator";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

/* ----------------------------------------
   GET /api/users/:id
----------------------------------------- */

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_READ
        );

        const { id } = await params;

        const user =
            await UserService.getUserById(id);

        return ApiResponse.success(
            user,
            "User fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

/* ----------------------------------------
   PATCH /api/users/:id
----------------------------------------- */

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
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
            UpdateUserSchema.parse(body);

        const { id } = await params;

        const user =
            await UserService.updateUser(
                id,
                data
            );

        return ApiResponse.success(
            user,
            "User updated successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_DELETE
        );

        const { id } = await params;

        await UserService.deleteUser(
            id
        );

        return ApiResponse.success(
            null,
            "User deleted successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}