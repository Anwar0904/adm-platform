import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/api-error";
import {
    setAccessTokenCookie,
} from "@/lib/auth/auth-cookies";
import { getUserFromToken } from "@/lib/auth/get-user";
import { JwtService } from "@/lib/auth/jwt";
import { AuthorizationService } from "@/lib/auth/authorization";
import AuthService from "@/services/auth/auth.service";

const ACCESS_TOKEN_COOKIE = "adm_access_token";
const REFRESH_TOKEN_COOKIE = "adm_refresh_token";

type RoleLike = {
    name: string;
    permissions: string[];
};

function isRoleLike(role: unknown): role is RoleLike {
    if (typeof role !== "object" || role === null) {
        return false;
    }

    const candidate = role as Partial<RoleLike>;

    return (
        typeof candidate.name === "string" &&
        Array.isArray(candidate.permissions)
    );
}

async function renewRequestSession(refreshToken: string) {
    const refreshed =
        await AuthService.refreshAccessToken(refreshToken);

    await setAccessTokenCookie(refreshed.accessToken);

    return getUserFromToken(`Bearer ${refreshed.accessToken}`);
}

export async function requireAuth(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    if (
        authorization &&
        !authorization.startsWith("Bearer ")
    ) {
        return getUserFromToken(authorization);
    }

    const accessToken = authorization
        ? authorization.slice("Bearer ".length)
        : request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = authorization
        ? undefined
        : request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!accessToken) {
        if (!refreshToken) {
            throw new ApiError(
                401,
                "Authorization is required."
            );
        }

        return renewRequestSession(refreshToken);
    }

    try {
        JwtService.verifyAccessToken(accessToken);
    } catch (error) {
        if (!(error instanceof jwt.TokenExpiredError)) {
            throw error;
        }

        if (!refreshToken) {
            throw new ApiError(
                401,
                "Access token expired and no refresh session is available."
            );
        }

        return renewRequestSession(refreshToken);
    }

    try {
        return await getUserFromToken(`Bearer ${accessToken}`);
    } catch (error) {
        if (
            error instanceof ApiError &&
            error.statusCode === 401 &&
            refreshToken
        ) {
            return renewRequestSession(refreshToken);
        }

        throw error;
    }
}

export async function requireRole(
    request: NextRequest,
    roles: string[]
) {
    const user = await requireAuth(request);
    const role = isRoleLike(user.role) ? user.role.name : null;

    if (!role) {
        throw new ApiError(403, "Role not loaded.");
    }

    AuthorizationService.hasRole(role, roles);
    return user;
}

export async function requirePermission(
    request: NextRequest,
    permission: string
) {
    const user = await requireAuth(request);

    if (!isRoleLike(user.role)) {
        throw new ApiError(403, "Role not loaded.");
    }

    if (AuthorizationService.isSuperAdmin(user.role.name)) {
        return user;
    }

    AuthorizationService.hasPermission(
        user.role.permissions,
        permission
    );
    return user;
}

export async function requireAnyPermission(
    request: NextRequest,
    permissions: string[]
) {
    const user = await requireAuth(request);

    if (!isRoleLike(user.role)) {
        throw new ApiError(403, "Role not loaded.");
    }

    if (AuthorizationService.isSuperAdmin(user.role.name)) {
        return user;
    }

    AuthorizationService.hasAnyPermission(
        user.role.permissions,
        permissions
    );
    return user;
}
