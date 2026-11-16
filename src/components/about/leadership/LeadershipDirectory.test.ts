import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import LeadershipDirectory from "./LeadershipDirectory";
import type { IPublicTeamMember } from "@/types/team-member.types";

function member(
    overrides: Partial<IPublicTeamMember> = {}
): IPublicTeamMember {
    return {
        id: "member-1",
        name: "Example Member",
        slug: "example-member",
        designation: "Director",
        shortBio: "",
        biography: "",
        experience: 0,
        avatar: null,
        skills: [],
        socialLinks: {},
        ...overrides,
    };
}

function renderDirectory(teamMember: IPublicTeamMember) {
    return renderToStaticMarkup(
        createElement(LeadershipDirectory, {
            groupTitle: "Executive Committee",
            members: [teamMember],
        })
    );
}

test("omits unavailable and unsafe social links", () => {
    const markup = renderDirectory(
        member({
            socialLinks: {
                linkedin: "javascript:alert(1)",
                github: "mailto:member@example.com",
            },
        })
    );

    assert.doesNotMatch(markup, /<a\b/);
    assert.doesNotMatch(markup, /Example Member links/);
    assert.doesNotMatch(markup, /javascript:/);
});

test("renders configured social links as safe external destinations", () => {
    const destinations = {
        linkedin: "https://linkedin.example/member",
        github: "https://github.example/member",
        facebook: "https://facebook.example/member",
        instagram: "https://instagram.example/member",
        twitter: "https://x.example/member",
        website: "https://member.example",
    };
    const markup = renderDirectory(member({ socialLinks: destinations }));

    const anchors = [...markup.matchAll(/<a\b[^>]*>/g)].map(([anchor]) => anchor);
    assert.equal(anchors.length, 6);

    for (const [key, destination] of Object.entries(destinations)) {
        const normalizedDestination = new URL(destination).href;
        const anchor = anchors.find((item) =>
            item.includes(`href="${normalizedDestination}"`)
        );
        assert.ok(anchor, `expected a link for ${key}`);
        assert.match(anchor, /target="_blank"/);
        assert.match(anchor, /rel="noopener noreferrer"/);
    }

    assert.match(markup, /Example Member on LinkedIn/);
    assert.match(markup, /Example Member on GitHub/);
    assert.match(markup, /Example Member on Facebook/);
    assert.match(markup, /Example Member on Instagram/);
    assert.match(markup, /Example Member on X/);
    assert.match(markup, /Example Member&#x27;s website/);
});

test("shows the short biography first and avoids an identical full biography", () => {
    const biography = "A concise approved biography.";
    const markup = renderDirectory(
        member({
            shortBio: biography,
            biography,
        })
    );

    assert.equal(markup.split(biography).length - 1, 1);
    assert.doesNotMatch(markup, /Read full biography/);
    assert.doesNotMatch(markup, /Show less/);
});

test("offers an accessible inline expansion when the biography has more detail", () => {
    const markup = renderDirectory(
        member({
            shortBio: "A concise introduction.",
            biography: "A complete professional biography.",
        })
    );

    assert.match(markup, /A concise introduction\./);
    assert.match(markup, /aria-expanded="false"/);
    assert.match(markup, /aria-controls="leadership-biography-member-1"/);
    assert.match(markup, /id="leadership-biography-member-1" aria-hidden="true"/);
    assert.match(markup, /Read full biography/);
});
