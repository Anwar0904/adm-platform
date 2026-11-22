import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";
import { AuthEmailService } from "@/services/auth/auth-email.service";
import { authFlowAcceptedResponse, authFlowRateLimitedResponse, authFlowUnavailableResponse } from "@/lib/api/auth-flow-response";
import { AUTH_REQUEST_LIMITS, isAuthRequestRateLimited } from "@/lib/security/auth-request-limit";
import { enforceSameOrigin } from "@/lib/security/same-origin";

import { ForgotPasswordSchema } from "@/validators/auth/forgot-password.validator";

export async function POST(
    request: NextRequest
) {
    try {
        enforceSameOrigin(request);
        const body = await request.json();
        const data = ForgotPasswordSchema.parse(body);

        if (!AuthEmailService.isConfigured()) return authFlowUnavailableResponse();
        if (await isAuthRequestRateLimited(request, "password-reset", data.email, AUTH_REQUEST_LIMITS.passwordReset)) {
            return authFlowRateLimitedResponse();
        }
        await connectDB();
        await AuthService.forgotPassword(data.email);
        return authFlowAcceptedResponse();
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}
