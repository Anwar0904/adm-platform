import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";

import { User } from "@/models/user.model";

function makeUser(avatar: unknown) {
    return new User({
        firstName: "Preview",
        lastName: "User",
        email: "preview-user@example.invalid",
        password: "Disposable-Only!Pass2026",
        role: new Types.ObjectId(),
        status: "active",
        avatar,
    });
}

test("user model accepts the avatar URL string sent by the admin user form", async () => {
    const avatar = "https://images.example.invalid/avatar.png";
    const user = makeUser(avatar);

    await assert.doesNotReject(() => user.validate());
    assert.equal(user.avatar, avatar);
});

test("user model preserves existing image-object avatars", async () => {
    const avatar = {
        url: "https://images.example.invalid/avatar.png",
        publicId: "preview-avatar",
        alt: "Preview user",
    };
    const user = makeUser(avatar);

    await assert.doesNotReject(() => user.validate());
    assert.deepEqual(user.avatar, avatar);
});

test("user model rejects malformed avatar values", async () => {
    const user = makeUser(42);

    await assert.rejects(user.validate(), (error: unknown) => {
        assert.ok(error instanceof Error);
        const validationError = error as { errors?: Record<string, unknown> };
        assert.ok(validationError.errors?.avatar);
        return true;
    });
});
