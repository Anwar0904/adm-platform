import test from "node:test";
import assert from "node:assert/strict";

import { CreateUserSchema, UpdateUserSchema } from "./user.validator";

test("CreateUserSchema accepts a valid user with a Mongo role ID", () => {
    const parsed = CreateUserSchema.parse({
        firstName: "  Ada  ",
        lastName: "Lovelace",
        email: "ADA@example.com",
        password: "Adm!nPass123",
        role: "68a1b2c3d4e5f60718293a4b",
        status: "active",
    });

    assert.equal(parsed.firstName, "Ada");
    assert.equal(parsed.email, "ada@example.com");
    assert.equal(parsed.role, "68a1b2c3d4e5f60718293a4b");
});

test("CreateUserSchema reports rejected user fields with actionable messages", () => {
    const result = CreateUserSchema.safeParse({
        firstName: "A",
        email: "not-an-email",
        password: "weak",
        role: "not-a-role-id",
    });

    assert.equal(result.success, false);
    if (result.success) return;

    const fieldErrors = result.error.flatten().fieldErrors;
    assert.equal(fieldErrors.firstName?.[0], "First name must be at least 2 characters.");
    assert.equal(fieldErrors.email?.[0], "Enter a valid email address.");
    assert.equal(fieldErrors.password?.[0], "Password must contain at least 8 characters.");
    assert.equal(fieldErrors.role?.[0], "Select a valid existing role.");
});

test("UpdateUserSchema accepts email and role updates", () => {
    const parsed = UpdateUserSchema.parse({
        firstName: "Updated FirstName",
        lastName: "Updated LastName",
        email: "new@example.com",
        role: "68a1b2c3d4e5f60718293a4b",
    });

    assert.equal(parsed.firstName, "Updated FirstName");
    assert.equal(parsed.lastName, "Updated LastName");
    assert.equal(parsed.email, "new@example.com");
    assert.equal(parsed.role, "68a1b2c3d4e5f60718293a4b");
});
