import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { POST as login } from "@/app/api/auth/login/route";
import { POST as refresh } from "@/app/api/auth/refresh/route";
import { POST as resetPassword } from "@/app/api/auth/reset-password/route";
import { POST as verifyEmail } from "@/app/api/auth/verify-email/route";

const crossSiteRequest = (path: string) => new NextRequest(`https://adm-preview.example${path}`, {
    method: "POST",
    headers: {
        origin: "https://attacker.example",
        "sec-fetch-site": "cross-site",
        "content-type": "application/json",
    },
    body: "{",
});

test("login, refresh, password reset, and verification route handlers reject cross-site mutations before parsing or service access", async () => {
    const cases = [
        ["login", login, "/api/auth/login"],
        ["refresh", refresh, "/api/auth/refresh"],
        ["password reset", resetPassword, "/api/auth/reset-password"],
        ["email verification", verifyEmail, "/api/auth/verify-email"],
    ] as const;

    for (const [label, handler, path] of cases) {
        const response = await handler(crossSiteRequest(path));
        assert.equal(response.status, 403, `${label} handler must reject a cross-site mutation`);
        const body = await response.json();
        assert.equal(body.message, "Cross-origin request denied.");
    }
});

test("login does not let an Authorization header bypass cross-site rejection", async () => {
    const request = new NextRequest("https://adm-preview.example/api/auth/login", {
        method: "POST",
        headers: {
            authorization: "Bearer arbitrary-client-token",
            origin: "https://attacker.example",
            "sec-fetch-site": "cross-site",
            "content-type": "application/json",
        },
        body: "{",
    });

    const response = await login(request);
    assert.equal(response.status, 403);
    const body = await response.json();
    assert.equal(body.message, "Cross-origin request denied.");
});
