import {
    NextRequest,
    NextResponse,
} from "next/server";

const REFRESH_TOKEN_COOKIE =
    "adm_refresh_token";
const ACCESS_TOKEN_COOKIE =
    "adm_access_token";

export function proxy(
    request: NextRequest
) {
    const { pathname } =
        request.nextUrl;

    const isAdminRoute =
        pathname.startsWith(
            "/admin"
        );

    const isLoginRoute =
        pathname ===
        "/admin/login";

    if (!isAdminRoute) {
        return NextResponse.next();
    }

    const accessToken =
        request.cookies.get(
            ACCESS_TOKEN_COOKIE
        )?.value;
    const refreshToken =
        request.cookies.get(
            REFRESH_TOKEN_COOKIE
        )?.value;
    const hasSessionCookie =
        Boolean(accessToken || refreshToken);

    if (
        !hasSessionCookie &&
        !isLoginRoute
    ) {
        return NextResponse.redirect(
            new URL(
                "/admin/login",
                request.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
};