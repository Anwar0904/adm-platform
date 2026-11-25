import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";

import { ApiError } from "@/lib/api/api-error";
import { PasswordService } from "@/lib/auth/bcrypt";
import { JwtService } from "@/lib/auth/jwt";
import { getUserFromToken } from "@/lib/auth/get-user";
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

test("logout revokes a session only when its current refresh token matches", async (context) => {
    const userId = new Types.ObjectId().toString();
    const sessionId = new Types.ObjectId().toString();
    const session = {
        _id: new Types.ObjectId(sessionId),
        refreshToken: "current-refresh-token-hash",
    };
    let revokedSessionId: Types.ObjectId | undefined;
    let revokedHash: string | undefined;

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
        "findActiveSessionById",
        async (id: string | Types.ObjectId, user: string) => {
            assert.equal(String(id), sessionId);
            assert.equal(user, userId);
            return session as never;
        },
    );
    context.mock.method(
        PasswordService,
        "compare",
        async (token: string, hash: string) =>
            token === "current-refresh-token" && hash === session.refreshToken,
    );
    context.mock.method(
        SessionRepository,
        "revokeActiveSession",
        async (id: Types.ObjectId, hash: string) => {
            revokedSessionId = id;
            revokedHash = hash;
            return {} as never;
        },
    );

    await AuthService.logout("current-refresh-token");

    assert.equal(revokedSessionId?.toString(), sessionId);
    assert.equal(revokedHash, session.refreshToken);
});

test("logout rejects a previously rotated refresh token without revoking the active session", async (context) => {
    const userId = new Types.ObjectId().toString();
    const sessionId = new Types.ObjectId().toString();
    const session = {
        _id: new Types.ObjectId(sessionId),
        refreshToken: "current-refresh-token-hash",
    };

    context.mock.method(JwtService, "verifyRefreshToken", () => ({
        userId,
        sub: userId,
        sid: sessionId,
    }) as never);
    context.mock.method(SessionRepository, "findActiveSessionById", async () => session as never);
    context.mock.method(PasswordService, "compare", async () => false);
    const revokeSession = context.mock.method(
        SessionRepository,
        "revokeActiveSession",
        async () => {
            throw new Error("A stale token must not revoke the current session.");
        },
    );

    await assert.rejects(
        AuthService.logout("previously-rotated-token"),
        (error: unknown) => error instanceof ApiError && error.statusCode === 401,
    );
    assert.equal(revokeSession.mock.callCount(), 0);
});

test("a revoked access session is rejected before a user record is loaded", async (context) => {
    const userId = new Types.ObjectId().toString();
    const sessionId = new Types.ObjectId().toString();
    context.mock.method(JwtService, "verifyAccessToken", () => ({
        userId,
        sub: userId,
        sid: sessionId,
    }) as never);
    const lookupUser = context.mock.method(User, "findById", () => {
        throw new Error("Revoked sessions must stop before user lookup.");
    });
    context.mock.method(SessionRepository, "findActiveSessionById", async () => null);

    await assert.rejects(
        getUserFromToken("Bearer test-only-revoked-access-token"),
        (error: unknown) => error instanceof ApiError && error.statusCode === 401,
    );
    assert.equal(lookupUser.mock.callCount(), 0);
});

test("an invalid access token is rejected before session and user lookups", async (context) => {
    context.mock.method(JwtService, "verifyAccessToken", () => {
        throw new Error("test-only invalid token");
    });
    const lookupSession = context.mock.method(SessionRepository, "findActiveSessionById", async () => {
        throw new Error("Invalid tokens must stop before session lookup.");
    });
    const lookupUser = context.mock.method(User, "findById", () => {
        throw new Error("Invalid tokens must stop before user lookup.");
    });

    await assert.rejects(
        getUserFromToken("Bearer test-only-invalid-access-token"),
        (error: unknown) => error instanceof ApiError && error.statusCode === 401,
    );
    assert.equal(lookupSession.mock.callCount(), 0);
    assert.equal(lookupUser.mock.callCount(), 0);
});

