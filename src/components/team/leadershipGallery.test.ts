import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import TeamGallery from "./leadershipGallery";
import type { IPublicTeamMember } from "@/types/team-member.types";

function member(
    id: string,
    governanceGroup?: IPublicTeamMember["governanceGroup"],
    avatar: IPublicTeamMember["avatar"] = null
): IPublicTeamMember {
    return {
        id,
        name: `${id} Example`,
        slug: id,
        designation: "Approved test designation",
        governanceGroup,
        shortBio: "",
        biography: "",
        experience: 0,
        avatar,
        skills: [],
        socialLinks: {},
    };
}

test("gallery includes only explicitly assigned profiles with portraits", () => {
    const markup = renderToStaticMarkup(
        createElement(TeamGallery, {
            members: [
                member("approved", "board", {
                    url: "/uploads/media/approved.jpg",
                    alt: "Approved Example",
                }),
                member("unassigned", undefined, {
                    url: "/uploads/media/unassigned.jpg",
                }),
                member("portraitless", "executive"),
            ],
        })
    );

    assert.match(markup, /approved Example/);
    assert.doesNotMatch(markup, /unassigned Example/);
    assert.doesNotMatch(markup, /portraitless Example/);
});

test("shows an empty state when no assigned profile portraits exist", () => {
    const markup = renderToStaticMarkup(
        createElement(TeamGallery, {
            members: [member("unassigned")],
        })
    );

    assert.match(markup, /Approved leadership portraits will appear here/);
    assert.doesNotMatch(markup, /unassigned Example/);
});
