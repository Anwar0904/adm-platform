import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";

import { PasswordService } from "@/lib/auth/bcrypt";
import { JwtService } from "@/lib/auth/jwt";
import { ApiError } from "@/lib/api/api-error";
import { Role } from "@/models/role.model";
import { User } from "@/models/user.model";
import SessionRepository from "@/repositories/session.repository";
import UserRepository from "@/repositories/user.repository";
import { LoginSchema } from "@/validators/auth/login.validator";
import { CreateUserSchema } from "@/validators/user.validator";
import type { CreateUserInput } from "@/types/user-management";
import AuthService from "@/services/auth/auth.service";
import UserService from "./user.service";

test("admin-created user email and bcrypt password authenticate through login", async (context) => {
    const userId = new Types.ObjectId();
    const roleId = new Types.ObjectId();
    const suppliedEmail = "  preview-disposable@example.test  ";
    const suppliedPassword = "Disposable-Only!Pass2026";
    const normalizedEmail = "preview-disposable@example.test";
    const role = { _id: roleId, name: "preview-user" };
    const createInput = CreateUserSchema.parse({
        firstName: "Preview",
        email: suppliedEmail,
        password: suppliedPassword,
        role: roleId.toString(),
        status: "active",
        isEmailVerified: true,
    }) as CreateUserInput;

    context.mock.method(UserRepository, "emailExists", async () => false);
    context.mock.method(Role, "findById", async () => role as never);

    let createdRecord: Record<string, unknown> | undefined;
    context.mock.method(UserRepository, "create", async (data: Parameters<typeof UserRepository.create>[0]) => {
        createdRecord = data as Record<string, unknown>;
        return data as never;
    });

    await UserService.createUser(createInput, userId.toString());

    assert.ok(createdRecord);
    assert.equal(createdRecord.email, normalizedEmail);
    const storedPassword = createdRecord.password;
    assert.equal(typeof storedPassword, "string");
    assert.equal(
        await PasswordService.compare(suppliedPassword, storedPassword as string),
        true,
    );

    let loginFilter: Record<string, unknown> | undefined;
    let selectedPassword = false;
    const loginUser = {
        ...createdRecord,
        _id: userId,
        email: normalizedEmail,
        role,
        status: "active",
        isDeleted: false,
        emailVerified: true,
        isEmailVerified: true,
        save: async () => undefined,
    };
    context.mock.method(User, "findOne", ((filter: Record<string, unknown>) => {
        loginFilter = filter;
        return {
            select(selection: string) {
                selectedPassword = selection === "+password";
                return {
                    populate: async () => loginUser,
                };
            },
        };
    }) as never);
    context.mock.method(JwtService, "signAccessToken", () => "disposable-access-token");
    context.mock.method(JwtService, "signRefreshToken", () => "disposable-refresh-token");
    context.mock.method(PasswordService, "hash", async () => "disposable-refresh-hash");
    context.mock.method(SessionRepository, "createSession", async () => undefined);

    const loginInput = LoginSchema.parse({
        email: suppliedEmail,
        password: suppliedPassword,
    });
    const loginResult = await AuthService.login(loginInput);

    assert.equal(loginFilter?.email, normalizedEmail);
    assert.equal(selectedPassword, true);
    assert.equal(loginResult.user._id.toString(), userId.toString());
});

test("login keeps one generic error for unknown email and incorrect password", async (context) => {
    const userId = new Types.ObjectId();
    const roleId = new Types.ObjectId();
    const knownUser = {
        _id: userId,
        email: "known-preview-user@example.test",
        password: "opaque-test-hash",
        role: { _id: roleId },
    };

    context.mock.method(User, "findOne", ((filter: Record<string, unknown>) => ({
        select: () => ({
            populate: async () => filter.email === knownUser.email ? knownUser : null,
        }),
    })) as never);
    context.mock.method(PasswordService, "compare", async () => false);

    const errors = await Promise.all([
        AuthService.login({ email: "missing-preview-user@example.test", password: "disposable" })
            .catch((error: unknown) => error),
        AuthService.login({ email: knownUser.email, password: "disposable" })
            .catch((error: unknown) => error),
    ]);

    for (const error of errors) {
        assert.ok(error instanceof ApiError);
        assert.equal(error.statusCode, 401);
        assert.equal(error.message, "Invalid email or password.");
    }
});
