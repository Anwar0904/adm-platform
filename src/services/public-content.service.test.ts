import test from "node:test";
import assert from "node:assert/strict";
import { Types } from "mongoose";

import { TeamMember } from "@/models/team-member.model";
import PublicContentService from "./public-content.service";
import { teamMemberPublicFilter } from "./public-content.service";

test("public team member filtering requires published, active, non-deleted records", () => {
    assert.deepEqual(teamMemberPublicFilter(), {
        status: "published",
        isDeleted: false,
        employmentStatus: "active",
    });
});

test("public team member filtering does not require featured status", () => {
    assert.deepEqual(teamMemberPublicFilter(), {
        status: "published",
        isDeleted: false,
        employmentStatus: "active",
    });

    assert.deepEqual(teamMemberPublicFilter({ featured: true }), {
        status: "published",
        isDeleted: false,
        employmentStatus: "active",
        featured: true,
    });
});

test("getAllTeamMembers returns more than two records without pagination", async (context) => {
    const records = Array.from({ length: 3 }, (_, index) => ({
        _id: new Types.ObjectId(),
        name: `Team Member ${index + 1}`,
        slug: `team-member-${index + 1}`,
        designation: "Project Manager",
        shortBio: "",
        biography: "",
        experience: 0,
        avatar: null,
        skills: [],
        socialLinks: {},
        cvUrl: "",
    }));

    const query = {
        select() {
            return this;
        },
        populate() {
            return this;
        },
        sort() {
            return this;
        },
        skip() {
            throw new Error("Unpaginated retrieval must not skip records.");
        },
        limit() {
            throw new Error("Unpaginated retrieval must not limit records.");
        },
        then(resolve: (value: typeof records) => unknown) {
            return Promise.resolve(records).then(resolve);
        },
    };

    context.mock.method(TeamMember, "find", () => query as never);

    const teamMembers = await PublicContentService.getAllTeamMembers();

    assert.equal(teamMembers.length, 3);
    assert.equal(teamMembers[2].name, "Team Member 3");
});
