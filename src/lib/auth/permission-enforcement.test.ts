import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { ApiError } from "@/lib/api/api-error";
import { JwtService } from "@/lib/auth/jwt";
import { requirePermission } from "@/lib/auth/require-auth";
import { User } from "@/models/user.model";
import SessionRepository from "@/repositories/session.repository";

function mockAuthenticatedRole(context: TestContext, role: { name: string; permissions: string[] }) {
    const userId = new Types.ObjectId().toString();
    const sessionId = new Types.ObjectId().toString();

    context.mock.method(JwtService, "verifyAccessToken", () => ({
        userId,
        sub: userId,
        sid: sessionId,
    }) as never);
    context.mock.method(SessionRepository, "findActiveSessionById", async () => ({
        _id: sessionId,
        user: userId,
        isRevoked: false,
    }) as never);
    context.mock.method(User, "findById", () => ({
        populate: () => ({
            select: async () => ({
                _id: userId,
                status: "active",
                isDeleted: false,
                role,
            }),
        }),
    }) as never);

    return (method: string, path: string) => new NextRequest(`https://adm-preview.example${path}`, {
        method,
        headers: { authorization: "Bearer test-only-access-token" },
    });
}

test("staging_viewer is denied server permission checks for user mutations and role management", async (context) => {
    const createRequest = mockAuthenticatedRole(context, {
        name: "staging_viewer",
        permissions: [PERMISSIONS.USER_READ],
    });

    const allowedUserRead = await requirePermission(
        createRequest("GET", "/api/users"),
        PERMISSIONS.USER_READ,
    );
    assert.ok(typeof allowedUserRead.role === "object" && "name" in allowedUserRead.role);
    assert.equal(allowedUserRead.role.name, "staging_viewer");

    const protectedOperations = [
        ["POST", "/api/users", PERMISSIONS.USER_CREATE],
        ["PATCH", "/api/users/user-id", PERMISSIONS.USER_UPDATE],
        ["DELETE", "/api/users/user-id", PERMISSIONS.USER_DELETE],
        ["GET", "/api/roles", PERMISSIONS.ROLE_READ],
        ["POST", "/api/roles", PERMISSIONS.ROLE_CREATE],
        ["PATCH", "/api/roles/role-id", PERMISSIONS.ROLE_UPDATE],
        ["DELETE", "/api/roles/role-id", PERMISSIONS.ROLE_DELETE],
        ["PATCH", "/api/roles/permissions/role-id", PERMISSIONS.ROLE_UPDATE],
        ["PATCH", "/api/roles/default/role-id", PERMISSIONS.ROLE_UPDATE],
    ] as const;

    for (const [method, path, permission] of protectedOperations) {
        await assert.rejects(
            requirePermission(createRequest(method, path), permission),
            (error: unknown) => error instanceof ApiError && error.statusCode === 403,
            `${method} ${path} must reject a user with only USER_READ`,
        );
    }
});

test("Super Admin permission checks still allow protected user and role operations", async (context) => {
    const createRequest = mockAuthenticatedRole(context, {
        name: "Super Admin",
        permissions: [],
    });
    const privilegedOperations = [
        ["POST", "/api/users", PERMISSIONS.USER_CREATE],
        ["PATCH", "/api/users/user-id", PERMISSIONS.USER_UPDATE],
        ["DELETE", "/api/users/user-id", PERMISSIONS.USER_DELETE],
        ["GET", "/api/roles", PERMISSIONS.ROLE_READ],
        ["POST", "/api/roles", PERMISSIONS.ROLE_CREATE],
        ["PATCH", "/api/roles/role-id", PERMISSIONS.ROLE_UPDATE],
        ["DELETE", "/api/roles/role-id", PERMISSIONS.ROLE_DELETE],
    ] as const;

    for (const [method, path, permission] of privilegedOperations) {
        await assert.doesNotReject(
            requirePermission(createRequest(method, path), permission),
            `${method} ${path} remains available through the existing Super Admin bypass`,
        );
    }
});
