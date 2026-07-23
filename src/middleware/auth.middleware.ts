import { NextRequest } from "next/server";

import { getUserFromToken } from "@/lib/auth/get-user";

export async function requireAuth(
    request: NextRequest
) {
    const authorization =
        request.headers.get("authorization");

    return getUserFromToken(
        authorization
    );
}