test("an expired access token is rejected before session and user lookups", async (context) => {
    context.mock.method(JwtService, "verifyAccessToken", () => {
        const error = new Error("test-only expired token");
        error.name = "TokenExpiredError";
        throw error;
    });
    const lookupSession = context.mock.method(SessionRepository, "findActiveSessionById", async () => {
        throw new Error("Expired tokens must stop before session lookup.");
    });
    const lookupUser = context.mock.method(User, "findById", () => {
        throw new Error("Expired tokens must stop before user lookup.");
    });

    await assert.rejects(
        getUserFromToken("Bearer test-only-expired-access-token"),
        (error: unknown) => error instanceof ApiError && error.statusCode === 401,
    );
    assert.equal(lookupSession.mock.callCount(), 0);
    assert.equal(lookupUser.mock.callCount(), 0);
});

test("expired password-reset tokens are rejected and do not revoke sessions", async (context) => {
    context.mock.method(PasswordService, "hash", async () => "test-only-hash");
    let observedFilter: Record<string, unknown> | undefined;
    context.mock.method(User, "findOneAndUpdate", (filter: Record<string, unknown>) => {
        observedFilter = filter;
        return { select: async () => null } as never;
    });
    const revokeSessions = context.mock.method(
        SessionRepository,
        "revokeAllUserSessions",
        async () => undefined as never,
    );

    const testPassword = `TestPass1!${randomUUID()}`;
    await assert.rejects(
        AuthService.resetPassword({
            token: "test-only-expired-reset-token",
            password: testPassword,
            confirmPassword: testPassword,
        }),
        (error: unknown) => error instanceof ApiError && error.statusCode === 400,
    );

    const expiry = (observedFilter?.passwordResetExpires as { $gt?: Date } | undefined)?.$gt;
    assert.ok(expiry instanceof Date, "reset lookup must require an expiry later than now");
    assert.equal(revokeSessions.mock.callCount(), 0);
});

test("a valid password reset consumes its token and revokes sessions", async (context) => {
    const userId = new Types.ObjectId();
    const passwordHash = `mocked-hash-${randomUUID()}`;
    const resetUser = { _id: userId };
    let update: Record<string, unknown> | undefined;
    context.mock.method(PasswordService, "hash", async () => passwordHash);
    context.mock.method(User, "findOneAndUpdate", (_filter: Record<string, unknown>, updateDocument: Record<string, unknown>) => {
        update = updateDocument;
        return { select: async () => resetUser } as never;
    });
    const revokeSessions = context.mock.method(
        SessionRepository,
        "revokeAllUserSessions",
        async () => undefined as never,
    );
    const testPassword = `TestPass1!${randomUUID()}`;

    assert.equal(await AuthService.resetPassword({
        token: "test-only-valid-reset-token",
        password: testPassword,
        confirmPassword: testPassword,
    }), true);
    assert.equal((update?.$set as Record<string, unknown> | undefined)?.password, passwordHash);
    assert.deepEqual(update?.$unset, { passwordResetToken: 1, passwordResetExpires: 1 });
    assert.equal(revokeSessions.mock.callCount(), 1);
    assert.equal(revokeSessions.mock.calls[0]?.arguments[0], userId.toString());
});

test("expired email-verification tokens are rejected with an atomic expiry filter", async (context) => {
    let observedFilter: Record<string, unknown> | undefined;
    context.mock.method(User, "findOneAndUpdate", (filter: Record<string, unknown>) => {
        observedFilter = filter;
        return { select: async () => null } as never;
    });

    await assert.rejects(
        AuthService.verifyEmail("test-only-expired-verification-token"),
        (error: unknown) => error instanceof ApiError && error.statusCode === 400,
    );

    const expiry = (observedFilter?.emailVerificationExpires as { $gt?: Date } | undefined)?.$gt;
    assert.ok(expiry instanceof Date, "verification lookup must require an expiry later than now");
    assert.deepEqual(observedFilter?.emailVerified, { $ne: true });
});

test("a valid email-verification token is consumed by one atomic update", async (context) => {
    let update: Record<string, unknown> | undefined;
    const verificationUser = { _id: new Types.ObjectId() };
    context.mock.method(User, "findOneAndUpdate", (_filter: Record<string, unknown>, updateDocument: Record<string, unknown>) => {
        update = updateDocument;
        return { select: async () => verificationUser } as never;
    });

    assert.equal(await AuthService.verifyEmail("test-only-valid-verification-token"), true);
    assert.deepEqual(update?.$set, { emailVerified: true, isEmailVerified: true });
    assert.deepEqual(update?.$unset, { emailVerificationToken: 1, emailVerificationExpires: 1 });
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
