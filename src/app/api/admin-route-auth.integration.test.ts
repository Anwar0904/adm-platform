import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test, { type TestContext } from "node:test";
import mongoose, { Types } from "mongoose";
import { NextRequest } from "next/server";

import { GET as getUsers, POST as postUsers } from "@/app/api/users/route";
import {
    DELETE as deleteUser,
    PATCH as patchUser,
} from "@/app/api/users/[id]/route";
import { GET as getRoles, POST as postRoles } from "@/app/api/roles/route";
import {
    DELETE as deleteRole,
    PATCH as patchRole,
} from "@/app/api/roles/[id]/route";
import { PATCH as assignRolePermissions } from "@/app/api/roles/permissions/[id]/route";
import { PATCH as setDefaultRole } from "@/app/api/roles/default/[id]/route";
import { PERMISSIONS } from "@/constants/permissions";
import { JwtService } from "@/lib/auth/jwt";
import { User } from "@/models/user.model";
import SessionRepository from "@/repositories/session.repository";
import { roleController } from "@/controllers/role.controller";
import UserService from "@/services/user/user.service";

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

function installFakeAuthenticatedUser(context: TestContext, role: { name: string; permissions: string[] }) {
    const userId = new Types.ObjectId();
    const sessionId = new Types.ObjectId();
    const runtime = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };
    const cache = runtime.mongooseCache;

    assert.ok(cache, "db module should initialize its cache before the route is called");
    const previousCache = { conn: cache.conn, promise: cache.promise };
    cache.conn = mongoose;
    cache.promise = null;
    context.after(() => {
        cache.conn = previousCache.conn;
        cache.promise = previousCache.promise;
    });

    context.mock.method(JwtService, "verifyAccessToken", () => ({
        userId: userId.toString(),
        sub: userId.toString(),
        sid: sessionId.toString(),
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

    return {
        userId,
        request(path: string, method = "GET", body?: string) {
            return new NextRequest(`https://adm-preview.example${path}`, {
                method,
                headers: { authorization: "Bearer test-only-route-token" },
                body,
            });
        },
        params(id: string) {
            return { params: Promise.resolve({ id }) };
        },
    };
}

function mockRouteServices(context: TestContext) {
    const listUsers = context.mock.method(UserService, "getUsers", async () => [] as never);
    const createUser = context.mock.method(UserService, "createUser", async () => ({
        _id: new Types.ObjectId(),
    }) as never);
    const deleteUserRecord = context.mock.method(UserService, "deleteUser", async () => undefined as never);
    const listRoles = context.mock.method(roleController, "findAll", async () => [] as never);
    const createRole = context.mock.method(roleController, "create", async () => ({
        _id: new Types.ObjectId(),
        name: "route-test-role",
        permissions: [PERMISSIONS.USER_READ],
    }) as never);
    const updateRole = context.mock.method(roleController, "update", async () => ({}) as never);
    const deleteRoleRecord = context.mock.method(roleController, "delete", async () => undefined as never);
    const assignPermissions = context.mock.method(roleController, "assignPermissions", async () => ({}) as never);
    const makeDefault = context.mock.method(roleController, "setDefault", async () => ({}) as never);

    return {
        listUsers,
        createUser,
        deleteUserRecord,
        listRoles,
        createRole,
        updateRole,
        deleteRoleRecord,
        assignPermissions,
        makeDefault,
    };
}

test("actual Users and Roles handlers deny staging_viewer before parsing or mutation", async (context) => {
    const calls = mockRouteServices(context);
    const stagingViewer = installFakeAuthenticatedUser(context, {
        name: "staging_viewer",
        permissions: [PERMISSIONS.USER_READ],
    });

    const usersResponse = await getUsers(stagingViewer.request("/api/users"));
    assert.equal(usersResponse.status, 200);
    assert.equal(calls.listUsers.mock.callCount(), 1);

    const invalidJson = "{";
    const unauthorizedUserCreate = await postUsers(
        stagingViewer.request("/api/users", "POST", invalidJson),
    );
    assert.equal(unauthorizedUserCreate.status, 403, "authorization must precede request body parsing");

    const unauthorizedUserUpdate = await patchUser(
        stagingViewer.request("/api/users/000000000000000000000000", "PATCH", invalidJson),
        stagingViewer.params("000000000000000000000000"),
    );
    assert.equal(unauthorizedUserUpdate.status, 403, "authorization must precede request body parsing");

    const unauthorizedUserDelete = await deleteUser(
        stagingViewer.request("/api/users/000000000000000000000000", "DELETE"),
        stagingViewer.params("000000000000000000000000"),
    );
    assert.equal(unauthorizedUserDelete.status, 403);

    assert.equal((await getRoles(stagingViewer.request("/api/roles"))).status, 403);
    assert.equal((await postRoles(stagingViewer.request("/api/roles", "POST", invalidJson))).status, 403);
    assert.equal((await patchRole(
        stagingViewer.request("/api/roles/000000000000000000000000", "PATCH", invalidJson),
        stagingViewer.params("000000000000000000000000"),
    )).status, 403);
    assert.equal((await deleteRole(
        stagingViewer.request("/api/roles/000000000000000000000000", "DELETE"),
        stagingViewer.params("000000000000000000000000"),
    )).status, 403);
    assert.equal((await assignRolePermissions(
        stagingViewer.request("/api/roles/permissions/000000000000000000000000", "PATCH", invalidJson),
        stagingViewer.params("000000000000000000000000"),
    )).status, 403);
    assert.equal((await setDefaultRole(
        stagingViewer.request("/api/roles/default/000000000000000000000000", "PATCH", invalidJson),
        stagingViewer.params("000000000000000000000000"),
    )).status, 403);

    assert.equal(calls.createUser.mock.callCount(), 0);
    assert.equal(calls.deleteUserRecord.mock.callCount(), 0);
    assert.equal(calls.listRoles.mock.callCount(), 0);
    assert.equal(calls.createRole.mock.callCount(), 0);
    assert.equal(calls.updateRole.mock.callCount(), 0);
    assert.equal(calls.deleteRoleRecord.mock.callCount(), 0);
    assert.equal(calls.assignPermissions.mock.callCount(), 0);
    assert.equal(calls.makeDefault.mock.callCount(), 0);
});

test("a user creator without ROLE_UPDATE cannot assign a role through POST /api/users", async (context) => {
    const calls = mockRouteServices(context);
    const limitedCreator = installFakeAuthenticatedUser(context, {
        name: "staging_user_creator",
        permissions: [PERMISSIONS.USER_CREATE],
    });
    const body = JSON.stringify({
        firstName: "Disposable",
        lastName: "Preview",
        email: "adm-route-test@example.invalid",
        password: `TestPass1!${randomUUID()}`,
        role: new Types.ObjectId().toString(),
    });

    const response = await postUsers(limitedCreator.request("/api/users", "POST", body));
    assert.equal(response.status, 403);
    assert.equal(calls.createUser.mock.callCount(), 0);
});

test("actual Users and Roles handlers retain Super Admin read and write authorization without database writes", async (context) => {
    const calls = mockRouteServices(context);
    const superAdmin = installFakeAuthenticatedUser(context, {
        name: "Super Admin",
        permissions: [],
    });

    assert.equal((await getUsers(superAdmin.request("/api/users"))).status, 200);
    assert.equal((await getRoles(superAdmin.request("/api/roles"))).status, 200);

    const createdUserResponse = await postUsers(superAdmin.request("/api/users", "POST", JSON.stringify({
        firstName: "Disposable",
        lastName: "Preview",
        email: "adm-route-test@example.invalid",
        password: `TestPass1!${randomUUID()}`,
        role: new Types.ObjectId().toString(),
    })));
    assert.equal(createdUserResponse.status, 201);

    const createdRoleResponse = await postRoles(
        superAdmin.request("/api/roles", "POST", JSON.stringify({ name: "test-only" })),
    );
    assert.equal(createdRoleResponse.status, 201);

    assert.equal(calls.createUser.mock.callCount(), 1);
    assert.equal(calls.createRole.mock.callCount(), 1);
});
