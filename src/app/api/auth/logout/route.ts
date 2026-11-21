import { NextResponse } from "next/server";

import {
    clearAuthCookies,
    getRefreshToken,
} from "@/lib/auth/auth-cookies";
import { ApiErrorHandler } from "@/lib/api/api-error";
import { connectDB } from "@/lib/db";
import AuthService from "@/services/auth/auth.service";
import { NextRequest } from "next/server";
import { enforceSameOrigin } from "@/lib/security/same-origin";

export async function POST(request: NextRequest) {
    try {
        enforceSameOrigin(request, { requireOrigin: true });
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
            await connectDB();
            await AuthService.logout(refreshToken);
        }

        await clearAuthCookies();

        return NextResponse.json({
            success: true,
            message: "Logged out successfully.",
        }, { headers: { "Cache-Control": "no-store, private" } });
    } catch (error) {
        await clearAuthCookies();
        return ApiErrorHandler.handle(error);
    }
}
