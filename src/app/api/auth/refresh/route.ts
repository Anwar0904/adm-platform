import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ApiError, ApiErrorHandler } from "@/lib/api/api-error";
import { ApiResponse } from "@/lib/api/api-response";
import AuthService from "@/services/auth/auth.service";
import {
    getRefreshToken,
    setAuthCookies,
} from "@/lib/auth/auth-cookies";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            throw new ApiError(401, "Refresh session is missing.");
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            throw new ApiError(400, "Activity timestamp is required.");
        }

        if (
            typeof body !== "object" ||
            body === null ||
            !("activityAt" in body) ||
            typeof body.activityAt !== "string"
        ) {
            throw new ApiError(400, "Activity timestamp is required.");
        }

        const activityAt = new Date(body.activityAt);
        if (!Number.isFinite(activityAt.getTime())) {
            throw new ApiError(400, "Invalid activity timestamp.");
        }

        const result =
            await AuthService.refresh(
                refreshToken,
                activityAt
            );

        await setAuthCookies(
            result.accessToken,
            result.refreshToken ?? refreshToken,
            result.sessionExpiresAt
        );

        return ApiResponse.success(
            {},
            "Session refreshed successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}