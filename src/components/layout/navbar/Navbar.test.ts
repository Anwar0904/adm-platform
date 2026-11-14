import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Navbar from "./Navbar";
import { navigation } from "./menu";

test("uses the approved top-level navigation order and destinations", () => {
    assert.deepEqual(
        navigation.map(({ title }) => title),
        [
            "Home",
            "About",
            "Capabilities",
            "Industries",
            "Selected Work",
            "Insights",
            "Talk to ADM",
        ]
    );

    assert.equal(navigation[0].href, "/");
    assert.equal(navigation[1].href, undefined);
    assert.equal(navigation[2].href, "/services");
    assert.equal(navigation[3].href, "/industries");
    assert.equal(navigation[4].href, "/portfolio");
    assert.equal(navigation[5].href, "/blogs");

    const contactLink = navigation[6];
    assert.ok(!contactLink.mega);
    assert.equal(contactLink.href, "/contact");
    assert.equal(contactLink.primary, true);
});

test("keeps the approved About destinations and existing service submenu", () => {
    const about = navigation[1];
    const capabilities = navigation[2];

    assert.ok(about.mega);
    assert.deepEqual(
        about.items.map(({ title, href }) => [title, href]),
        [
            ["Our Company", "/about"],
            ["Leadership & Governance", "/about/leadership-governance"],
            ["Sustainability", "/about/sustainability"],
            ["Careers", "/careers"],
        ]
    );

    assert.ok(capabilities.mega);
    assert.deepEqual(
        capabilities.items.map(({ href }) => href),
        [
            "/services/web-development",
            "/services/mobile-apps",
            "/services/ai-solutions",
            "/services/ui-ux",
        ]
    );
});

test("renders About as an accessible disclosure button and Talk to ADM as a contact link", () => {
    const markup = renderToStaticMarkup(createElement(Navbar));
    const aboutButton = markup.match(
        /<button\b(?=[^>]*aria-controls="desktop-about-submenu")[^>]*>[\s\S]*?<\/button>/
    );

    assert.ok(aboutButton);
    assert.match(aboutButton[0], /aria-expanded="false"/);
    assert.match(aboutButton[0], />[\s\S]*About/);
    assert.doesNotMatch(aboutButton[0], /href=/);
    assert.match(markup, /id="desktop-about-submenu"[^>]*hidden=""/);
    assert.match(markup, /href="\/contact"[^>]*>Talk to ADM<\/a>/);

    const desktopNav = markup.match(
        /<nav aria-label="Main navigation"[^>]*>[\s\S]*?<\/nav>/
    );
    assert.ok(desktopNav);
    assert.doesNotMatch(desktopNav[0], /Talk to ADM/);
});
