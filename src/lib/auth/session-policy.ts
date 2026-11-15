import {
    SESSION_IDLE_TIMEOUT_SECONDS,
} from "@/constants/auth";

export function normalizeSessionActivityAt(activityAt: Date) {
    return new Date(
        Math.floor(activityAt.getTime() / 1000) * 1000
    );
}

export function getSessionExpiresAt(now: Date) {
    return new Date(
        normalizeSessionActivityAt(now).getTime() +
            SESSION_IDLE_TIMEOUT_SECONDS * 1000
    );
}

export function isSessionExpired(
    expiresAt: Date,
    now: Date
) {
    return expiresAt.getTime() <= now.getTime();
}
