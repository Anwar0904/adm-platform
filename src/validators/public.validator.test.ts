import test from "node:test";
import assert from "node:assert/strict";

import { PublicTeamMemberQuerySchema } from "./public.validator";

test("public team member query accepts supported governance groups", () => {
    assert.equal(
        PublicTeamMemberQuerySchema.parse({
            governanceGroup: "board",
        }).governanceGroup,
        "board"
    );
});

test("public team member query rejects unsupported governance groups", () => {
    assert.throws(() =>
        PublicTeamMemberQuerySchema.parse({
            governanceGroup: "founder",
        })
    );
});
