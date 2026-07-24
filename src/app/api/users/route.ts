import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import UserService from "@/services/user/user.service";

import { requirePermission } from "@/middleware/auth.middleware";

import { PERMISSIONS } from "@/constants/permissions";
import { CreateUserSchema } from "@/validators/user.validator";

export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.USER_READ
        );

        const searchParams =
            request.nextUrl.searchParams;

        const result =
            await UserService.getUsers({
                page: Number(
                    searchParams.get("page")
                ),

                limit: Number(
                    searchParams.get("limit")
                ),

                search:
                    searchParams.get(
                        "search"
                    ) ?? undefined,

                status:
                    searchParams.get(
                        "status"
                    ) ?? undefined,

                role:
                    searchParams.get(
                        "role"
                    ) ?? undefined,

                sort:
                    searchParams.get(
                        "sort"
                    ) ?? undefined,
            });

        return ApiResponse.success(
            result,
            "Users fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(
    request: NextRequest
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
            CreateUserSchema.parse(
                body
            );

        const user =
            await UserService.createUser(
                data
            );

        return ApiResponse.success(
            user,
            "User created successfully.",
            201
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}