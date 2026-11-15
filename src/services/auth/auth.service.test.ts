import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { Types } from "mongoose";

import { ApiError } from "@/lib/api/api-error";
import { PasswordService } from "@/lib/auth/bcrypt";
import { JwtService } from "@/lib/auth/jwt";
import { User } from "@/models/user.model";
import SessionRepository from "@/repositories/session.repository";
import { clearEmailVerificationFields } from "./auth.service";
import AuthService from "./auth.service";

function mockActiveRefreshSession(
    context: TestContext,
    session: Record<string, unknown>,
    user: Record<string, unknown>,
    payload: Record<string, unknown>
) {
    context.mock.method(
        JwtService,
        "verifyRefreshToken",
        () => payload as never
    );
    context.mock.method(
        SessionRepository,
        "findActiveSessionById",
        async () => session as never
    );
    context.mock.method(
        PasswordService,
        "compare",
        async () => true
    );
    context.mock.method(
        User,
        "findById",
        () => ({
            populate: async () => user,
        }) as never
    );
}

test("clears verification fields by setting them to null", () => {
    const user = {
        emailVerificationToken: "token",
        emailVerificationExpires: new Date("2026-01-01T00:00:00.000Z"),
    };

    clearEmailVerificationFields(user);

    assert.equal(user.emailVerificationToken, null);
    assert.equal(user.emailVerificationExpires, null);
});

test("logout revokes a session by its signed ID after refresh-token rotation", async (context) => {
    const userId = new Types.ObjectId().toString();
    const sessionId = new Types.ObjectId().toString();
    let revokedSessionId: string | undefined;
    let comparedRefreshToken = false;

    context.mock.method(
        JwtService,
        "verifyRefreshToken",
        () => ({
            userId,
            sub: userId,
            sid: sessionId,
        }) as never
    );
    context.mock.method(
        SessionRepository,
        "revokeActiveSessionById",
        async (id: string | Types.ObjectId) => {
            revokedSessionId = String(id);
            return {} as never;
        }
    );
    context.mock.method(
        PasswordService,
        "compare",
        async () => {
            comparedRefreshToken = true;
            return false;
        }
    );

    await AuthService.logout("previously-rotated-token");

    assert.equal(revokedSessionId, sessionId);
    assert.equal(comparedRefreshToken, false);
});

test("access-token renewal validates the session without extending or rotating it", async (context) => {
    const userId = new Types.ObjectId();
    const sessionId = new Types.ObjectId();
    const now = new Date("2026-03-01T10:00:00.000Z");
    const session = {
        _id: sessionId,
        refreshToken: "hashed-refresh-token",
        expiresAt: new Date("2026-03-08T10:00:00.000Z"),
        lastActivityAt: new Date("2026-03-01T09:00:00.000Z"),
    };
    const user = {
        _id: userId,
        email: "admin@example.test",
        role: { _id: new Types.ObjectId() },
        status: "active",
        isDeleted: false,
    };

    mockActiveRefreshSession(context, session, user, {
        userId: userId.toString(),
        sub: userId.toString(),
        sid: sessionId.toString(),
    });
    context.mock.method(
        JwtService,
        "signAccessToken",
        () => "new-access-token"
    );
    const recordActivity = context.mock.method(
        SessionRepository,
        "recordSessionActivity",
        async () => {
            throw new Error("Access renewal must not record activity.");
        }
    );
    const rotateToken = context.mock.method(
        SessionRepository,
        "rotateRefreshToken",
        async () => {
            throw new Error("Access renewal must not rotate refresh tokens.");
        }
    );

    const result = await AuthService.refreshAccessToken(
        "current-refresh-token",
        now
    );

    assert.deepEqual(result, { accessToken: "new-access-token" });
    assert.equal(recordActivity.mock.callCount(), 0);
    assert.equal(rotateToken.mock.callCount(), 0);
});

test("a previously rotated refresh token is rejected without revoking the active session", async (context) => {
    const userId = new Types.ObjectId();
    const sessionId = new Types.ObjectId();

    context.mock.method(
        JwtService,
        "verifyRefreshToken",
        () => ({
            userId: userId.toString(),
            sub: userId.toString(),
            sid: sessionId.toString(),
        }) as never
    );
    context.mock.method(
        SessionRepository,
        "findActiveSessionById",
        async () => ({
            _id: sessionId,
            refreshToken: "current-refresh-hash",
        }) as never
    );
    context.mock.method(
        PasswordService,
        "compare",
        async () => false
    );
    const revokeSession = context.mock.method(
        SessionRepository,
        "revokeActiveSessionById",
        async () => {
            throw new Error("A stale token must not revoke the current session.");
        }
    );

    await assert.rejects(
        AuthService.refreshAccessToken("previous-refresh-token"),
        (error: unknown) =>
            error instanceof ApiError &&
            error.statusCode === 409
    );

    assert.equal(revokeSession.mock.callCount(), 0);
});

test("concurrent refresh rotation returns a conflict to the losing request", async (context) => {
    const userId = new Types.ObjectId();
    const sessionId = new Types.ObjectId();
    const now = new Date("2026-03-01T10:00:00.500Z");
    const activityAt = new Date("2026-03-01T10:00:00.400Z");
    const session = {
        _id: sessionId,
        refreshToken: "hashed-refresh-token",
        expiresAt: new Date("2026-03-08T09:00:00.000Z"),
        lastActivityAt: new Date("2026-03-01T09:00:00.000Z"),
    };
    const user = {
        _id: userId,
        email: "admin@example.test",
        role: { _id: new Types.ObjectId() },
        status: "active",
        isDeleted: false,
    };
    const updatedSession = {
        ...session,
        lastActivityAt: new Date("2026-03-01T10:00:00.000Z"),
        expiresAt: new Date("2026-03-08T10:00:00.000Z"),
    };

    mockActiveRefreshSession(context, session, user, {
        userId: userId.toString(),
        sub: userId.toString(),
        sid: sessionId.toString(),
    });
    context.mock.method(
        SessionRepository,
        "recordSessionActivity",
        async () => updatedSession as never
    );
    context.mock.method(
        JwtService,
        "signAccessToken",
        () => "new-access-token"
    );
    context.mock.method(
        JwtService,
        "signRefreshToken",
        () => "new-refresh-token"
    );
    context.mock.method(
        PasswordService,
        "hash",
        async () => "new-refresh-hash"
    );
    let rotationCount = 0;
    context.mock.method(
        SessionRepository,
        "rotateRefreshToken",
        async () => {
            rotationCount += 1;
            return rotationCount === 1
                ? updatedSession as never
                : null;
        }
    );

    const results = await Promise.allSettled([
        AuthService.refresh("current-refresh-token", activityAt, now),
        AuthService.refresh("current-refresh-token", activityAt, now),
    ]);
    const fulfilled = results.filter(
        (result) => result.status === "fulfilled"
    );
    const rejected = results.filter(
        (result): result is PromiseRejectedResult =>
            result.status === "rejected"
    );

    assert.equal(fulfilled.length, 1);
    assert.equal(rejected.length, 1);
    assert.ok(rejected[0].reason instanceof ApiError);
    assert.equal(rejected[0].reason.statusCode, 409);
});
