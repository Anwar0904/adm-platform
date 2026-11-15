import assert from "node:assert/strict";
import test from "node:test";

import {
    getSessionExpiresAt,
    isSessionExpired,
    normalizeSessionActivityAt,
} from "./session-policy";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

test("sets session expiry seven days from second-normalized activity", () => {
    const activityAt = new Date("2026-01-01T12:00:00.999Z");
    const normalizedActivityAt =
        normalizeSessionActivityAt(activityAt);

    assert.equal(
        getSessionExpiresAt(activityAt).getTime(),
        normalizedActivityAt.getTime() + SESSION_DURATION_MS
    );
});

test("treats the exact expiration time as expired", () => {
    const expiresAt = new Date("2026-01-08T12:00:00.000Z");

    assert.equal(
        isSessionExpired(
            expiresAt,
            new Date(expiresAt.getTime() - 1)
        ),
        false
    );
    assert.equal(isSessionExpired(expiresAt, expiresAt), true);
});
