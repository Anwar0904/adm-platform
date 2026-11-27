import assert from "node:assert/strict";
import test from "node:test";

import { requestTestimonialWrite, TestimonialWriteError } from "@/lib/admin/testimonials-api";

test("testimonial mutation returns a record only after an API-confirmed write", async () => {
    const persisted = { _id: "saved-id", clientName: "Real record", message: "Persisted successfully." };
    const result = await requestTestimonialWrite<typeof persisted>(
        "/api/testimonials",
        "POST",
        { clientName: persisted.clientName },
        async (_input, init) => {
            assert.equal(init?.method, "POST");
            return Response.json({ success: true, data: persisted }, { status: 201 });
        },
    );
    assert.deepEqual(result, persisted);
});

test("failed testimonial writes reject without returning an optimistic record", async () => {
    for (const status of [400, 401, 403, 500]) {
        await assert.rejects(
            requestTestimonialWrite("/api/testimonials", "POST", { clientName: "Fabricated" }, async () =>
                Response.json({ success: false, message: "Failed" }, { status })),
            (error: unknown) => error instanceof TestimonialWriteError && error.status === status,
        );
    }
});

test("successful status without persisted data is not reported as a saved record", async () => {
    await assert.rejects(
        requestTestimonialWrite("/api/testimonials", "POST", {}, async () =>
            Response.json({ success: true, data: null }, { status: 201 })),
        TestimonialWriteError,
    );
});

test("validation responses identify the rejected testimonial field", async () => {
    await assert.rejects(
        requestTestimonialWrite("/api/testimonials", "POST", {}, async () =>
            Response.json({
                success: false,
                message: "Validation failed.",
                errors: { formErrors: [], fieldErrors: { avatar: ["Must be a valid MongoDB record ID."] } },
            }, { status: 400 })),
        (error: unknown) => error instanceof TestimonialWriteError && /Avatar: Must be a valid MongoDB record ID/.test(error.message),
    );
});
