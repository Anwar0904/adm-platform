import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";
import { AuthEmailService } from "@/services/auth/auth-email.service";
import { authFlowAcceptedResponse, authFlowRateLimitedResponse, authFlowUnavailableResponse } from "@/lib/api/auth-flow-response";
import { isAuthRequestRateLimited } from "@/lib/security/auth-request-limit";
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
        if (isAuthRequestRateLimited(request, "password-reset", data.email, { identifierLimit: 3, ipLimit: 15, windowMs: 15 * 60_000 })) {
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
