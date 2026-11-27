import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import mongoose, { Types } from "mongoose";
import { NextRequest } from "next/server";

import { DELETE as deleteTestimonial, PATCH as patchTestimonial } from "@/app/api/testimonials/[id]/route";
import { GET as getTestimonials, POST as createTestimonial } from "@/app/api/testimonials/route";
import { PERMISSIONS } from "@/constants/permissions";
import { JwtService } from "@/lib/auth/jwt";
import { User } from "@/models/user.model";
import SessionRepository from "@/repositories/session.repository";
import TestimonialService from "@/services/testimonial.service";
import UserService from "@/services/user/user.service";
import { GET as getUsers } from "@/app/api/users/route";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

function installUser(context: TestContext, role: { name: string; permissions: string[] }) {
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
    context.mock.method(User, "findById", () => ({ populate: () => ({ select: async () => ({ _id: userId, status: "active", isDeleted: false, role }) }) }) as never);
    return {
        request(path: string, method = "GET", body?: string) {
            return new NextRequest(`https://adm-preview.example${path}`, {
                method,
                headers: { authorization: "Bearer test-only-token", ...(body ? { "content-type": "application/json" } : {}) },
                body,
            });
        },
        params(id: string) { return { params: Promise.resolve({ id }) }; },
    };
}

const validBody = JSON.stringify({ clientName: "Preview Client", message: "A sufficiently long staging testimonial.", rating: 5 });
const id = "000000000000000000000001";

test("staging_viewer keeps Users API read and is denied testimonial read and every mutation", async (context) => {
    const viewer = installUser(context, { name: "staging_viewer", permissions: [PERMISSIONS.USER_READ] });
    const users = context.mock.method(UserService, "getUsers", async () => [] as never);
    const list = context.mock.method(TestimonialService, "getTestimonials", async () => ({ testimonials: [], pagination: {} }) as never);
    const create = context.mock.method(TestimonialService, "createTestimonial", async () => ({ _id: new Types.ObjectId() }) as never);
    const update = context.mock.method(TestimonialService, "updateTestimonial", async () => ({ _id: new Types.ObjectId() }) as never);
    const remove = context.mock.method(TestimonialService, "deleteTestimonial", async () => true as never);

    assert.equal((await getUsers(viewer.request("/api/users"))).status, 200);
    assert.equal(users.mock.callCount(), 1);
    assert.equal((await getTestimonials(viewer.request("/api/testimonials"))).status, 403);
    assert.equal((await createTestimonial(viewer.request("/api/testimonials", "POST", "{"))).status, 403, "authz must happen before JSON parsing");
    assert.equal((await patchTestimonial(viewer.request(`/api/testimonials/${id}`, "PATCH", "{"), viewer.params(id))).status, 403);
    assert.equal((await deleteTestimonial(viewer.request(`/api/testimonials/${id}`, "DELETE"), viewer.params(id))).status, 403);
    assert.equal(list.mock.callCount(), 0);
    assert.equal(create.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
    assert.equal(remove.mock.callCount(), 0);
});

test("Super Admin can read and mutate testimonials through the authorized handlers", async (context) => {
    const admin = installUser(context, { name: "Super Admin", permissions: [] });
    const createdRecord = { _id: new Types.ObjectId(), clientName: "Preview Client", message: "A sufficiently long staging testimonial.", rating: 5 };
    const list = context.mock.method(TestimonialService, "getTestimonials", async () => ({ testimonials: [createdRecord], pagination: {} }) as never);
    const create = context.mock.method(TestimonialService, "createTestimonial", async () => createdRecord as never);
    const update = context.mock.method(TestimonialService, "updateTestimonial", async () => createdRecord as never);
    const remove = context.mock.method(TestimonialService, "deleteTestimonial", async () => true as never);

    assert.equal((await getTestimonials(admin.request("/api/testimonials"))).status, 200);
    assert.equal((await createTestimonial(admin.request("/api/testimonials", "POST", validBody))).status, 201);
    assert.equal((await patchTestimonial(admin.request(`/api/testimonials/${id}`, "PATCH", JSON.stringify({ message: "Updated sufficiently long text." })), admin.params(id))).status, 200);
    assert.equal((await deleteTestimonial(admin.request(`/api/testimonials/${id}`, "DELETE"), admin.params(id))).status, 200);
    assert.equal(list.mock.callCount(), 1);
    assert.equal(create.mock.callCount(), 1);
    assert.equal(update.mock.callCount(), 1);
    assert.equal(remove.mock.callCount(), 1);
});
