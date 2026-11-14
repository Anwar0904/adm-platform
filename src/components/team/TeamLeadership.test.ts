import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import TeamLeadership from "./TeamLeadership";
import type { IPublicTeamMember } from "@/types/team-member.types";

function member(
    id: string,
    name: string,
    governanceGroup?: IPublicTeamMember["governanceGroup"]
): IPublicTeamMember {
    return {
        id,
        name,
        slug: id,
        designation: "Approved test designation",
        governanceGroup,
        shortBio: "Approved test biography.",
        biography: "Approved test biography.",
        experience: 0,
        avatar: null,
        skills: [],
        socialLinks: {},
    };
}

test("renders assigned committee members only in their explicit governance groups", () => {
    const executive = {
        ...member("executive", "Executive Example", "executive"),
        avatar: {
            url: "/uploads/media/executive.jpg",
            alt: "Executive Example",
        },
        socialLinks: {
            website: "https://example.com",
        },
        cvUrl: "/uploads/media/executive-cv.pdf",
    };
    const markup = renderToStaticMarkup(
        createElement(TeamLeadership, {
            members: [
                executive,
                member("management", "Management Example", "management"),
                member("board", "Board Example", "board"),
                member("unassigned", "Unassigned Example"),
            ],
        })
    );

    assert.match(markup, /Executive Committee/);
    assert.match(markup, /Management Committee/);
    assert.match(markup, /Executive Example/);
    assert.match(markup, /Management Example/);
    assert.doesNotMatch(markup, /Board Example/);
    assert.doesNotMatch(markup, /Unassigned Example/);
    assert.match(markup, /executive\.jpg/);
    assert.match(markup, /https:\/\/example\.com/);
    assert.match(markup, /Download CV/);
});

test("shows separate empty states when no committee profiles are assigned", () => {
    const markup = renderToStaticMarkup(
        createElement(TeamLeadership, {
            members: [],
        })
    );

    assert.match(markup, /Executive Committee/);
    assert.match(markup, /Management Committee/);
    assert.equal(
        (markup.match(/Approved profiles will appear here/g) ?? []).length,
        2
    );
});
