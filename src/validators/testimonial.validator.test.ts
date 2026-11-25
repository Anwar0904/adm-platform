import assert from "node:assert/strict";
import test from "node:test";

import { CreateTestimonialSchema } from "@/validators/testimonial.validator";

const validTestimonial = {
    clientName: "Preview Client",
    message: "A staging testimonial with enough text.",
    rating: 5,
};

test("testimonial schema accepts valid optional media relation IDs", () => {
    const result = CreateTestimonialSchema.parse({
        ...validTestimonial,
        avatar: "0123456789abcdef01234567",
        service: null,
        portfolio: "abcdef0123456789abcdef01",
    });
    assert.equal(result.avatar, "0123456789abcdef01234567");
});

test("testimonial schema rejects malformed media relation IDs with a field error", () => {
    const result = CreateTestimonialSchema.safeParse({ ...validTestimonial, avatar: "not-a-media-id" });
    assert.equal(result.success, false);
    if (!result.success) {
        assert.match(result.error.flatten().fieldErrors.avatar?.[0] ?? "", /valid MongoDB record ID/);
    }
});
