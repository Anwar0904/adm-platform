import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";
import { AuthEmailService } from "@/services/auth/auth-email.service";
import { authFlowAcceptedResponse, authFlowRateLimitedResponse, authFlowUnavailableResponse } from "@/lib/api/auth-flow-response";
import { AUTH_REQUEST_LIMITS, isAuthRequestRateLimited } from "@/lib/security/auth-request-limit";
import { enforceSameOrigin } from "@/lib/security/same-origin";
import { ResendVerificationSchema } from "@/middleware/resend-verification.validator";


export async function POST(
    request: NextRequest
) {
    try {
        enforceSameOrigin(request);
        const body = await request.json();
        const data = ResendVerificationSchema.parse(body);

        if (!AuthEmailService.isConfigured()) return authFlowUnavailableResponse();
        if (await isAuthRequestRateLimited(request, "email-verification", data.email, AUTH_REQUEST_LIMITS.emailVerification)) {
            return authFlowRateLimitedResponse();
        }
        await connectDB();
        await AuthService.resendVerificationEmail(data.email);
        return authFlowAcceptedResponse();
    } catch (error) {
        return ApiErrorHandler.handle(
            error
        );
    }
}
