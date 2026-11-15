import { NextResponse } from "next/server";

import {
    clearAuthCookies,
    getRefreshToken,
} from "@/lib/auth/auth-cookies";
import { ApiErrorHandler } from "@/lib/api/api-error";
import { connectDB } from "@/lib/db";
import AuthService from "@/services/auth/auth.service";

export async function POST() {
    try {
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
            await connectDB();
            await AuthService.logout(refreshToken);
        }

        await clearAuthCookies();

        return NextResponse.json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        await clearAuthCookies();
        return ApiErrorHandler.handle(error);
    }
}