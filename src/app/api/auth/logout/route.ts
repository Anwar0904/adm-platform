import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import {
    LogoutSchema,
} from "@/validators/auth/logout.validator";

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const body =
            await request.json();

        const data =
            LogoutSchema.parse(body);

        await AuthService.logout(
            data.refreshToken
        );

        return ApiResponse.success(
            null,
            "Logout successful."
        );
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}