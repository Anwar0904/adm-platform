import assert from "node:assert/strict";
import test from "node:test";
import mongoose, { Types } from "mongoose";
import { NextRequest } from "next/server";

import { GET } from "@/app/api/auth/me/route";
import { JwtService } from "@/lib/auth/jwt";
import { User } from "@/models/user.model";
import SessionRepository from "@/repositories/session.repository";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

test("/api/auth/me exposes permissions from the authenticated populated role and is non-cacheable", async (context) => {
    const userId = new Types.ObjectId();
    const sessionId = new Types.ObjectId();
    const runtime = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };
    const cache = runtime.mongooseCache;
    assert.ok(cache);
    const previous = { conn: cache.conn, promise: cache.promise };
    cache.conn = mongoose;
    cache.promise = null;
    context.after(() => { cache.conn = previous.conn; cache.promise = previous.promise; });

    context.mock.method(JwtService, "verifyAccessToken", () => ({ userId: userId.toString(), sub: userId.toString(), sid: sessionId.toString() }) as never);
    context.mock.method(SessionRepository, "findActiveSessionById", async () => ({ _id: sessionId, user: userId, isRevoked: false }) as never);
    context.mock.method(User, "findById", () => ({
        populate: () => ({
            select: async () => ({
                _id: userId,
                firstName: "Staging",
                lastName: "Viewer",
                email: "viewer@example.invalid",
                status: "active",
                isDeleted: false,
                role: { name: "staging_viewer", permissions: ["user.read"] },
            }),
        }),
    }) as never);

    const response = await GET(new NextRequest("https://adm-preview.example/api/auth/me", {
        headers: { authorization: "Bearer test-only-token" },
    }));
    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store, private");
    assert.deepEqual(result.data.role, { name: "staging_viewer", permissions: ["user.read"] });
});
