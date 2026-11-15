import { cookies } from "next/headers";

import { JwtService } from "./jwt";

const ACCESS_TOKEN_COOKIE =
    "adm_access_token";

const REFRESH_TOKEN_COOKIE =
    "adm_refresh_token";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

function getTokenMaxAge(
    token: string,
    expiresAt?: Date
) {
    const tokenExpiresAt =
        JwtService.getTokenExpiryDate(token);
    const effectiveExpiry =
        expiresAt &&
        expiresAt.getTime() < tokenExpiresAt.getTime()
            ? expiresAt
            : tokenExpiresAt;

    return Math.max(
        0,
        Math.floor(
            (effectiveExpiry.getTime() - Date.now()) / 1000
        )
    );
}

export async function setAccessTokenCookie(
    accessToken: string
) {
    const cookieStore = await cookies();

    cookieStore.set(
        ACCESS_TOKEN_COOKIE,
        accessToken,
        {
            ...COOKIE_OPTIONS,
            maxAge: getTokenMaxAge(accessToken),
        }
    );
}

export async function setRefreshTokenCookie(
    refreshToken: string,
    expiresAt?: Date
) {
    const cookieStore = await cookies();

    cookieStore.set(
        REFRESH_TOKEN_COOKIE,
        refreshToken,
        {
            ...COOKIE_OPTIONS,
            maxAge: getTokenMaxAge(refreshToken, expiresAt),
        }
    );
}

export async function setAuthCookies(
    accessToken: string,
    refreshToken: string,
    sessionExpiresAt?: Date
) {
    await setAccessTokenCookie(accessToken);
    await setRefreshTokenCookie(refreshToken, sessionExpiresAt);
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();

    cookieStore.delete(
        ACCESS_TOKEN_COOKIE
    );

    cookieStore.delete(
        REFRESH_TOKEN_COOKIE
    );
}

export async function getAccessToken() {
    const cookieStore = await cookies();

    return cookieStore.get(
        ACCESS_TOKEN_COOKIE
    )?.value;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();

    return cookieStore.get(
        REFRESH_TOKEN_COOKIE
    )?.value;
}