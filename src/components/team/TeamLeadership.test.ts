import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import TeamLeadership from "./TeamLeadership";
import type { IPublicTeamMember } from "@/types/team-member.types";

const owner: IPublicTeamMember = {
    id: "owner",
    name: "Abudullah Araz",
    slug: "abudullah-araz",
    designation: "Founder & Chief Executive Officer (CEO)",
    shortBio: "Company leadership and strategy.",
    biography: "Company leadership and strategy.",
    experience: 0,
    avatar: null,
    skills: [],
    socialLinks: {},
};

const technicalLead: IPublicTeamMember = {
    id: "anwar",
    name: "M. Anwar Ul Haq",
    slug: "m-anwar-ul-haq",
    designation: "Full-Stack Project Manager",
    shortBio: "Technical leadership and delivery.",
    biography: "Technical leadership and delivery.",
    experience: 0,
    avatar: {
        url: "/uploads/media/anwar.jpg",
        alt: "M. Anwar Ul Haq",
    },
    skills: [],
    socialLinks: {
        website: "https://anwar-ul-haq1.vercel.app",
        github: "https://github.com/Anwar0904",
        linkedin: "https://www.linkedin.com/in/anwar-42khan/",
    },
    cvUrl: "/uploads/media/anwar-cv.pdf",
};

test("renders supplied leadership profiles and their supplied links", () => {
    const markup = renderToStaticMarkup(
        createElement(TeamLeadership, {
            members: [owner, technicalLead],
        })
    );

    assert.match(markup, /Abudullah Araz/);
    assert.match(markup, /M\. Anwar Ul Haq/);
    assert.match(markup, /Executive leadership/);
    assert.match(markup, /Technical leadership/);
    assert.match(markup, /anwar\.jpg/);
    assert.match(markup, /https:\/\/anwar-ul-haq1\.vercel\.app/);
    assert.match(markup, /https:\/\/github\.com\/Anwar0904/);
    assert.match(markup, /https:\/\/www\.linkedin\.com\/in\/anwar-42khan\//);
    assert.equal((markup.match(/Download CV/g) ?? []).length, 1);
    assert.match(markup, /Portrait coming soon/);
});

test("renders a single published technical profile without waiting for a second profile", () => {
    const markup = renderToStaticMarkup(
        createElement(TeamLeadership, {
            members: [{ ...technicalLead, cvUrl: undefined }],
        })
    );

    assert.match(markup, /M\. Anwar Ul Haq/);
    assert.match(markup, /Technical leadership/);
    assert.doesNotMatch(markup, /Leadership profiles are not published yet/);
    assert.doesNotMatch(markup, /Download CV/);
});

test("renders more than two leadership profiles with optional media omitted", () => {
    const thirdMember: IPublicTeamMember = {
        ...technicalLead,
        id: "third",
        name: "Third Team Member",
        slug: "third-team-member",
        avatar: null,
        cvUrl: undefined,
        socialLinks: {},
    };
    const markup = renderToStaticMarkup(
        createElement(TeamLeadership, {
            members: [owner, technicalLead, thirdMember],
        })
    );

    assert.match(markup, /M\. Anwar Ul Haq/);
    assert.match(markup, /Third Team Member/);
    assert.equal((markup.match(/Portrait coming soon/g) ?? []).length, 2);
    assert.equal((markup.match(/Download CV/g) ?? []).length, 1);
});

test("shows the empty state when no published profiles are returned", () => {
    const markup = renderToStaticMarkup(
        createElement(TeamLeadership, {
            members: [],
        })
    );

    assert.match(markup, /Leadership profiles are not published yet/);
});
