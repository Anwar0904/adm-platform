import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { ChangePasswordSchema } from "@/validators/auth/change-password.validator";
import { requireAuth } from "@/lib/auth/require-auth";
import { enforceSameOrigin } from "@/lib/security/same-origin";

export async function POST(request: NextRequest) {
    try {
        enforceSameOrigin(request, { requireOrigin: true });
        await connectDB();

        const body = await request.json();

        const data =
            ChangePasswordSchema.parse(body);

        const currentUser = await requireAuth(request);

        await AuthService.changePassword(
            currentUser._id.toString(),
            data
        );

        return ApiResponse.success(
            null,
            "Password changed successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
