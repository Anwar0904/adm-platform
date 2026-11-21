import assert from "node:assert/strict";
import test from "node:test";

import { toAuthUserResponse } from "./auth-user-response.dto";

test("auth user response exposes only the allowlisted profile and role name", () => {
  const response = toAuthUserResponse({
    _id: { toString: () => "user-id" },
    firstName: "Test",
    lastName: "User",
    email: "test@example.test",
    avatar: null,
    jobTitle: "Reviewer",
    status: "active",
    role: {
      _id: "role-id",
      name: "Editor",
      permissions: ["user.read"],
      passwordResetToken: "must-not-escape",
    } as never,
    password: "must-not-escape",
    passwordResetToken: "must-not-escape",
    emailVerificationToken: "must-not-escape",
  } as never);

  assert.deepEqual(response, {
    _id: "user-id",
    name: "Test User",
    firstName: "Test",
    lastName: "User",
    email: "test@example.test",
    avatar: null,
    jobTitle: "Reviewer",
    status: "active",
    role: { name: "Editor" },
  });
  assert.equal(JSON.stringify(response).includes("must-not-escape"), false);
});
