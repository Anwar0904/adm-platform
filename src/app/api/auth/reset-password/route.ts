import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { ResetPasswordSchema } from "@/validators/auth/reset-password.validator";
import { enforceSameOrigin } from "@/lib/security/same-origin";
import { AUTH_REQUEST_LIMITS, isAuthRequestRateLimited } from "@/lib/security/auth-request-limit";
import { authFlowRateLimitedResponse } from "@/lib/api/auth-flow-response";

export async function POST(request: NextRequest) {
    try {
        enforceSameOrigin(request);
        await connectDB();

        const body = await request.json();

        const data = ResetPasswordSchema.parse(body);

        if (await isAuthRequestRateLimited(
            request,
            "password-reset-completion",
            data.token,
            AUTH_REQUEST_LIMITS.passwordResetCompletion,
        )) {
            return authFlowRateLimitedResponse();
        }

        await AuthService.resetPassword(data);


        return ApiResponse.success(
            null,
            "Password reset successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
