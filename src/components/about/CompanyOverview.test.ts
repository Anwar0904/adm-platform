import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import CompanyOverview from "./CompanyOverview";

test("renders the editorial company sections, media placeholders, and verified destinations", () => {
    const markup = renderToStaticMarkup(createElement(CompanyOverview));

    assert.match(markup, /Arazi Digital Media is a global Technology/);
    assert.match(markup, /Building What&#x27;s Next for the Digital Economy/);
    assert.match(markup, /Our Capabilities/);
    assert.match(markup, /Artificial Intelligence/);
    assert.match(markup, /Our Story/);
    assert.match(markup, /Draft copy - pending approval/);
    assert.match(markup, /Proposed statement - pending approval/);
    assert.match(markup, /IDEAS INTO ACTION/i);
    assert.match(markup, /Let&#x27;s Build What&#x27;s Next/);
    assert.equal((markup.match(/<video/g) ?? []).length, 8);
    assert.equal(
        (markup.match(/poster="\/about\/company-media-poster\.svg"/g) ?? [])
            .length,
        8
    );
    assert.equal((markup.match(/Temporary media/g) ?? []).length, 8);
    assert.match(markup, /href="\/services"/);
    assert.match(markup, /href="\/portfolio"/);
    assert.match(markup, /href="\/contact"/);
    assert.doesNotMatch(markup, /<main/);
});
