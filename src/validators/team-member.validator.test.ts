import test from "node:test";
import assert from "node:assert/strict";

import { CreateTeamMemberSchema } from "./team-member.validator";

test("CreateTeamMemberSchema accepts a public CV URL or no CV", () => {
    const base = {
        name: "M. Anwar Ul Haq",
        designation: "Full-Stack Project Manager",
    };

    assert.equal(
        CreateTeamMemberSchema.parse({
            ...base,
            cvUrl: "https://example.com/anwar-cv.pdf",
        }).cvUrl,
        "https://example.com/anwar-cv.pdf"
    );

    assert.equal(
        CreateTeamMemberSchema.parse(base).cvUrl,
        undefined
    );

    assert.equal(
        CreateTeamMemberSchema.parse({
            ...base,
            cvUrl: "",
        }).cvUrl,
        ""
    );

    assert.equal(
        CreateTeamMemberSchema.parse({
            ...base,
            cvUrl: "/uploads/media/anwar-cv.pdf",
        }).cvUrl,
        "/uploads/media/anwar-cv.pdf"
    );
});

test("CreateTeamMemberSchema rejects non-HTTP CV URLs", () => {
    for (const cvUrl of ["javascript:alert(1)", "ftp://example.com/cv.pdf", "https://"]) {
        assert.throws(() =>
            CreateTeamMemberSchema.parse({
                name: "M. Anwar Ul Haq",
                designation: "Full-Stack Project Manager",
                cvUrl,
            })
        );
    }
});
