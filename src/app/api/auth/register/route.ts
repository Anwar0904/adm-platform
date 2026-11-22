import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";
import { AuthEmailService } from "@/services/auth/auth-email.service";
import { authFlowAcceptedResponse, authFlowRateLimitedResponse, authFlowUnavailableResponse, authFlowNotFoundResponse } from "@/lib/api/auth-flow-response";
import { AUTH_REQUEST_LIMITS, isAuthRequestRateLimited } from "@/lib/security/auth-request-limit";
import { enforceSameOrigin } from "@/lib/security/same-origin";

import { RegisterSchema } from "@/validators/auth/register.validator";

export async function POST(request: NextRequest) {
  if (process.env.AUTH_PUBLIC_SIGNUP_ENABLED !== "true") return authFlowNotFoundResponse();
  try {
    enforceSameOrigin(request, { requireOrigin: true });
    if (!AuthEmailService.isConfigured()) return authFlowUnavailableResponse();

    const body = await request.json();
    const data = RegisterSchema.parse(body);
    if (await isAuthRequestRateLimited(request, "register", data.email, AUTH_REQUEST_LIMITS.register)) {
      return authFlowRateLimitedResponse();
    }

    await connectDB();
    await AuthService.register(data);
    return authFlowAcceptedResponse();
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}
