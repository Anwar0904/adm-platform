import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { LoginSchema } from "@/validators/auth/login.validator";

import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { toAuthUserResponse } from "@/dto/auth/auth-user-response.dto";
import { isAuthRequestRateLimited } from "@/lib/security/auth-request-limit";
import { enforceSameOrigin } from "@/lib/security/same-origin";

export async function POST(
  request: NextRequest
) {
  try {
    enforceSameOrigin(request, { requireOrigin: true });
    const body =
      await request.json();

    const data =
      LoginSchema.parse(body);

    if (isAuthRequestRateLimited(request, "login", data.email, { identifierLimit: 8, ipLimit: 30, windowMs: 15 * 60_000 })) {
      return Response.json(
        { success: false, message: "Too many requests. Try again later." },
        { status: 429, headers: { "Cache-Control": "no-store, private" } },
      );
    }
    await connectDB();

    const result =
      await AuthService.login(
        data
      );

    const accessToken =
      result.tokens?.accessToken;

    const refreshToken =
      result.tokens?.refreshToken;

    if (
      !accessToken ||
      !refreshToken
    ) {
      throw new Error(
        "Authentication tokens were not generated."
      );
    }

    await setAuthCookies(
      accessToken,
      refreshToken,
      result.sessionExpiresAt
    );

    const response = ApiResponse.success(
      {
        user: toAuthUserResponse(result.user),
      },
      "Login successful."
    );
    response.headers.set("Cache-Control", "no-store, private");
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch (error) {
    return ApiErrorHandler.handle(
      error
    );
  }
}
