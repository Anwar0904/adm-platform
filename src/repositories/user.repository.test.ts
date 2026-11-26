import assert from "node:assert/strict";
import test from "node:test";

import { User } from "@/models/user.model";
import UserRepository from "@/repositories/user.repository";

test("email existence check includes soft-deleted users to match the unique index", async (context) => {
    let receivedFilter: Record<string, unknown> | undefined;
    context.mock.method(User, "exists", ((filter: Record<string, unknown>) => {
        receivedFilter = filter;
        return null;
    }) as never);

    await UserRepository.emailExists("preview-user@example.invalid");

    assert.deepEqual(receivedFilter, { email: "preview-user@example.invalid" });
});
